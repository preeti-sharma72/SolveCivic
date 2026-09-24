'use client';

import React, { useState } from 'react';
import { useCityPulse } from '@/lib/context/CityPulseContext';
import { AnomalyAlert } from '@/lib/types/civic';
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowRight,
} from 'lucide-react';

export default function AnomalyAlertBanner() {
  const { anomalies, mitigateAnomaly } = useCityPulse();
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyAlert | null>(null);

  const activeAnomalies = anomalies.filter((a) => a.status === 'active');

  if (activeAnomalies.length === 0) {
    return (
      <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-emerald-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>PREDICTIVE AI ENGINE: Multi-vector telemetry within nominal statistical baselines (Z &lt; 2.0).</span>
        </div>
        <span className="text-[11px] text-emerald-500/80">Continuous Fourier & Z-score monitoring active</span>
      </div>
    );
  }

  const primary = activeAnomalies[0];

  return (
    <div className="space-y-2">
      {/* Alert Header Banner */}
      <div className="bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-950 border border-rose-800/60 rounded-xl p-3.5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full bg-rose-500/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 relative z-10">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 mt-0.5 animate-pulse">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500 text-slate-950 uppercase tracking-wider">
                  AI HAZARD DETECTION
                </span>
                <span className="text-xs font-mono text-rose-300">
                  Anomaly Metric: <b>{primary.metricName}</b> (Z-Score: +{primary.zScore}σ)
                </span>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                  Detected at {primary.timestamp}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-1">
                {primary.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-4xl leading-relaxed">
                <span className="text-rose-400 font-mono font-semibold">AI Rationale: </span>
                {primary.aiRationale}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end lg:self-center">
            <button
              onClick={() => setSelectedAnomaly(selectedAnomaly?.id === primary.id ? null : primary)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5"
            >
              <span>{selectedAnomaly?.id === primary.id ? 'Hide Protocols' : 'Review Interventions'}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedAnomaly?.id === primary.id ? 'rotate-90' : ''}`} />
            </button>

            <button
              onClick={() => mitigateAnomaly(primary.id)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Authorize Protocol</span>
            </button>
          </div>
        </div>

        {/* Expandable Recommended Intervention Steps */}
        {selectedAnomaly?.id === primary.id && (
          <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {primary.recommendedInterventions.map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg flex items-start gap-2 text-xs"
              >
                <div className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/80 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="text-slate-300 text-[11px] leading-snug">
                  {step}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Secondary active anomalies if multiple */}
      {activeAnomalies.length > 1 && (
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <span className="text-slate-400 py-1">Additional alerts:</span>
          {activeAnomalies.slice(1).map((a) => (
            <div
              key={a.id}
              className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2 text-slate-300"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="truncate max-w-[220px]">{a.title}</span>
              <button
                onClick={() => mitigateAnomaly(a.id)}
                className="text-xs text-emerald-400 hover:text-emerald-300 underline font-sans ml-1"
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
