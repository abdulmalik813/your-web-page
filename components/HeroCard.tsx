/**
 * The hero mockup card. Everything inside is sized with container units, so the
 * same component reads correctly at 260px in a sidebar or at 640px in a hero.
 * The card owns its own `@container`, which means importing it anywhere is
 * enough: no page-level breakpoints or transform hacks are required.
 */
export function HeroCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`@container w-full min-w-0 overflow-hidden rounded-sm border border-border bg-background/95 backdrop-blur-md ${className}`.trim()}
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-[clamp(0.35rem,1.4cqw,0.75rem)] bg-foreground px-[clamp(0.6rem,2.4cqw,1rem)] py-[clamp(0.45rem,1.6cqw,0.75rem)] text-background">
        <div className="flex items-center gap-[clamp(0.2rem,0.8cqw,0.375rem)]" aria-hidden="true">
          <i className="block size-[clamp(0.32rem,1.2cqw,0.5rem)] bg-primary" />
          <i className="block size-[clamp(0.32rem,1.2cqw,0.5rem)] bg-background/50" />
          <i className="block size-[clamp(0.32rem,1.2cqw,0.5rem)] bg-background/30" />
        </div>
        <span className="truncate text-center font-mono text-[clamp(0.5rem,2.05cqw,0.75rem)] uppercase leading-none tracking-[0.12em] text-background/80">
          A considered digital presence
        </span>
        <span className="size-[clamp(0.32rem,1.2cqw,0.5rem)]" aria-hidden="true" />
      </div>

      <div className="grid grid-cols-1 gap-[clamp(0.85rem,3.4cqw,2rem)] p-[clamp(0.85rem,3.2cqw,2rem)] @min-[26rem]:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <div className="flex min-w-0 flex-col justify-center">
          <span className="mb-[clamp(0.5rem,1.8cqw,1rem)] font-mono text-[clamp(0.5rem,1.7cqw,0.7rem)] font-semibold uppercase leading-[1.4] tracking-[0.12em] text-primary-strong">
            Strategy · Design · Development
          </span>
          <h2 className="mb-[clamp(0.5rem,1.8cqw,1rem)] max-w-[12ch] font-heading text-[clamp(1.35rem,7.2cqw,3rem)] leading-[0.98] tracking-[-0.04em] text-foreground">
            Made for the next chapter.
          </h2>
          <p className="max-w-[30ch] text-[clamp(0.68rem,2.3cqw,0.875rem)] font-medium leading-relaxed text-foreground">
            A clear idea, carefully shaped, and built to last.
          </p>
          <div className="mt-[clamp(0.85rem,3cqw,1.5rem)] flex max-w-full items-center gap-[clamp(0.4rem,1.6cqw,0.75rem)]">
            <span className="inline-flex w-fit max-w-full shrink items-center justify-center whitespace-nowrap bg-primary px-[clamp(0.55rem,2.6cqw,1rem)] py-[clamp(0.4rem,1.6cqw,0.55rem)] font-mono text-[clamp(0.55rem,1.9cqw,0.75rem)] font-semibold uppercase leading-none tracking-[0.08em] text-primary-foreground">
              Explore the work
            </span>
            <span className="size-[clamp(1.5rem,6.2cqw,2rem)] shrink-0 border border-border" aria-hidden="true" />
          </div>
        </div>

        <div className="relative aspect-[16/10] min-h-0 overflow-hidden rounded-sm border border-border bg-gradient-to-br from-accent via-secondary to-primary/20 @min-[26rem]:aspect-auto @min-[26rem]:min-h-[clamp(8.5rem,38cqw,15rem)]">
          <div
            className="absolute right-0 top-0 h-full w-[55%] border-l border-primary/20 bg-primary/5 [background-image:linear-gradient(90deg,transparent_49%,var(--border)_50%,transparent_51%),linear-gradient(transparent_49%,var(--border)_50%,transparent_51%)] [background-size:22px_22px]"
            aria-hidden="true"
          />
          <div
            className="absolute right-[18%] top-[18%] size-[clamp(2.25rem,10cqw,5rem)] border-[clamp(3px,1.4cqw,8px)] border-signal bg-background/80"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-[13%] left-[12%] h-[44%] w-[68%] border border-white/40 bg-card/65"
            aria-hidden="true"
          />
          <div className="absolute bottom-[22%] left-[21%] grid gap-[clamp(0.25rem,1.2cqw,0.5rem)]" aria-hidden="true">
            <span className="block h-[clamp(0.25rem,1.2cqw,0.5rem)] w-[clamp(3rem,14cqw,6rem)] bg-foreground/80" />
            <span className="block h-[clamp(0.2rem,0.8cqw,0.375rem)] w-[clamp(2rem,10cqw,4rem)] bg-foreground/35" />
            <span className="mt-[clamp(0.15rem,0.6cqw,0.25rem)] block h-[clamp(0.75rem,3.2cqw,1.25rem)] w-[clamp(2rem,10cqw,4rem)] bg-primary" />
          </div>
          <div className="absolute bottom-[clamp(0.5rem,2cqw,1rem)] right-[clamp(0.5rem,2cqw,1rem)] whitespace-nowrap border border-foreground/10 bg-background/90 px-[clamp(0.4rem,1.8cqw,0.75rem)] py-[clamp(0.2rem,0.9cqw,0.375rem)] font-mono text-[clamp(0.45rem,1.7cqw,0.75rem)] font-semibold uppercase leading-none tracking-[0.1em] text-foreground">
            Built with intent
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-border bg-card/80">
        {['Clear thinking', 'Quiet confidence', 'Built to perform'].map((value) => (
          <span
            className="min-w-0 border-r border-border px-[clamp(0.15rem,1cqw,0.5rem)] py-[clamp(0.45rem,1.8cqw,0.75rem)] text-center font-mono text-[clamp(0.5rem,2.05cqw,0.75rem)] font-semibold uppercase leading-tight tracking-[0.02em] text-foreground last:border-r-0 [overflow-wrap:anywhere]"
            key={value}
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}
