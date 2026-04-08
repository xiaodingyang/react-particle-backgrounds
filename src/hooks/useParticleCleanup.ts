import { useEffect, type RefObject } from 'react';

/**
 * 组件卸载时清理 WebGL 上下文，释放 GPU 资源。
 */
export function useParticleCleanup(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    return () => {
      const container = containerRef.current;
      if (!container) return;

      // 清理 WebGL 上下文
      const canvas = container.querySelector('canvas');
      if (canvas) {
        const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
        if (gl) {
          const ext = gl.getExtension('WEBGL_lose_context');
          ext?.loseContext();
        }
      }
    };
  }, [containerRef]);
}
