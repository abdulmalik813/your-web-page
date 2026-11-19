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

    // Modest particle count for high-performance 60fps
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

    // Mouse proximity tracking on desktop
    let mouseX = -1000;
    let mouseY = -1000;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Scroll tracking for subtle parallax drift
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
      // In light mode: high-saturation, punchy colors that pop!
      // In dark mode: the superb luminous neon/obsidian tones
      const colors = {
        primary: dark ? 'rgba(237, 128, 100, ' : 'rgba(234, 78, 40, ',
        signal: dark ? 'rgba(200, 217, 147, ' : 'rgba(125, 195, 20, ',
        ink: dark ? 'rgba(240, 239, 231, ' : 'rgba(27, 38, 32, ',
        line: dark ? 'rgba(237, 128, 100, ' : 'rgba(234, 78, 40, ',
      };

      scrollVelocity *= 0.92;

      const len = particles.length;
      for (let i = 0; i < len; i++) {
        const p = particles[i];

        if (!reduceMotion) {
          p.x += p.vx;
          p.y += p.vy - scrollVelocity * 0.45;

          // Mouse proximity gentle repulsion
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160 && dist > 0) {
            const force = (160 - dist) / 160;
            p.x += (dx / dist) * force * 1.5;
            p.y += (dy / dist) * force * 1.5;
          }

          // Screen wrap-around
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;
        }

        // Draw particle dot
        const colorPrefix = colors[p.colorType];
        ctx.fillStyle = `${colorPrefix}${p.baseAlpha * (dark ? 1.0 : 0.95)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles with subtle architectural line
        for (let j = i + 1; j < len; j++) {
          const p2 = particles[j];
          const distSq = (p.x - p2.x) ** 2 + (p.y - p2.y) ** 2;
          const maxDist = 130;
          if (distSq < maxDist * maxDist) {
            const lineAlpha = (1 - Math.sqrt(distSq) / maxDist) * (dark ? 0.22 : 0.24);
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
      {/* 0. Base Theme Background Layer */}
      <div className="absolute inset-0 bg-background" />

      {/* 1. Large Ambient Living Mesh Glows */}
      {/* Top Right Radiant Terracotta / Vibrant Amber Field */}
      <div
        className="absolute -right-16 -top-20 h-[580px] w-[580px] rounded-full opacity-90 blur-[80px] transition-opacity duration-1000 dark:opacity-60 dark:blur-[95px] sm:h-[760px] sm:w-[760px]"
        style={{
          background: `
            radial-gradient(circle,
              #ea4e28 0%,
              #f59e0b 36%,
              #fbbf24 55%,
              transparent 72%
            )
          `,
          animation: reduceMotion ? 'none' : 'ambient-drift-1 22s ease-in-out infinite alternate',
        }}
      />
      {/* Dark mode overlay override for top right */}
      <div
        className="absolute -right-16 -top-20 hidden h-[580px] w-[580px] rounded-full opacity-0 blur-[95px] transition-opacity duration-1000 dark:block dark:opacity-60 sm:h-[760px] sm:w-[760px]"
        style={{
          background: 'radial-gradient(circle, var(--primary) 0%, transparent 68%)',
          animation: reduceMotion ? 'none' : 'ambient-drift-1 22s ease-in-out infinite alternate',
        }}
      />

      {/* Mid Left Vivid Chartreuse Lime & Emerald Mint Field */}
      <div
        className="absolute -left-16 top-[30%] h-[540px] w-[540px] rounded-full opacity-85 blur-[85px] transition-opacity duration-1000 dark:opacity-50 dark:blur-[105px] sm:h-[700px] sm:w-[700px]"
        style={{
          background: `
            radial-gradient(circle,
              #88ce10 0%,
              #10b981 38%,
              #2dd4bf 56%,
              transparent 72%
            )
          `,
          animation: reduceMotion ? 'none' : 'ambient-drift-2 26s ease-in-out infinite alternate',
        }}
      />
      {/* Dark mode overlay override for mid left */}
      <div
        className="absolute -left-16 top-[30%] hidden h-[540px] w-[540px] rounded-full opacity-0 blur-[105px] transition-opacity duration-1000 dark:block dark:opacity-50 sm:h-[700px] sm:w-[700px]"
        style={{
          background: 'radial-gradient(circle, var(--signal) 0%, var(--accent) 40%, transparent 72%)',
          animation: reduceMotion ? 'none' : 'ambient-drift-2 26s ease-in-out infinite alternate',
        }}
      />

      {/* Bottom Center-Right Warm Coral & Golden Sunset Field */}
      <div
        className="absolute -bottom-12 right-1/4 h-[540px] w-[540px] rounded-full opacity-80 blur-[90px] transition-opacity duration-1000 dark:opacity-45 dark:blur-[115px] sm:h-[720px] sm:w-[720px]"
        style={{
          background: `
            radial-gradient(circle,
              #f97316 0%,
              #e11d48 35%,
              #fb923c 55%,
              transparent 70%
            )
          `,
          animation: reduceMotion ? 'none' : 'ambient-drift-3 30s ease-in-out infinite alternate',
        }}
      />
      {/* Dark mode overlay override for bottom right */}
      <div
        className="absolute -bottom-12 right-1/4 hidden h-[540px] w-[540px] rounded-full opacity-0 blur-[115px] transition-opacity duration-1000 dark:block dark:opacity-45 sm:h-[720px] sm:w-[720px]"
        style={{
          background: 'radial-gradient(circle, var(--accent) 0%, var(--primary) 45%, transparent 70%)',
          animation: reduceMotion ? 'none' : 'ambient-drift-3 30s ease-in-out infinite alternate',
        }}
      />

      {/* 2. Architectural Micro-Grid */}
      <div
        className="absolute inset-0 opacity-[0.11] dark:opacity-[0.14]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Coordinate Registration Crosses / Dots at 32px intervals */}
      <div
        className="absolute inset-0 opacity-[0.20] dark:opacity-[0.24]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      {/* 3. Interactive Floating Constellation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full opacity-90 dark:opacity-95"
      />

      {/* 4. Fine Paper Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay dark:opacity-[0.045]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <style jsx>{`
        @keyframes ambient-drift-1 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(45px, 40px) scale(1.09);
          }
          100% {
            transform: translate(-35px, 25px) scale(0.95);
          }
        }
        @keyframes ambient-drift-2 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-40px, -35px) scale(1.12);
          }
          100% {
            transform: translate(30px, -20px) scale(0.93);
          }
        }
        @keyframes ambient-drift-3 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(35px, -30px) scale(1.08);
          }
          100% {
            transform: translate(-25px, 35px) scale(0.96);
          }
        }
      `}</style>
    </div>
  );
}
