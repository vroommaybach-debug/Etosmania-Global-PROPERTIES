import React, { useState } from 'react';
import {
  X,
  Calendar,
  Video,
  MapPin,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useData } from '../../context/DataContext';
import { getWhatsAppUrl, getInspectionWhatsAppMessage } from '../../utils/whatsapp';
import { OFFICE_DETAILS } from '../../data/mockData';

export const InspectionModal: React.FC = () => {
  const { isModalOpen, closeInspectionModal, inspectionProperty } = useUI();
  const { addEnquiry } = useData();

  const [mode, setMode] = useState<'in-person' | 'video'>('in-person');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('11:00 AM (WAT)');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEnquiry({
      type: 'Inspection',
      name: fullName,
      email,
      phone,
      subject: inspectionProperty
        ? `Inspection Request: ${inspectionProperty.title}`
        : 'Private Property / Land Inspection Request',
      message:
        notes ||
        `Requested ${
          mode === 'in-person'
            ? 'In-Person Viewing (10B Thomas Estate, Ajah)'
            : 'Live 4K WhatsApp Video Tour'
        } on ${preferredDate} at ${preferredTime}.`,
      meta: {
        mode: mode === 'in-person' ? 'In-Person Viewing' : 'Live Video Tour',
        date: preferredDate,
        time: preferredTime,
        propertyId: inspectionProperty?.id || 'Portfolio Consultation',
      },
    });
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setFullName('');
    setEmail('');
    setPhone('');
    setPreferredDate('');
    setNotes('');
    closeInspectionModal();
  };

  const whatsappDirectUrl = getWhatsAppUrl(
    getInspectionWhatsAppMessage({
      name: fullName || 'Prospective Client',
      mode: mode === 'in-person' ? 'In-Person Physical Inspection' : 'Live 4K WhatsApp Video Tour',
      date: preferredDate || 'Flexible Date',
      time: preferredTime,
      propertyTitle: inspectionProperty?.title,
      notes,
    })
  );

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspection-modal-title"
    >
      <div
        className="fixed inset-0 bg-[#120721]/80 backdrop-blur-sm transition-opacity"
        onClick={resetAndClose}
      />

      <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-purple-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2E1065] via-[#3B0764] to-[#1E0938] px-6 py-5 text-white flex items-start justify-between gap-4 border-b border-[#D4AF37]/30">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#F59E0B] block mb-1">
              Private Viewing Concierge
            </span>
            <h3 id="inspection-modal-title" className="font-serif text-xl sm:text-2xl font-bold">
              {inspectionProperty ? 'Schedule Property Viewing' : 'Book Site Inspection or Consultation'}
            </h3>
            {inspectionProperty && (
              <p className="text-xs text-purple-200 mt-1 line-clamp-1">
                Mandate: <strong className="text-[#F59E0B]">{inspectionProperty.title}</strong> ({inspectionProperty.location})
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            aria-label="Close modal"
            className="p-2 rounded-lg bg-white/10 text-purple-200 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-purple-100 text-[#3B0764] flex items-center justify-center mx-auto border border-[#D4AF37]">
              <CheckCircle2 className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h4 className="font-serif text-2xl font-bold text-[#120721]">
              Inspection Request Logged
            </h4>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you, <strong>{fullName}</strong>. Our acquisitions team at{' '}
              <strong>10B Thomas Estate, Ajah, Lekki</strong> has received your booking for{' '}
              <strong>{preferredDate || 'your preferred date'}</strong> at <strong>{preferredTime}</strong>.
            </p>
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 text-xs text-slate-700">
              For instant priority confirmation with our duty officer, launch WhatsApp below.
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm Instantly on WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={resetAndClose}
                className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold uppercase tracking-wider hover:bg-slate-50 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Mode Toggle */}
            <div className="grid grid-cols-2 gap-3 p-1 bg-purple-50 rounded-xl border border-purple-100">
              <button
                type="button"
                onClick={() => setMode('in-person')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'in-person'
                    ? 'bg-[#3B0764] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#3B0764]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Physical Viewing (Lagos)</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('video')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'video'
                    ? 'bg-[#3B0764] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#3B0764]'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Live Video Tour (Diaspora)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#4C1D95]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your contact number"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#4C1D95]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#4C1D95]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#4C1D95]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Time Slot (WAT)
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:border-[#4C1D95]"
                >
                  <option>10:00 AM (WAT)</option>
                  <option>11:00 AM (WAT)</option>
                  <option>01:00 PM (WAT)</option>
                  <option>03:00 PM (WAT)</option>
                  <option>04:30 PM (WAT)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specific Interests (Land, House, Commercial, Co-Ownership, Title Review)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific instructions for our advisory team..."
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#4C1D95]"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 bg-purple-50/70 px-3.5 py-2.5 rounded-lg border border-purple-100">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#4C1D95]" />
                <span>HQ: {OFFICE_DETAILS.address}</span>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                type="submit"
                className="flex-1 py-3 px-5 rounded-lg bg-gradient-to-r from-[#3B0764] to-[#4C1D95] hover:from-[#4C1D95] hover:to-[#3B0764] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#F59E0B]" />
                <span>Confirm Viewing Slot</span>
              </button>
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Prompt on WhatsApp</span>
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
