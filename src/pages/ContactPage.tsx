import React from 'react';
import { MapPin, Mail, MessageCircle, Clock, ArrowUpRight } from 'lucide-react';
import { ETOSMANIA_CONTACT } from '../data/mockData';
import { ContactForm } from '../components/contact/ContactForm';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { useData } from '../context/DataContext';

export const ContactPage: React.FC = () => {
  const { siteConfig } = useData();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header */}
      <section className="bg-[#07142B] text-white py-16 lg:py-20 border-b-4 border-[#FACC15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block px-3 py-1 rounded-md bg-[#FACC15] text-[#07142B] font-mono-tech text-xs font-extrabold uppercase tracking-widest mb-3">
            Direct Advisory Desk
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold tracking-tight">
            Connect With Etosmania Global Properties
          </h1>
          <p className="text-blue-100/85 text-base sm:text-lg max-w-2xl mt-3">
            Visit our corporate office at {siteConfig.headOfficeAddress || ETOSMANIA_CONTACT.address} or reach our property consultants for Ajah, Lekki, Egbeda, Akowonjo, Agbara, and Ibeju-Lekki immediately via WhatsApp or email.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Official Contact Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
              <h2 className="font-serif-luxury text-2xl font-bold text-[#07142B]">
                Official Contact Channels
              </h2>

              {/* Head Office */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-[#0A1D42] text-[#FACC15] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-mono-tech uppercase tracking-wider text-slate-400">
                    Head Office Address
                  </p>
                  <p className="font-bold text-sm text-[#07142B] mt-0.5">
                    {siteConfig.headOfficeAddress || ETOSMANIA_CONTACT.address}
                  </p>
                </div>
              </div>

              {/* WhatsApp Concierge */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 fill-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-mono-tech uppercase tracking-wider text-slate-400">
                    Live WhatsApp Concierge
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Connect directly with our property &amp; co-ownership advisors for Ajah, Lekki, Egbeda, Akowonjo &amp; Agbara on WhatsApp.
                  </p>
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2.5 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold shadow-xs transition-all"
                  >
                    <span>Message on WhatsApp</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Official Email */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-[#0A1D42] text-[#FACC15] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-mono-tech uppercase tracking-wider text-slate-400">
                    Official Email Desk
                  </p>
                  <a
                    href={`mailto:${siteConfig.contactEmail || ETOSMANIA_CONTACT.email}`}
                    className="font-bold text-sm text-[#0A1D42] hover:underline break-all mt-0.5 block"
                  >
                    {siteConfig.contactEmail || ETOSMANIA_CONTACT.email}
                  </a>
                </div>
              </div>

              {/* Office Hours */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-[#0A1D42] text-[#FACC15] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-mono-tech uppercase tracking-wider text-slate-400">
                    Inspection &amp; Office Hours
                  </p>
                  <p className="font-bold text-sm text-[#07142B] mt-0.5">
                    Monday – Saturday: 8:30 AM – 6:00 PM (WAT)
                  </p>
                  <p className="text-xs text-slate-500">
                    Sunday Private Inspections by Prior Appointment
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Inquiry Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};
