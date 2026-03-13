import type { ParticleTheme } from './types';
import { baseConfig } from './base';

export const waveTheme: ParticleTheme = {
  id: 'wave',
  name: 'Particle Ocean',
  icon: '\uD83C\uDF0A',
  description: '3D particle wave effect (requires three.js)',
  isThreeJS: true,
  backgroundGradient: 'linear-gradient(180deg, #000000 0%, #0a1628 50%, #0d1f3c 100%)',
  options: () => ({
    ...baseConfig,
    particles: {
      number: { value: 0 },
    },
  }),
};
