import type { ParticleTheme } from './types';
import { baseConfig } from './base';

export const starsTheme: ParticleTheme = {
  id: 'stars',
  name: 'Twinkling Stars',
  icon: '\u2B50',
  description: 'Sparkling starry sky',
  backgroundGradient: 'linear-gradient(180deg, #000000 0%, #1a1a2e 50%, #16213e 100%)',
  options: (isDark: boolean) => ({
    ...baseConfig,
    interactivity: {
      detectsOn: 'window',
      events: {
        onClick: { enable: true, mode: 'push' },
        onHover: { enable: true, mode: 'connect' },
        resize: { enable: true },
      },
      modes: {
        push: { quantity: 3 },
        connect: { distance: 100, links: { opacity: 0.3 }, radius: 150 },
      },
    },
    particles: {
      color: {
        value: isDark
          ? ['#ffffff', '#ffffd4', '#ffecd2', '#d4f1ff']
          : ['#ffd700', '#ffb347', '#ff6b6b', '#4ecdc4'],
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: { default: 'out' },
        random: true,
        speed: 0.5,
        straight: false,
      },
      number: {
        density: { enable: true, width: 1920, height: 1080 },
        value: 120,
      },
      opacity: {
        value: { min: 0.2, max: 1 },
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0.1,
          sync: false,
        },
      },
      shape: { type: 'star', options: { star: { sides: 5 } } },
      size: { value: { min: 1, max: 4 } },
      twinkle: {
        lines: { enable: false },
        particles: {
          enable: true,
          frequency: 0.05,
          opacity: 1,
          color: { value: isDark ? '#ffffff' : '#ffd700' },
        },
      },
      shadow: {
        blur: 6,
        color: { value: isDark ? '#ffffff' : '#ffd700' },
        enable: true,
        offset: { x: 0, y: 0 },
      },
    },
  }),
};
