import type { ParticleTheme } from './types';
import { baseConfig } from './base';

export const geometryTheme: ParticleTheme = {
  id: 'geometry',
  name: '几何',
  icon: '🔷',
  description: '漂浮的抽象几何图形',
  options: (isDark: boolean) => ({
    ...baseConfig,
    interactivity: {
      detectsOn: 'window',
      events: {
        onClick: { enable: true, mode: 'push' },
        onHover: { enable: true, mode: 'repulse' },
        resize: { enable: true },
      },
      modes: {
        // 快速点击会持续触发 push，限制强度有助于降低连线/粒子带来的开销
        push: { quantity: 1 },
        repulse: { distance: 150, duration: 0.4 },
      },
    },
    particles: {
      color: {
        value: ['#ffb3d9', '#ff91c7', '#ffc0e5', '#ffd6e8'],
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: { default: 'bounce' },
        random: false,
        speed: 1.5,
        straight: false,
      },
      number: {
        density: { enable: true, width: 1920, height: 1080 },
        value: 30,
        // 限制粒子总量，避免连续点击时粒子无限增加
        limit: { value: 60, mode: 'delete' },
      },
      opacity: {
        value: { min: 0.3, max: 0.7 },
      },
      rotate: {
        value: { min: 0, max: 360 },
        direction: 'random',
        animation: { enable: true, speed: 5 },
      },
      shape: {
        type: ['triangle', 'square', 'polygon'],
        options: {
          polygon: { sides: 6 },
        },
      },
      size: { value: { min: 10, max: 25 } },
      stroke: {
        width: 1,
        color: { value: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.2)' },
      },
      shadow: {
        blur: 10,
        color: { value: isDark ? '#ffb3d9' : '#ff91c7' },
        enable: true,
        offset: { x: 2, y: 2 },
      },
    },
  }),
};
