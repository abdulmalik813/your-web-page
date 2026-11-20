'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Eye, EyeOff, LayoutDashboard, Loader2, Pencil, Plus } from 'lucide-react';

interface PayloadAdminBarClientProps {
  adminUrl: string;
  draftEnabled: boolean;
  previewSecret: string;
}

interface ResolvedDoc {
  collection: string | null;
  id: string | null;
  title: string | null;
  editUrl: string | null;
}

function formatCollectionLabel(collection: string | null): string {
  switch (collection) {
    case 'pages':
      return 'Page';
    case 'services':
      return 'Service';
    case 'projects':
      return 'Project';
    case 'resources':
      return 'Resource';
    case 'faqs':
      return 'FAQ';
    case 'testimonials':
      return 'Testimonial';
    default:
      return 'Document';
  }
}

export function PayloadAdminBarClient({
  adminUrl,
  draftEnabled,
  previewSecret,
}: PayloadAdminBarClientProps) {
  const pathname = usePathname() || '/';
  const [resolvedState, setResolvedState] = useState<{
    path: string;
    doc: ResolvedDoc | null;
  }>({
    path: '',
    doc: null,
  });

  useEffect(() => {
    let isCancelled = false;

    fetch(`/api/admin/resolve-document?path=${encodeURIComponent(pathname)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isCancelled) {
          setResolvedState({
            path: pathname,
            doc: data && data.editUrl ? data : null,
          });
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setResolvedState({
            path: pathname,
            doc: null,
          });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [pathname]);

  const isLoading = resolvedState.path !== pathname;
  const docInfo = resolvedState.path === pathname ? resolvedState.doc : null;

  const params = new URLSearchParams({
    path: pathname,
    previewSecret,
  });
  const previewHref = `/api/draft/enable?${params.toString()}`;
  const exitPreviewHref = `/api/draft/disable?path=${encodeURIComponent(pathname)}`;

  return (
    <aside
      aria-label="Payload CMS toolbar"
      className="relative z-40 border-b border-border bg-card/95 text-foreground backdrop-blur-md transition-colors"
    >
      <div className="mx-auto flex min-h-11 w-full max-w-[1360px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-1.5 sm:px-6 lg:px-11">
        {/* Left Side: Brand badge, Status indicator, Current target */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <Link
            className="group inline-flex min-h-7 items-center gap-2 rounded-sm border border-border bg-background px-2.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-foreground no-underline transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            href={`${adminBase}/admin`}
          >
            <LayoutDashboard aria-hidden="true" className="size-3.5 text-primary transition-transform group-hover:scale-110" />
            <span>Admin</span>
          </Link>

          <span
            aria-live="polite"
            className="inline-flex items-center gap-1.5"
          >
            {draftEnabled ? (
              <span className="inline-flex items-center gap-1.5 rounded-sm border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
                Draft Preview
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-muted/60 px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <span className="size-1.5 rounded-full bg-muted-foreground/60" aria-hidden="true" />
                Published
              </span>
            )}
          </span>

          {docInfo?.title ? (
            <span className="hidden md:inline-flex items-center gap-1.5 border-l border-border pl-3 font-mono text-xs text-muted-foreground">
              <span className="truncate max-w-[180px] font-semibold text-foreground">
                {docInfo.title}
              </span>
              <span className="text-[10px] uppercase opacity-60">
                ({formatCollectionLabel(docInfo.collection)})
              </span>
            </span>
          ) : null}
        </div>

        {/* Right Side: Edit current page button, Preview toggle, New page */}
        <div className="flex flex-wrap items-center gap-2">
          {isLoading ? (
            <span className="inline-flex min-h-7 items-center gap-1.5 rounded-sm border border-border bg-muted/40 px-3 font-mono text-xs text-muted-foreground opacity-60">
              <Loader2 className="size-3 animate-spin" aria-hidden="true" />
              <span>Locating...</span>
            </span>
          ) : docInfo?.editUrl ? (
            <a
              className="inline-flex min-h-7 items-center gap-1.5 rounded-sm bg-primary px-3 font-mono text-xs font-semibold uppercase tracking-wider text-primary-foreground no-underline shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              href={`${adminBase}${docInfo.editUrl}`}
              target="_blank"
              rel="noreferrer"
            >
              <Pencil aria-hidden="true" className="size-3.5" />
              <span>Edit {formatCollectionLabel(docInfo.collection)}</span>
            </a>
          ) : (
            <a
              className="inline-flex min-h-7 items-center gap-1.5 rounded-sm border border-border bg-background px-3 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground no-underline transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              href={`${adminBase}/admin/collections/pages`}
              target="_blank"
              rel="noreferrer"
            >
              <Pencil aria-hidden="true" className="size-3.5" />
              <span>Edit in Admin</span>
            </a>
          )}

          <a
            className="inline-flex min-h-7 items-center gap-1.5 rounded-sm border border-border bg-background px-3 font-mono text-xs font-semibold uppercase tracking-wider text-foreground no-underline transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            href={draftEnabled ? exitPreviewHref : previewHref}
          >
            {draftEnabled ? (
              <>
                <EyeOff aria-hidden="true" className="size-3.5 text-primary" />
                <span>Exit</span>
              </>
            ) : (
              <>
                <Eye aria-hidden="true" className="size-3.5" />
                <span>Preview</span>
              </>
            )}
          </a>

          <Link
            className="inline-flex min-h-7 items-center gap-1.5 rounded-sm border border-border bg-background px-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-foreground no-underline transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            href={`${adminUrl}/admin/collections/pages/create`}
            title="Create a new page"
          >
            <Plus aria-hidden="true" className="size-3.5" />
            <span className="hidden sm:inline">New page</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
