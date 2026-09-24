'use client';

import React, { useState } from 'react';
import { useCityPulse } from '@/lib/context/CityPulseContext';
import CivicMap from '../map/CivicMap';
import ReportIssueModal from './ReportIssueModal';
import {
  Wind,
  ShieldCheck,
  AlertTriangle,
  Car,
  ThumbsUp,
  MapPin,
  PlusCircle,
  Clock,
  CheckCircle2,
  Droplets,
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

  // Filter citizen reports for the current view
  const visibleReports = citizenReports.filter((r) =>
    selectedDistrict ? r.district === selectedDistrict.name : true
  );

  // Active road closures & transit delays
  const roadNotices = incidents.filter(
    (i) => i.vector === 'mobility' && i.status !== 'resolved'
  );

  return (
    <div className="space-y-6">
      {/* Citizen Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/70 border border-emerald-800/40 rounded-3xl p-6 lg:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span>CityPulse Citizen Transparency Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Live Civic Health & Neighborhood Pulse
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Transparent, real-time public data on local air quality, active road closures, and municipal services across {city.name}. Report issues directly to city operations teams.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Report an Issue</span>
            </button>
          </div>
        </div>
      </div>

      {/* Neighborhood Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <Navigation className="w-4 h-4 text-cyan-400" />
          <span>Viewing Neighborhood:</span>
          <span className="font-bold text-white text-sm">{activeDistrict.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 hidden sm:inline">Switch Area:</label>
          <select
            value={selectedDistrict?.id || ''}
            onChange={(e) => {
              const d = city.districts.find((dist) => dist.id === e.target.value) || null;
              setSelectedDistrict(d);
            }}
            className="bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
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

      {/* Public Advisory Cards (AQI + Transit + Safety) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Air Quality Advisory Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
              <Wind className="w-4 h-4" />
              <span>Air Quality Index</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                environment.aqi <= 50
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}
            >
              {environment.aqiCategory}
            </span>
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">{Math.round(environment.aqi)}</span>
              <span className="text-xs text-slate-400">AQI (PM2.5: {environment.pm25} µg/m³)</span>
            </div>
            <p className="text-xs text-slate-300 mt-2">
              {environment.aqi <= 50
                ? '🟢 Ideal conditions for outdoor activities and jogging. Clean marine airflow.'
                : '🟡 Air quality is acceptable; however, sensitive groups should limit prolonged outdoor exertion.'}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
            <span>Temp: {environment.temperatureC}°C</span>
            <span>Humidity: {environment.humidityPercent}%</span>
            <span>Noise: {environment.noiseDb.toFixed(1)} dB</span>
          </div>
        </div>

        {/* 2. Road Closures & Transit Advisories */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
              <Car className="w-4 h-4" />
              <span>Roads & Transit</span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Avg Delay: +{mobility.avgTransitDelayMins.toFixed(1)}m
            </span>
          </div>

          <div className="my-3 space-y-2 overflow-y-auto max-h-[110px] custom-scrollbar">
            {roadNotices.length === 0 ? (
              <p className="text-xs text-slate-400">No major road closures in this sector.</p>
            ) : (
              roadNotices.slice(0, 2).map((notice) => (
                <div key={notice.id} className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-xs">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <span className="text-amber-400">⚠️</span>
                    <span className="truncate">{notice.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {notice.impactMetrics}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
            <span>Congestion: {mobility.congestionIndex}%</span>
            <span>On-Time: {mobility.transitOnTimeRate}%</span>
          </div>
        </div>

        {/* 3. Municipal Public Notice */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Civic Services Status</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950 text-emerald-300 font-mono">
              911 / 311 NORMAL
            </span>
          </div>

          <div className="my-3 text-xs text-slate-300 space-y-2">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <div className="font-bold text-white">💧 Drinking Water Safety Notice</div>
              <p className="text-[11px] text-slate-400 mt-1">
                City reservoir tests confirm 100% compliance with potable health standards.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
            <span>Grid Reliability: {vectors.infrastructure.gridStabilityPercent}%</span>
            <span>Hotline: 311</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Map for Citizens */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>Interactive Neighborhood Map</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Pins indicate verified citizen reports & public works projects
          </span>
        </div>
        <div className="h-[460px]">
          <CivicMap />
        </div>
      </div>

      {/* Verified Citizen Reports & Community Upvoting Feed */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Community 311 Live Feed</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                {visibleReports.length} Reports
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Confirm existing issues with your upvote to escalate repair priority with public works.
            </p>
          </div>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition border border-slate-700 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>File New Report</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {visibleReports.map((report: CitizenReport) => (
            <div
              key={report.id}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {report.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{report.timestamp}</span>
                </div>

                <p className="text-xs font-medium text-slate-200 mt-2 line-clamp-3">
                  {report.description}
                </p>

                <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{report.address} ({report.district})</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Status: {report.status.toUpperCase()}
                </span>

                <button
                  onClick={() => upvoteReport(report.id)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/80 transition font-mono text-xs"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{report.upvotes} Confirm</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Issue Reporting Modal */}
      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
