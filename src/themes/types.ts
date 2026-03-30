import type { ISourceOptions } from '@tsparticles/engine';

export interface ParticleTheme {
  id: string;
  name: string;
  icon: string;
  description: string;
  /** 是否使用 Three.js 而非 tsparticles */
  isThreeJS?: boolean;
  /** 根据深色模式状态返回 tsparticles 配置 */
  options: (isDark: boolean) => ISourceOptions;
  /** 纯色背景色 */
  backgroundColor?: string;
  /** CSS 渐变背景 */
  backgroundGradient?: string;
}

export type ThemeId =
  | 'starline'
  | 'snow'
  | 'bubble'
  | 'stars'
  | 'firefly'
  | 'geometry'
  | 'wave'
  | 'wave2d'
  | 'tyndall'
  | 'none';
