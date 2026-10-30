import React, { useState } from 'react';
import { MessageCircle, Bookmark, X, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import { useUI } from '../../context/UIContext';

const QUICK_TOPICS = [
  {
    label: 'Buy Verified Land or House',
    message:
      'Hello Etosmania Global Properties, I would like to inquire about your available verified land plots and houses in Lagos.',
  },
  {
    label: 'Co-Ownership Slots (From ₦5M)',
    message:
      'Hello Etosmania Global Properties, please share details on your active Real Estate Co-ownership slots and projected returns.',
  },
  {
    label: 'Schedule Private Inspection',
    message:
      'Hello Etosmania Global Properties, I would like to schedule a physical viewing or live video property inspection.',
  },
  {
    label: 'Property Management / Advisory',
    message:
      'Hello Etosmania Global Properties, I would like to speak with a consultant regarding Property Management and Investment Consulting.',
  },
];

/**
 * International "Simple as ABC" WhatsApp Chat Deck
 * Keeps phone numbers completely unexposed on the public UI while allowing
 * 1-tap topic selection or custom message entry before launching WhatsApp.
 */
export const WhatsAppButton: React.FC = () => {
  const { savedIds, openSavedDrawer } = useUI();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  const handleLaunchWhatsApp = (messageText: string) => {
    const finalMsg =
      messageText.trim() ||
      'Hello Etosmania Global Properties, I would like to speak with an advisor regarding your properties and investment services.';
    const url = getWhatsAppUrl(finalMsg);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsChatOpen(false);
    setCustomMessage('');
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2.5">
      {/* Interactive "Simple as ABC" WhatsApp Chat Popover */}
      {isChatOpen && (
        <div className="w-[320px] sm:w-[350px] rounded-2xl bg-white shadow-2xl border border-purple-200 overflow-hidden mb-1 animate-in slide-in-from-bottom-3 duration-200">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-[#18062C] via-[#2E1065] to-[#3B0764] p-4 text-white flex items-center justify-between border-b border-[#D4AF37]/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#16A34A] flex items-center justify-center shadow-inner">
                <MessageCircle className="w-4 h-4 fill-white text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-serif font-bold text-sm text-white">
                    Etosmania Concierge
                  </h4>
                  <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                </div>
                <span className="text-[11px] text-purple-200 block">
                  Instant WhatsApp Advisory Desk
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsChatOpen(false)}
              aria-label="Close chat box"
              className="p-1.5 rounded-lg bg-white/10 text-purple-200 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-[#FAF9FC] space-y-3">
            <div className="bg-white p-3 rounded-xl rounded-tl-none border border-purple-100 text-xs text-slate-700 leading-relaxed shadow-2xs">
              <strong className="text-[#2E1065] block mb-0.5">Welcome to Etosmania Global</strong>
              Select a topic below or type your question to start a direct WhatsApp chat with our
              advisory desk:
            </div>

            {/* Quick 1-Tap Topics */}
            <div className="space-y-1.5">
              {QUICK_TOPICS.map((topic) => (
                <button
                  key={topic.label}
                  type="button"
                  onClick={() => handleLaunchWhatsApp(topic.message)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-white hover:bg-purple-50 border border-purple-100 hover:border-[#D4AF37] text-xs font-medium text-[#120721] flex items-center justify-between transition-all cursor-pointer group"
                >
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5B21B6]" />
                    <span>{topic.label}</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#D4AF37] group-hover:translate-x-0.5 transition-transform">
                    Chat →
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Message Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLaunchWhatsApp(customMessage);
              }}
              className="pt-1 flex items-center gap-2"
            >
              <input
                type="text"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Or type a message..."
                className="flex-1 px-3 py-2 rounded-lg bg-white border border-purple-200 text-xs text-[#120721] focus:outline-none focus:border-[#3B0764]"
              />
              <button
                type="submit"
                aria-label="Send to WhatsApp"
                className="px-3.5 py-2 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Send</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Saved Shortlist Quick Trigger */}
      {savedIds.length > 0 && (
        <button
          type="button"
          onClick={openSavedDrawer}
          aria-label={`Open saved property shortlist (${savedIds.length} saved)`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#18062C] text-white border border-[#D4AF37]/60 shadow-lg hover:bg-[#3B0764] transition-all text-xs font-semibold cursor-pointer whitespace-nowrap"
        >
          <Bookmark className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
          <span>Shortlist ({savedIds.length})</span>
        </button>
      )}

      {/* Compact Floating Trigger (No exposed phone number) */}
      <button
        type="button"
        onClick={() => setIsChatOpen((prev) => !prev)}
        aria-label="Open WhatsApp Concierge Chat"
        className="group inline-flex items-center gap-2.5 p-3 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-[#16A34A] to-[#15803D] text-white font-semibold text-xs shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all border border-white/25 cursor-pointer whitespace-nowrap"
      >
        <MessageCircle className="w-5 h-5 fill-white text-white" />
        <span className="hidden sm:inline font-bold tracking-wide">WhatsApp Chat</span>
      </button>
    </div>
  );
};
