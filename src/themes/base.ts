import type { ISourceOptions } from '@tsparticles/engine';

export const baseConfig: Partial<ISourceOptions> = {
  fullScreen: {
    enable: true,
    zIndex: 0,
  },
  background: {
    color: { value: 'transparent' },
  },
  fpsLimit: 120,
  detectRetina: true,
};

/** 支持多色粒子的主题所使用的默认强调色 */
export const DEFAULT_COLORS = [
  '#ffb3d9', '#f43f5e', '#a78bfa', '#3b82f6',
  '#10b981', '#f59e0b', '#ff6b6b', '#8b5cf6',
  '#06b6d4', '#fb7185',
];
