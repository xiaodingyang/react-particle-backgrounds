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

/** Default accent colors used by themes that support multi-color particles */
export const DEFAULT_COLORS = [
  '#ffb3d9', '#f43f5e', '#a78bfa', '#3b82f6',
  '#10b981', '#f59e0b', '#ff6b6b', '#8b5cf6',
  '#06b6d4', '#fb7185',
];
