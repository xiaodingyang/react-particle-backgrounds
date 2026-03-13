import type { ParticleTheme } from './types';
import { baseConfig, DEFAULT_COLORS } from './base';

export const starlineTheme: ParticleTheme = {
  id: 'starline',
  name: 'Star Links',
  icon: '\u2728',
  description: 'Classic particle linking effect',
  backgroundGradient: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
  options: (isDark: boolean) => {
    const colors = DEFAULT_COLORS;
    return {
      ...baseConfig,
      interactivity: {
        detectsOn: 'window',
        events: {
          onClick: { enable: true, mode: 'push' },
          onHover: { enable: true, mode: 'grab' },
          resize: { enable: true },
        },
        modes: {
          push: { quantity: 6 },
          grab: {
            distance: 200,
            links: { opacity: 1, color: colors },
          },
        },
      },
      particles: {
        color: { value: colors },
        links: {
          color: colors,
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: 'none',
          enable: true,
          outModes: { default: 'out' },
          random: false,
          speed: 2,
          straight: false,
        },
        number: {
          density: { enable: true, width: 1920, height: 1080 },
          value: 100,
        },
        opacity: { value: 0.7 },
        shape: { type: 'circle' },
        size: { value: { min: 2, max: 6 } },
        shadow: {
          blur: 8,
          color: { value: colors },
          enable: true,
          offset: { x: 0, y: 0 },
        },
      },
    };
  },
};
