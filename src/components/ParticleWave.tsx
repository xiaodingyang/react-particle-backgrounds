import React, { useRef, useEffect } from 'react';

interface ParticleWaveProps {
  /** 波浪背后的 CSS 渐变或纯色背景 */
  background?: string;
  className?: string;
  style?: React.CSSProperties;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

/**
 * 使用 Canvas 2D 渲染的粒子海洋波浪效果。
 * 轻量级实现，无需 Three.js 依赖。
 */
const ParticleWave: React.FC<ParticleWaveProps> = ({
  background = 'linear-gradient(180deg, #000000 0%, #0a1628 50%, #0d1f3c 100%)',
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();

    // 初始化粒子
    const particleCount = 800;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const colorChoice = Math.random();
      let color: string;

      if (colorChoice < 0.5) {
        color = `rgba(0, ${Math.floor(200 + Math.random() * 55)}, 255, `;
      } else if (colorChoice < 0.8) {
        color = `rgba(25, ${Math.floor(76 + Math.random() * 76)}, ${Math.floor(230 + Math.random() * 25)}, `;
      } else {
        color = `rgba(${Math.floor(200 + Math.random() * 55)}, ${Math.floor(230 + Math.random() * 25)}, 255, `;
      }

      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        color,
        alpha: Math.random() * 0.5 + 0.3,
      });
    }

    particlesRef.current = particles;

    const animate = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      ctx.clearRect(0, 0, width, height);
      timeRef.current += 0.01;

      particles.forEach((p) => {
        // 波浪运动
        const wave = Math.sin(p.x * 0.01 + timeRef.current) * 20 +
                     Math.sin(p.z * 0.005 + timeRef.current * 0.5) * 15;

        p.y += p.vy + Math.sin(timeRef.current + p.x * 0.01) * 0.2;
        p.x += p.vx;
        p.z += 0.5;

        // 边界检测
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        if (p.z > 1000) p.z = 0;

        // 3D 透视效果
        const scale = 1000 / (1000 + p.z);
        const x = p.x;
        const y = p.y + wave;
        const size = p.size * scale;
        const alpha = p.alpha * scale;

        // 绘制粒子
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + alpha + ')';
        ctx.fill();

        // 添加光晕
        if (scale > 0.7) {
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
          gradient.addColorStop(0, p.color + (alpha * 0.3) + ')');
          gradient.addColorStop(1, p.color + '0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(x - size * 3, y - size * 3, size * 6, size * 6);
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        background,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
};

export default ParticleWave;
