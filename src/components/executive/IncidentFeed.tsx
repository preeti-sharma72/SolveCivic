'use client';

import React, { useState } from 'react';
import { useCityPulse } from '@/lib/context/CityPulseContext';
import { CivicIncident, IncidentSeverity } from '@/lib/types/civic';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
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
    <div className="bg-[#140F0D] border border-[#2C201A] rounded-2xl p-4 shadow-brown flex flex-col h-full">
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#241A15]">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#FFAA7A]" />
          <h3 className="text-sm font-serif font-bold text-[#FFF5EE] uppercase tracking-wider">
            Active Incident Feed
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#221813] text-[#FFAA7A] border border-[#3D2C24]">
            {filteredIncidents.length}
          </span>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1 text-xs font-mono">
          <Filter className="w-3 h-3 text-[#A67E68] mr-1" />
          {(['all', 'critical', 'high', 'medium'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2 py-0.5 rounded text-[11px] uppercase transition ${
                filterSeverity === sev
                  ? 'bg-[#FFAA7A] text-[#0F0B09] font-bold'
                  : 'text-[#B88E77] hover:text-[#FFF5EE]'
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
          <div className="text-center py-12 text-[#8C6D5D] font-mono text-xs">
            No incidents matching current sector and filters.
          </div>
        ) : (
          filteredIncidents.map((inc: CivicIncident) => {
            const isResolved = inc.status === 'resolved';
            const isCritical = inc.severity === 'critical';

            let vectorBadgeColor = 'bg-[#221813] text-[#FFAA7A] border-[#443026]';
            if (inc.vector === 'environment') vectorBadgeColor = 'bg-[#221813] text-[#FFD2B8] border-[#443026]';
            if (inc.vector === 'infrastructure') vectorBadgeColor = 'bg-[#221813] text-[#D6B49F] border-[#443026]';
            if (inc.vector === 'sentiment') vectorBadgeColor = 'bg-[#2A150F] text-[#E86A38] border-[#703020]';

            return (
              <div
                key={inc.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isResolved
                    ? 'bg-[#0E0B09] border-[#221813] opacity-60'
                    : isCritical
                    ? 'bg-gradient-to-r from-[#24130E] to-[#150F0D] border-[#5A2C1E]'
                    : 'bg-[#17110E] border-[#2C201A] hover:border-[#443026]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-[#A67E68]">
                      {inc.id}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono uppercase font-bold border ${vectorBadgeColor}`}>
                      {inc.vector}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-mono uppercase font-bold ${
                        inc.severity === 'critical'
                          ? 'bg-[#2E140D] text-[#FF8F66] border border-[#703020]'
                          : inc.severity === 'high'
                          ? 'bg-[#261A14] text-[#FFAA7A] border border-[#543C30]'
                          : 'bg-[#1E1612] text-[#D6B49F]'
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </div>

                  <span className="text-[11px] text-[#A67E68] font-mono flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" />
                    {inc.timestamp}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#FFF5EE] mt-1.5 leading-snug">
                  {inc.title}
                </h4>

                <p className="text-xs text-[#D6B49F] mt-1 leading-relaxed">
                  {inc.description}
                </p>

                <div className="mt-3 pt-2.5 border-t border-[#241A15] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-1 text-[#B88E77]">
                    <MapPin className="w-3.5 h-3.5 text-[#FFAA7A]" />
                    <span>{inc.district}</span>
                  </div>

                  {inc.assignedUnit && (
                    <div className="flex items-center gap-1 text-[#D6B49F]">
                      <Truck className="w-3.5 h-3.5 text-[#FFAA7A]" />
                      <span>{inc.assignedUnit}</span>
                    </div>
                  )}

                  {!isResolved ? (
                    <button
                      onClick={() => resolveIncident(inc.id)}
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#221813] hover:bg-[#2C201A] text-[#FFAA7A] border border-[#443026] transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-[#FFAA7A]" />
                      <span>Mark Resolved</span>
                    </button>
                  ) : (
                    <span className="text-[#FFAA7A] text-[11px] font-bold">Resolved</span>
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
