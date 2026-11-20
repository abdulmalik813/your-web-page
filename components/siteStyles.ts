export const siteCardClass =
  'min-w-0 rounded-sm border border-border/75 bg-card/85 backdrop-blur-md text-card-foreground shadow-xs transition-[color,background-color,border-color,box-shadow,transform,translate,scale] duration-200 ease-out';

/** Subtle response for cards that are informational rather than links. */
export const siteCardHoverClass = 'hover:border-primary/45 hover:shadow-sm';

/** Stronger response for cards whose whole surface is a link. */
export const siteCardLiftClass =
  'group-hover:border-primary/60 group-hover:bg-card group-hover:shadow-md motion-safe:group-hover:-translate-y-1';

/** Applied to the <img> inside a linked card so the artwork zooms slightly. */
export const cardImageHoverClass =
  'transition-[scale] duration-300 ease-out motion-safe:group-hover:scale-[1.03]';
