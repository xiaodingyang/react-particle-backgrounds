export type { ParticleTheme, ThemeId } from './types';
export { baseConfig, DEFAULT_COLORS } from './base';
export { starlineTheme } from './starline';
export { snowTheme } from './snow';
export { bubbleTheme } from './bubble';
export { starsTheme } from './stars';
export { fireflyTheme } from './firefly';
export { geometryTheme } from './geometry';
export { waveTheme } from './wave';

import { starlineTheme } from './starline';
import { snowTheme } from './snow';
import { bubbleTheme } from './bubble';
import { starsTheme } from './stars';
import { fireflyTheme } from './firefly';
import { geometryTheme } from './geometry';
import { waveTheme } from './wave';
import type { ParticleTheme } from './types';

/** All built-in particle themes (excludes "none") */
export const particleThemes: ParticleTheme[] = [
  starlineTheme,
  snowTheme,
  bubbleTheme,
  starsTheme,
  fireflyTheme,
  geometryTheme,
  waveTheme,
];

/** Get a theme by its ID. Falls back to starline if not found. */
export const getThemeById = (id: string): ParticleTheme => {
  return particleThemes.find((theme) => theme.id === id) || starlineTheme;
};

export const DEFAULT_THEME_ID = 'starline';
