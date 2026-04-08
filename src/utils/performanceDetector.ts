export type PerformanceLevel = 'high' | 'medium' | 'low';

/**
 * 检测设备性能等级。
 * - high: 8+ 核心或 4GB+ JS 堆内存
 * - medium: 4+ 核心
 * - low: 其他
 */
export function detectPerformance(): PerformanceLevel {
  if (typeof navigator === 'undefined') return 'high';

  const memory = (performance as unknown as { memory?: { jsHeapSizeLimit: number } }).memory;
  const cores = navigator.hardwareConcurrency || 2;

  if (cores >= 8 || (memory && memory.jsHeapSizeLimit > 4e9)) {
    return 'high';
  }

  if (cores >= 4) {
    return 'medium';
  }

  return 'low';
}

export const PERFORMANCE_PRESETS: Record<PerformanceLevel, { particleMultiplier: number; fpsLimit: number }> = {
  high: { particleMultiplier: 1.0, fpsLimit: 120 },
  medium: { particleMultiplier: 0.6, fpsLimit: 60 },
  low: { particleMultiplier: 0.3, fpsLimit: 30 },
};
