'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import ExecutiveRoom from '@/components/executive/ExecutiveRoom';
import CitizenPortal from '@/components/citizen/CitizenPortal';
import { useCityPulse } from '@/lib/context/CityPulseContext';
import { ShieldCheck, Cpu, Globe2, Sparkles } from 'lucide-react';

export default function Home() {
  const { viewMode, city } = useCityPulse();

  return (
    <div className="min-h-screen flex flex-col bg-[#080C14] text-slate-100">
      <Header />

      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 lg:px-6 py-5">
        {viewMode === 'executive' ? <ExecutiveRoom /> : <CitizenPortal />}
      </main>

      {/* Footer / Hackathon Metadata Banner */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 mt-12 text-xs font-mono text-slate-400">
        <div className="max-w-[1720px] mx-auto px-4 lg:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white tracking-wide">CityPulse Architecture v1.0</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400">Track B: Industry / Open Innovation</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">{city.name} Metro Grid</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>Multi-Vector Ingestion: 4 Streams</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Z-Score Anomaly Detector: Nominal</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>OpenStreetMap / Leaflet Engine</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
