import React from 'react';
import {
  MapPin,
  Mail,
  Clock,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import { OFFICE_DETAILS } from '../data/mockData';
import { useUI } from '../context/UIContext';
import { ContactForm } from '../components/contact/ContactForm';
import { getWhatsAppUrl, getGeneralWhatsAppMessage } from '../utils/whatsapp';

export const ContactPage: React.FC = () => {
  const { openInspectionModal } = useUI();
  const googleMapsUrl =
    'https://www.google.com/maps/search/?api=1&query=10B+Thomas+Estate+Ajah+Lekki+Lagos';

  return (
    <div className="bg-[#FAF9FC] min-h-screen pt-24 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-[#120721] via-[#2E1065] to-[#3B0764] text-white py-16 sm:py-20 border-b border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-white/10 border border-[#D4AF37]/40 text-xs font-mono uppercase tracking-[0.2em] text-[#F59E0B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Private Concierge &amp; Verification Desk</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight">
              Connect With <span className="text-[#F59E0B]">Etosmania Global Properties</span>
            </h1>
            <p className="text-base sm:text-lg text-purple-100/90 leading-relaxed">
              Visit our corporate headquarters at{' '}
              <strong>10B Thomas Estate, Ajah, Lekki, Lagos State</strong>, schedule a private
              consultation, or launch a direct WhatsApp chat with our advisory desk.
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Channels & Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#5B21B6] font-bold block mb-1">
                  Headquarters Address
                </span>
                <div className="flex items-start gap-3 mt-2">
                  <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#120721]">
                      10B Thomas Estate, Ajah, Lekki, Lagos State
                    </h2>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#4C1D95] hover:underline mt-1"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t border-purple-100 pt-5">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#5B21B6] font-bold block mb-3">
                  Direct Concierge Channels
                </span>
                <div className="space-y-3">
                  <a
                    href={getWhatsAppUrl(getGeneralWhatsAppMessage())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-emerald-700" />
                      <div>
                        <span className="text-[10px] font-mono uppercase text-emerald-800 block">
                          Instant Messaging Desk
                        </span>
                        <span className="font-serif text-sm font-bold text-emerald-950">
                          Launch WhatsApp Concierge
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-800">Message →</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => openInspectionModal()}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-[#3B0764]" />
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#5B21B6] block">
                          In-Person or Virtual Tour
                        </span>
                        <span className="font-serif text-sm font-bold text-[#120721]">
                          Book Private Site Inspection
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#3B0764]">Schedule →</span>
                  </button>
                </div>
              </div>

              <div className="border-t border-purple-100 pt-5 space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      Official Corporate Email
                    </span>
                    <a
                      href={`mailto:${OFFICE_DETAILS.email}`}
                      className="font-mono text-sm font-bold text-[#3B0764] hover:underline break-all"
                    >
                      {OFFICE_DETAILS.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <Clock className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      Consultation &amp; Inspection Hours
                    </span>
                    <p className="text-xs text-slate-600">{OFFICE_DETAILS.hours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Interactive Map of Thomas Estate, Ajah, Lekki */}
            <div className="bg-white rounded-2xl overflow-hidden border border-purple-100 shadow-sm">
              <div className="p-4 bg-[#18062C] text-white flex items-center justify-between">
                <span className="text-xs font-mono text-[#F59E0B]">
                  📍 10B Thomas Estate, Ajah, Lekki Corridor
                </span>
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <iframe
                title="Etosmania Global Properties Headquarters — 10B Thomas Estate, Ajah, Lekki"
                src="https://www.google.com/maps?q=Thomas+Estate,+Ajah,+Lekki,+Lagos&output=embed"
                className="w-full h-64 border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right Column: Official Inquiry Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
};
