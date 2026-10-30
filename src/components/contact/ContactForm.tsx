import React, { useState } from 'react';
import { Send, CheckCircle2, MessageCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { getWhatsAppUrl } from '../../utils/whatsapp';

export const ContactForm: React.FC = () => {
  const { addEnquiry, services } = useData();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState(services[0]?.title || 'Real Estate Consultancy');
  const [budgetRange, setBudgetRange] = useState('₦25M – ₦75M');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEnquiry({
      type: 'General',
      name,
      email,
      phone,
      subject: `${serviceType} Inquiry (${budgetRange})`,
      message,
      meta: {
        service: serviceType,
        budget: budgetRange,
      },
    });
    setSubmitted(true);
  };

  const whatsappDirectUrl = getWhatsAppUrl(
    `Hello Etosmania Global Properties, my name is ${
      name || 'a prospective client'
    }. I am inquiring about *${serviceType}* (Budget: ${budgetRange}). ${message}`
  );

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-purple-200 shadow-lg text-center space-y-5">
        <div className="w-14 h-14 rounded-full bg-purple-100 text-[#3B0764] flex items-center justify-center mx-auto border border-[#D4AF37]">
          <CheckCircle2 className="w-7 h-7 text-[#D4AF37]" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#120721]">
          Your Brief Has Reached Our Advisory Desk
        </h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Thank you, <strong>{name}</strong>. A senior consultant at{' '}
          <strong>Etosmania Global Properties</strong> (10B Thomas Estate, Ajah) will respond
          shortly. You can also connect with us immediately on WhatsApp below.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href={whatsappDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Continue on WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setName('');
              setEmail('');
              setPhone('');
              setMessage('');
            }}
            className="px-5 py-3 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold uppercase tracking-wider hover:bg-slate-50 cursor-pointer"
          >
            Send Another Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-6 sm:p-8 border border-purple-100 shadow-lg space-y-5"
    >
      <div className="border-b border-purple-100 pb-4">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#5B21B6] font-semibold block mb-1">
          Private Mandate Brief
        </span>
        <h3 className="font-serif text-2xl font-bold text-[#120721]">
          Send an Inquiry to Etosmania Advisory
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#4C1D95]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Your Contact Phone / WhatsApp *
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#4C1D95]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#4C1D95]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Service Division
          </label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:border-[#4C1D95]"
          >
            {services.map((s) => (
              <option key={s.id} value={s.title}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Target Capital Range
          </label>
          <select
            value={budgetRange}
            onChange={(e) => setBudgetRange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:border-[#4C1D95]"
          >
            <option>₦5M – ₦25M (Co-Ownership / Land)</option>
            <option>₦25M – ₦75M (Serviced Land / Plots)</option>
            <option>₦75M – ₦200M (Residential Duplex / Terrace)</option>
            <option>₦200M – ₦500M+ (Commercial / Luxury Villa)</option>
            <option>Property Management Mandate</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Your Property or Investment Requirements *
        </label>
        <textarea
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us the location (e.g., Thomas Estate Ajah, Lekki Phase 1, Ibeju-Lekki, Victoria Island), property type, or payment plan you are looking for..."
          className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#4C1D95]"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg bg-gradient-to-r from-[#3B0764] to-[#4C1D95] hover:from-[#4C1D95] hover:to-[#3B0764] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
        >
          <Send className="w-4 h-4 text-[#F59E0B]" />
          <span>Submit Official Brief</span>
        </button>

        <a
          href={whatsappDirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs uppercase tracking-wider transition-colors whitespace-nowrap"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Continue on WhatsApp</span>
        </a>
      </div>
    </form>
  );
};
