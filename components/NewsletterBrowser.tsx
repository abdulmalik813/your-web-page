'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { NewsletterEntry } from '@/lib/cms';
import { filterNewsletters, type NewsletterFilter } from '@/lib/filters';
import { ContentFilters } from './ContentFilters';
import { Grid } from './Grid';
import { NewsletterCard } from './NewsletterCard';

const NEWSLETTERS_PER_PAGE = 6;

type PageEntry = number | 'ellipsis';

function getPageEntries(currentPage: number, pageCount: number): PageEntry[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const pages = Array.from(
    new Set([1, pageCount, currentPage - 1, currentPage, currentPage + 1]),
  )
    .filter((page) => page >= 1 && page <= pageCount)
    .sort((a, b) => a - b);

  const entries: PageEntry[] = [];
  let previous = 0;
  for (const page of pages) {
    if (previous && page - previous > 1) entries.push('ellipsis');
    entries.push(page);
    previous = page;
  }
  return entries;
}

export function NewsletterBrowser({ newsletter }: { newsletter: NewsletterEntry[] }) {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState<NewsletterFilter>('All');
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NewsletterEntry[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [query, activeCategory]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed && activeCategory === 'All') {
      return;
    }

    let isCancelled = false;
    const timeoutId = setTimeout(() => {
      setIsSearching(true);
      const params = new URLSearchParams({
        collection: 'newsletter',
        q: trimmed,
        category: activeCategory,
      });

      fetch(`/api/search?${params.toString()}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!isCancelled) {
            if (data?.docs && Array.isArray(data.docs)) {
              setSearchResults(data.docs);
            } else {
              setSearchResults(null);
            }
            setIsSearching(false);
          }
        })
        .catch(() => {
          if (!isCancelled) {
            setSearchResults(null);
            setIsSearching(false);
          }
        });
    }, 200);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [query, activeCategory]);

  const categories: NewsletterFilter[] = [
    'All',
    ...Array.from(new Set(newsletter.map((entry) => entry.category))),
  ];

  const isDefaultView = !query.trim() && activeCategory === 'All';
  const displayed = isDefaultView
    ? newsletter
    : searchResults !== null
      ? searchResults
      : filterNewsletters(newsletter, activeCategory, query);

  const pageCount = Math.max(1, Math.ceil(displayed.length / NEWSLETTERS_PER_PAGE));
  const currentPage = Math.min(page, pageCount);
  const pageStart = (currentPage - 1) * NEWSLETTERS_PER_PAGE;
  const pageItems = displayed.slice(pageStart, pageStart + NEWSLETTERS_PER_PAGE);
  const pageEntries = getPageEntries(currentPage, pageCount);

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > pageCount || nextPage === currentPage) return;
    setPage(nextPage);
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <div ref={resultsRef}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <ContentFilters
          options={categories}
          value={activeCategory}
          label="Filter newsletters by category"
          onChange={(cat) => {
            setActiveCategory(cat);
            if (cat === 'All' && !query.trim()) setSearchResults(null);
          }}
        />
        <div className="flex min-w-[min(100%,280px)] flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label className="font-mono text-xs font-semibold uppercase leading-5 tracking-[0.1em]" htmlFor="newsletter-search">Search newsletters</Label>
            {isSearching && (
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                <Loader2 className="size-3 animate-spin" aria-hidden="true" />
                Searching...
              </span>
            )}
          </div>
          <Input
            id="newsletter-search"
            type="search"
            placeholder="Search by keyword"
            value={query}
            onChange={(event) => {
              const val = event.target.value;
              setQuery(val);
              if (!val.trim() && activeCategory === 'All') setSearchResults(null);
            }}
            className="h-11 rounded-sm border-border bg-card px-4 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </div>
      </div>
      {displayed.length > 0 ? (
        <>
          <Grid columns={3}>{pageItems.map((entry, index) => <NewsletterCard key={entry.slug} newsletter={entry} index={index} />)}</Grid>
          {pageCount > 1 ? (
            <nav
              aria-label="Newsletter pagination"
              className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5"
            >
              <p className="font-mono text-xs font-medium uppercase leading-5 tracking-[0.08em] text-muted-foreground">
                Showing {pageStart + 1}–{Math.min(pageStart + NEWSLETTERS_PER_PAGE, displayed.length)} of {displayed.length}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-sm px-3"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                {pageEntries.map((entry, index) =>
                  entry === 'ellipsis' ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 font-mono text-xs text-muted-foreground"
                      aria-hidden="true"
                    >
                      …
                    </span>
                  ) : (
                    <Button
                      key={entry}
                      type="button"
                      variant={entry === currentPage ? 'default' : 'ghost'}
                      size="sm"
                      className={cn(
                        'size-9 rounded-sm p-0 font-mono text-xs',
                        entry === currentPage && 'bg-primary text-primary-foreground hover:bg-primary/90',
                      )}
                      aria-current={entry === currentPage ? 'page' : undefined}
                      aria-label={`Go to page ${entry}`}
                      onClick={() => goToPage(entry)}
                    >
                      {entry}
                    </Button>
                  ),
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-sm px-3"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === pageCount}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </nav>
          ) : null}
        </>
      ) : (
        <Empty className="min-h-56 rounded-sm border border-dashed border-border bg-card p-8">
          <EmptyHeader>
            <EmptyTitle>No newsletters found</EmptyTitle>
            <EmptyDescription>Nothing matches that search. Try a different keyword or category.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}
