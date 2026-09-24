'use client';

import React, { useState } from 'react';
import { useCityPulse } from '@/lib/context/CityPulseContext';
import { DistrictSummary } from '@/lib/types/civic';
import { Building2, Navigation, ArrowUpDown } from 'lucide-react';

export default function DistrictTable() {
  const { city, selectedDistrict, setSelectedDistrict } = useCityPulse();
  const [sortField, setSortField] = useState<'healthScore' | 'congestion' | 'aqi' | 'activeIssues'>('healthScore');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const sortedDistricts = [...city.districts].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    return sortAsc ? valA - valB : valB - valA;
  });

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Sector Health Breakdown
          </h3>
          <span className="text-xs font-mono text-slate-400">
            ({city.districts.length} Wards)
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Click any row to pinpoint on map
        </div>
      </div>

      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800/80">
              <th className="py-2.5 px-2 font-semibold">Sector / Ward</th>
              <th
                onClick={() => handleSort('healthScore')}
                className="py-2.5 px-2 font-semibold cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Health</span>
                  <ArrowUpDown className="w-3 h-3 text-cyan-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('aqi')}
                className="py-2.5 px-2 font-semibold cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>AQI</span>
                  <ArrowUpDown className="w-3 h-3 text-emerald-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('congestion')}
                className="py-2.5 px-2 font-semibold cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Congestion</span>
                  <ArrowUpDown className="w-3 h-3 text-cyan-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('activeIssues')}
                className="py-2.5 px-2 font-semibold cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Issues</span>
                  <ArrowUpDown className="w-3 h-3 text-rose-400" />
                </div>
              </th>
              <th className="py-2.5 px-2 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {sortedDistricts.map((dist: DistrictSummary) => {
              const isSelected = selectedDistrict?.id === dist.id;
              let scoreColor = 'text-emerald-400';
              if (dist.healthScore < 70) scoreColor = 'text-rose-400';
              else if (dist.healthScore < 80) scoreColor = 'text-amber-400';

              return (
                <tr
                  key={dist.id}
                  onClick={() => setSelectedDistrict(isSelected ? null : dist)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-cyan-950/40 text-cyan-200'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <td className="py-2.5 px-2">
                    <div className="font-bold text-white flex items-center gap-1.5 font-sans">
                      <span>{dist.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                        {dist.code}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">Pop: {dist.population}</div>
                  </td>

                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${scoreColor}`}>{dist.healthScore}%</span>
                      <div className="w-12 bg-slate-800 h-1 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-cyan-400 rounded-full"
                          style={{ width: `${dist.healthScore}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-2.5 px-2">
                    <span
                      className={`font-semibold ${
                        dist.aqi > 60 ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {dist.aqi}
                    </span>
                  </td>

                  <td className="py-2.5 px-2">
                    <span
                      className={`font-semibold ${
                        dist.congestion > 65 ? 'text-rose-400' : 'text-slate-200'
                      }`}
                    >
                      {dist.congestion}%
                    </span>
                  </td>

                  <td className="py-2.5 px-2">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-bold">
                      {dist.activeIssues}
                    </span>
                  </td>

                  <td className="py-2.5 px-2 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDistrict(isSelected ? null : dist);
                      }}
                      className={`px-2 py-1 rounded text-[10px] font-mono uppercase font-semibold transition ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-800 hover:bg-slate-700 text-cyan-400'
                      }`}
                    >
                      {isSelected ? 'Focused' : 'Locate'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
