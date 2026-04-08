import type * as THREE from 'three';

type ThreeModule = typeof THREE;

/**
 * 类型安全地加载 Three.js 模块。
 * 支持 CommonJS require 和 ESM import。
 */
export async function loadThree(): Promise<ThreeModule | null> {
  try {
    const req = (globalThis as unknown as { require?: (id: string) => unknown }).require;
    if (typeof req === 'function') {
      return req('three') as ThreeModule;
    }
    const mod = await import('three');
    return (mod as { default?: typeof mod }).default ?? mod;
  } catch {
    console.warn('[react-particle-backgrounds] 未安装 "three"。波浪主题需要它作为 peer dependency。');
    return null;
  }
}
