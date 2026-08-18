import React, { useEffect, useState } from 'react';
import { PageTab, ProjectItem } from './types';
import { PROJECTS } from './data';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ServicesView } from './components/ServicesView';
import { WorkView } from './components/WorkView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { LegalView } from './components/LegalView';
import { ProjectModal } from './components/ProjectModal';
import { InquiryModal } from './components/InquiryModal';

export const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme
      ? savedTheme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [currentTab, setCurrentTab] = useState<PageTab>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState<boolean>(false);

  const selectedProject: ProjectItem | null =
    PROJECTS.find((p) => p.id === selectedProjectId) || null;

  const handleNavigate = (tab: PageTab) => {
    setCurrentTab(tab);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-[#faf9f9] text-[#1a1c1c] flex flex-col justify-between font-body-md grid-bg selection:bg-[#ff4500] selection:text-white">
      <div>
        {/* Main Header */}
        <Header
          currentTab={currentTab}
          onNavigate={handleNavigate}
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode((current) => !current)}
        />

        {/* View Switcher */}
        <main key={currentTab} className="w-full page-transition">
          {currentTab === 'home' && (
            <HomeView
              onNavigate={handleNavigate}
              onOpenInquiry={() => handleNavigate('contact')}
              onSelectProject={(id) => setSelectedProjectId(id)}
            />
          )}

          {currentTab === 'services' && (
            <ServicesView onOpenInquiry={() => handleNavigate('contact')} />
          )}

          {currentTab === 'work' && (
            <WorkView
              onSelectProject={(id) => setSelectedProjectId(id)}
              onOpenInquiry={() => handleNavigate('contact')}
            />
          )}

          {currentTab === 'about' && (
            <AboutView onOpenInquiry={() => handleNavigate('contact')} />
          )}

          {currentTab === 'contact' && <ContactView />}
          {currentTab === 'privacy' && <LegalView type="privacy" />}
          {currentTab === 'terms' && <LegalView type="terms" />}
        </main>
      </div>

      {/* Main Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Project Case Study Deep Dive Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProjectId(null)}
        onOpenInquiry={() => setInquiryModalOpen(true)}
      />

      {/* Quick Project Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />
    </div>
  );
};

export default App;
