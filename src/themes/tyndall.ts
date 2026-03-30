import type { ParticleTheme } from './types';
import { baseConfig } from './base';

export const tyndallTheme: ParticleTheme = {
  id: 'tyndall',
  name: '丁达尔光雨',
  icon: '🌫️',
  description: '右上阳光穿透薄雾，尘埃粒子缓慢下落',
  backgroundGradient:
    'radial-gradient(110% 84% at 100% -4%, rgba(255, 246, 196, 0.72) 0%, rgba(255, 246, 196, 0.38) 26%, rgba(255, 246, 196, 0.14) 50%, rgba(255, 246, 196, 0) 80%), linear-gradient(112deg, rgba(255, 252, 230, 0.78) 6%, rgba(255, 252, 230, 0.42) 11%, rgba(255, 252, 230, 0.08) 16%, rgba(255, 252, 230, 0) 24%), linear-gradient(116deg, rgba(255, 247, 205, 0.68) 10%, rgba(255, 247, 205, 0.32) 15%, rgba(255, 247, 205, 0.06) 20%, rgba(255, 247, 205, 0) 29%), linear-gradient(121deg, rgba(255, 241, 180, 0.62) 14%, rgba(255, 241, 180, 0.28) 18%, rgba(255, 241, 180, 0.05) 23%, rgba(255, 241, 180, 0) 32%), linear-gradient(126deg, rgba(255, 236, 166, 0.5) 18%, rgba(255, 236, 166, 0.2) 22%, rgba(255, 236, 166, 0.04) 26%, rgba(255, 236, 166, 0) 35%), radial-gradient(70% 54% at 28% 34%, rgba(208, 236, 219, 0.32) 0%, rgba(208, 236, 219, 0.12) 35%, rgba(208, 236, 219, 0) 74%), linear-gradient(180deg, #183328 0%, #122a21 48%, #0b1b15 100%)',
  options: (isDark: boolean) => ({
    ...baseConfig,
    background: {
      color: {
        value: 'transparent',
      },
    },
    interactivity: {
      detectsOn: 'window',
      events: {
        onHover: { enable: true, mode: 'slow' },
        resize: { enable: true },
      },
      modes: {
        slow: {
          factor: 2.2,
          radius: 180,
        },
      },
    },
    particles: {
      color: {
        value: isDark ? ['#fff7d8', '#ffe9a9', '#fffdf2'] : ['#fef7dd', '#fff1bc', '#fffef5'],
      },
      move: {
        direction: 'bottom',
        enable: true,
        outModes: { default: 'out', top: 'out', left: 'out', right: 'out' },
        random: true,
        speed: { min: 0.18, max: 0.56 },
        straight: false,
        angle: { value: 12, offset: 24 },
      },
      number: {
        density: { enable: true, width: 1920, height: 1080 },
        value: 120,
      },
      opacity: {
        value: { min: 0.2, max: 0.65 },
        animation: {
          enable: true,
          speed: 0.6,
          minimumValue: 0.12,
          sync: false,
        },
      },
      shape: { type: 'circle' },
      size: { value: { min: 0.9, max: 2.6 } },
      links: {
        enable: false,
      },
    },
  }),
};
