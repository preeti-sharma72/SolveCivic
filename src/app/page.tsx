'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import ExecutiveRoom from '@/components/executive/ExecutiveRoom';
import CitizenPortal from '@/components/citizen/CitizenPortal';
import { useCityPulse } from '@/lib/context/CityPulseContext';
import { Cpu, Globe2 } from 'lucide-react';

export default function Home() {
  const { viewMode, city } = useCityPulse();

  return (
    <div className="min-h-screen flex flex-col bg-[#090706] text-[#FFF5EE]">
      <Header />

      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 lg:px-8 py-6">
        {viewMode === 'executive' ? <ExecutiveRoom /> : <CitizenPortal />}
      </main>

      {/* Footer / Classic Editorial Metadata */}
      <footer className="border-t border-[#241A15] bg-[#0E0B09] py-6 mt-12 text-xs font-mono text-[#A67E68]">
        <div className="max-w-[1720px] mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-[#FFF5EE] tracking-wide">CityPulse Architecture v1.0</span>
            <span className="text-[#3D2C24]">•</span>
            <span className="text-[#FFAA7A]">Track B: Industry / Open Innovation</span>
            <span className="text-[#3D2C24] hidden sm:inline">•</span>
            <span className="text-[#A67E68] hidden sm:inline">{city.name} Municipal Grid</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#A67E68]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FFAA7A] inline-block animate-pulse" />
              <span>Multi-Vector Ingestion: 4 Streams</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#FFAA7A]" />
              <span>Z-Score Anomaly Detector: Nominal</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-[#D6B49F]" />
              <span>OpenStreetMap / Leaflet Engine</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
