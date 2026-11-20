'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ResourceEntry } from '@/lib/cms';
import { filterResources, type ResourceFilter } from '@/lib/filters';
import { ContentFilters } from './ContentFilters';
import { Grid } from './Grid';
import { ResourceCard } from './ResourceCard';

export function ResourcesBrowser({ resources }: { resources: ResourceEntry[] }) {
  const [activeCategory, setActiveCategory] = useState<ResourceFilter>('All');
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ResourceEntry[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed && activeCategory === 'All') {
      return;
    }

    let isCancelled = false;
    const timeoutId = setTimeout(() => {
      setIsSearching(true);
      const params = new URLSearchParams({
        collection: 'resources',
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

  const categories: ResourceFilter[] = [
    'All',
    ...Array.from(new Set(resources.map((resource) => resource.category))),
  ];

  const isDefaultView = !query.trim() && activeCategory === 'All';
  const displayed = isDefaultView
    ? resources
    : searchResults !== null
      ? searchResults
      : filterResources(resources, activeCategory, query);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <ContentFilters
          options={categories}
          value={activeCategory}
          label="Filter resources by category"
          onChange={(cat) => {
            setActiveCategory(cat);
            if (cat === 'All' && !query.trim()) setSearchResults(null);
          }}
        />
        <div className="flex min-w-[min(100%,280px)] flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label className="font-mono text-xs font-semibold uppercase leading-5 tracking-[0.1em]" htmlFor="resource-search">Search resources</Label>
            {isSearching && (
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                <Loader2 className="size-3 animate-spin" aria-hidden="true" />
                Searching...
              </span>
            )}
          </div>
          <Input
            id="resource-search"
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
        <Grid columns={3}>{displayed.map((entry, index) => <ResourceCard key={entry.slug} resource={entry} index={index} />)}</Grid>
      ) : (
        <Empty className="min-h-56 rounded-sm border border-dashed border-border bg-card p-8">
          <EmptyHeader>
            <EmptyTitle>No resources found</EmptyTitle>
            <EmptyDescription>Nothing matches that search. Try a different keyword or category.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}
