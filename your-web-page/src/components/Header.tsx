import React, { useState } from 'react';
import { PageTab } from '../types';

interface HeaderProps {
  currentTab: PageTab;
  onNavigate: (tab: PageTab) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onNavigate, darkMode, onToggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; tab: PageTab }[] = [
    { label: 'WORK', tab: 'work' },
    { label: 'SERVICES', tab: 'services' },
    { label: 'ABOUT', tab: 'about' },
  ];

  const handleNavClick = (tab: PageTab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="bg-[#faf9f9] text-[#000000] font-label-caps border-b border-[#000000] sticky top-0 z-50 w-full transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 py-3 flex justify-between items-center gap-2">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="font-headline-md text-2xl sm:text-3xl tracking-tighter text-[#000000] hover:text-[#ff4500] transition-colors cursor-pointer text-left whitespace-nowrap"
        >
          YOUR WEB PAGE
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => {
            const isActive = currentTab === link.tab;
            return (
              <button
                key={link.tab}
                onClick={() => handleNavClick(link.tab)}
                className={`px-3 py-1.5 transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? 'text-[#ff4500] font-bold border-b-2 border-[#ff4500]'
                    : 'text-[#000000] hover:bg-[#ff4500] hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onToggleTheme}
            className="theme-toggle"
            aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          >
            <span className="material-symbols-outlined text-xl">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className="btn-primary header-project-button text-xs"
          >
            START A PROJECT
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#000000] p-2 hover:bg-[#e8e8e8] transition-colors border border-[#000000] cursor-pointer"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#000000] bg-[#faf9f9] px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <button
              key={link.tab}
              onClick={() => handleNavClick(link.tab)}
              className={`text-left font-label-caps text-base py-2 border-b border-[#c4c7c7] transition-colors ${
                currentTab === link.tab
                  ? 'text-[#ff4500] font-bold pl-2 border-l-4 border-l-[#ff4500]'
                  : 'text-[#000000] hover:text-[#ff4500]'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              handleNavClick('contact');
            }}
            className="btn-primary w-full mt-2"
          >
            START A PROJECT
          </button>
        </div>
      )}
    </header>
  );
};
