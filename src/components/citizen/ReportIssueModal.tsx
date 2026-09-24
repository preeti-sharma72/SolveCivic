'use client';

import React, { useState } from 'react';
import { useCityPulse } from '@/lib/context/CityPulseContext';
import { CitizenReport } from '@/lib/types/civic';
import {
  X,
  Send,
  Camera,
  MapPin,
  AlertCircle,
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
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden text-white relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Report a Civic Issue</h3>
              <p className="text-xs text-slate-400">Directly alerts Municipal Public Works & updates CityPulse</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {submittedId ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Report Successfully Logged!</h4>
              <p className="text-xs text-slate-300 mt-1">
                Your issue has been routed to the relevant municipal dispatch team and placed on the live civic heatmap.
              </p>
              <div className="mt-3 p-3 bg-slate-950 border border-slate-800 rounded-xl inline-block font-mono text-xs text-cyan-400">
                Ticket Reference: <span className="font-bold text-white">{submittedId}</span>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={handleResetAndClose}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Category selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
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
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-semibold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Neighborhood / Sector
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {city.districts.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Street Address / Cross Streets
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g., 18th St & Valencia"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'low', label: 'Low (Routine)', color: 'text-slate-300' },
                  { id: 'medium', label: 'Medium (Active Hazard)', color: 'text-amber-300' },
                  { id: 'urgent', label: 'Urgent (Immediate Danger)', color: 'text-rose-300' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setUrgency(item.id as CitizenReport['urgency'])}
                    className={`py-1.5 px-2 rounded-lg text-xs border text-center transition ${
                      urgency === item.id
                        ? 'bg-slate-800 border-cyan-400 font-bold text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Description & Impact
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you observed (e.g., deep pothole causing vehicles to swerve, broken streetlight)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 placeholder:text-slate-600"
              />
            </div>

            {/* Mock Photo Upload Attachment */}
            <div className="p-3 bg-slate-950/60 border border-dashed border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>Attach photo proof (optional)</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                GPS Verified
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
              >
                <Send className="w-4 h-4" />
                <span>Submit Citizen Report</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
