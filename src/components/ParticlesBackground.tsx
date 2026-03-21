import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Container } from '@tsparticles/engine';
import { getThemeById, DEFAULT_THEME_ID } from '../themes';
import type { ThemeId } from '../themes/types';
import { useParticleThemeOptional } from '../context/ParticleContext';
import ParticleWave from './ParticleWave';
import ParticleWave2D from './ParticleWave2D';

let instanceCounter = 0;

export interface ParticlesBackgroundProps {
  /**
   * 要显示的主题 ID。如果在 `<ParticleProvider>` 内使用，
   * 此属性可选，会自动使用 Provider 中的主题。
   */
  theme?: ThemeId | string;
  /** 深色模式开关 — 影响支持的主题的粒子颜色 */
  isDark?: boolean;
  /** 粒子加载完成的回调 */
  onLoaded?: (container?: Container) => void;
  /** 自定义 CSS 类名 */
  className?: string;
  /** 自定义行内样式 */
  style?: React.CSSProperties;
}

/**
 * 渲染全屏粒子背景。
 *
 * 可以通过 props 独立使用：
 * ```tsx
 * <ParticlesBackground theme="starline" isDark />
 * ```
 *
 * 也可以在 `<ParticleProvider>` 内使用以共享状态：
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
  const [instanceId, setInstanceId] = useState(() => ++instanceCounter);
  const containerRef = useRef<Container | undefined>(undefined);
  const isFirstMount = useRef(true);
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

  useEffect(() => {
    if (!isFirstMount.current) {
      setInstanceId(++instanceCounter);
    }
    isFirstMount.current = false;

    return () => {
      if (containerRef.current) {
        containerRef.current.destroy();
        containerRef.current = undefined;
      }
    };
  }, [themeId, isDark]);

  const particlesLoaded = useCallback(async (container?: Container) => {
    if (containerRef.current && containerRef.current !== container) {
      containerRef.current.destroy();
    }
    containerRef.current = container;
    onLoaded?.(container);
  }, [onLoaded]);

  const options = useMemo(() => theme.options(isDark), [theme, isDark]);

  if (themeId === 'none') return null;

  if (theme.isThreeJS) {
    const WaveComponent = themeId === 'wave2d' ? ParticleWave2D : ParticleWave;
    return (
      <WaveComponent
        background={theme.backgroundGradient || theme.backgroundColor}
        className={className}
        style={style}
      />
    );
  }

  if (!init) return null;

  const particlesId = `rpb-tsparticles-${instanceId}`;

  return (
    <Particles
      id={particlesId}
      key={particlesId}
      className={className}
      style={style}
      particlesLoaded={particlesLoaded}
      options={options}
    />
  );
};

export default ParticlesBackground;
