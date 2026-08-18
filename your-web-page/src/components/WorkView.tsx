import React, { useState } from 'react';
import { PROJECTS } from '../data';
import { ProjectItem } from '../types';

interface WorkViewProps {
  onSelectProject: (projectId: string) => void;
  onOpenInquiry: () => void;
}

export const WorkView: React.FC<WorkViewProps> = ({ onSelectProject, onOpenInquiry }) => {
  const [filter, setFilter] = useState<string>('ALL');

  const categories = ['ALL', 'Strategy', 'Design', 'Development', 'Full-Stack'];

  const filteredProjects =
    filter === 'ALL'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category.toLowerCase() === filter.toLowerCase());

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-12 md:py-20">
      {/* Header */}
      <section className="mb-12 border-b border-[#000000] pb-12">
        <div className="flex justify-between items-start flex-col md:flex-row gap-6 mb-8">
          <div>
            <h1 className="font-display-hero text-5xl sm:text-7xl md:text-[100px] uppercase text-[#000000] leading-none tracking-tighter">
              SELECTED WORK
            </h1>
          </div>
          <p className="font-body-lg text-base sm:text-lg text-[#444748] max-w-md">
            A selection of websites and digital projects we have created.
          </p>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-[#c4c7c7]">
          {categories.map((cat) => {
            const isActive = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`font-label-caps text-xs px-5 py-2.5 border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#000000] text-white border-[#000000]'
                    : 'bg-transparent text-[#000000] border-[#000000] hover:bg-[#e8e8e8]'
                }`}
              >
                [{cat.toUpperCase()}]
              </button>
            );
          })}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-24">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className="border border-[#000000] bg-[#faf9f9] group hover:border-[#ff4500] transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[16/10] overflow-hidden border-b border-[#000000] relative bg-[#e2e2e2]">
                <img
                  src={project.imageUrl}
                  alt={project.altText}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 bg-[#000000] text-white px-3 py-1 font-label-caps text-xs">
                  {project.category}
                </span>
                <span className="absolute top-4 right-4 bg-[#faf9f9] text-[#000000] border border-[#000000] px-2 py-0.5 font-mono-metric text-xs font-bold">
                  {project.year}
                </span>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-headline-md text-3xl text-[#000000] group-hover:text-[#ff4500] transition-colors">
                    {project.title}
                  </h3>
                </div>

                <p className="font-body-md text-sm text-[#444748] mb-6">
                  {project.subtitle}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 border-t border-b border-[#c4c7c7] py-4 mb-6">
                  {project.metrics.map((m, idx) => (
                    <div key={idx}>
                      <span className="font-mono-metric text-[11px] text-[#444748] block">
                        {m.label}
                      </span>
                      <span className="font-headline-md text-xl text-[#000000]">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 pt-0 flex justify-between items-center font-mono-metric text-xs border-t border-[#c4c7c7] mt-2">
              <span className="text-[#000000] font-bold">Client: {project.client}</span>
              <span className="text-[#ff4500] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                INSPECT CASE STUDY <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* Commission Callout */}
      <section className="border border-[#000000] bg-[#000000] text-white p-12 text-center flex flex-col items-center">
        <span className="font-mono-metric text-xs text-[#ff4500] font-bold block mb-2">
          HAVE A PROJECT?
        </span>
        <h2 className="font-headline-lg text-4xl sm:text-6xl uppercase mb-4">
          NEED A HIGH-PERFORMING WEB PAGE?
        </h2>
        <p className="font-body-md text-white/70 max-w-xl mb-8">
          We accept a limited number of projects per quarter to guarantee uncompromised quality and technical perfection.
        </p>
        <button onClick={onOpenInquiry} className="btn-primary bg-[#ff4500] border-[#ff4500] hover:bg-white hover:text-[#000000]">
          START A PROJECT
        </button>
      </section>
    </div>
  );
};
