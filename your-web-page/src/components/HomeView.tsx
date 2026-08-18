import React from 'react';
import { PageTab } from '../types';
import { HERO_SHOWCASE_IMAGE, BRUTALIST_BUILDING_IMAGE, SERVICES, PROJECTS } from '../data';

interface HomeViewProps {
  onNavigate: (tab: PageTab) => void;
  onOpenInquiry: () => void;
  onSelectProject: (projectId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenInquiry,
  onSelectProject,
}) => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="px-6 md:px-16 py-16 md:py-24 flex flex-col md:flex-row items-end gap-8 border-b border-[#c4c7c7] relative">
        <div className="w-full md:w-2/3 pr-0 md:pr-12">
          <h1 className="font-display-hero text-5xl sm:text-7xl md:text-[96px] text-[#000000] mb-8 tracking-tighter leading-none uppercase">
            Websites built to move your business forward.
          </h1>
          
          <p className="font-body-lg text-lg sm:text-xl text-[#444748] max-w-2xl mb-12">
            We design, build, host, and maintain high-performing websites for businesses in PEI and around the world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onOpenInquiry}
              className="btn-primary text-sm px-8 py-4"
            >
              Start Your Project
            </button>
            <button
              onClick={() => onNavigate('work')}
              className="btn-secondary text-sm px-8 py-4"
            >
              View Our Work
            </button>
          </div>
        </div>

        {/* Services Summary */}
        <div className="w-full md:w-1/3 flex justify-end mt-8 md:mt-0">
          <div className="w-full border border-[#000000] bg-[#f4f3f3]">
            <div className="flex justify-between items-center p-5 bg-[#000000] text-white">
              <div>
                <span className="font-mono-metric text-xs text-[#ff4500] uppercase font-bold block mb-1">HOW WE HELP</span>
                <p className="font-headline-md text-2xl uppercase">Everything your site needs</p>
              </div>
              <span className="material-symbols-outlined text-3xl text-[#ff4500]">web</span>
            </div>
            <div className="divide-y divide-[#c4c7c7]">
              <div className="p-5 flex gap-4 items-start">
                <span className="material-symbols-outlined text-[#ff4500]">draw</span>
                <div>
                  <h3 className="font-label-caps text-[#000000] mb-1">Website Design</h3>
                  <p className="font-body-md text-sm text-[#444748]">A clear, custom design built around your business.</p>
                </div>
              </div>
              <div className="p-5 flex gap-4 items-start">
                <span className="material-symbols-outlined text-[#ff4500]">code</span>
                <div>
                  <h3 className="font-label-caps text-[#000000] mb-1">Website Development</h3>
                  <p className="font-body-md text-sm text-[#444748]">A fast, responsive website that works on every device.</p>
                </div>
              </div>
              <div className="p-5 flex gap-4 items-start">
                <span className="material-symbols-outlined text-[#ff4500]">support_agent</span>
                <div>
                  <h3 className="font-label-caps text-[#000000] mb-1">Hosting & Support</h3>
                  <p className="font-body-md text-sm text-[#444748]">Reliable hosting, updates, and help after launch.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Showcase Section */}
      <section className="border-b border-[#c4c7c7] p-6 md:p-16">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-4 font-mono-metric text-xs uppercase">
          <span className="font-bold text-[#000000]">FEATURED WEBSITE</span>
          <span className="text-[#444748]">CLEAR, MODERN DESIGN</span>
        </div>
        <div className="w-full border border-[#000000] relative overflow-hidden bg-[#e2e2e2] h-[50vh] md:h-[70vh] group">
          <img
            src={HERO_SHOWCASE_IMAGE}
            alt="Minimalist digital interface on screen"
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
          />
          <div className="absolute bottom-4 left-4 bg-[#000000] text-white px-4 py-2 font-mono-metric text-xs uppercase opacity-90 group-hover:bg-[#ff4500] transition-colors">
            Designed for clarity and speed
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="border-b border-[#c4c7c7]" id="services">
        <div className="px-6 md:px-16 py-8 border-b border-[#c4c7c7] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-[#f4f3f3]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#000000]"></span>
            <h2 className="font-headline-md text-2xl md:text-3xl uppercase text-[#000000]">OUR SERVICES</h2>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="font-label-caps text-xs text-[#ff4500] hover:underline flex items-center gap-1 cursor-pointer"
          >
            EXPLORE ALL SERVICES <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, index) => {
            const isTopRow = index < 4;
            const isRightBorder = (index + 1) % 4 !== 0;

            return (
              <div
                key={service.id}
                onClick={() => onNavigate('services')}
                className={`p-6 sm:p-8 flex flex-col justify-between gap-6 sm:gap-12 group hover:bg-[#f4f3f3] transition-colors duration-300 border-b border-[#c4c7c7] cursor-pointer ${
                  isRightBorder ? 'md:border-r border-[#c4c7c7]' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="material-symbols-outlined text-4xl text-[#000000] group-hover:text-[#ff4500] transition-colors">
                    {service.icon}
                  </span>
                  <span className="font-mono-metric text-xs text-[#444748] font-bold">
                    [0{index + 1}]
                  </span>
                </div>
                
                <div>
                  <h3 className="font-headline-md text-2xl text-[#000000] mb-3 group-hover:translate-x-1 transition-transform">
                    {service.title}
                  </h3>
                  <p className="font-body-md text-sm text-[#444748]">
                    {service.tagline}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Projects Showcase */}
      <section className="px-6 md:px-16 py-16 md:py-24 border-b border-[#c4c7c7]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="font-headline-lg text-4xl sm:text-6xl text-[#000000] uppercase">
              RECENT WORK
            </h2>
          </div>
          <button
            onClick={() => onNavigate('work')}
            className="btn-secondary text-xs"
          >
            VIEW ALL PROJECTS ({PROJECTS.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.slice(0, 2).map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className="border border-[#000000] bg-[#faf9f9] group hover:border-[#ff4500] transition-all duration-300 cursor-pointer"
            >
              <div className="aspect-[16/10] overflow-hidden border-b border-[#000000] relative">
                <img
                  src={project.imageUrl}
                  alt={project.altText}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 bg-[#000000] text-white px-3 py-1 font-label-caps text-xs">
                  {project.category}
                </span>
                <span className="absolute top-4 right-4 bg-[#faf9f9] text-[#000000] border border-[#000000] px-2 py-0.5 font-mono-metric text-xs font-bold">
                  {project.year}
                </span>
              </div>

              <div className="p-6">
                <h3 className="font-headline-md text-2xl sm:text-3xl text-[#000000] mb-2 group-hover:text-[#ff4500] transition-colors">
                  {project.title}
                </h3>
                <p className="font-body-md text-sm text-[#444748] mb-6">
                  {project.subtitle}
                </p>

                <div className="flex justify-between items-center border-t border-[#c4c7c7] pt-4 font-mono-metric text-xs">
                  <span className="text-[#000000] font-medium">{project.client}</span>
                  <span className="text-[#ff4500] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    VIEW CASE STUDY <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Contact Callout */}
      <section className="bg-[#000000] text-white px-6 md:px-16 py-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h2 className="font-headline-lg text-4xl sm:text-6xl uppercase tracking-tight">
            LET'S CREATE YOUR WEB PAGE.
          </h2>
          <p className="font-body-md text-white/70 max-w-xl mt-4">
            Tell us about your business and what you need from your website.
          </p>
        </div>
        <button
          onClick={onOpenInquiry}
          className="bg-[#ff4500] text-white font-label-caps text-sm px-8 py-5 border border-[#ff4500] hover:bg-white hover:text-[#000000] hover:border-white transition-colors cursor-pointer uppercase font-bold tracking-widest w-full md:w-auto"
        >
          START A PROJECT NOW
        </button>
      </section>
    </div>
  );
};
