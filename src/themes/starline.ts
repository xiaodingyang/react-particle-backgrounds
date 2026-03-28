import type { ParticleTheme } from './types';
import { baseConfig, DEFAULT_COLORS } from './base';

export const starlineTheme: ParticleTheme = {
  id: 'starline',
  name: '星链',
  icon: '✨',
  description: '经典粒子连线效果',
  backgroundGradient: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
  options: (isDark: boolean) => {
    const colors = DEFAULT_COLORS;
    return {
      ...baseConfig,
      interactivity: {
        detectsOn: 'window',
        events: {
          onClick: { enable: false },
          onHover: { enable: true, mode: 'grab' },
          resize: { enable: true },
        },
        modes: {
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
          value: 80,
          limit: { value: 100, mode: 'delete' },
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
