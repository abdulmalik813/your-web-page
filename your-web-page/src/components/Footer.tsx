import React from 'react';
import { PageTab } from '../types';

interface FooterProps {
  onNavigate: (tab: PageTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNavClick = (tab: PageTab) => {
    onNavigate(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#000000] text-white font-label-caps border-t border-[#000000] w-full px-6 md:px-16 py-12 md:py-20 z-20 relative">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
        <div className="mb-6 md:mb-0">
          <button
            onClick={() => handleNavClick('home')}
            className="font-headline-lg text-4xl sm:text-6xl md:text-7xl text-white block mb-6 hover:text-[#ff4500] transition-colors text-left cursor-pointer"
          >
            YOUR WEB PAGE
          </button>
          <p className="font-body-md text-white/80 uppercase mb-2">
            Your business. Your web page. Serving clients worldwide.
          </p>
          <div className="font-mono-metric text-xs text-[#ff4500] space-y-1 break-words">
            <p>📍 44 Beach Grove Rd Unit 3, Charlottetown, PE C1E 1Y5</p>
            <p>📞 <a href="tel:9026299691" className="underline hover:text-white">902-629-9691</a> // Visits by appointment only.</p>
          </div>
        </div>

        <div className="flex flex-col gap-8 md:items-end w-full md:w-auto">
          <div className="flex flex-wrap gap-x-8 gap-y-4 font-label-caps text-xs">
            <button
              onClick={() => handleNavClick('work')}
              className="text-white/80 hover:text-[#ff4500] transition-colors cursor-pointer"
            >
              WORK
            </button>
            <button
              onClick={() => handleNavClick('services')}
              className="text-white/80 hover:text-[#ff4500] transition-colors cursor-pointer"
            >
              SERVICES
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="text-white/80 hover:text-[#ff4500] transition-colors cursor-pointer"
            >
              PROCESS
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-white/80 hover:text-[#ff4500] transition-colors cursor-pointer"
            >
              CONTACT
            </button>
            <button
              onClick={() => handleNavClick('privacy')}
              className="text-white/80 hover:text-[#ff4500] transition-colors cursor-pointer"
            >
              PRIVACY
            </button>
            <button
              onClick={() => handleNavClick('terms')}
              className="text-white/80 hover:text-[#ff4500] transition-colors cursor-pointer"
            >
              TERMS
            </button>
          </div>
          <span className="font-mono-metric text-xs text-white/50 tracking-wider">
            © {new Date().getFullYear()} YOUR WEB PAGE. ALL RIGHTS RESERVED.
          </span>
        </div>
      </div>
    </footer>
  );
};
