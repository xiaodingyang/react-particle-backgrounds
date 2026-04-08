import type * as THREE from 'three';

/** Three.js 模块类型 */
export type ThreeModule = typeof THREE;

/** 雨滴数据 */
export interface RainDrop {
  x: number;
  z: number;
  y: number;
  velocity: number;
  active: boolean;
  maxHeight: number;
  trail: number[];
  opacity: number;
}

/** 组件 Props */
export interface ParticleWaveProps {
  /** CSS 渐变或纯色背景 */
  background?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** 场景初始化结果 */
export interface ThreeSceneResult {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  container: HTMLDivElement;
}

/** 波浪参数 */
export interface WaveParams {
  particleCount: number;
  waveWidth: number;
  waveDepth: number;
}

/** 波浪粒子系统结果 */
export interface WaveParticlesResult {
  getWaveHeight: (x: number, z: number, t: number) => number;
}
