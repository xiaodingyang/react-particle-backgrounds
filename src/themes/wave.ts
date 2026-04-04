import type { ParticleTheme } from './types';
import { baseConfig } from './base';

export const waveTheme: ParticleTheme = {
  id: 'wave',
  name: '粒子海洋',
  icon: '🌊',
  description: '3D 粒子波浪效果（需要 three.js）',
  isThreeJS: true,
  options: () => ({
    ...baseConfig,
    particles: {
      number: { value: 0 },
    },
  }),
};
