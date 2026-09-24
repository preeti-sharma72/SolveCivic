'use client';

import React from 'react';
import { useCityPulse } from '@/lib/context/CityPulseContext';
import { Activity, ShieldCheck, AlertCircle, AlertTriangle } from 'lucide-react';

export default function MetricGauge() {
  const { healthIndex } = useCityPulse();
  const { score, status, vectorScores } = healthIndex;

  // Gauge calculation for semi-circle SVG
  const radius = 64;
  const circumference = Math.PI * radius; // Semi-circle circumference
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#10B981'; // emerald
  let statusBadgeBg = 'bg-emerald-950 text-emerald-300 border-emerald-800';
  let StatusIcon = ShieldCheck;

  if (score < 60) {
    strokeColor = '#F43F5E'; // rose
    statusBadgeBg = 'bg-rose-950 text-rose-300 border-rose-800';
    StatusIcon = AlertCircle;
  } else if (score < 75) {
    strokeColor = '#F59E0B'; // amber
    statusBadgeBg = 'bg-amber-950 text-amber-300 border-amber-800';
    StatusIcon = AlertTriangle;
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Civic Health Index
          </span>
        </div>
        <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border flex items-center gap-1 ${statusBadgeBg}`}>
          <StatusIcon className="w-3 h-3" />
          <span>{status.toUpperCase()}</span>
        </div>
      </div>

      {/* Main Semi-Circle Gauge */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <svg className="w-44 h-24 overflow-visible" viewBox="0 0 160 85">
          {/* Background Track */}
          <path
            d="M 16 80 A 64 64 0 0 1 144 80"
            fill="none"
            stroke="#1E293B"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Active Meter */}
          <path
            d="M 16 80 A 64 64 0 0 1 144 80"
            fill="none"
            stroke={strokeColor}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Score Readout */}
        <div className="absolute bottom-0 text-center">
          <div className="text-3xl font-black tracking-tight text-white font-mono">
            {score}
            <span className="text-sm font-normal text-slate-400">/100</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 tracking-wide">COMPOSITE RATING</div>
        </div>
      </div>

      {/* 4 Vector Micro Bars */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs font-mono">
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-400">🚗 Mobility</span>
            <span className="text-white font-bold">{vectorScores.mobility}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${vectorScores.mobility}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-400">🍃 Environment</span>
            <span className="text-white font-bold">{vectorScores.environment}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${vectorScores.environment}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-400">⚡ Infra</span>
            <span className="text-white font-bold">{vectorScores.infrastructure}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-violet-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${vectorScores.infrastructure}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-400">📢 Sentiment</span>
            <span className="text-white font-bold">{vectorScores.sentiment}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${vectorScores.sentiment}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
