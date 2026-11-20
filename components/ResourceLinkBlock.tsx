import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ResourceLinkBlockProps {
  label: string;
  href: string;
  style?: 'button' | 'link' | string | null;
  newTab?: boolean | null;
}

export function ResourceLinkBlock({ label, href, style, newTab }: ResourceLinkBlockProps) {
  const target = newTab ? '_blank' : undefined;
  const rel = newTab ? 'noopener noreferrer' : undefined;

  if (style === 'link') {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className="font-medium text-primary underline underline-offset-2 hover:no-underline"
      >
        {label}
      </Link>
    );
  }

  return (
    <div className="my-4">
      <Button
        asChild
        className="h-11 rounded-sm bg-primary px-6 font-semibold text-primary-foreground"
      >
        <Link href={href} target={target} rel={rel}>
          {label}
        </Link>
      </Button>
    </div>
  );
}
