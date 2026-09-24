'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useCityPulse } from '@/lib/context/CityPulseContext';
import { CivicVectorType } from '@/lib/types/civic';
import { RotateCcw } from 'lucide-react';

const LeafletMapInner = dynamic(() => import('./LeafletMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[460px] bg-[#0E0B09] flex flex-col items-center justify-center border border-[#2C201A] rounded-xl text-[#B88E77] gap-3">
      <div className="w-10 h-10 border-4 border-[#543C30] border-t-[#FFAA7A] rounded-full animate-spin" />
      <p className="text-xs font-mono tracking-widest text-[#FFE0CC]">CALIBRATING CIVIC GIS TELEMETRY...</p>
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
      label: 'Sentiment / 311',
      icon: '📢',
      count: citizenReports.length,
    },
  ];

  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col rounded-2xl overflow-hidden border border-[#2C201A] bg-[#0E0B09] shadow-2xl">
      {/* Top Map HUD Bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Vector Filters (Peach & Espresso) */}
        <div className="flex items-center gap-1.5 p-1 bg-[#140F0D]/95 backdrop-blur-md border border-[#3D2C24] rounded-xl shadow-xl pointer-events-auto">
          {vectorButtons.map((btn) => {
            const isActive = selectedVector === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setSelectedVector(btn.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#FFAA7A] text-[#0F0B09] font-bold shadow-peach'
                    : 'text-[#D6B49F] hover:text-[#FFF5EE] hover:bg-[#251B16]'
                }`}
              >
                <span>{btn.icon}</span>
                <span>{btn.label}</span>
                {btn.count !== undefined && btn.count > 0 && (
                  <span
                    className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? 'bg-[#0F0B09]/20 text-[#0F0B09]' : 'bg-[#291E18] text-[#FFAA7A]'
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
            className="bg-[#140F0D]/95 text-[#FFF5EE] border border-[#3D2C24] rounded-xl px-3 py-1.5 text-xs font-mono backdrop-blur-md focus:outline-none focus:border-[#FFAA7A] shadow-xl cursor-pointer"
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
              className="p-1.5 bg-[#140F0D]/95 border border-[#3D2C24] rounded-xl text-[#B88E77] hover:text-[#FFF5EE] hover:bg-[#251B16] backdrop-blur-md transition shadow-xl"
              title="Reset district focus"
            >
              <RotateCcw className="w-4 h-4 text-[#FFAA7A]" />
            </button>
          )}
        </div>
      </div>

      {/* Map Canvas */}
      <div className="w-full h-full flex-1">
        <LeafletMapInner />
      </div>

      {/* Bottom Map Legend and Telemetry HUD */}
      <div className="absolute bottom-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Incident Summary Badge */}
        <div className="flex items-center gap-3 px-3 py-2 bg-[#140F0D]/95 backdrop-blur-md border border-[#33251E] rounded-xl shadow-xl pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFAA7A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFAA7A]"></span>
            </span>
            <span className="text-xs font-mono text-[#D6B49F]">
              Active Incidents: <span className="font-bold text-[#FFF5EE]">{incidents.filter((i) => i.status !== 'resolved').length}</span>
            </span>
          </div>

          <div className="h-3 w-[1px] bg-[#33251E]" />

          <div className="text-xs font-mono text-[#D6B49F]">
            Citizen Flags: <span className="font-bold text-[#FFAA7A]">{citizenReports.length}</span>
          </div>

          {selectedDistrict && (
            <>
              <div className="h-3 w-[1px] bg-[#33251E]" />
              <div className="text-xs font-mono text-[#FFAA7A]">
                Focused: <span className="font-bold text-[#FFF5EE]">{selectedDistrict.name}</span>
              </div>
            </>
          )}
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 px-3 py-2 bg-[#140F0D]/95 backdrop-blur-md border border-[#33251E] rounded-xl shadow-xl text-[11px] text-[#B88E77] pointer-events-auto font-mono">
          <span className="font-medium text-[#FFF5EE]">Legend:</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFAA7A] inline-block" /> Health &gt;80
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D6B49F] inline-block" /> Health 70-80
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E86A38] inline-block" /> Warning &lt;70
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full border border-[#FFAA7A] inline-block bg-[#1A1310]" /> Citizen 311
          </span>
        </div>
      </div>
    </div>
  );
}
