/**
 * 检测是否为移动设备。
 */
export function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    || (navigator.maxTouchPoints > 0 && window.innerWidth < 768);
}

export const MOBILE_PRESET = {
  particleMultiplier: 0.2,
  fpsLimit: 30,
  disableInteraction: true,
  disableShadows: true,
  pixelRatio: 1,
};
