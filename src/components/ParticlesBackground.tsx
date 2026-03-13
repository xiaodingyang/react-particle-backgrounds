import React, { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Container } from '@tsparticles/engine';
import { getThemeById, DEFAULT_THEME_ID } from '../themes';
import type { ThemeId } from '../themes/types';
import { useParticleThemeOptional } from '../context/ParticleContext';
import ParticleWave from './ParticleWave';

export interface ParticlesBackgroundProps {
  /**
   * Theme ID to display. If used inside a `<ParticleProvider>`,
   * this is optional and the provider's theme will be used.
   */
  theme?: ThemeId | string;
  /** Dark mode toggle — affects particle colors for supported themes */
  isDark?: boolean;
  /** Callback when particles finish loading */
  onLoaded?: (container?: Container) => void;
  /** Custom CSS class */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
}

/**
 * Renders a full-screen particle background.
 *
 * Can be used standalone with props:
 * ```tsx
 * <ParticlesBackground theme="starline" isDark />
 * ```
 *
 * Or inside a `<ParticleProvider>` for shared state:
 * ```tsx
 * <ParticleProvider defaultTheme="snow">
 *   <ParticlesBackground />
 * </ParticleProvider>
 * ```
 */
const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({
  theme: themeProp,
  isDark: isDarkProp,
  onLoaded,
  className,
  style,
}) => {
  const [init, setInit] = useState(false);
  const ctx = useParticleThemeOptional();

  const themeId = themeProp ?? ctx?.themeId ?? DEFAULT_THEME_ID;
  const isDark = isDarkProp ?? ctx?.isDark ?? true;
  const theme = getThemeById(themeId);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    }).catch(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(() => theme.options(isDark), [theme, isDark]);

  if (themeId === 'none') return null;

  if (theme.isThreeJS) {
    return (
      <ParticleWave
        background={theme.backgroundGradient || theme.backgroundColor}
        className={className}
        style={style}
      />
    );
  }

  if (!init) return null;

  return (
    <Particles
      id="rpb-tsparticles"
      key={themeId}
      className={className}
      style={style}
      particlesLoaded={async (container) => onLoaded?.(container)}
      options={options}
    />
  );
};

export default ParticlesBackground;
