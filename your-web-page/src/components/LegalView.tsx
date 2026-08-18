import React from 'react';

interface LegalViewProps {
  type: 'privacy' | 'terms';
}

const privacySections = [
  ['Information we collect', 'When you contact us, we may collect your name, email address, phone number, and the details you provide about your project.'],
  ['How we use information', 'We use your information to respond to messages, provide requested services, prepare estimates, and maintain our business records.'],
  ['Sharing information', 'We do not sell your personal information. We only share it with service providers when needed to operate our website or deliver our services, or when required by law.'],
  ['Data retention', 'We keep information only for as long as it is needed for our work, recordkeeping, or legal obligations.'],
  ['Your choices', 'You may ask us to access, correct, or delete your personal information by emailing hello@yourwebpage.com.'],
];

const termsSections = [
  ['Using this website', 'You may use this website for lawful purposes. You may not interfere with the site, attempt unauthorized access, or misuse its content.'],
  ['Project services', 'Website projects, pricing, timelines, deliverables, and payment terms are confirmed in a separate written agreement before work begins.'],
  ['Website content', 'The text, design, graphics, and other content on this website belong to YOUR WEB PAGE or their respective owners and may not be copied without permission.'],
  ['Information on this site', 'We try to keep this website accurate and available, but we do not guarantee that every detail will always be complete, current, or error-free.'],
  ['Contact', 'Questions about these terms can be sent to hello@yourwebpage.com.'],
];

export const LegalView: React.FC<LegalViewProps> = ({ type }) => {
  const isPrivacy = type === 'privacy';
  const sections = isPrivacy ? privacySections : termsSections;

  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-16 py-12 md:py-20">
      <header className="border-b border-[#000000] pb-10 mb-10">
        <h1 className="font-display-hero text-5xl sm:text-7xl uppercase text-[#000000] leading-none tracking-tighter mb-5">
          {isPrivacy ? 'Privacy Policy' : 'Terms of Use'}
        </h1>
        <p className="font-body-md text-[#444748]">Last updated August 13, 2026</p>
      </header>
      <div className="space-y-10">
        <p className="font-body-lg text-[#444748]">
          {isPrivacy
            ? 'This policy explains how YOUR WEB PAGE handles information you share with us.'
            : 'These terms explain the basic rules for using the YOUR WEB PAGE website.'}
        </p>
        {sections.map(([title, content]) => (
          <section key={title} className="border-t border-[#c4c7c7] pt-6">
            <h2 className="font-headline-md text-2xl uppercase text-[#000000] mb-3">{title}</h2>
            <p className="font-body-md text-[#444748]">{content}</p>
          </section>
        ))}
      </div>
    </div>
  );
};
