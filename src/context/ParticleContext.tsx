import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ThemeId } from '../themes/types';
import { DEFAULT_THEME_ID } from '../themes';

interface ParticleContextValue {
  themeId: string;
  isDark: boolean;
  setTheme: (id: string) => void;
  setDark: (dark: boolean) => void;
}

const ParticleContext = createContext<ParticleContextValue | null>(null);

const STORAGE_KEY = 'rpb-theme-id';

export interface ParticleProviderProps {
  /** 初始/默认主题 ID */
  defaultTheme?: ThemeId | string;
  /** 是否使用深色模式粒子颜色 */
  isDark?: boolean;
  /** 是否将主题选择持久化到 localStorage */
  persist?: boolean;
  children: React.ReactNode;
}

/**
 * 为子组件提供粒子主题状态。
 * 用此 Provider 包裹你的应用（或子树），即可无需显式传参地使用
 * `<ParticlesBackground />` 和 `<ThemeSelector />`。
 */
export const ParticleProvider: React.FC<ParticleProviderProps> = ({
  defaultTheme = DEFAULT_THEME_ID,
  isDark: isDarkProp = true,
  persist = true,
  children,
}) => {
  const [themeId, setThemeId] = useState<string>(() => {
    if (persist && typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) || defaultTheme;
    }
    return defaultTheme;
  });
  const [isDark, setDark] = useState(isDarkProp);

  useEffect(() => {
    setDark(isDarkProp);
  }, [isDarkProp]);

  const setTheme = useCallback((id: string) => {
    setThemeId(id);
    if (persist && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, id);
    }
  }, [persist]);

  return (
    <ParticleContext.Provider value={{ themeId, isDark, setTheme, setDark }}>
      {children}
    </ParticleContext.Provider>
  );
};

/** 访问当前粒子主题上下文。必须在 `<ParticleProvider>` 内使用。 */
export const useParticleTheme = (): ParticleContextValue => {
  const ctx = useContext(ParticleContext);
  if (!ctx) {
    throw new Error('useParticleTheme must be used within a <ParticleProvider>');
  }
  return ctx;
};

/**
 * 内部 Hook：如果上下文可用则返回上下文，否则回退到 props。
 * 这允许组件在有或没有 Provider 的情况下都能正常工作。
 */
export const useParticleThemeOptional = () => {
  return useContext(ParticleContext);
};
