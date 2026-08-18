import React from 'react';
import { ProjectItem } from '../types';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onOpenInquiry: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onOpenInquiry,
}) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#faf9f9] border border-[#000000] max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col justify-between shadow-2xl relative">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#000000] flex justify-between items-center sticky top-0 bg-[#faf9f9] z-10">
          <div>
            <span className="font-mono-metric text-xs text-[#ff4500] font-bold block">
              [{project.category} // {project.year}]
            </span>
            <h2 className="font-headline-md text-2xl sm:text-3xl text-[#000000] uppercase">
              {project.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 border border-[#000000] hover:bg-[#ff4500] hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-8">
          <div className="aspect-[16/9] border border-[#000000] overflow-hidden bg-[#e2e2e2]">
            <img
              src={project.imageUrl}
              alt={project.altText}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 space-y-4">
              <h3 className="font-headline-md text-xl text-[#000000] uppercase">
                PROJECT SUMMARY
              </h3>
              <p className="font-body-md text-base text-[#444748]">
                {project.description}
              </p>

              <div>
                <span className="font-mono-metric text-xs text-[#000000] font-bold block mb-2">
                  TECHNOLOGY STACK
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono-metric text-xs px-3 py-1 bg-[#f4f3f3] border border-[#000000] text-[#000000]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-4 border border-[#000000] p-6 bg-[#f4f3f3] space-y-4">
              <span className="font-mono-metric text-xs text-[#ff4500] font-bold block">
                [PERFORMANCE METRICS]
              </span>

              <div className="space-y-4">
                {project.metrics.map((m, idx) => (
                  <div key={idx} className="border-b border-[#c4c7c7] pb-2">
                    <span className="font-mono-metric text-[11px] text-[#444748] block">
                      {m.label}
                    </span>
                    <span className="font-headline-md text-2xl text-[#000000]">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <span className="font-mono-metric text-[11px] text-[#444748] block">
                  CLIENT
                </span>
                <span className="font-label-caps text-xs text-[#000000] font-bold">
                  {project.client}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-[#000000] bg-[#f4f3f3] flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-mono-metric text-xs text-[#444748]">
            Want a web page with similar metrics?
          </span>
          <button
            onClick={() => {
              onClose();
              onOpenInquiry();
            }}
            className="btn-primary text-xs w-full sm:w-auto"
          >
            COMMISSION SIMILAR PROJECT
          </button>
        </div>
      </div>
    </div>
  );
};
