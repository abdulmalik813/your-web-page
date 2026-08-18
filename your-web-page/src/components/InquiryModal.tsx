import React, { useState } from 'react';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#faf9f9] border border-[#000000] max-w-lg w-full p-8 shadow-2xl relative">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#000000]">
          <div>
            <span className="font-mono-metric text-xs text-[#ff4500] font-bold block">
              [FAST TRACK INQUIRY]
            </span>
            <h2 className="font-headline-md text-2xl text-[#000000] uppercase">
              START A PROJECT
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-[#000000] hover:bg-[#ff4500] hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <span className="material-symbols-outlined text-5xl text-[#ff4500]">
              task_alt
            </span>
            <h3 className="font-headline-md text-2xl text-[#000000] uppercase">
              MESSAGE SENT
            </h3>
            <p className="font-body-md text-sm text-[#444748]">
              Thank you, <strong className="text-[#000000]">{name}</strong>. Our team has recorded your inquiry and will contact <strong className="text-[#000000]">{email}</strong> shortly.
            </p>
            <button onClick={handleReset} className="btn-primary w-full text-xs mt-4">
              CLOSE WINDOW
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-label-caps text-xs block mb-1 text-[#000000]">
                YOUR NAME *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full border border-[#000000] p-3 font-body-md text-sm bg-white focus:outline-none focus:border-[#ff4500]"
              />
            </div>

            <div>
              <label className="font-label-caps text-xs block mb-1 text-[#000000]">
                EMAIL ADDRESS *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@company.com"
                className="w-full border border-[#000000] p-3 font-body-md text-sm bg-white focus:outline-none focus:border-[#ff4500]"
              />
            </div>

            <div>
              <label className="font-label-caps text-xs block mb-1 text-[#000000]">
                PROJECT OUTLINE
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Briefly describe your website needs or goals..."
                className="w-full border border-[#000000] p-3 font-body-md text-sm bg-white focus:outline-none focus:border-[#ff4500]"
              ></textarea>
            </div>

            <button type="submit" className="btn-primary w-full py-4 text-xs font-bold mt-2">
              SEND MESSAGE
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
