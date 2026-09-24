'use client';

import React, { useState } from 'react';
import { useCityPulse } from '@/lib/context/CityPulseContext';
import { DistrictSummary } from '@/lib/types/civic';
import { Building2, ArrowUpDown } from 'lucide-react';

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
    <div className="bg-[#140F0D] border border-[#2C201A] rounded-2xl p-4 shadow-brown flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b border-[#241A15]">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#FFAA7A]" />
          <h3 className="text-sm font-serif font-bold text-[#FFF5EE] uppercase tracking-wider">
            Sector Health Breakdown
          </h3>
          <span className="text-xs font-mono text-[#A67E68]">
            ({city.districts.length} Wards)
          </span>
        </div>
        <div className="text-[11px] font-mono text-[#A67E68]">
          Click row to pinpoint
        </div>
      </div>

      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="text-[#A67E68] border-b border-[#241A15]">
              <th className="py-2.5 px-2 font-semibold">Sector / Ward</th>
              <th
                onClick={() => handleSort('healthScore')}
                className="py-2.5 px-2 font-semibold cursor-pointer hover:text-[#FFF5EE]"
              >
                <div className="flex items-center gap-1">
                  <span>Health</span>
                  <ArrowUpDown className="w-3 h-3 text-[#FFAA7A]" />
                </div>
              </th>
              <th
                onClick={() => handleSort('aqi')}
                className="py-2.5 px-2 font-semibold cursor-pointer hover:text-[#FFF5EE]"
              >
                <div className="flex items-center gap-1">
                  <span>AQI</span>
                  <ArrowUpDown className="w-3 h-3 text-[#FFD2B8]" />
                </div>
              </th>
              <th
                onClick={() => handleSort('congestion')}
                className="py-2.5 px-2 font-semibold cursor-pointer hover:text-[#FFF5EE]"
              >
                <div className="flex items-center gap-1">
                  <span>Congestion</span>
                  <ArrowUpDown className="w-3 h-3 text-[#FFAA7A]" />
                </div>
              </th>
              <th
                onClick={() => handleSort('activeIssues')}
                className="py-2.5 px-2 font-semibold cursor-pointer hover:text-[#FFF5EE]"
              >
                <div className="flex items-center gap-1">
                  <span>Issues</span>
                  <ArrowUpDown className="w-3 h-3 text-[#E86A38]" />
                </div>
              </th>
              <th className="py-2.5 px-2 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#201612]">
            {sortedDistricts.map((dist: DistrictSummary) => {
              const isSelected = selectedDistrict?.id === dist.id;
              let scoreColor = 'text-[#FFAA7A]';
              if (dist.healthScore < 70) scoreColor = 'text-[#E86A38]';
              else if (dist.healthScore < 80) scoreColor = 'text-[#D6B49F]';

              return (
                <tr
                  key={dist.id}
                  onClick={() => setSelectedDistrict(isSelected ? null : dist)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#221813] text-[#FFE0CC]'
                      : 'hover:bg-[#1A1310] text-[#D6B49F]'
                  }`}
                >
                  <td className="py-2.5 px-2">
                    <div className="font-bold text-[#FFF5EE] flex items-center gap-1.5 font-sans">
                      <span>{dist.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#201612] text-[#B88E77] border border-[#2C201A]">
                        {dist.code}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#A67E68] font-mono">Pop: {dist.population}</div>
                  </td>

                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${scoreColor}`}>{dist.healthScore}%</span>
                      <div className="w-12 bg-[#201612] h-1 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-[#FFAA7A] rounded-full"
                          style={{ width: `${dist.healthScore}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-2.5 px-2">
                    <span
                      className={`font-semibold ${
                        dist.aqi > 60 ? 'text-[#E86A38]' : 'text-[#FFAA7A]'
                      }`}
                    >
                      {dist.aqi}
                    </span>
                  </td>

                  <td className="py-2.5 px-2">
                    <span
                      className={`font-semibold ${
                        dist.congestion > 65 ? 'text-[#E86A38]' : 'text-[#FFF5EE]'
                      }`}
                    >
                      {dist.congestion}%
                    </span>
                  </td>

                  <td className="py-2.5 px-2">
                    <span className="px-1.5 py-0.5 rounded bg-[#201612] text-[#FFF5EE] font-bold border border-[#2C201A]">
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
                          ? 'bg-[#FFAA7A] text-[#0F0B09] font-bold'
                          : 'bg-[#221813] hover:bg-[#2C201A] text-[#FFAA7A] border border-[#3D2C24]'
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
