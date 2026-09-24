'use client';

import React, { useState } from 'react';
import { useCityPulse } from '@/lib/context/CityPulseContext';
import { CitizenReport } from '@/lib/types/civic';
import {
  X,
  Send,
  Camera,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportIssueModal({ isOpen, onClose }: ReportIssueModalProps) {
  const { city, submitCitizenReport, selectedDistrict } = useCityPulse();

  const [category, setCategory] = useState<CitizenReport['category']>('Pothole');
  const [district, setDistrict] = useState<string>(selectedDistrict ? selectedDistrict.name : city.districts[0].name);
  const [address, setAddress] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [urgency, setUrgency] = useState<CitizenReport['urgency']>('medium');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories: CitizenReport['category'][] = [
    'Pothole',
    'Streetlight',
    'Garbage / Sanitation',
    'Water Leak',
    'Air Quality',
    'Traffic Hazard',
    'Noise',
    'Public Safety',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !address) return;

    submitCitizenReport({
      category,
      district,
      address,
      description,
      urgency,
    });

    setSubmittedId(`REP-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handleResetAndClose = () => {
    setSubmittedId(null);
    setDescription('');
    setAddress('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-[#080605]/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#140F0D] border border-[#3E2D25] w-full max-w-lg rounded-2xl shadow-brown overflow-hidden text-[#FFF5EE] relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#241A15] bg-[#0E0B09]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2A1B14] text-[#FFAA7A] border border-[#543C30] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#FFF5EE]">Report a Civic Issue</h3>
              <p className="text-xs text-[#A67E68]">Directly alerts Municipal Public Works & updates CityPulse</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1 rounded-lg text-[#A67E68] hover:text-[#FFF5EE] hover:bg-[#201612] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {submittedId ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-[#261A14] text-[#FFAA7A] border border-[#543C30] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-serif font-bold text-[#FFF5EE]">Report Successfully Logged!</h4>
              <p className="text-xs text-[#D6B49F] mt-1.5 leading-relaxed">
                Your report has been routed to the relevant public works dispatch unit and pinned onto the live civic map.
              </p>
              <div className="mt-3 p-3 bg-[#0E0B09] border border-[#2C201A] rounded-xl inline-block font-mono text-xs text-[#FFAA7A]">
                Reference ID: <span className="font-bold text-[#FFF5EE]">{submittedId}</span>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={handleResetAndClose}
                className="w-full py-2.5 px-4 bg-[#FFAA7A] hover:bg-[#FFB88E] text-[#0F0B09] rounded-xl text-xs font-serif font-bold transition shadow-peach"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Category selection */}
            <div>
              <label className="block text-xs font-serif font-semibold text-[#D6B49F] mb-1.5">
                Issue Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`p-2 rounded-lg text-xs text-center border transition ${
                      category === cat
                        ? 'bg-[#FFAA7A] border-[#FFAA7A] text-[#0F0B09] font-bold shadow-peach'
                        : 'bg-[#0E0B09] border-[#241A15] text-[#A67E68] hover:text-[#FFF5EE] hover:bg-[#1E1612]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Neighborhood & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-serif font-semibold text-[#D6B49F] mb-1">
                  Neighborhood / Ward
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-[#0E0B09] border border-[#241A15] rounded-lg px-3 py-2 text-xs text-[#FFF5EE] focus:outline-none focus:border-[#FFAA7A]"
                >
                  {city.districts.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-serif font-semibold text-[#D6B49F] mb-1">
                  Street Address / Cross Streets
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g., 18th St & Valencia"
                  className="w-full bg-[#0E0B09] border border-[#241A15] rounded-lg px-3 py-2 text-xs text-[#FFF5EE] focus:outline-none focus:border-[#FFAA7A] placeholder:text-[#543C30]"
                />
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-xs font-serif font-semibold text-[#D6B49F] mb-1.5">
                Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'low', label: 'Low (Routine)' },
                  { id: 'medium', label: 'Medium (Active)' },
                  { id: 'urgent', label: 'Urgent (Critical)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setUrgency(item.id as CitizenReport['urgency'])}
                    className={`py-1.5 px-2 rounded-lg text-xs border text-center transition ${
                      urgency === item.id
                        ? 'bg-[#2A1B14] border-[#FFAA7A] font-bold text-[#FFAA7A]'
                        : 'bg-[#0E0B09] border-[#241A15] text-[#A67E68]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-serif font-semibold text-[#D6B49F] mb-1">
                Description & Observed Impact
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you observed (e.g., deep pothole causing vehicles to swerve, broken streetlight)..."
                className="w-full bg-[#0E0B09] border border-[#241A15] rounded-lg p-2.5 text-xs text-[#FFF5EE] focus:outline-none focus:border-[#FFAA7A] placeholder:text-[#543C30]"
              />
            </div>

            {/* Photo Attachment preview placeholder */}
            <div className="p-3 bg-[#0E0B09] border border-dashed border-[#2C201A] rounded-xl flex items-center justify-between text-xs text-[#A67E68]">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#FFAA7A]" />
                <span>Attach photo documentation (optional)</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C1512] text-[#D6B49F] border border-[#2C201A]">
                GPS Tagged
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#FFAA7A] hover:bg-[#FFB88E] text-[#0F0B09] rounded-xl text-xs font-serif font-bold transition flex items-center justify-center gap-2 shadow-peach"
              >
                <Send className="w-4 h-4 text-[#0F0B09]" />
                <span>Submit Citizen Report</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
