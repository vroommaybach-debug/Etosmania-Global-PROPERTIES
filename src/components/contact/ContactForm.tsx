import React, { useState } from 'react';
import { Send, CheckCircle2, MessageCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import { CORE_SERVICES } from '../../data/mockData';

export const ContactForm: React.FC = () => {
  const { addInquiry } = useData();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Real Estate Consultancy');
  const [budgetRange, setBudgetRange] = useState('₦15M – ₦50M');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addInquiry({
      fullName,
      email,
      phone,
      subject: `${serviceCategory} Inquiry (${budgetRange})`,
      serviceCategory,
      budgetRange,
      message,
    });
    setSubmitted(true);
  };

  if (submitted) {
    const waText = `Hello Etosmania Global Properties, my name is *${fullName}*. I just submitted an inquiry regarding *${serviceCategory}* (Budget: ${budgetRange}).\n\nDetails: ${message}`;
    return (
      <div className="bg-white rounded-3xl p-8 border border-[#0A1D42]/20 shadow-xl text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h3 className="font-serif-luxury text-2xl font-bold text-[#07142B]">
          Inquiry Received by Etosmania Advisory
        </h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Thank you, <strong>{fullName}</strong>. Our investment desk at 10b Thomas Estate, Ajah has
          logged your brief. For an immediate response, continue this conversation on WhatsApp:
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <a
            href={getWhatsAppUrl(waText)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm shadow-md"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Continue on WhatsApp</span>
          </a>
          <button
            onClick={() => {
              setSubmitted(false);
              setFullName('');
              setEmail('');
              setPhone('');
              setMessage('');
            }}
            className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-5"
    >
      <div>
        <span className="text-[11px] font-mono-tech uppercase tracking-widest text-[#07142B] bg-[#FACC15] px-2.5 py-1 rounded font-bold">
          Direct Executive Brief
        </span>
        <h3 className="font-serif-luxury text-2xl font-bold text-[#07142B] mt-2">
          Tell Us What You Are Looking For
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Select one of our 8 core services and your preferred Lagos corridor (Ajah, Lekki, Egbeda, Akowonjo, Agbara) below.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0A1D42]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Phone / WhatsApp Number *
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+234 800 000 0000"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0A1D42]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0A1D42]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Service Required *
          </label>
          <select
            value={serviceCategory}
            onChange={(e) => setServiceCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0A1D42] bg-white"
          >
            {CORE_SERVICES.map((s) => (
              <option key={s.id} value={s.title}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          Target Investment Budget
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            '₦5M – ₦15M (Co-Own)',
            '₦15M – ₦50M',
            '₦50M – ₦150M',
            '₦150M+ Portfolio',
          ].map((range) => (
            <button
              type="button"
              key={range}
              onClick={() => setBudgetRange(range)}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                budgetRange === range
                  ? 'bg-[#0A1D42] text-white border-[#0A1D42]'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          How Can We Help You? *
        </label>
        <textarea
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your preferred location (Ajah, Lekki, Egbeda, Akowonjo, Agbara, Ibeju-Lekki), property type, or co-ownership goals..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0A1D42]"
        />
      </div>

      <button
        type="submit"
        className="w-full py-4 px-6 rounded-xl bg-[#0A1D42] hover:bg-[#07142B] text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
      >
        <Send className="w-4 h-4 text-[#FACC15]" />
        <span>Submit Brief to Etosmania Advisory</span>
      </button>
    </form>
  );
};
