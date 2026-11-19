'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Eye, EyeOff, LayoutDashboard, Plus } from 'lucide-react';

interface PayloadAdminBarClientProps {
  adminUrl: string;
  draftEnabled: boolean;
  previewSecret: string;
}

export function PayloadAdminBarClient({
  adminUrl,
  draftEnabled,
  previewSecret,
}: PayloadAdminBarClientProps) {
  const pathname = usePathname() || '/';
  const params = new URLSearchParams({
    path: pathname,
    previewSecret,
  });
  const previewHref = `/api/draft/enable?${params.toString()}`;
  const exitPreviewHref = `/api/draft/disable?path=${encodeURIComponent(pathname)}`;

  return (
    <aside
      aria-label="Payload CMS toolbar"
      className="border-b border-border bg-foreground text-background"
    >
      <div className="mx-auto flex min-h-11 w-full max-w-[1360px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 sm:px-6 lg:px-11">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link
            className="inline-flex min-h-8 items-center gap-2 rounded-sm px-2 text-sm font-semibold text-background no-underline hover:bg-background/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
            href={`${adminUrl}/admin`}
          >
            <LayoutDashboard aria-hidden="true" className="size-4" />
            <span>Payload Admin</span>
          </Link>
          <span
            aria-live="polite"
            className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-background/75"
          >
            {draftEnabled ? 'Draft preview enabled' : 'Published site'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            className="inline-flex min-h-8 items-center gap-2 rounded-sm border border-background/35 px-3 text-sm font-medium text-background no-underline hover:bg-background/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
            href={draftEnabled ? exitPreviewHref : previewHref}
          >
            {draftEnabled ? (
              <EyeOff aria-hidden="true" className="size-4" />
            ) : (
              <Eye aria-hidden="true" className="size-4" />
            )}
            {draftEnabled ? 'Exit preview' : 'Enable preview'}
          </a>
          <Link
            className="inline-flex min-h-8 items-center gap-2 rounded-sm bg-background px-3 text-sm font-semibold text-foreground no-underline hover:bg-background/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
            href={`${adminUrl}/admin/collections/pages/create`}
          >
            <Plus aria-hidden="true" className="size-4" />
            <span>New page</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
