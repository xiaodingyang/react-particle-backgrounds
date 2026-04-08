// 组件
export { default as ParticlesBackground } from './components/ParticlesBackground';
export type { ParticlesBackgroundProps } from './components/ParticlesBackground';
export { default as ThemeSelector } from './components/ThemeSelector';
export type { ThemeSelectorProps } from './components/ThemeSelector';
export { ParticleErrorBoundary } from './components/ParticleErrorBoundary';
export type { ErrorBoundaryProps } from './components/ParticleErrorBoundary';
export { ParticleDebugPanel } from './components/ParticleDebugPanel';
export type { DebugPanelProps } from './components/ParticleDebugPanel';

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
  tyndallTheme,
} from './themes';
export type { ParticleTheme, ThemeId } from './themes';

// 工具函数
export { detectPerformance, PERFORMANCE_PRESETS, type PerformanceLevel } from './utils/performanceDetector';
export { isMobileDevice, MOBILE_PRESET } from './utils/mobileDetector';
export { validateImageUrl, sanitizeCustomOptions } from './utils/sanitize';

// Hooks
export { useFPSMonitor } from './hooks/useFPSMonitor';
export { useParticleCleanup } from './hooks/useParticleCleanup';

// 国际化
export { t, type Locale } from './i18n';
