import { useEffect, useRef, useCallback } from 'react';

interface FPSMonitorOptions {
  /** FPS 低于此阈值触发回调 */
  threshold?: number;
  /** 连续低 FPS 秒数达到此值时触发回调 */
  sustainedSeconds?: number;
  /** 低 FPS 回调 */
  onLowFPS?: () => void;
}

/**
 * 监控 FPS，在持续低帧率时触发降级回调。
 */
export function useFPSMonitor(options: FPSMonitorOptions = {}) {
  const { threshold = 30, sustainedSeconds = 3, onLowFPS } = options;
  const fpsRef = useRef(0);
  const lowCountRef = useRef(0);
  const triggeredRef = useRef(false);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let rafId: number;

    const checkFPS = () => {
      frameCount++;
      const now = performance.now();

      if (now - lastTime >= 1000) {
        fpsRef.current = frameCount;
        frameCount = 0;
        lastTime = now;

        if (fpsRef.current < threshold) {
          lowCountRef.current++;
          if (lowCountRef.current >= sustainedSeconds && !triggeredRef.current) {
            triggeredRef.current = true;
            onLowFPS?.();
          }
        } else {
          lowCountRef.current = 0;
          triggeredRef.current = false;
        }
      }

      rafId = requestAnimationFrame(checkFPS);
    };

    rafId = requestAnimationFrame(checkFPS);
    return () => cancelAnimationFrame(rafId);
  }, [threshold, sustainedSeconds, onLowFPS]);

  return { fps: fpsRef };
}
