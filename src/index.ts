// 组件
export { default as ParticlesBackground } from './components/ParticlesBackground';
export type { ParticlesBackgroundProps } from './components/ParticlesBackground';
export { default as ThemeSelector } from './components/ThemeSelector';
export type { ThemeSelectorProps } from './components/ThemeSelector';

// 上下文
export { ParticleProvider, useParticleTheme } from './context/ParticleContext';
export type { ParticleProviderProps } from './context/ParticleContext';

// 主题
export {
  particleThemes,
  getThemeById,
  DEFAULT_THEME_ID,
  DEFAULT_COLORS,
  baseConfig,
  starlineTheme,
  snowTheme,
  bubbleTheme,
  starsTheme,
  fireflyTheme,
  geometryTheme,
  waveTheme,
  wave2dTheme,
} from './themes';
export type { ParticleTheme, ThemeId } from './themes';
