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
  /** Initial/default theme ID */
  defaultTheme?: ThemeId | string;
  /** Whether to use dark mode particle colors */
  isDark?: boolean;
  /** Persist theme selection to localStorage */
  persist?: boolean;
  children: React.ReactNode;
}

/**
 * Provides particle theme state to child components.
 * Wrap your app (or a subtree) with this provider to use
 * `<ParticlesBackground />` and `<ThemeSelector />` without explicit props.
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

/** Access the current particle theme context. Must be used within a `<ParticleProvider>`. */
export const useParticleTheme = (): ParticleContextValue => {
  const ctx = useContext(ParticleContext);
  if (!ctx) {
    throw new Error('useParticleTheme must be used within a <ParticleProvider>');
  }
  return ctx;
};

/**
 * Internal hook: returns context if available, otherwise falls back to props.
 * This allows components to work both with and without a provider.
 */
export const useParticleThemeOptional = () => {
  return useContext(ParticleContext);
};
