import React from 'react';
import type { PerformanceLevel } from '../utils/performanceDetector';

export interface DebugPanelProps {
  fps: number;
  particleCount: number;
  memoryUsage?: number;
  performanceLevel: PerformanceLevel;
}

/**
 * 开发者调试面板 — 显示实时性能数据。
 * 仅在 debug=true 且开发环境时渲染。
 */
export const ParticleDebugPanel: React.FC<DebugPanelProps> = ({
  fps,
  particleCount,
  memoryUsage,
  performanceLevel,
}) => {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        bottom: 8,
        right: 8,
        background: 'rgba(0,0,0,0.85)',
        color: fps < 30 ? '#f44' : '#0f0',
        padding: '8px 12px',
        borderRadius: 6,
        fontSize: 12,
        fontFamily: 'monospace',
        zIndex: 99999,
        pointerEvents: 'none',
        lineHeight: 1.6,
      }}
    >
      <div>FPS: {fps}</div>
      <div>Particles: {particleCount}</div>
      {memoryUsage != null && <div>Memory: {(memoryUsage / 1024 / 1024).toFixed(1)}MB</div>}
      <div>Level: {performanceLevel}</div>
    </div>
  );
};
