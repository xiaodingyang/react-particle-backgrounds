import { useEffect, useRef } from 'react';
import type { ThreeModule, ThreeSceneResult } from './types';
import { waveVertexShader, waveFragmentShader, bokehFragmentShader } from './shaders';

export interface WaveParticlesResult {
  getWaveHeight: (x: number, z: number, t: number) => number;
}

/**
 * 创建波浪粒子系统和散景粒子，挂载到 scene 上。
 * 返回波浪高度函数和 dispose 清理函数。
 */
export function useWaveParticles(
  sceneResult: React.RefObject<ThreeSceneResult | null>,
  THREE: ThreeModule | null,
): React.RefObject<WaveParticlesResult | null> {
  const resultRef = useRef<WaveParticlesResult | null>(null);
  const disposablesRef = useRef<{ dispose: () => void }[]>([]);

  useEffect(() => {
    if (!THREE || !sceneResult.current) return;
    const { scene } = sceneResult.current;

    const particleCount = 15000;
    const waveWidth = 200;
    const waveDepth = 100;

    // 波浪高度函数
    const getWaveHeight = (x: number, z: number, t: number) =>
      Math.sin(x * 0.05 + t) * 8 +
      Math.sin(z * 0.08 + t * 0.8) * 5 +
      Math.sin((x + z) * 0.03 + t * 1.2) * 3;

    // ---------- 主波浪粒子 ----------
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * waveWidth;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = (Math.random() - 0.5) * waveDepth;

      const c = Math.random();
      if (c < 0.5) {
        colors[i3] = 0; colors[i3 + 1] = 0.8 + Math.random() * 0.2; colors[i3 + 2] = 1;
      } else if (c < 0.8) {
        colors[i3] = 0.1; colors[i3 + 1] = 0.3 + Math.random() * 0.3; colors[i3 + 2] = 0.9 + Math.random() * 0.1;
      } else {
        colors[i3] = 0.8 + Math.random() * 0.2; colors[i3 + 1] = 0.9 + Math.random() * 0.1; colors[i3 + 2] = 1;
      }
      sizes[i] = Math.random() * 2 + 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: waveVertexShader,
      fragmentShader: waveFragmentShader,
      transparent: true, vertexColors: true,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    disposablesRef.current.push({ dispose: () => { geometry.dispose(); material.dispose(); } });

    // ---------- 散景粒子 ----------
    const bokehCount = 100;
    const bokehGeo = new THREE.BufferGeometry();
    const bkPos = new Float32Array(bokehCount * 3);
    const bkCol = new Float32Array(bokehCount * 3);
    const bkSize = new Float32Array(bokehCount);

    for (let i = 0; i < bokehCount; i++) {
      const i3 = i * 3;
      bkPos[i3] = (Math.random() - 0.5) * waveWidth * 1.5;
      bkPos[i3 + 1] = Math.random() * -30 - 10;
      bkPos[i3 + 2] = (Math.random() - 0.5) * waveDepth * 2;
      bkCol[i3] = 0.2; bkCol[i3 + 1] = 0.5 + Math.random() * 0.3; bkCol[i3 + 2] = 1;
      bkSize[i] = Math.random() * 15 + 8;
    }

    bokehGeo.setAttribute('position', new THREE.BufferAttribute(bkPos, 3));
    bokehGeo.setAttribute('color', new THREE.BufferAttribute(bkCol, 3));
    bokehGeo.setAttribute('size', new THREE.BufferAttribute(bkSize, 1));

    const bokehMat = new THREE.ShaderMaterial({
      vertexShader: waveVertexShader,
      fragmentShader: bokehFragmentShader,
      transparent: true, vertexColors: true,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });

    const bokehParticles = new THREE.Points(bokehGeo, bokehMat);
    scene.add(bokehParticles);
    disposablesRef.current.push({ dispose: () => { bokehGeo.dispose(); bokehMat.dispose(); } });

    resultRef.current = { getWaveHeight };

    return () => {
      scene.remove(particles);
      scene.remove(bokehParticles);
      disposablesRef.current.forEach(d => d.dispose());
      disposablesRef.current = [];
      resultRef.current = null;
    };
  }, [THREE, sceneResult]);

  return resultRef;
}
