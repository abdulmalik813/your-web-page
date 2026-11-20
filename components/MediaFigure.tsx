import Image from 'next/image';
import { resolveImageUrl, resolveMediaForDisplay, type PayloadMediaObject } from '@/lib/media';

/** Legacy flat media shape (from cms.ts mappers) */
interface FlatMediaAsset {
  url: string;
  alt?: string;
}

type MediaSource = PayloadMediaObject | FlatMediaAsset | null | undefined;

function isFlatAsset(m: MediaSource): m is FlatMediaAsset {
  return !!m && !('sizes' in m) && 'url' in m && typeof (m as FlatMediaAsset).url === 'string';
}

interface MediaFigureProps {
  image?: MediaSource;
  alt: string;
  /**
   * 'wide'  → hero / detail images   → picks `large` (1400w)
   * 'card'  → grid cards             → picks `medium` (900w)
   * 'thumb' → thumbnails             → picks `thumbnail` (300w)
   */
  aspect?: 'card' | 'wide' | 'thumb';
  className?: string;
  /**
   * Next/Image sizes hint.
   * Defaults are set per aspect for sensible defaults.
   */
  sizes?: string;
  priority?: boolean;
}

const DEFAULT_SIZES: Record<NonNullable<MediaFigureProps['aspect']>, string> = {
  wide:  '(min-width: 1360px) 1280px, calc(100vw - 2rem)',
  card:  '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  thumb: '(min-width: 640px) 160px, 100px',
};

const ASPECT_CLASS: Record<NonNullable<MediaFigureProps['aspect']>, string> = {
  wide:  'aspect-[21/9]',
  card:  'aspect-[16/9]',
  thumb: 'aspect-square',
};

export function MediaFigure({
  image,
  alt,
  aspect = 'card',
  className = '',
  sizes,
  priority = false,
}: MediaFigureProps) {
  if (!image) return null;

  // Flat legacy asset (from cms.ts mappers that return { url, alt })
  if (isFlatAsset(image)) {
    const src = resolveImageUrl(image, 'medium');
    if (!src) return null;
    return (
      <figure
        className={`relative m-0 w-full overflow-hidden rounded-sm bg-muted ${ASPECT_CLASS[aspect]} ${className}`.trim()}
      >
        <Image
          src={src}
          alt={image.alt || alt}
          fill
          sizes={sizes ?? DEFAULT_SIZES[aspect]}
          className="object-cover"
          priority={priority}
        />
      </figure>
    );
  }

  // Full Payload media object — resolve the right size
  const { src, width, height, alt: mediaAlt } = resolveMediaForDisplay(image, aspect === 'thumb' ? 'thumb' : aspect);
  if (!src) return null;

  return (
    <figure
      className={`relative m-0 w-full overflow-hidden rounded-sm bg-muted ${ASPECT_CLASS[aspect]} ${className}`.trim()}
    >
      <Image
        src={src}
        alt={mediaAlt || alt}
        fill
        sizes={sizes ?? DEFAULT_SIZES[aspect]}
        className="object-cover"
        priority={priority}
        {...(!width && !height ? {} : { width: undefined, height: undefined })}
      />
    </figure>
  );
}
