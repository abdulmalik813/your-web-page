import { MediaFigure } from '@/components/MediaFigure';

type BlockSize = 'full' | 'wide' | 'medium';

interface ResourceMediaBlockProps {
  image: unknown;
  caption?: string | null;
  size?: BlockSize | string | null;
}

const sizeToAspect: Record<string, 'wide' | 'card'> = {
  full: 'wide',
  wide: 'wide',
  medium: 'card',
};

export function ResourceMediaBlock({ image, caption, size }: ResourceMediaBlockProps) {
  const aspect = sizeToAspect[size ?? 'wide'] ?? 'wide';
  const wrapClass =
    size === 'medium'
      ? 'my-6 max-w-[520px]'
      : 'my-6';

  return (
    <figure className={wrapClass}>
      <MediaFigure
        image={image as any}
        alt={caption ?? ''}
        aspect={aspect}
        sizes={
          size === 'full'
            ? '(min-width: 1360px) 1280px, calc(100vw - 2rem)'
            : size === 'medium'
              ? '(min-width: 640px) 520px, calc(100vw - 2rem)'
              : '(min-width: 1360px) 900px, calc(100vw - 2rem)'
        }
      />
      {caption ? (
        <figcaption className="mt-2 text-center font-mono text-xs text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
