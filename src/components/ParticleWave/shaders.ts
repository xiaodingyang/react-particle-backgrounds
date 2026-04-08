/** 粒子波浪顶点着色器 */
export const waveVertexShader = /* glsl */ `
  attribute float size;
  varying vec3 vColor;
  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

/** 粒子波浪片段着色器 */
export const waveFragmentShader = /* glsl */ `
  varying vec3 vColor;
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    float glow = exp(-dist * 3.0);
    vec3 finalColor = vColor + glow * 0.5;
    gl_FragColor = vec4(finalColor, alpha * 0.8);
  }
`;

/** 散景片段着色器 */
export const bokehFragmentShader = /* glsl */ `
  varying vec3 vColor;
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
    gl_FragColor = vec4(vColor, alpha * 0.3);
  }
`;

/** 雨滴轨迹片段着色器 */
export const dropTrailFragmentShader = /* glsl */ `
  varying vec3 vColor;
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    gl_FragColor = vec4(vColor, alpha * 0.8);
  }
`;

/** 雨滴头部片段着色器 */
export const dropHeadFragmentShader = /* glsl */ `
  varying vec3 vColor;
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    float glow = exp(-dist * 2.0);
    vec3 finalColor = vColor + glow * 0.8;
    gl_FragColor = vec4(finalColor, alpha);
  }
`;
