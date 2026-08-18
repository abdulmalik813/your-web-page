import React from 'react';

interface AboutViewProps {
  onOpenInquiry: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onOpenInquiry }) => {
  const principles = [
    {
      num: '01',
      title: 'CLEAR DESIGN',
      description: 'We make websites that are easy to understand, easy to use, and built around your business.',
    },
    {
      num: '02',
      title: 'FAST WEBSITES',
      description: 'We keep every build focused and efficient so pages load quickly and work reliably.',
    },
    {
      num: '03',
      title: 'EASY TO USE',
      description: 'Clear type, simple navigation, and responsive layouts make every page comfortable to use.',
    },
    {
      num: '04',
      title: 'PERFORMANCE FIRST',
      description: 'We test every website carefully and provide support after launch.',
    },
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-12 md:py-20">
      {/* Header */}
      <section className="mb-16 border-b border-[#000000] pb-12">
        <h1 className="font-display-hero text-5xl sm:text-7xl md:text-[100px] uppercase text-[#000000] leading-none tracking-tighter mb-6">
          ABOUT US
        </h1>
        <p className="font-body-lg text-lg md:text-xl text-[#444748] max-w-3xl">
          YOUR WEB PAGE designs, builds, hosts, and supports websites for businesses that want a strong online presence.
        </p>
      </section>

      {/* Core Principles Grid */}
      <section className="mb-24">
        <div className="flex items-center justify-between mb-8 border-b border-[#000000] pb-4">
          <h2 className="font-headline-md text-3xl uppercase text-[#000000]">
            HOW WE WORK
          </h2>
          <span className="font-mono-metric text-xs text-[#ff4500] font-bold">
            [STANDARDS]
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {principles.map((p) => (
            <div
              key={p.num}
              className="border border-[#000000] bg-[#faf9f9] p-8 flex flex-col justify-between hover:bg-[#f4f3f3] transition-colors"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-mono-metric text-sm font-bold text-[#ff4500]">
                    [{p.num}]
                  </span>
                  <span className="material-symbols-outlined text-xl text-[#000000]">
                    architecture
                  </span>
                </div>
                <h3 className="font-headline-md text-2xl text-[#000000] mb-3">
                  {p.title}
                </h3>
                <p className="font-body-md text-sm text-[#444748]">
                  {p.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process & Workflow */}
      <section className="border border-[#000000] bg-[#000000] text-white p-8 md:p-16 mb-20">
        <span className="font-mono-metric text-xs text-[#ff4500] font-bold block mb-2">
          OUR PROCESS
        </span>
        <h2 className="font-headline-lg text-4xl sm:text-6xl uppercase mb-8">
          OUR 4-STAGE PROCESS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="border-t border-white/30 pt-4">
            <span className="font-mono-metric text-xs text-[#ff4500] block mb-2">STAGE 01</span>
            <h4 className="font-headline-md text-xl text-white mb-2">DISCOVER</h4>
            <p className="font-body-md text-xs text-white/70">
              We learn about your business, audience, and goals.
            </p>
          </div>

          <div className="border-t border-white/30 pt-4">
            <span className="font-mono-metric text-xs text-[#ff4500] block mb-2">STAGE 02</span>
            <h4 className="font-headline-md text-xl text-white mb-2">DESIGN</h4>
            <p className="font-body-md text-xs text-white/70">
              We create a clear look and layout for your website.
            </p>
          </div>

          <div className="border-t border-white/30 pt-4">
            <span className="font-mono-metric text-xs text-[#ff4500] block mb-2">STAGE 03</span>
            <h4 className="font-headline-md text-xl text-white mb-2">BUILD</h4>
            <p className="font-body-md text-xs text-white/70">
              We build and test the website on phones, tablets, and computers.
            </p>
          </div>

          <div className="border-t border-white/30 pt-4">
            <span className="font-mono-metric text-xs text-[#ff4500] block mb-2">STAGE 04</span>
            <h4 className="font-headline-md text-xl text-white mb-2">LAUNCH</h4>
            <p className="font-body-md text-xs text-white/70">
              We publish your website and help keep it running smoothly.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <span className="font-mono-metric text-xs text-white/60">
            Ready to get started?
          </span>
          <button onClick={onOpenInquiry} className="btn-primary bg-[#ff4500] border-[#ff4500] hover:bg-white hover:text-[#000000]">
            START A PROJECT
          </button>
        </div>
      </section>
    </div>
  );
};
