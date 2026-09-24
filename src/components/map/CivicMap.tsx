'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useCityPulse } from '@/lib/context/CityPulseContext';
import { CivicVectorType } from '@/lib/types/civic';
import { Layers, ShieldAlert, Sparkles, Navigation, RotateCcw } from 'lucide-react';

const LeafletMapInner = dynamic(() => import('./LeafletMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[460px] bg-slate-950 flex flex-col items-center justify-center border border-slate-800 rounded-xl text-slate-400 gap-3">
      <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
      <p className="text-sm font-mono tracking-wide text-slate-300">CALIBRATING GEOSPATIAL CIVIC TELEMETRY...</p>
    </div>
  ),
});

export default function CivicMap() {
  const {
    city,
    selectedVector,
    setSelectedVector,
    selectedDistrict,
    setSelectedDistrict,
    incidents,
    citizenReports,
  } = useCityPulse();

  const vectorButtons: { id: CivicVectorType | 'all'; label: string; icon: string; count?: number }[] = [
    { id: 'all', label: 'All Vectors', icon: '🌐' },
    {
      id: 'mobility',
      label: 'Mobility',
      icon: '🚗',
      count: incidents.filter((i) => i.vector === 'mobility' && i.status !== 'resolved').length,
    },
    {
      id: 'environment',
      label: 'Environment',
      icon: '🍃',
      count: incidents.filter((i) => i.vector === 'environment' && i.status !== 'resolved').length,
    },
    {
      id: 'infrastructure',
      label: 'Infrastructure',
      icon: '⚡',
      count: incidents.filter((i) => i.vector === 'infrastructure' && i.status !== 'resolved').length,
    },
    {
      id: 'sentiment',
      label: 'Sentiment / Reports',
      icon: '📢',
      count: citizenReports.length,
    },
  ];

  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Top Map HUD Bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Vector Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-xl pointer-events-auto">
          {vectorButtons.map((btn) => {
            const isActive = selectedVector === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setSelectedVector(btn.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>{btn.icon}</span>
                <span>{btn.label}</span>
                {btn.count !== undefined && btn.count > 0 && (
                  <span
                    className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-cyan-300'
                    }`}
                  >
                    {btn.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* District Quick Filter & Reset */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <select
            value={selectedDistrict?.id || ''}
            onChange={(e) => {
              const dist = city.districts.find((d) => d.id === e.target.value) || null;
              setSelectedDistrict(dist);
            }}
            className="bg-slate-900/90 text-slate-200 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-mono backdrop-blur-md focus:outline-none focus:border-cyan-500 shadow-xl cursor-pointer"
          >
            <option value="">All Metro Sectors ({city.districts.length})</option>
            {city.districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.code}) - {d.healthScore}% Health
              </option>
            ))}
          </select>

          {selectedDistrict && (
            <button
              onClick={() => setSelectedDistrict(null)}
              className="p-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 backdrop-blur-md transition shadow-xl"
              title="Reset district focus"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
            </button>
          )}
        </div>
      </div>

      {/* Actual Interactive Map Container */}
      <div className="w-full h-full flex-1">
        <LeafletMapInner />
      </div>

      {/* Bottom Map Legend and Telemetry HUD */}
      <div className="absolute bottom-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Active Incident Summary Badge */}
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl shadow-xl pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span className="text-xs font-mono text-slate-300">
              Active Incidents: <span className="font-bold text-white">{incidents.filter((i) => i.status !== 'resolved').length}</span>
            </span>
          </div>

          <div className="h-3 w-[1px] bg-slate-700" />

          <div className="text-xs font-mono text-slate-300">
            Citizen Flags: <span className="font-bold text-amber-400">{citizenReports.length}</span>
          </div>

          {selectedDistrict && (
            <>
              <div className="h-3 w-[1px] bg-slate-700" />
              <div className="text-xs font-mono text-cyan-400">
                Focused: <span className="font-bold text-white">{selectedDistrict.name}</span>
              </div>
            </>
          )}
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 px-3 py-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl shadow-xl text-[11px] text-slate-400 pointer-events-auto">
          <span className="font-medium text-slate-200">Legend:</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Health &gt;80
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Health 70-80
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Warning &lt;70
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full border border-amber-400 inline-block bg-slate-900" /> Citizen 311
          </span>
        </div>
      </div>
    </div>
  );
}
