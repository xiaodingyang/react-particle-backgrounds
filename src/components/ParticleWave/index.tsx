import React, { useRef, useEffect, useState } from 'react';
import type { ParticleWaveProps, ThreeModule } from './types';
import { useThreeScene } from './useThreeScene';
import { useWaveParticles } from './useWaveParticles';
import { useRainDrops } from './useRainDrops';
import { loadThree } from '../../utils/threeLoader';

/**
 * 使用 Three.js 渲染的 3D 粒子海洋波浪。
 * Three.js 以动态方式加载 — 如果未安装，此组件不会渲染任何内容。
 */
const ParticleWave: React.FC<ParticleWaveProps> = ({
  background = 'linear-gradient(180deg, #000000 0%, #141414 50%, #1f1f1f 100%)',
  className,
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [threeModule, setThreeModule] = useState<ThreeModule | null>(null);

  // 加载 Three.js
  useEffect(() => {
    let disposed = false;
    loadThree().then(mod => {
      if (!disposed) setThreeModule(mod);
    });
    return () => { disposed = true; };
  }, []);

  // 初始化场景
  const sceneResult = useThreeScene(containerRef, threeModule);

  // 创建波浪粒子
  const waveResult = useWaveParticles(sceneResult, threeModule);

  // 创建雨滴动画
  useRainDrops(sceneResult, waveResult, threeModule, animationRef);

  // 动画帧清理
  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

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
