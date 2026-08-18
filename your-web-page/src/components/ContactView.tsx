import React, { useState } from 'react';
import { ProjectInquiry } from '../types';
import { MapSection } from './MapSection';

export const ContactView: React.FC = () => {
  const [form, setForm] = useState<ProjectInquiry>({
    fullName: '',
    email: '',
    budget: '$10k - $25k',
    timeline: '1 - 3 Months',
    details: '',
    servicesSelected: ['Website Design', 'Development'],
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [referenceId, setReferenceId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email) return;

    const ref = `YWP-${Math.floor(1000 + Math.random() * 9000)}`;
    setReferenceId(ref);
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-12 md:py-20">
      {/* Header */}
      <section className="mb-12 border-b border-[#000000] pb-12">
        <h1 className="font-display-hero text-5xl sm:text-7xl md:text-[96px] uppercase text-[#000000] leading-none tracking-tighter mb-6">
          LET'S TALK ABOUT YOUR WEBSITE.
        </h1>
        <p className="font-body-lg text-lg text-[#444748] max-w-2xl">
          We work with clients in PEI and worldwide. Tell us what you need and we will get back to you. In-person meetings are available by appointment only.
        </p>
      </section>

      {/* Featured PEI Map & Coffee Banner */}
      <MapSection />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 mt-12">
        {/* Form Column */}
        <div className="lg:col-span-8">
          {submitted ? (
            <div className="border border-[#000000] bg-[#faf9f9] p-8 sm:p-12 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-3 h-3 bg-[#ff4500]"></span>
                <span className="font-mono-metric text-xs font-bold text-[#ff4500]">
                  MESSAGE SENT // {referenceId}
                </span>
              </div>
              <h2 className="font-headline-lg text-4xl text-[#000000] uppercase mb-4">
                THANK YOU.
              </h2>
              <p className="font-body-md text-base text-[#444748] mb-8">
                Thanks, <strong className="text-[#000000]">{form.fullName}</strong>. We will reply to <strong className="text-[#000000]">{form.email}</strong> soon.
              </p>

              <div className="border border-[#000000] bg-[#f4f3f3] p-6 mb-8 font-mono-metric text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#444748]">Reference ID:</span>
                  <span className="font-bold text-[#000000]">{referenceId}</span>
                </div>
              </div>

              <button
                onClick={() => setSubmitted(false)}
                className="btn-secondary text-xs"
              >
                SEND ANOTHER MESSAGE
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="border border-[#000000] bg-[#faf9f9] p-8 sm:p-12 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="font-label-caps text-xs block mb-2 text-[#000000]">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="Your name"
                    className="w-full border border-[#000000] p-4 font-body-md text-sm bg-white focus:outline-none focus:border-[#ff4500]"
                  />
                </div>

                <div>
                  <label className="font-label-caps text-xs block mb-2 text-[#000000]">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full border border-[#000000] p-4 font-body-md text-sm bg-white focus:outline-none focus:border-[#ff4500]"
                  />
                </div>
              </div>

              <div>
                <label className="font-label-caps text-xs block mb-2 text-[#000000]">
                  HOW CAN WE HELP? *
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.details}
                  onChange={(e) => setForm({ ...form, details: e.target.value })}
                  placeholder="Tell us a little about your project."
                  className="w-full border border-[#000000] p-4 font-body-md text-sm bg-white focus:outline-none focus:border-[#ff4500]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-5 text-sm font-bold tracking-widest"
              >
                SEND MESSAGE
              </button>
            </form>
          )}
        </div>

        {/* Studio Direct Info Column */}
        <div className="lg:col-span-4 space-y-8">
          <div className="border border-[#000000] bg-[#faf9f9] p-8">
            <span className="font-mono-metric text-xs text-[#ff4500] font-bold block mb-4">
              CONTACT
            </span>
            <div className="space-y-6 font-mono-metric text-sm">
              <div>
                <span className="text-[#444748] text-xs block uppercase">INQUIRIES</span>
                <a href="mailto:hello@yourwebpage.com" className="font-bold text-[#000000] hover:text-[#ff4500] transition-colors">
                  hello@yourwebpage.com
                </a>
              </div>

              <div>
                <span className="text-[#444748] text-xs block uppercase">DIRECT PHONE / TEXT</span>
                <a href="tel:9026299691" className="font-bold text-[#000000] hover:text-[#ff4500] transition-colors">
                  902-629-9691
                </a>
              </div>

              <div>
                <span className="text-[#444748] text-xs block uppercase">HOME LOCATION</span>
                <p className="font-bold text-[#000000]">
                  44 Beach Grove Rd Unit 3<br />
                  Charlottetown, PE C1E 1Y5<br />
                  Canada
                </p>
              </div>
            </div>
          </div>

          <div className="border border-[#000000] bg-[#f4f3f3] p-8">
            <span className="font-mono-metric text-xs text-[#000000] font-bold block mb-2">
              IN-PERSON MEETINGS
            </span>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 bg-[#ff4500] animate-pulse"></span>
              <span className="font-label-caps text-xs text-[#000000] font-bold">
                BY APPOINTMENT ONLY
              </span>
            </div>
            <p className="font-body-md text-xs text-[#444748]">
              Please call or send a message to arrange a time before visiting. This is a private home, so visits are by appointment only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

