'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { siteCardClass } from './siteStyles';

export function HeroScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [22, -30]);

  return (
    <div
      ref={sceneRef}
      className="relative mx-auto w-full max-w-[610px] py-8 [perspective:1400px] sm:py-12"
      role="img"
      aria-label="A layered three-dimensional website interface"
    >
      <motion.div
        className="relative isolate"
        style={{
          y: reduceMotion ? 0 : parallaxY,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="pointer-events-none absolute -z-10 inset-x-3 inset-y-4 rounded-sm border border-primary/15 bg-accent/40 sm:[transform:translateZ(-42px)_rotateY(7deg)_rotateX(-3deg)]" aria-hidden="true" />
        <motion.div
          className={`relative z-10 ${siteCardClass} p-2 sm:p-3`}
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="overflow-hidden rounded-sm border border-border/60 bg-background/90 backdrop-blur-md">
            <div className="flex items-center justify-between bg-foreground px-4 py-3 text-background">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <i className="size-2 bg-primary" />
                <i className="size-2 bg-background/50" />
                <i className="size-2 bg-background/30" />
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-background/70">A considered digital presence</span>
              <span className="size-2" aria-hidden="true" />
            </div>
            <div className="grid gap-6 p-5 sm:grid-cols-[1fr_0.9fr] sm:gap-8 sm:p-8">
              <div className="flex flex-col justify-center">
                <span className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-primary">Strategy · Design · Development</span>
                <h2 className="mb-4 font-heading text-[clamp(1.7rem,3.8vw,3rem)] leading-[0.98] tracking-[-0.04em] text-foreground">
                  Made for the next chapter.
                </h2>
                <p className="max-w-[30ch] text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  A clear idea, carefully shaped, and built to last.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="h-8 bg-primary px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground">Explore the work</span>
                  <span className="size-8 border border-border" aria-hidden="true" />
                </div>
              </div>
              <div className="relative min-h-[190px] overflow-hidden rounded-sm border border-border/60 bg-gradient-to-br from-accent via-secondary to-primary/20 [transform-style:preserve-3d] sm:min-h-[240px]">
                <div className="absolute right-0 top-0 h-full w-[55%] border-l border-primary/20 bg-primary/5 [background-image:linear-gradient(90deg,transparent_49%,var(--border)_50%,transparent_51%),linear-gradient(transparent_49%,var(--border)_50%,transparent_51%)] [background-size:22px_22px] [transform:translateZ(45px)]" aria-hidden="true" />
                <div className="absolute right-[18%] top-[18%] size-16 border-8 border-signal bg-background/80 [transform:translateZ(85px)] sm:size-20" aria-hidden="true" />
                <div className="absolute bottom-[13%] left-[12%] h-[44%] w-[68%] border border-white/40 bg-card/65 [transform:translateZ(65px)_rotateY(-12deg)]" aria-hidden="true" />
                <div className="absolute bottom-[22%] left-[21%] grid gap-2 [transform:translateZ(95px)]" aria-hidden="true">
                  <span className="h-2 w-24 bg-foreground/80" />
                  <span className="h-1.5 w-16 bg-foreground/35" />
                  <span className="mt-1 h-5 w-16 bg-primary" />
                </div>
                <div className="absolute bottom-4 right-4 border border-foreground/10 bg-background/90 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-foreground/80">
                  Built with intent
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 border-t border-border/60 bg-card/60">
              {['Clear thinking', 'Quiet confidence', 'Built to perform'].map((value) => (
                <span className="border-r border-border/60 px-2 py-3 text-center font-mono text-xs font-medium uppercase tracking-[0.02em] text-muted-foreground last:border-r-0" key={value}>
                  {value}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
