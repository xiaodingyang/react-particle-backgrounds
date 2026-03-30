import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Container } from '@tsparticles/engine';
import { getThemeById, DEFAULT_THEME_ID } from '../themes';
import type { ThemeId } from '../themes/types';
import { useParticleThemeOptional } from '../context/ParticleContext';
import ParticleWave from './ParticleWave';
import ParticleWave2D from './ParticleWave2D';

let instanceCounter = 0;
let engineInitPromise: Promise<void> | null = null;

const toRgba = (color: string, alpha: number): string | null => {
  const hex = color.trim().match(/^#([\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i);
  if (hex) {
    const raw = hex[1];
    const full = raw.length === 3
      ? raw.split('').map((c) => c + c).join('')
      : raw.slice(0, 6);
    const r = Number.parseInt(full.slice(0, 2), 16);
    const g = Number.parseInt(full.slice(2, 4), 16);
    const b = Number.parseInt(full.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const rgb = color.trim().match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgb) {
    return `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, ${alpha})`;
  }

  return null;
};

const buildBackground = (base: string | undefined, themeColor?: string): string | undefined => {
  if (!themeColor) return base;

  const strong = toRgba(themeColor, 0.32);
  const soft = toRgba(themeColor, 0.14);
  const glow = toRgba(themeColor, 0.08);
  if (!strong || !soft || !glow) return base;

  const colorGradient =
    `radial-gradient(90% 60% at 100% 0%, ${strong} 0%, ${soft} 36%, ${glow} 62%, rgba(0, 0, 0, 0) 88%), linear-gradient(155deg, ${soft} 0%, rgba(0, 0, 0, 0) 48%)`;
  return base ? `${colorGradient}, ${base}` : `${colorGradient}, linear-gradient(180deg, #0b1220 0%, #111827 100%)`;
};

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
  /** 传入主题色，背景会自动叠加同色渐变 */
  themeColor?: string;
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
  themeColor,
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
  const themeBg = buildBackground(theme.backgroundGradient || theme.backgroundColor, themeColor);

  useEffect(() => {
    if (theme.isThreeJS || themeId === 'none') return;

    if (!engineInitPromise) {
      engineInitPromise = import('@tsparticles/react').then(async ({ initParticlesEngine }) => {
        const { loadSlim } = await import('@tsparticles/slim');
        await initParticlesEngine(async (engine) => {
          await loadSlim(engine);
        });
      });
    }

    engineInitPromise.then(() => setInit(true)).catch(() => setInit(true));
  }, [theme.isThreeJS, themeId, instanceId]);

  useEffect(() => {
    if (!isFirstMount.current) {
      if (containerRef.current) {
        containerRef.current.destroy();
        containerRef.current = undefined;
      }
      setInstanceId(++instanceCounter);
      setInit(false);
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
  const backgroundStyle = useMemo<React.CSSProperties | null>(() => {
    if (!themeBg) return null;
    return {
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
      background: themeBg,
    };
  }, [themeBg]);

  if (themeId === 'none') return null;

  if (theme.isThreeJS) {
    const WaveComponent = themeId === 'wave2d' ? ParticleWave2D : ParticleWave;
    return (
      <WaveComponent
        background={themeBg}
        className={className}
        style={style}
      />
    );
  }

  if (!init) return null;

  const particlesId = `rpb-tsparticles-${instanceId}`;

  const ParticlesLazy = React.lazy(() => import('@tsparticles/react').then(m => ({ default: m.Particles })));

  return (
    <React.Suspense fallback={null}>
      {backgroundStyle && <div aria-hidden style={backgroundStyle} />}
      <ParticlesLazy
        id={particlesId}
        key={particlesId}
        className={className}
        style={style}
        particlesLoaded={particlesLoaded}
        options={options}
      />
    </React.Suspense>
  );
};

export default ParticlesBackground;
