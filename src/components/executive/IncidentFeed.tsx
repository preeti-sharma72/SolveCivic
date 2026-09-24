'use client';

import React, { useState } from 'react';
import { useCityPulse } from '@/lib/context/CityPulseContext';
import { CivicIncident, IncidentSeverity } from '@/lib/types/civic';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  Shield,
  Truck,
  Filter,
} from 'lucide-react';

export default function IncidentFeed() {
  const { incidents, resolveIncident, selectedDistrict, selectedVector } = useCityPulse();
  const [filterSeverity, setFilterSeverity] = useState<IncidentSeverity | 'all'>('all');

  const filteredIncidents = incidents.filter((inc) => {
    if (filterSeverity !== 'all' && inc.severity !== filterSeverity) return false;
    if (selectedVector !== 'all' && inc.vector !== selectedVector) return false;
    if (selectedDistrict && inc.district !== selectedDistrict.name) return false;
    return true;
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col h-full">
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Active Incident Feed
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-cyan-300">
            {filteredIncidents.length}
          </span>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1 text-xs font-mono">
          <Filter className="w-3 h-3 text-slate-400 mr-1" />
          {(['all', 'critical', 'high', 'medium'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2 py-0.5 rounded text-[11px] uppercase transition ${
                filterSeverity === sev
                  ? 'bg-slate-800 text-white font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Incident List */}
      <div className="flex-1 overflow-y-auto space-y-3 mt-3 pr-1 max-h-[380px] custom-scrollbar">
        {filteredIncidents.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-mono text-xs">
            No incidents matching current sector and filters.
          </div>
        ) : (
          filteredIncidents.map((inc: CivicIncident) => {
            const isResolved = inc.status === 'resolved';
            const isCritical = inc.severity === 'critical';

            let vectorBadgeColor = 'bg-cyan-950 text-cyan-400 border-cyan-800';
            if (inc.vector === 'environment') vectorBadgeColor = 'bg-emerald-950 text-emerald-400 border-emerald-800';
            if (inc.vector === 'infrastructure') vectorBadgeColor = 'bg-violet-950 text-violet-400 border-violet-800';
            if (inc.vector === 'sentiment') vectorBadgeColor = 'bg-amber-950 text-amber-400 border-amber-800';

            return (
              <div
                key={inc.id}
                className={`p-3 rounded-xl border transition-all ${
                  isResolved
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    : isCritical
                    ? 'bg-gradient-to-r from-rose-950/40 to-slate-900 border-rose-900/80'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {inc.id}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono uppercase font-bold border ${vectorBadgeColor}`}>
                      {inc.vector}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-mono uppercase font-bold ${
                        inc.severity === 'critical'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : inc.severity === 'high'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" />
                    {inc.timestamp}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mt-1.5 leading-snug">
                  {inc.title}
                </h4>

                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {inc.description}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-800/70 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{inc.district}</span>
                  </div>

                  {inc.assignedUnit && (
                    <div className="flex items-center gap-1 text-slate-300">
                      <Truck className="w-3.5 h-3.5 text-amber-400" />
                      <span>{inc.assignedUnit}</span>
                    </div>
                  )}

                  {!isResolved ? (
                    <button
                      onClick={() => resolveIncident(inc.id)}
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Mark Resolved</span>
                    </button>
                  ) : (
                    <span className="text-emerald-400 text-[11px] font-bold">Resolved</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
