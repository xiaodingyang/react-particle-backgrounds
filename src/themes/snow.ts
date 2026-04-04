import type { ParticleTheme } from './types';
import { baseConfig } from './base';

export const snowTheme: ParticleTheme = {
  id: 'snow',
  name: '飘雪',
  icon: '❄️',
  description: '浪漫飘落雪花',
  options: (isDark: boolean) => ({
    ...baseConfig,
    interactivity: {
      detectsOn: 'window',
      events: {
        onHover: { enable: true, mode: 'repulse' },
        resize: { enable: true },
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
      },
    },
    particles: {
      color: { value: isDark ? '#ffffff' : '#87CEEB' },
      move: {
        direction: 'bottom',
        enable: true,
        outModes: { default: 'out' },
        speed: { min: 1, max: 3 },
        straight: false,
        drift: { min: -0.5, max: 0.5 },
      },
      number: {
        density: { enable: true, width: 1920, height: 1080 },
        value: 80,
      },
      opacity: {
        value: { min: 0.3, max: 0.8 },
        animation: { enable: true, speed: 1, minimumValue: 0.3, sync: false },
      },
      shape: { type: 'circle' },
      size: { value: { min: 2, max: 6 } },
      wobble: {
        enable: true,
        distance: 10,
        speed: { min: -5, max: 5 },
      },
      shadow: {
        blur: 5,
        color: { value: isDark ? '#ffffff' : '#87CEEB' },
        enable: true,
        offset: { x: 0, y: 0 },
      },
    },
  }),
};
