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

    const particleCount = Math.min(Math.floor((width * height) / 30000), 50);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const typeRand = Math.random();
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42,
        radius: Math.random() * 2.0 + 1.2,
        colorType: typeRand < 0.45 ? 'primary' : typeRand < 0.75 ? 'signal' : 'ink',
        baseAlpha: Math.random() * 0.35 + 0.45,
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
      scrollVelocity = (currentScrollY - lastScrollY) * 0.15;
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const dark = isDarkMode();
      // Dark: warm terracotta/signal palette — Light: deep ink colours, subtle so the CSS glows shine
      const colors = {
        primary: dark ? 'rgba(237, 128, 100, ' : 'rgba(180, 83, 9, ',
        signal:  dark ? 'rgba(200, 217, 147, ' : 'rgba(180, 83, 9, ',
        ink:     dark ? 'rgba(240, 239, 231, ' : 'rgba(120, 53, 15, ',
        line:    dark ? 'rgba(237, 128, 100, ' : 'rgba(180, 83, 9, ',
      };

      scrollVelocity *= 0.92;

      const len = particles.length;
      for (let i = 0; i < len; i++) {
        const p = particles[i];

        if (!reduceMotion) {
          p.x += p.vx;
          p.y += p.vy - scrollVelocity * 0.45;

          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160 && dist > 0) {
            const force = (160 - dist) / 160;
            p.x += (dx / dist) * force * 1.5;
            p.y += (dy / dist) * force * 1.5;
          }

          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;
        }

        const alphaScale = dark ? 1.0 : 0.3;
        ctx.fillStyle = `${colors[p.colorType]}${p.baseAlpha * alphaScale})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < len; j++) {
          const p2 = particles[j];
          const distSq = (p.x - p2.x) ** 2 + (p.y - p2.y) ** 2;
          const maxDist = 130;
          if (distSq < maxDist * maxDist) {
            const lineAlpha = (1 - Math.sqrt(distSq) / maxDist) * (dark ? 0.22 : 0.08);
            ctx.strokeStyle = `${colors.line}${lineAlpha})`;
            ctx.lineWidth = 0.95;
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
      {/* 0. Base layer */}
      <div className="absolute inset-0 bg-background" />

      {/* ── LIGHT MODE: Warm golden mesh gradient ── */}
      {/* Top-right: deep amber/gold sunburst */}
      <div
        className="absolute -right-24 -top-32 h-[700px] w-[700px] rounded-full opacity-70 blur-[100px] dark:opacity-0 sm:h-[900px] sm:w-[900px]"
        style={{
          background: 'radial-gradient(circle, #f59e0b 0%, #d97706 28%, #b45309 52%, transparent 72%)',
          animation: reduceMotion ? 'none' : 'ambient-drift-1 20s ease-in-out infinite alternate',
        }}
      />
      {/* Mid-left: warm rose-gold / champagne */}
      <div
        className="absolute -left-20 top-[25%] h-[600px] w-[600px] rounded-full opacity-55 blur-[90px] dark:opacity-0 sm:h-[780px] sm:w-[780px]"
        style={{
          background: 'radial-gradient(circle, #fbbf24 0%, #f97316 35%, #ea580c 58%, transparent 74%)',
          animation: reduceMotion ? 'none' : 'ambient-drift-2 25s ease-in-out infinite alternate',
        }}
      />
      {/* Bottom-centre: peach / coral */}
      <div
        className="absolute -bottom-20 left-1/3 h-[580px] w-[580px] rounded-full opacity-50 blur-[95px] dark:opacity-0 sm:h-[760px] sm:w-[760px]"
        style={{
          background: 'radial-gradient(circle, #fed7aa 0%, #fb923c 32%, #f97316 54%, transparent 72%)',
          animation: reduceMotion ? 'none' : 'ambient-drift-3 28s ease-in-out infinite alternate',
        }}
      />
      {/* Top-left accent: lemon-gold highlight */}
      <div
        className="absolute -left-10 -top-10 h-[380px] w-[380px] rounded-full opacity-40 blur-[70px] dark:opacity-0 sm:h-[500px] sm:w-[500px]"
        style={{
          background: 'radial-gradient(circle, #fde68a 0%, #fbbf24 45%, transparent 70%)',
          animation: reduceMotion ? 'none' : 'ambient-drift-4 18s ease-in-out infinite alternate',
        }}
      />

      {/* ── DARK MODE: Original superb neon orbs ── */}
      <div
        className="absolute -right-16 -top-20 hidden h-[580px] w-[580px] rounded-full blur-[95px] dark:block dark:opacity-60 sm:h-[760px] sm:w-[760px]"
        style={{
          background: 'radial-gradient(circle, var(--primary) 0%, transparent 68%)',
          animation: reduceMotion ? 'none' : 'ambient-drift-1 22s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute -left-16 top-[30%] hidden h-[540px] w-[540px] rounded-full blur-[105px] dark:block dark:opacity-50 sm:h-[700px] sm:w-[700px]"
        style={{
          background: 'radial-gradient(circle, var(--signal) 0%, var(--accent) 40%, transparent 72%)',
          animation: reduceMotion ? 'none' : 'ambient-drift-2 26s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute -bottom-12 right-1/4 hidden h-[540px] w-[540px] rounded-full blur-[115px] dark:block dark:opacity-45 sm:h-[720px] sm:w-[720px]"
        style={{
          background: 'radial-gradient(circle, var(--accent) 0%, var(--primary) 45%, transparent 70%)',
          animation: reduceMotion ? 'none' : 'ambient-drift-3 30s ease-in-out infinite alternate',
        }}
      />

      {/* Architectural Micro-Grid */}
      <div
        className="absolute inset-0 opacity-[0.09] dark:opacity-[0.14]"
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
        className="absolute inset-0 opacity-[0.16] dark:opacity-[0.24]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Interactive Constellation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full opacity-90 dark:opacity-95"
      />

      {/* Fine Paper Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay dark:opacity-[0.045]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <style jsx>{`
        @keyframes ambient-drift-1 {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(50px, 45px) scale(1.1); }
          100% { transform: translate(-40px, 20px) scale(0.94); }
        }
        @keyframes ambient-drift-2 {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(-45px, -38px) scale(1.13); }
          100% { transform: translate(35px, -18px) scale(0.92); }
        }
        @keyframes ambient-drift-3 {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(38px, -32px) scale(1.08); }
          100% { transform: translate(-28px, 38px) scale(0.95); }
        }
        @keyframes ambient-drift-4 {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(22px, 28px) scale(1.06); }
          100% { transform: translate(-18px, -14px) scale(0.97); }
        }
      `}</style>
    </div>
  );
}
