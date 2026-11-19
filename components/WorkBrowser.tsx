'use client';

import { useState } from 'react';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import type { Project } from '@/lib/cms';
import { filterProjects, type ProjectFilter } from '@/lib/filters';
import { ContentFilters } from './ContentFilters';
import { Grid } from './Grid';
import { ProjectCard } from './ProjectCard';

export function WorkBrowser({ projects }: { projects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('All');
  const filters: ProjectFilter[] = ['All', ...Array.from(new Set(projects.map((project) => project.type)))];
  const filtered = filterProjects(projects, activeFilter);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <ContentFilters
          options={filters}
          value={activeFilter}
          label="Filter projects by type"
          onChange={setActiveFilter}
        />
        <span className="font-mono text-xs font-medium uppercase leading-5 tracking-[0.08em] text-muted-foreground" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
        </span>
      </div>
      {filtered.length ? (
        <Grid columns={3}>{filtered.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</Grid>
      ) : (
        <Empty className="min-h-56 rounded-sm border border-dashed border-border bg-card p-8">
          <EmptyHeader>
            <EmptyTitle>No projects found</EmptyTitle>
            <EmptyDescription>There are no projects in this category yet.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </>
  );
}
