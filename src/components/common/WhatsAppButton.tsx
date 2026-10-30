import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, ArrowUpRight } from 'lucide-react';
import { getWhatsAppUrl } from '../../utils/whatsapp';

const QUICK_PROMPTS = [
  {
    label: 'Buy Verified Land or House',
    message:
      'Hello Etosmania Global Properties, I am interested in buying verified Land or a House in Lagos (Ajah, Lekki, Egbeda, Akowonjo, or Agbara). Please share available options.',
  },
  {
    label: 'Join Real Estate Co-Ownership',
    message:
      'Hello Etosmania Global Properties, I would like to learn how to subscribe to a Real Estate Co-Ownership slot.',
  },
  {
    label: 'Book Site / Live Video Inspection',
    message:
      'Hello Etosmania Global Properties, I want to schedule a site or live WhatsApp video inspection across your Lagos corridors.',
  },
  {
    label: 'Speak with Investment Consultant',
    message:
      'Hello Etosmania Global Properties, I would like to speak with an Investment Consultant regarding high-yield properties in Lagos.',
  },
];

export const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const msg =
      customMessage.trim() ||
      'Hello Etosmania Global Properties, I would like to inquire about your properties and investment services.';
    window.open(getWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
    setCustomMessage('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end">
      {/* Simple as ABC Chat Box */}
      {isOpen && (
        <div className="mb-3 w-[300px] sm:w-[340px] bg-white rounded-2xl shadow-2xl border border-blue-950/15 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#07142B] via-[#0A1D42] to-[#0F295A] p-4 text-white relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
              aria-label="Close WhatsApp concierge"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#25D366] flex items-center justify-center shadow-md shrink-0">
                <MessageCircle className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-tight">Etosmania Live Chat</span>
                  <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                </div>
                <p className="text-[11px] text-[#FACC15]">Instant WhatsApp Advisory</p>
              </div>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="p-3.5 bg-[#F8FAFC] space-y-2 max-h-[250px] overflow-y-auto">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#0A1D42] px-1">
              <Sparkles className="w-3 h-3 text-[#EAB308]" />
              <span>Tap a topic or type below:</span>
            </div>

            {QUICK_PROMPTS.map((item, idx) => (
              <a
                key={idx}
                href={getWhatsAppUrl(item.message)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 w-full p-2.5 rounded-xl bg-white hover:bg-blue-50/70 border border-slate-200/80 hover:border-[#0A1D42]/30 text-left transition-all group shadow-2xs"
              >
                <span className="text-xs font-semibold text-[#07142B] group-hover:text-[#0A1D42]">
                  {item.label}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0A1D42] shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ))}
          </div>

          {/* Custom Message Input */}
          <form
            onSubmit={handleSendCustom}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0A1D42]"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white flex items-center justify-center shadow-sm transition-colors shrink-0"
              aria-label="Send WhatsApp Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button — Compact on Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 pl-3.5 pr-3.5 sm:pr-4 py-3 rounded-full bg-gradient-to-r from-[#07142B] to-[#0A1D42] hover:from-[#0A1D42] hover:to-[#1D4ED8] text-white shadow-xl border border-[#FACC15]/50 transition-all duration-300 hover:scale-[1.03]"
        aria-label="Open WhatsApp Concierge"
      >
        <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#25D366] text-white shadow-inner">
          <MessageCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-white" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#FACC15] border-2 border-[#07142B]" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-[10px] font-mono-tech uppercase tracking-widest text-[#FACC15] leading-none">
            Live Chat
          </p>
          <p className="text-xs font-bold tracking-tight text-white leading-tight mt-0.5">
            WhatsApp Us
          </p>
        </div>
      </button>
    </div>
  );
};
