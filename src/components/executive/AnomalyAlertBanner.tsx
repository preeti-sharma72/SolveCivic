'use client';

import React, { useState } from 'react';
import { useCityPulse } from '@/lib/context/CityPulseContext';
import { AnomalyAlert } from '@/lib/types/civic';
import {
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export default function AnomalyAlertBanner() {
  const { anomalies, mitigateAnomaly } = useCityPulse();
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyAlert | null>(null);

  const activeAnomalies = anomalies.filter((a) => a.status === 'active');

  if (activeAnomalies.length === 0) {
    return (
      <div className="bg-[#140F0D] border border-[#2C201A] rounded-xl p-3.5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-[#FFAA7A]">
          <ShieldCheck className="w-4 h-4 text-[#FFAA7A]" />
          <span>PREDICTIVE AI ENGINE: Multi-vector telemetry within nominal statistical baselines (Z &lt; 2.0).</span>
        </div>
        <span className="text-[11px] text-[#A67E68]">Continuous Fourier & Z-score monitoring active</span>
      </div>
    );
  }

  const primary = activeAnomalies[0];

  return (
    <div className="space-y-2">
      {/* Alert Header Banner */}
      <div className="bg-gradient-to-r from-[#24130E] via-[#1A120E] to-[#120D0A] border border-[#5A2C1E] rounded-xl p-4 shadow-brown relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 relative z-10">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#3D1A12] border border-[#703020] text-[#FF8F66] mt-0.5">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E86A38] text-[#0F0B09] uppercase tracking-wider">
                  AI HAZARD DETECTION
                </span>
                <span className="text-xs font-mono text-[#FFAA7A]">
                  Anomaly Metric: <b>{primary.metricName}</b> (Z-Score: +{primary.zScore}σ)
                </span>
                <span className="text-[10px] text-[#A67E68] font-mono hidden sm:inline">
                  Detected at {primary.timestamp}
                </span>
              </div>
              <h3 className="text-sm font-bold font-serif text-[#FFF5EE] mt-1.5">
                {primary.title}
              </h3>
              <p className="text-xs text-[#D6B49F] mt-1 max-w-4xl leading-relaxed">
                <span className="text-[#FFAA7A] font-mono font-semibold">AI Rationale: </span>
                {primary.aiRationale}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end lg:self-center">
            <button
              onClick={() => setSelectedAnomaly(selectedAnomaly?.id === primary.id ? null : primary)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-[#221813] hover:bg-[#2C201A] text-[#FFE0CC] border border-[#443026] transition flex items-center gap-1.5"
            >
              <span>{selectedAnomaly?.id === primary.id ? 'Hide Protocols' : 'Review Interventions'}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedAnomaly?.id === primary.id ? 'rotate-90' : ''}`} />
            </button>

            <button
              onClick={() => mitigateAnomaly(primary.id)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#FFAA7A] hover:bg-[#FFB88E] text-[#0F0B09] shadow-peach transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Authorize Protocol</span>
            </button>
          </div>
        </div>

        {/* Expandable Recommended Intervention Steps */}
        {selectedAnomaly?.id === primary.id && (
          <div className="mt-3.5 pt-3.5 border-t border-[#33251E] grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {primary.recommendedInterventions.map((step, idx) => (
              <div
                key={idx}
                className="bg-[#140F0D] border border-[#33251E] p-2.5 rounded-lg flex items-start gap-2.5 text-xs"
              >
                <div className="w-5 h-5 rounded-full bg-[#2A1E18] text-[#FFAA7A] border border-[#543C30] flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="text-[#D6B49F] text-[11px] leading-snug">
                  {step}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Secondary Alerts */}
      {activeAnomalies.length > 1 && (
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <span className="text-[#A67E68] py-1">Additional alerts:</span>
          {activeAnomalies.slice(1).map((a) => (
            <div
              key={a.id}
              className="px-2.5 py-1 rounded-lg bg-[#140F0D] border border-[#2C201A] flex items-center gap-2 text-[#D6B49F]"
            >
              <span className="w-2 h-2 rounded-full bg-[#FFAA7A]" />
              <span className="truncate max-w-[220px]">{a.title}</span>
              <button
                onClick={() => mitigateAnomaly(a.id)}
                className="text-xs text-[#FFAA7A] hover:underline font-sans ml-1"
              >
                Mitigate
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
