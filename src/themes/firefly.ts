import type { ParticleTheme } from './types';
import { baseConfig } from './base';

export const fireflyTheme: ParticleTheme = {
  id: 'firefly',
  name: '萤火虫',
  icon: '🪲',
  description: '温暖的萤火虫光效',
  backgroundGradient: 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
  options: (isDark: boolean) => ({
    ...baseConfig,
    interactivity: {
      detectsOn: 'window',
      events: {
        onHover: { enable: true, mode: 'slow' },
        resize: { enable: true },
      },
      modes: {
        slow: { factor: 3, radius: 200 },
      },
    },
    particles: {
      color: {
        value: isDark
          ? ['#ffff00', '#adff2f', '#7fff00', '#00ff7f']
          : ['#ffc107', '#ff9800', '#ff5722', '#4caf50'],
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: { default: 'bounce' },
        random: true,
        speed: 1,
        straight: false,
        trail: {
          enable: true,
          length: 5,
          fill: { color: 'transparent' },
        },
      },
      number: {
        density: { enable: true, width: 1920, height: 1080 },
        value: 40,
      },
      opacity: {
        value: { min: 0.3, max: 1 },
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 0.1,
          sync: false,
        },
      },
      shape: { type: 'circle' },
      size: { value: { min: 2, max: 5 } },
      shadow: {
        blur: 15,
        color: { value: isDark ? '#adff2f' : '#ffc107' },
        enable: true,
        offset: { x: 0, y: 0 },
      },
    },
  }),
};
