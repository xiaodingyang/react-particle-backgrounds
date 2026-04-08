/**
 * 校验图片 URL 是否安全（仅允许 http/https/data 协议）。
 */
export function validateImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:', 'data:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * 过滤用户自定义粒子选项中的危险输入。
 */
export function sanitizeCustomOptions(options: Record<string, unknown>): Record<string, unknown> {
  if (options?.particles && typeof options.particles === 'object') {
    const particles = options.particles as Record<string, unknown>;
    if (particles?.shape && typeof particles.shape === 'object') {
      const shape = particles.shape as Record<string, unknown>;
      if (shape?.image && typeof shape.image === 'object') {
        const image = shape.image as Record<string, unknown>;
        if (typeof image.src === 'string' && !validateImageUrl(image.src)) {
          console.warn('[react-particle-backgrounds] 无效的图片 URL，已忽略');
          delete shape.image;
        }
      }
    }
  }
  return options;
}
