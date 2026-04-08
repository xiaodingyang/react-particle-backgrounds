import { useEffect, useRef } from 'react';
import type { ThreeModule, ThreeSceneResult } from './types';

/**
 * 初始化 Three.js 场景、相机、渲染器，并处理 resize 和清理。
 * 返回 cleanup 函数，由调用方决定何时销毁。
 */
export function useThreeScene(
  containerRef: React.RefObject<HTMLDivElement | null>,
  THREE: ThreeModule | null,
) {
  const resultRef = useRef<ThreeSceneResult | null>(null);

  useEffect(() => {
    if (!THREE || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 50, 100);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    resultRef.current = { scene, camera, renderer, container };

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      resultRef.current = null;
    };
  }, [THREE]);

  return resultRef;
}
