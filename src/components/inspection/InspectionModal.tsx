import React, { useState } from 'react';
import { X, Calendar, Clock, Video, MapPin, Users, CheckCircle2, MessageCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { getInspectionWhatsAppUrl } from '../../utils/whatsapp';

export const InspectionModal: React.FC = () => {
  const { isInspectionModalOpen, closeInspectionModal, selectedPropertyForInspection, addBooking } =
    useData();

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [inspectionType, setInspectionType] = useState<
    'In-Person' | 'Virtual Video Tour' | 'Co-Ownership Briefing'
  >('In-Person');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isInspectionModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addBooking({
      propertyId: selectedPropertyForInspection?.id,
      propertyTitle:
        selectedPropertyForInspection?.title || 'General Portfolio / Office Consultation',
      clientName,
      clientEmail,
      clientPhone,
      preferredDate,
      preferredTime,
      inspectionType,
      notes,
    });
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setPreferredDate('');
    setNotes('');
    closeInspectionModal();
  };

  const whatsappConfirmUrl = getInspectionWhatsAppUrl({
    clientName: clientName || 'Prospective Client',
    propertyTitle:
      selectedPropertyForInspection?.title || 'Etosmania Verified Property / Land',
    preferredDate: preferredDate || 'Flexible Date',
    inspectionType,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07142B]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#FACC15]/40">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#07142B] via-[#0A1D42] to-[#0F295A] p-6 text-white relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <span className="inline-block text-[10px] font-mono-tech uppercase tracking-widest px-2.5 py-1 rounded bg-[#FACC15] text-[#07142B] font-bold mb-2">
            Etosmania Concierge Desk
          </span>
          <h3 className="font-serif-luxury text-2xl font-bold">
            Schedule Site or Video Inspection
          </h3>
          <p className="text-xs text-blue-100/80 mt-1">
            {selectedPropertyForInspection?.title
              ? `Property: ${selectedPropertyForInspection.title}`
              : '10b Thomas Estate, Ajah • Lekki • Egbeda • Akowonjo • Agbara'}
          </p>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <h4 className="font-serif-luxury text-2xl font-bold text-[#07142B]">
                Inspection Request Logged!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Your inspection booking for{' '}
                <strong className="text-[#0A1D42]">{preferredDate}</strong> ({inspectionType}) has
                been saved. Click below to notify our field officer on WhatsApp for instant
                gate-pass confirmation.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappConfirmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm shadow-lg"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Instant WhatsApp Confirmation</span>
              </a>
              <button
                onClick={handleResetAndClose}
                className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Inspection Format Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Select Inspection Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'In-Person', label: 'Physical Visit', icon: MapPin },
                  { id: 'Virtual Video Tour', label: 'Live Video Tour', icon: Video },
                  { id: 'Co-Ownership Briefing', label: 'Co-Own Briefing', icon: Users },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = inspectionType === tab.id;
                  return (
                    <button
                      type="button"
                      key={tab.id}
                      onClick={() => setInspectionType(tab.id as typeof inspectionType)}
                      className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        active
                          ? 'bg-[#0A1D42] text-white border-[#0A1D42] shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50/50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-[#FACC15]' : 'text-[#0A1D42]'}`} />
                      <span className="text-[11px] font-bold">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Chief / Mrs. Adewale"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0A1D42]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp / Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0A1D42]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0A1D42]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  <Calendar className="w-3.5 h-3.5 inline mr-1 text-[#0A1D42]" />
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0A1D42]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  <Clock className="w-3.5 h-3.5 inline mr-1 text-[#0A1D42]" />
                  Preferred Time *
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0A1D42] bg-white"
                >
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specific Preferences or Questions (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tell us if you want to inspect Ajah, Lekki, Egbeda, Akowonjo, or Agbara..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0A1D42]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FACC15] hover:bg-[#EAB308] text-[#07142B] shadow-md transition-all cursor-pointer"
              >
                Confirm Inspection Slot
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
