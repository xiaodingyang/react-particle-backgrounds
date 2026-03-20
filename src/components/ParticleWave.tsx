import React, { useRef, useEffect } from 'react';

interface ParticleWaveProps {
  /** 波浪背后的 CSS 渐变或纯色背景 */
  background?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 使用 Three.js 渲染的 3D 粒子海洋波浪。
 * Three.js 以动态方式加载 — 如果未安装，此组件不会渲染任何内容。
 */
const ParticleWave: React.FC<ParticleWaveProps> = ({
  background = 'linear-gradient(180deg, #000000 0%, #0a1628 50%, #0d1f3c 100%)',
  className,
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const hasThree = useRef(true);

  useEffect(() => {
    let THREE: any;
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      THREE = (globalThis as any).require
        ? (globalThis as any).require('three')
        : (() => { throw new Error('no require'); })();
    } catch {
      hasThree.current = false;
      console.warn('[react-particle-backgrounds] 未安装 "three"。波浪主题需要它作为 peer dependency。');
      return;
    }

    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 50, 100);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const particleCount = 15000;
    const waveWidth = 200;
    const waveDepth = 100;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * waveWidth;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = (Math.random() - 0.5) * waveDepth;

      const colorChoice = Math.random();
      if (colorChoice < 0.5) {
        colors[i3] = 0; colors[i3 + 1] = 0.8 + Math.random() * 0.2; colors[i3 + 2] = 1;
      } else if (colorChoice < 0.8) {
        colors[i3] = 0.1; colors[i3 + 1] = 0.3 + Math.random() * 0.3; colors[i3 + 2] = 0.9 + Math.random() * 0.1;
      } else {
        colors[i3] = 0.8 + Math.random() * 0.2; colors[i3 + 1] = 0.9 + Math.random() * 0.1; colors[i3 + 2] = 1;
      }
      sizes[i] = Math.random() * 2 + 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const vertexShader = `
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
        float glow = exp(-dist * 3.0);
        vec3 finalColor = vColor + glow * 0.5;
        gl_FragColor = vec4(finalColor, alpha * 0.8);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader, fragmentShader,
      transparent: true, vertexColors: true,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const bokehCount = 100;
    const bokehGeometry = new THREE.BufferGeometry();
    const bokehPositions = new Float32Array(bokehCount * 3);
    const bokehColors = new Float32Array(bokehCount * 3);
    const bokehSizes = new Float32Array(bokehCount);

    for (let i = 0; i < bokehCount; i++) {
      const i3 = i * 3;
      bokehPositions[i3] = (Math.random() - 0.5) * waveWidth * 1.5;
      bokehPositions[i3 + 1] = Math.random() * -30 - 10;
      bokehPositions[i3 + 2] = (Math.random() - 0.5) * waveDepth * 2;
      bokehColors[i3] = 0.2; bokehColors[i3 + 1] = 0.5 + Math.random() * 0.3; bokehColors[i3 + 2] = 1;
      bokehSizes[i] = Math.random() * 15 + 8;
    }

    bokehGeometry.setAttribute('position', new THREE.BufferAttribute(bokehPositions, 3));
    bokehGeometry.setAttribute('color', new THREE.BufferAttribute(bokehColors, 3));
    bokehGeometry.setAttribute('size', new THREE.BufferAttribute(bokehSizes, 1));

    const bokehMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
          gl_FragColor = vec4(vColor, alpha * 0.3);
        }
      `,
      transparent: true, vertexColors: true,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });

    const bokehParticles = new THREE.Points(bokehGeometry, bokehMaterial);
    scene.add(bokehParticles);

    const dropCount = 150;
    const trailLength = 12;

    interface RainDrop {
      x: number; z: number; y: number;
      velocity: number; active: boolean;
      maxHeight: number; trail: number[];
      opacity: number;
    }

    const rainDrops: RainDrop[] = [];
    for (let i = 0; i < dropCount; i++) {
      const shouldActivate = Math.random() < 0.1;
      const x = (Math.random() - 0.5) * waveWidth * 0.9;
      const z = (Math.random() - 0.5) * waveDepth * 0.7;
      const waveHeight = Math.sin(x * 0.05) * 8 + Math.sin(z * 0.08) * 5;
      const startHeight = shouldActivate ? waveHeight + Math.random() * 40 : -200;
      rainDrops.push({
        x, z, y: startHeight,
        velocity: shouldActivate ? 0.5 + Math.random() * 0.7 : 0,
        active: shouldActivate,
        maxHeight: waveHeight + 80 + Math.random() * 120,
        trail: new Array(trailLength).fill(startHeight),
        opacity: shouldActivate ? 1.0 : 0,
      });
    }

    const trailPointCount = dropCount * trailLength;
    const dropTrailGeometry = new THREE.BufferGeometry();
    const dropTrailPositions = new Float32Array(trailPointCount * 3);
    const dropTrailColors = new Float32Array(trailPointCount * 3);
    const dropTrailSizes = new Float32Array(trailPointCount);

    for (let i = 0; i < dropCount; i++) {
      for (let j = 0; j < trailLength; j++) {
        dropTrailSizes[i * trailLength + j] = 4 * (1 - j / trailLength) * 0.5;
      }
    }

    dropTrailGeometry.setAttribute('position', new THREE.BufferAttribute(dropTrailPositions, 3));
    dropTrailGeometry.setAttribute('color', new THREE.BufferAttribute(dropTrailColors, 3));
    dropTrailGeometry.setAttribute('size', new THREE.BufferAttribute(dropTrailSizes, 1));

    const dropTrailMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `,
      transparent: true, vertexColors: true,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });

    const dropTrailParticles = new THREE.Points(dropTrailGeometry, dropTrailMaterial);
    scene.add(dropTrailParticles);

    const dropHeadGeometry = new THREE.BufferGeometry();
    const dropHeadPositions = new Float32Array(dropCount * 3);
    const dropHeadColors = new Float32Array(dropCount * 3);
    const dropHeadSizes = new Float32Array(dropCount);
    for (let i = 0; i < dropCount; i++) {
      dropHeadSizes[i] = (6 + Math.random() * 4) * 0.5;
    }

    dropHeadGeometry.setAttribute('position', new THREE.BufferAttribute(dropHeadPositions, 3));
    dropHeadGeometry.setAttribute('color', new THREE.BufferAttribute(dropHeadColors, 3));
    dropHeadGeometry.setAttribute('size', new THREE.BufferAttribute(dropHeadSizes, 1));

    const dropHeadMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          float glow = exp(-dist * 2.0);
          vec3 finalColor = vColor + glow * 0.8;
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true, vertexColors: true,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });

    const dropHeadParticles = new THREE.Points(dropHeadGeometry, dropHeadMaterial);
    scene.add(dropHeadParticles);

    let time = 0;
    let lastSpawnTime = 0;

    const getWaveHeight = (x: number, z: number, t: number) =>
      Math.sin(x * 0.05 + t) * 8 + Math.sin(z * 0.08 + t * 0.8) * 5 + Math.sin((x + z) * 0.03 + t * 1.2) * 3;

    const activateDrop = (drop: RainDrop) => {
      drop.x = (Math.random() - 0.5) * waveWidth * 0.9;
      drop.z = (Math.random() - 0.5) * waveDepth * 0.7;
      const wh = getWaveHeight(drop.x, drop.z, time);
      drop.y = wh;
      drop.velocity = 0.5 + Math.random() * 0.7;
      drop.maxHeight = wh + 80 + Math.random() * 120;
      drop.active = true;
      drop.opacity = 0.5;
      drop.trail.fill(wh);
    };

    const animate = () => {
      time += 0.02;
      const wavePos = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        wavePos[i3 + 1] = getWaveHeight(wavePos[i3], wavePos[i3 + 2], time);
      }
      particles.geometry.attributes.position.needsUpdate = true;

      const tPos = dropTrailParticles.geometry.attributes.position.array as Float32Array;
      const tCol = dropTrailParticles.geometry.attributes.color.array as Float32Array;
      const hPos = dropHeadParticles.geometry.attributes.position.array as Float32Array;
      const hCol = dropHeadParticles.geometry.attributes.color.array as Float32Array;

      let activeCount = 0;
      const inactiveIndices: number[] = [];

      for (let i = 0; i < dropCount; i++) {
        const drop = rainDrops[i];
        if (drop.active) {
          activeCount++;
          for (let j = trailLength - 1; j > 0; j--) drop.trail[j] = drop.trail[j - 1];
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

      if (time - lastSpawnTime >= 0.1 && inactiveIndices.length > 0) {
        const spawnCount = Math.min(2 + Math.floor(Math.random() * 2), inactiveIndices.length);
        const shuffled = [...inactiveIndices].sort(() => Math.random() - 0.5);
        for (let n = 0; n < spawnCount; n++) activateDrop(rainDrops[shuffled[n]]);
        lastSpawnTime = time;
      }

      const targetActive = 20;
      const needActivate = Math.max(3, targetActive - activeCount);
      const remaining = inactiveIndices.filter(i => !rainDrops[i].active);
      if (remaining.length > 0) {
        const shuffled = [...remaining].sort(() => Math.random() - 0.5);
        for (let n = 0; n < Math.min(needActivate, shuffled.length); n++) activateDrop(rainDrops[shuffled[n]]);
      }

      for (let i = 0; i < dropCount; i++) {
        if (!rainDrops[i].active && Math.random() < 0.25) activateDrop(rainDrops[i]);
      }

      for (let i = 0; i < dropCount; i++) {
        const drop = rainDrops[i];
        const hi3 = i * 3;
        hPos[hi3] = drop.x; hPos[hi3 + 1] = drop.y; hPos[hi3 + 2] = drop.z;
        const brightness = drop.active ? (0.8 + Math.sin(time * 5 + i) * 0.2) : 0;
        hCol[hi3] = 0.5 * brightness * drop.opacity;
        hCol[hi3 + 1] = 1.0 * brightness * drop.opacity;
        hCol[hi3 + 2] = 1.0 * brightness * drop.opacity;

        for (let j = 0; j < trailLength; j++) {
          const pi = (i * trailLength + j) * 3;
          tPos[pi] = drop.x; tPos[pi + 1] = drop.trail[j]; tPos[pi + 2] = drop.z;
          const fade = 1 - (j / trailLength);
          tCol[pi] = 0.6 * fade * drop.opacity;
          tCol[pi + 1] = 1.0 * fade * drop.opacity;
          tCol[pi + 2] = 1.0 * fade * drop.opacity;
        }
      }

      dropTrailParticles.geometry.attributes.position.needsUpdate = true;
      dropTrailParticles.geometry.attributes.color.needsUpdate = true;
      dropHeadParticles.geometry.attributes.position.needsUpdate = true;
      dropHeadParticles.geometry.attributes.color.needsUpdate = true;

      camera.position.x = Math.sin(time * 0.3) * 5;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      container.removeChild(renderer.domElement);
      geometry.dispose(); material.dispose();
      bokehGeometry.dispose(); bokehMaterial.dispose();
      dropTrailGeometry.dispose(); dropTrailMaterial.dispose();
      dropHeadGeometry.dispose(); dropHeadMaterial.dispose();
      renderer.dispose();
    };
  }, [background]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        background,
        ...style,
      }}
    />
  );
};

export default ParticleWave;
