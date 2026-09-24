'use client';

import React, { useState } from 'react';
import { useCityPulse } from '@/lib/context/CityPulseContext';
import CivicMap from '../map/CivicMap';
import ReportIssueModal from './ReportIssueModal';
import {
  Wind,
  ShieldCheck,
  Car,
  ThumbsUp,
  MapPin,
  PlusCircle,
  Heart,
  Navigation,
} from 'lucide-react';
import { CitizenReport } from '@/lib/types/civic';

export default function CitizenPortal() {
  const {
    city,
    vectors,
    incidents,
    citizenReports,
    upvoteReport,
    selectedDistrict,
    setSelectedDistrict,
  } = useCityPulse();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const activeDistrict = selectedDistrict || city.districts[0];
  const { environment, mobility } = vectors;

  const visibleReports = citizenReports.filter((r) =>
    selectedDistrict ? r.district === selectedDistrict.name : true
  );

  const roadNotices = incidents.filter(
    (i) => i.vector === 'mobility' && i.status !== 'resolved'
  );

  return (
    <div className="space-y-6">
      {/* Citizen Welcome Banner (Peach, Brown, Noir) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#241712] via-[#1A120E] to-[#120D0A] border border-[#4D362C] rounded-3xl p-6 lg:p-8 shadow-brown">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#2A1B14] text-[#FFAA7A] border border-[#543C30]">
              <Heart className="w-3.5 h-3.5 text-[#FFAA7A] fill-[#FFAA7A]" />
              <span className="font-mono uppercase text-[10px] tracking-wider">Citizen Transparency Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#FFF5EE] tracking-tight">
              Live Civic Health & Neighborhood Pulse
            </h1>
            <p className="text-sm text-[#D6B49F] leading-relaxed">
              Transparent, real-time public data on local air quality, road conditions, and municipal services across {city.name}. Report issues directly to city operations teams.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-[#FFAA7A] hover:bg-[#FFB88E] text-[#0F0B09] font-serif font-bold text-sm shadow-peach transition flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-[#0F0B09]" />
              <span>Report an Issue</span>
            </button>
          </div>
        </div>
      </div>

      {/* Neighborhood Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#140F0D] border border-[#2C201A] rounded-2xl shadow-brown">
        <div className="flex items-center gap-2 text-xs font-mono text-[#D6B49F]">
          <Navigation className="w-4 h-4 text-[#FFAA7A]" />
          <span>Viewing Neighborhood:</span>
          <span className="font-bold text-[#FFF5EE] text-sm font-serif">{activeDistrict.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-[#A67E68] hidden sm:inline">Switch Area:</label>
          <select
            value={selectedDistrict?.id || ''}
            onChange={(e) => {
              const d = city.districts.find((dist) => dist.id === e.target.value) || null;
              setSelectedDistrict(d);
            }}
            className="bg-[#0E0B09] text-[#FFF5EE] border border-[#33251E] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#FFAA7A]"
          >
            <option value="">All Metro Neighborhoods</option>
            {city.districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Public Advisory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Air Quality Advisory Card */}
        <div className="bg-[#140F0D] border border-[#2C201A] rounded-2xl p-5 shadow-brown flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#FFAA7A] font-serif font-semibold text-xs uppercase tracking-wider">
              <Wind className="w-4 h-4" />
              <span>Air Quality Index</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold font-mono border ${
                environment.aqi <= 50
                  ? 'bg-[#221813] text-[#FFAA7A] border-[#443026]'
                  : 'bg-[#2A150F] text-[#FF8F66] border-[#703020]'
              }`}
            >
              {environment.aqiCategory}
            </span>
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black font-serif text-[#FFF5EE]">{Math.round(environment.aqi)}</span>
              <span className="text-xs text-[#A67E68] font-mono">AQI (PM2.5: {environment.pm25} µg/m³)</span>
            </div>
            <p className="text-xs text-[#D6B49F] mt-2 leading-relaxed">
              {environment.aqi <= 50
                ? 'Ideal conditions for outdoor walks and recreation. Clean atmospheric flow.'
                : 'Air quality is moderate; however, sensitive groups should limit prolonged outdoor exertion.'}
            </p>
          </div>

          <div className="pt-3 border-t border-[#241A15] text-[11px] font-mono text-[#A67E68] flex justify-between">
            <span>Temp: {environment.temperatureC}°C</span>
            <span>Humidity: {environment.humidityPercent}%</span>
            <span>Noise: {environment.noiseDb.toFixed(1)} dB</span>
          </div>
        </div>

        {/* 2. Road Closures & Transit Advisories */}
        <div className="bg-[#140F0D] border border-[#2C201A] rounded-2xl p-5 shadow-brown flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#FFAA7A] font-serif font-semibold text-xs uppercase tracking-wider">
              <Car className="w-4 h-4" />
              <span>Roads & Transit</span>
            </div>
            <span className="text-xs font-mono text-[#A67E68]">
              Delay: +{mobility.avgTransitDelayMins.toFixed(1)}m
            </span>
          </div>

          <div className="my-3 space-y-2 overflow-y-auto max-h-[110px] custom-scrollbar">
            {roadNotices.length === 0 ? (
              <p className="text-xs text-[#A67E68]">No major road closures in this sector.</p>
            ) : (
              roadNotices.slice(0, 2).map((notice) => (
                <div key={notice.id} className="p-2.5 rounded-lg bg-[#0E0B09] border border-[#241A15] text-xs">
                  <div className="font-semibold text-[#FFF5EE] flex items-center gap-1.5">
                    <span className="text-[#FFAA7A]">⚠️</span>
                    <span className="truncate">{notice.title}</span>
                  </div>
                  <div className="text-[11px] text-[#A67E68] mt-0.5 line-clamp-1">
                    {notice.impactMetrics}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-[#241A15] text-[11px] font-mono text-[#A67E68] flex justify-between">
            <span>Congestion: {mobility.congestionIndex}%</span>
            <span>On-Time: {mobility.transitOnTimeRate}%</span>
          </div>
        </div>

        {/* 3. Municipal Notice */}
        <div className="bg-[#140F0D] border border-[#2C201A] rounded-2xl p-5 shadow-brown flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#FFAA7A] font-serif font-semibold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Public Utilities Status</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#221813] text-[#FFAA7A] font-mono border border-[#443026]">
              311 / 911 NORMAL
            </span>
          </div>

          <div className="my-3 text-xs text-[#D6B49F] space-y-2">
            <div className="p-2.5 rounded-lg bg-[#0E0B09] border border-[#241A15]">
              <div className="font-bold text-[#FFF5EE]">💧 Potable Water Quality Certified</div>
              <p className="text-[11px] text-[#A67E68] mt-1">
                Reservoir tests confirm full compliance with state drinking standards.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#241A15] text-[11px] font-mono text-[#A67E68] flex justify-between">
            <span>Grid Reliability: {vectors.infrastructure.gridStabilityPercent}%</span>
            <span>Civic Hotline: 311</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Map for Citizens */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-serif font-bold text-[#FFF5EE] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#FFAA7A]" />
            <span>Interactive Neighborhood Map</span>
          </h2>
          <span className="text-xs text-[#A67E68] font-mono">
            Pins indicate verified citizen reports & ongoing public works
          </span>
        </div>
        <div className="h-[460px]">
          <CivicMap />
        </div>
      </div>

      {/* Verified Citizen Reports & Community Upvoting Feed */}
      <div className="bg-[#140F0D] border border-[#2C201A] rounded-2xl p-6 shadow-brown space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#241A15]">
          <div>
            <h3 className="text-base font-serif font-bold text-[#FFF5EE] flex items-center gap-2">
              <span>Community 311 Live Feed</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#221813] text-[#FFAA7A] border border-[#443026]">
                {visibleReports.length} Reports
              </span>
            </h3>
            <p className="text-xs text-[#A67E68] mt-0.5">
              Confirm existing issues with your upvote to escalate priority with municipal repair crews.
            </p>
          </div>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-4 py-2 bg-[#221813] hover:bg-[#2C201A] text-[#FFE0CC] rounded-xl text-xs font-medium transition border border-[#443026] flex items-center gap-1.5 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4 text-[#FFAA7A]" />
            <span>File New Report</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {visibleReports.map((report: CitizenReport) => (
            <div
              key={report.id}
              className="p-4 rounded-xl bg-[#0E0B09] border border-[#241A15] flex flex-col justify-between hover:border-[#443026] transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#261A14] text-[#FFAA7A] border border-[#543C30]">
                    {report.category}
                  </span>
                  <span className="text-[10px] text-[#A67E68] font-mono">{report.timestamp}</span>
                </div>

                <p className="text-xs font-medium text-[#FFF5EE] mt-2.5 line-clamp-3">
                  {report.description}
                </p>

                <div className="mt-3 text-[11px] text-[#A67E68] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FFAA7A] shrink-0" />
                  <span className="truncate">{report.address} ({report.district})</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1C1512] flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A1310] text-[#B88E77] border border-[#291E18]">
                  Status: {report.status.toUpperCase()}
                </span>

                <button
                  onClick={() => upvoteReport(report.id)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#221813] hover:bg-[#2C201A] text-[#FFAA7A] border border-[#443026] transition font-mono text-xs"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-[#FFAA7A]" />
                  <span>{report.upvotes} Confirm</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
