import type { ParticleTheme } from './types';
import { baseConfig } from './base';

export const bubbleTheme: ParticleTheme = {
  id: 'bubble',
  name: 'Bubbles',
  icon: '\uD83E\uDEE7',
  description: 'Dreamy rising bubbles',
  backgroundGradient: 'linear-gradient(180deg, #0a2647 0%, #144272 50%, #205295 100%)',
  options: (isDark: boolean) => ({
    ...baseConfig,
    interactivity: {
      detectsOn: 'window',
      events: {
        onClick: { enable: true, mode: 'pop' },
        onHover: { enable: true, mode: 'bubble' },
        resize: { enable: true },
      },
      modes: {
        bubble: { distance: 200, size: 15, duration: 2, opacity: 0.8 },
        pop: {},
      },
    },
    particles: {
      color: {
        value: isDark
          ? ['#00d9ff', '#00ff9d', '#ff00e6', '#ffee00']
          : ['#ffb3d9', '#ff91c7', '#ffc0e5', '#ffd6e8'],
      },
      move: {
        direction: 'top',
        enable: true,
        outModes: { default: 'out' },
        speed: { min: 1, max: 2 },
        straight: false,
      },
      number: {
        density: { enable: true, width: 1920, height: 1080 },
        value: 50,
      },
      opacity: {
        value: { min: 0.2, max: 0.6 },
        animation: { enable: true, speed: 0.5, minimumValue: 0.1, sync: false },
      },
      shape: { type: 'circle' },
      size: {
        value: { min: 5, max: 15 },
        animation: { enable: true, speed: 3, minimumValue: 3, sync: false },
      },
      stroke: {
        width: 1,
        color: { value: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)' },
      },
      shadow: {
        blur: 10,
        color: { value: isDark ? '#ffb3d9' : '#ff91c7' },
        enable: true,
        offset: { x: 0, y: 0 },
      },
    },
  }),
};
