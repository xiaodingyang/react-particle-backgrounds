import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Container } from '@tsparticles/engine';
import { getThemeById, DEFAULT_THEME_ID } from '../themes';
import type { ThemeId } from '../themes/types';
import { useParticleThemeOptional } from '../context/ParticleContext';
import ParticleWave from './ParticleWave';
import ParticleWave2D from './ParticleWave2D';
import { ParticleErrorBoundary } from './ParticleErrorBoundary';
import { detectPerformance, PERFORMANCE_PRESETS, type PerformanceLevel } from '../utils/performanceDetector';
import { isMobileDevice, MOBILE_PRESET } from '../utils/mobileDetector';
import { useFPSMonitor } from '../hooks/useFPSMonitor';
import { useParticleCleanup } from '../hooks/useParticleCleanup';
import { sanitizeCustomOptions } from '../utils/sanitize';

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
  return base ? `${colorGradient}, ${base}` : colorGradient;
};

export interface ParticlesBackgroundProps {
  /** 主题 ID */
  theme?: ThemeId | string;
  /** 深色模式开关 */
  isDark?: boolean;
  /** 粒子加载完成的回调 */
  onLoaded?: (container?: Container) => void;
  /** 传入主题色，背景会自动叠加同色渐变 */
  themeColor?: string;
  /** 自定义 CSS 类名 */
  className?: string;
  /** 自定义行内样式 */
  style?: React.CSSProperties;
  /** 渲染失败时的 fallback UI */
  errorFallback?: React.ReactNode;
  /** 性能档位：'auto' 自动检测，或手动指定 */
  performance?: 'auto' | PerformanceLevel;
  /** 移动端额外配置 */
  mobileOptions?: Partial<typeof MOBILE_PRESET>;
  /** 自定义粒子选项（会经过安全校验） */
  customOptions?: Record<string, unknown>;
  /** 加载状态指示器 */
  loading?: React.ReactNode;
  /** 加载开始回调 */
  onLoadStart?: () => void;
  /** 加载完成回调 */
  onLoadEnd?: () => void;
  /** 错误回调 */
  onError?: (error: Error, context: { theme: string; engine: string }) => void;
  /** 是否显示调试面板（仅开发环境） */
  debug?: boolean;
}

/**
 * 渲染全屏粒子背景。
 */
const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({
  theme: themeProp,
  isDark: isDarkProp,
  onLoaded,
  themeColor,
  className,
  style,
  errorFallback,
  performance: performanceProp = 'auto',
  mobileOptions,
  customOptions,
  loading,
  onLoadStart,
  onLoadEnd,
  onError,
  debug,
}) => {
  const [init, setInit] = useState(false);
  const [instanceId, setInstanceId] = useState(() => ++instanceCounter);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<Container | undefined>(undefined);
  const divRef = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef(true);
  const ctx = useParticleThemeOptional();

  // 性能检测
  const [perfLevel, setPerfLevel] = useState<PerformanceLevel>(() => {
    if (performanceProp !== 'auto') return performanceProp;
    if (isMobileDevice()) return 'low';
    return detectPerformance();
  });

  // FPS 监控与自动降级
  const handleLowFPS = useCallback(() => {
    setPerfLevel(prev => {
      if (prev === 'high') return 'medium';
      if (prev === 'medium') return 'low';
      return prev;
    });
  }, []);

  useFPSMonitor({ onLowFPS: handleLowFPS });

  // 内存清理
  useParticleCleanup(divRef);

  const themeId = themeProp ?? ctx?.themeId ?? DEFAULT_THEME_ID;
  const isDark = isDarkProp ?? ctx?.isDark ?? true;
  const theme = getThemeById(themeId);
  const themeBg = buildBackground(theme.backgroundGradient || theme.backgroundColor, themeColor);

  // 应用性能预设到粒子选项
  const _preset = isMobileDevice()
    ? { ...MOBILE_PRESET, ...mobileOptions }
    : PERFORMANCE_PRESETS[perfLevel];

  useEffect(() => {
    if (theme.isThreeJS || themeId === 'none') return;
    onLoadStart?.();
    setIsLoading(true);

    if (!engineInitPromise) {
      engineInitPromise = import('@tsparticles/react').then(async ({ initParticlesEngine }) => {
        const { loadSlim } = await import('@tsparticles/slim');
        await initParticlesEngine(async (engine) => {
          await loadSlim(engine);
        });
      });
    }

    engineInitPromise.then(() => {
      setInit(true);
      setIsLoading(false);
      onLoadEnd?.();
    }).catch(() => {
      setInit(true);
      setIsLoading(false);
    });
  }, [theme.isThreeJS, themeId, instanceId, onLoadStart, onLoadEnd]);

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

  const options = useMemo(() => {
    const base = theme.options(isDark);
    if (customOptions) {
      return { ...base, ...sanitizeCustomOptions(customOptions) };
    }
    return base;
  }, [theme, isDark, customOptions]);

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
      <ParticleErrorBoundary fallback={errorFallback}>
        <WaveComponent
          background={themeBg}
          className={className}
          style={style}
        />
      </ParticleErrorBoundary>
    );
  }

  if (!init) {
    return isLoading ? (loading ?? null) : null;
  }

  const particlesId = `rpb-tsparticles-${instanceId}`;

  const ParticlesLazy = React.lazy(() => import('@tsparticles/react').then(m => ({ default: m.Particles })));

  return (
    <ParticleErrorBoundary fallback={errorFallback}>
      <React.Suspense fallback={loading ?? null}>
        <div ref={divRef}>
          {backgroundStyle && <div style={backgroundStyle} />}
          <ParticlesLazy
            id={particlesId}
            key={particlesId}
            className={className}
            style={style}
            particlesLoaded={particlesLoaded}
            options={options}
          />
        </div>
      </React.Suspense>
    </ParticleErrorBoundary>
  );
};

export default ParticlesBackground;
