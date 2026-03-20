import type { ParticleTheme } from './types';
import { baseConfig } from './base';

export const waveTheme: ParticleTheme = {
  id: 'wave',
  name: '粒子海洋',
  icon: '🌊',
  description: '3D 粒子波浪效果（需要 three.js）',
  isThreeJS: true,
  backgroundGradient: 'linear-gradient(180deg, #000000 0%, #0a1628 50%, #0d1f3c 100%)',
  options: () => ({
    ...baseConfig,
    particles: {
      number: { value: 0 },
    },
  }),
};
