import type { ParticleTheme } from './types';
import { baseConfig } from './base';

export const wave2dTheme: ParticleTheme = {
  id: 'wave2d',
  name: '轻量波浪',
  icon: '🌊',
  description: '轻量级 Canvas 2D 粒子波浪',
  isThreeJS: true,
  options: () => baseConfig,
  backgroundGradient: 'linear-gradient(180deg, #000000 0%, #0a1628 50%, #0d1f3c 100%)',
};
