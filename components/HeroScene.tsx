import { HeroCard } from './HeroCard';
import { siteCardClass } from './siteStyles';

/**
 * Static composition; the subtle scroll parallax is CSS-only so this stays a
 * server component and never repaints after hydration. The card itself is a
 * separate component so it can be imported and scaled anywhere.
 */
export function HeroScene({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative mx-auto w-full max-w-[610px] py-8 [perspective:1400px] sm:py-12 ${className}`.trim()}
      role="img"
      aria-label="A layered three-dimensional website interface"
    >
      <div className="hero-parallax relative isolate [transform-style:preserve-3d]">
        <div
          className="pointer-events-none absolute -z-10 inset-x-3 inset-y-4 rounded-sm border border-primary/15 bg-accent/40 sm:[transform:translateZ(-42px)_rotateY(7deg)_rotateX(-3deg)]"
          aria-hidden="true"
        />
        <div
          className={`relative z-10 ${siteCardClass} p-2 sm:p-3`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <HeroCard />
        </div>
      </div>
    </div>
  );
}
