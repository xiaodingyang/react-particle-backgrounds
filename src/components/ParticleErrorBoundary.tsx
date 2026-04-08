import React from 'react';

export interface ErrorBoundaryProps {
  /** 渲染失败时显示的 fallback UI，默认不渲染任何内容 */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * 粒子渲染错误边界。
 * 粒子渲染失败不会影响主应用。
 */
export class ParticleErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('[react-particle-backgrounds] 渲染失败:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
