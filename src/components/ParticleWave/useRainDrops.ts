import { useEffect, useRef, type MutableRefObject } from 'react';
import type * as THREE_NS from 'three';
import type { ThreeModule, ThreeSceneResult, RainDrop, WaveParticlesResult } from './types';
import { waveVertexShader, dropTrailFragmentShader, dropHeadFragmentShader } from './shaders';

const DROP_COUNT = 150;
const TRAIL_LENGTH = 12;
const WAVE_WIDTH = 200;
const WAVE_DEPTH = 100;

/**
 * 创建雨滴动画系统，挂载到 scene 上。
 * 每帧更新雨滴位置和轨迹。
 */
export function useRainDrops(
  sceneResult: React.RefObject<ThreeSceneResult | null>,
  waveResult: React.RefObject<WaveParticlesResult | null>,
  THREE: ThreeModule | null,
  animationRef: MutableRefObject<number | undefined>,
): void {
  const timeRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const disposablesRef = useRef<{ dispose: () => void }[]>([]);

  useEffect(() => {
    if (!THREE || !sceneResult.current || !waveResult.current) return;
    const { scene, camera, renderer } = sceneResult.current;
    const { getWaveHeight } = waveResult.current;

    // ---------- 初始化雨滴数据 ----------
    const rainDrops: RainDrop[] = [];
    for (let i = 0; i < DROP_COUNT; i++) {
      const shouldActivate = Math.random() < 0.1;
      const x = (Math.random() - 0.5) * WAVE_WIDTH * 0.9;
      const z = (Math.random() - 0.5) * WAVE_DEPTH * 0.7;
      const wh = Math.sin(x * 0.05) * 8 + Math.sin(z * 0.08) * 5;
      const startHeight = shouldActivate ? wh + Math.random() * 40 : -200;
      rainDrops.push({
        x, z, y: startHeight,
        velocity: shouldActivate ? 0.5 + Math.random() * 0.7 : 0,
        active: shouldActivate,
        maxHeight: wh + 80 + Math.random() * 120,
        trail: new Array(TRAIL_LENGTH).fill(startHeight),
        opacity: shouldActivate ? 1.0 : 0,
      });
    }

    // ---------- 轨迹粒子 ----------
    const trailCount = DROP_COUNT * TRAIL_LENGTH;
    const trailGeo = new THREE.BufferGeometry();
    const trailPos = new Float32Array(trailCount * 3);
    const trailCol = new Float32Array(trailCount * 3);
    const trailSizes = new Float32Array(trailCount);
    for (let i = 0; i < DROP_COUNT; i++) {
      for (let j = 0; j < TRAIL_LENGTH; j++) {
        trailSizes[i * TRAIL_LENGTH + j] = 4 * (1 - j / TRAIL_LENGTH) * 0.5;
      }
    }
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
    trailGeo.setAttribute('color', new THREE.BufferAttribute(trailCol, 3));
    trailGeo.setAttribute('size', new THREE.BufferAttribute(trailSizes, 1));

    const trailMat = new THREE.ShaderMaterial({
      vertexShader: waveVertexShader,
      fragmentShader: dropTrailFragmentShader,
      transparent: true, vertexColors: true,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const trailPoints = new THREE.Points(trailGeo, trailMat);
    scene.add(trailPoints);

    // ---------- 头部粒子 ----------
    const headGeo = new THREE.BufferGeometry();
    const headPos = new Float32Array(DROP_COUNT * 3);
    const headCol = new Float32Array(DROP_COUNT * 3);
    const headSizes = new Float32Array(DROP_COUNT);
    for (let i = 0; i < DROP_COUNT; i++) {
      headSizes[i] = (6 + Math.random() * 4) * 0.5;
    }
    headGeo.setAttribute('position', new THREE.BufferAttribute(headPos, 3));
    headGeo.setAttribute('color', new THREE.BufferAttribute(headCol, 3));
    headGeo.setAttribute('size', new THREE.BufferAttribute(headSizes, 1));

    const headMat = new THREE.ShaderMaterial({
      vertexShader: waveVertexShader,
      fragmentShader: dropHeadFragmentShader,
      transparent: true, vertexColors: true,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const headPoints = new THREE.Points(headGeo, headMat);
    scene.add(headPoints);

    disposablesRef.current.push(
      { dispose: () => { trailGeo.dispose(); trailMat.dispose(); } },
      { dispose: () => { headGeo.dispose(); headMat.dispose(); } },
    );

    // ---------- 获取波浪粒子的 position attribute ----------
    const waveParticles = scene.children.find(c => c instanceof THREE.Points) as InstanceType<typeof THREE.Points> | undefined;
    const wavePosAttr = waveParticles?.geometry.getAttribute('position') as THREE_NS.BufferAttribute | undefined;

    // ---------- 雨滴激活 ----------
    const activateDrop = (drop: RainDrop) => {
      drop.x = (Math.random() - 0.5) * WAVE_WIDTH * 0.9;
      drop.z = (Math.random() - 0.5) * WAVE_DEPTH * 0.7;
      const wh = getWaveHeight(drop.x, drop.z, timeRef.current);
      drop.y = wh;
      drop.velocity = 0.5 + Math.random() * 0.7;
      drop.maxHeight = wh + 80 + Math.random() * 120;
      drop.active = true;
      drop.opacity = 0.5;
      drop.trail.fill(wh);
    };

    // ---------- 动画循环 ----------
    const animate = () => {
      timeRef.current += 0.02;

      // 更新波浪粒子 Y 坐标
      if (wavePosAttr) {
        const arr = wavePosAttr.array as Float32Array;
        for (let i = 0; i < 15000; i++) {
          const i3 = i * 3;
          arr[i3 + 1] = getWaveHeight(arr[i3], arr[i3 + 2], timeRef.current);
        }
        wavePosAttr.needsUpdate = true;
      }

      const tPos = trailPoints.geometry.attributes.position.array as Float32Array;
      const tCol = trailPoints.geometry.attributes.color.array as Float32Array;
      const hPos = headPoints.geometry.attributes.position.array as Float32Array;
      const hCol = headPoints.geometry.attributes.color.array as Float32Array;

      let activeCount = 0;
      const inactiveIndices: number[] = [];

      for (let i = 0; i < DROP_COUNT; i++) {
        const drop = rainDrops[i];
        if (drop.active) {
          activeCount++;
          for (let j = TRAIL_LENGTH - 1; j > 0; j--) drop.trail[j] = drop.trail[j - 1];
          drop.trail[0] = drop.y;
          drop.velocity = Math.max(drop.velocity * 0.995, 0.3);
          drop.y += drop.velocity;
          if (drop.opacity < 1) drop.opacity = Math.min(drop.opacity + 0.05, 1);
          if (drop.y > drop.maxHeight) {
            drop.opacity -= 0.03;
            if (drop.opacity <= 0) {
              drop.active = false; drop.y = -200; drop.trail.fill(-200);
              inactiveIndices.push(i);
            }
          }
        } else {
          inactiveIndices.push(i);
        }
      }

      const time = timeRef.current;
      if (time - lastSpawnRef.current >= 0.1 && inactiveIndices.length > 0) {
        const spawnCount = Math.min(2 + Math.floor(Math.random() * 2), inactiveIndices.length);
        const shuffled = [...inactiveIndices].sort(() => Math.random() - 0.5);
        for (let n = 0; n < spawnCount; n++) activateDrop(rainDrops[shuffled[n]]);
        lastSpawnRef.current = time;
      }

      const targetActive = 20;
      const needActivate = Math.max(3, targetActive - activeCount);
      const remaining = inactiveIndices.filter(i => !rainDrops[i].active);
      if (remaining.length > 0) {
        const shuffled = [...remaining].sort(() => Math.random() - 0.5);
        for (let n = 0; n < Math.min(needActivate, shuffled.length); n++) activateDrop(rainDrops[shuffled[n]]);
      }

      for (let i = 0; i < DROP_COUNT; i++) {
        if (!rainDrops[i].active && Math.random() < 0.25) activateDrop(rainDrops[i]);
      }

      // 更新 GPU buffer
      for (let i = 0; i < DROP_COUNT; i++) {
        const drop = rainDrops[i];
        const hi3 = i * 3;
        hPos[hi3] = drop.x; hPos[hi3 + 1] = drop.y; hPos[hi3 + 2] = drop.z;
        const brightness = drop.active ? (0.8 + Math.sin(time * 5 + i) * 0.2) : 0;
        hCol[hi3] = 0.5 * brightness * drop.opacity;
        hCol[hi3 + 1] = 1.0 * brightness * drop.opacity;
        hCol[hi3 + 2] = 1.0 * brightness * drop.opacity;

        for (let j = 0; j < TRAIL_LENGTH; j++) {
          const pi = (i * TRAIL_LENGTH + j) * 3;
          tPos[pi] = drop.x; tPos[pi + 1] = drop.trail[j]; tPos[pi + 2] = drop.z;
          const fade = 1 - (j / TRAIL_LENGTH);
          tCol[pi] = 0.6 * fade * drop.opacity;
          tCol[pi + 1] = 1.0 * fade * drop.opacity;
          tCol[pi + 2] = 1.0 * fade * drop.opacity;
        }
      }

      trailPoints.geometry.attributes.position.needsUpdate = true;
      trailPoints.geometry.attributes.color.needsUpdate = true;
      headPoints.geometry.attributes.position.needsUpdate = true;
      headPoints.geometry.attributes.color.needsUpdate = true;

      camera.position.x = Math.sin(time * 0.3) * 5;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      scene.remove(trailPoints);
      scene.remove(headPoints);
      disposablesRef.current.forEach(d => d.dispose());
      disposablesRef.current = [];
    };
  }, [THREE, sceneResult, waveResult, animationRef]);
}
