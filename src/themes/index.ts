export type { ParticleTheme, ThemeId } from './types';
export { baseConfig, DEFAULT_COLORS } from './base';

// 导出所有主题
export { starlineTheme } from './starline';
export { snowTheme } from './snow';
export { bubbleTheme } from './bubble';
export { starsTheme } from './stars';
export { fireflyTheme } from './firefly';
export { geometryTheme } from './geometry';
export { waveTheme } from './wave';
export { wave2dTheme } from './wave2d';

import { starlineTheme } from './starline';
import { snowTheme } from './snow';
import { bubbleTheme } from './bubble';
import { starsTheme } from './stars';
import { fireflyTheme } from './firefly';
import { geometryTheme } from './geometry';
import { waveTheme } from './wave';
import { wave2dTheme } from './wave2d';
import type { ParticleTheme } from './types';

export const DEFAULT_THEME_ID = 'starline';

/** 所有内置粒子主题（不包含 "none"） */
export const particleThemes: ParticleTheme[] = [
  starlineTheme,
  snowTheme,
  bubbleTheme,
  starsTheme,
  fireflyTheme,
  geometryTheme,
  waveTheme,
  wave2dTheme,
];

/** 根据 ID 获取主题。找不到时回退到 starline。 */
export const getThemeById = (id: string): ParticleTheme => {
  return particleThemes.find((theme) => theme.id === id) || starlineTheme;
};
