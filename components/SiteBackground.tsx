'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  colorType: 'primary' | 'signal' | 'ink';
  baseAlpha: number;
}

export function SiteBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isDarkMode = () => document.documentElement.classList.contains('dark');

    const particleCount = Math.min(Math.floor((width * height) / 35000), 40);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const typeRand = Math.random();
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.8 + 1.0,
        colorType: typeRand < 0.35 ? 'primary' : typeRand < 0.7 ? 'signal' : 'ink',
        baseAlpha: Math.random() * 0.25 + 0.25,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let mouseX = -1000;
    let mouseY = -1000;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = (currentScrollY - lastScrollY) * 0.12;
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const dark = isDarkMode();
      // High-contrast clean palette: orange accent, white/black signals
      const colors = {
        primary: 'rgba(249, 115, 22, ',
        signal:  dark ? 'rgba(255, 255, 255, ' : 'rgba(0, 0, 0, ',
        ink:     dark ? 'rgba(180, 180, 180, ' : 'rgba(40, 40, 40, ',
        line:    dark ? 'rgba(249, 115, 22, ' : 'rgba(249, 115, 22, ',
      };

      scrollVelocity *= 0.92;

      const len = particles.length;
      for (let i = 0; i < len; i++) {
        const p = particles[i];

        if (!reduceMotion) {
          p.x += p.vx;
          p.y += p.vy - scrollVelocity * 0.35;

          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150 && dist > 0) {
            const force = (150 - dist) / 150;
            p.x += (dx / dist) * force * 1.2;
            p.y += (dy / dist) * force * 1.2;
          }

          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;
        }

        const alphaScale = dark ? 0.75 : 0.45;
        ctx.fillStyle = `${colors[p.colorType]}${p.baseAlpha * alphaScale})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < len; j++) {
          const p2 = particles[j];
          const distSq = (p.x - p2.x) ** 2 + (p.y - p2.y) ** 2;
          const maxDist = 120;
          if (distSq < maxDist * maxDist) {
            const lineAlpha = (1 - Math.sqrt(distSq) / maxDist) * (dark ? 0.14 : 0.08);
            ctx.strokeStyle = `${colors.line}${lineAlpha})`;
            ctx.lineWidth = 0.85;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [reduceMotion]);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 0. Clean Base layer */}
      <div className="absolute inset-0 bg-background" />

      {/* ── LIGHT MODE: Soft, restrained orange ambient warmth (not vibrant or washed out) ── */}
      <div
        className="absolute -right-24 -top-32 h-[550px] w-[550px] rounded-full opacity-30 blur-[110px] dark:opacity-0 sm:h-[700px] sm:w-[700px]"
        style={{
          background: 'radial-gradient(circle, #f97316 0%, transparent 68%)',
          animation: reduceMotion ? 'none' : 'ambient-drift-1 24s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute -left-20 top-[40%] h-[450px] w-[450px] rounded-full opacity-20 blur-[100px] dark:opacity-0 sm:h-[600px] sm:w-[600px]"
        style={{
          background: 'radial-gradient(circle, #fb923c 0%, transparent 65%)',
          animation: reduceMotion ? 'none' : 'ambient-drift-2 28s ease-in-out infinite alternate',
        }}
      />

      {/* ── DARK MODE: Subtle restrained orange ambient warmth ── */}
      <div
        className="absolute -right-20 -top-24 hidden h-[550px] w-[550px] rounded-full blur-[110px] dark:block dark:opacity-25 sm:h-[700px] sm:w-[700px]"
        style={{
          background: 'radial-gradient(circle, #f97316 0%, transparent 68%)',
          animation: reduceMotion ? 'none' : 'ambient-drift-1 24s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute -left-20 top-[40%] hidden h-[450px] w-[450px] rounded-full blur-[100px] dark:block dark:opacity-15 sm:h-[600px] sm:w-[600px]"
        style={{
          background: 'radial-gradient(circle, #f97316 0%, transparent 65%)',
          animation: reduceMotion ? 'none' : 'ambient-drift-2 28s ease-in-out infinite alternate',
        }}
      />

      {/* Architectural Micro-Grid (restrained opacity) */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.12]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Interactive Constellation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full opacity-80 dark:opacity-90"
      />

      {/* Fine Paper Texture */}
      <div
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <style jsx>{`
        @keyframes ambient-drift-1 {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(40px, 35px) scale(1.06); }
          100% { transform: translate(-30px, 15px) scale(0.96); }
        }
        @keyframes ambient-drift-2 {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(-35px, -30px) scale(1.08); }
          100% { transform: translate(25px, -15px) scale(0.95); }
        }
      `}</style>
    </div>
  );
}
