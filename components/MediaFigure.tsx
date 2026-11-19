import Image from 'next/image';
import type { MediaAsset } from '@/lib/cms';

interface MediaFigureProps {
  image?: MediaAsset | null;
  alt: string;
  aspect?: 'card' | 'wide';
  className?: string;
  sizes?: string;
}

export function MediaFigure({
  image,
  alt,
  aspect = 'card',
  className = '',
  sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
}: MediaFigureProps) {
  if (!image?.url) return null;

  return (
    <figure
      className={`relative m-0 w-full overflow-hidden rounded-sm bg-muted ${
        aspect === 'wide' ? 'aspect-[21/9]' : 'aspect-[16/9]'
      } ${className}`.trim()}
    >
      <Image
        src={image.url}
        alt={image.alt || alt}
        fill
        sizes={sizes}
        unoptimized
        className="object-cover"
      />
    </figure>
  );
}
