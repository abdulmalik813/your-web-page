'use client';

import { useState } from 'react';
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
  const filtered = filterResources(resources, activeCategory, query);
  const categories: ResourceFilter[] = ['All', ...Array.from(new Set(resources.map((resource) => resource.category)))];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <ContentFilters
          options={categories}
          value={activeCategory}
          label="Filter resources by category"
          onChange={setActiveCategory}
        />
        <div className="flex min-w-[min(100%,280px)] flex-col gap-1.5">
          <Label className="font-mono text-xs font-semibold uppercase leading-5 tracking-[0.1em]" htmlFor="resource-search">Search resources</Label>
          <Input
            id="resource-search"
            type="search"
            placeholder="Search by keyword"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-11 rounded-sm border-border bg-card px-4 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </div>
      </div>
      {filtered.length > 0 ? (
        <Grid columns={3} fill>{filtered.map((entry, index) => <ResourceCard key={entry.slug} resource={entry} index={index} />)}</Grid>
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
