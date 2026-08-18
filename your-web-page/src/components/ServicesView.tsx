import React from 'react';
import { SERVICES } from '../data';

interface ServicesViewProps {
  onOpenInquiry: () => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onOpenInquiry }) => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-12 md:py-20">
      {/* Header Section */}
      <section className="w-full mb-16 border-b border-[#000000] pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <h1 className="font-display-hero text-5xl sm:text-7xl md:text-[110px] uppercase text-[#000000] leading-none tracking-tighter mb-6">
              SERVICES
            </h1>
            <p className="font-body-lg text-lg md:text-xl text-[#444748] max-w-2xl">
              Everything you need to launch and maintain a clear, fast, reliable website.
            </p>
          </div>
        </div>
      </section>

      {/* Services List Section */}
      <div className="flex flex-col gap-16 md:gap-24 mb-16">
        {SERVICES.map((service, index) => {
          const formattedNum = index < 9 ? `0${index + 1}` : `${index + 1}`;
          
          return (
            <React.Fragment key={service.id}>
              <section className="grid grid-cols-1 md:grid-cols-12 gap-8 group relative">
                {/* Horizontal marker line */}
                <div className="hidden md:block absolute -left-12 top-4 w-4 h-[1px] bg-[#000000] group-hover:bg-[#ff4500] transition-colors"></div>
                
                <div className="md:col-span-5 relative">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono-metric text-sm font-bold text-[#ff4500]">
                      {formattedNum}
                    </span>
                    <div className="border border-[#000000] px-2 py-0.5 inline-block bg-[#faf9f9]">
                      <span className="font-label-caps text-[10px] text-[#000000]">
                        [{service.badge}]
                      </span>
                    </div>
                  </div>

                  <h2 className="font-headline-lg text-4xl sm:text-6xl uppercase text-[#000000] leading-tight tracking-tighter group-hover:text-[#ff4500] transition-colors">
                    {service.title}
                  </h2>
                </div>

                <div className="md:col-span-7 flex flex-col justify-start">
                  <p className="font-body-lg text-base sm:text-lg text-[#000000] mb-8 border-l-2 border-[#000000] pl-4 py-1">
                    {service.description}
                  </p>

                  <ul className="font-mono-metric text-sm grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-[#1a1c1c]">
                        <span className="w-2 h-2 bg-[#ff4500] shrink-0"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {index < SERVICES.length - 1 && (
                <hr className="border-t border-[#c4c7c7] my-2" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Call to action section */}
      <section className="border border-[#000000] bg-[#000000] text-white p-8 md:p-12 text-center flex flex-col items-center">
        <span className="font-mono-metric text-xs text-[#ff4500] font-bold block mb-2">
          GET STARTED
        </span>
        <h2 className="font-headline-lg text-3xl sm:text-5xl uppercase mb-4">
          READY TO START YOUR WEBSITE?
        </h2>
        <p className="font-body-md text-white/80 max-w-xl mb-8">
          Send us a message and tell us what you need.
        </p>
        <button
          onClick={onOpenInquiry}
          className="btn-primary bg-[#ff4500] border-[#ff4500] hover:bg-white hover:text-[#000000]"
        >
          START A PROJECT
        </button>
      </section>
    </div>
  );
};

