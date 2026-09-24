'use client';

import React from 'react';
import { useCityPulse } from '@/lib/context/CityPulseContext';
import { Activity, ShieldCheck, AlertCircle, AlertTriangle } from 'lucide-react';

export default function MetricGauge() {
  const { healthIndex } = useCityPulse();
  const { score, status, vectorScores } = healthIndex;

  const radius = 64;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#FFAA7A'; // Peach
  let statusBadgeBg = 'bg-[#241712] text-[#FFAA7A] border-[#543C30]';
  let StatusIcon = ShieldCheck;

  if (score < 60) {
    strokeColor = '#E86A38'; // Terracotta
    statusBadgeBg = 'bg-[#2E140D] text-[#FF8F66] border-[#703020]';
    StatusIcon = AlertCircle;
  } else if (score < 75) {
    strokeColor = '#D6B49F'; // Warm Tan
    statusBadgeBg = 'bg-[#241A14] text-[#FFE0CC] border-[#4D362C]';
    StatusIcon = AlertTriangle;
  }

  return (
    <div className="bg-[#140F0D] border border-[#2C201A] rounded-2xl p-5 shadow-brown flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#FFAA7A]" />
          <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#D6B49F]">
            Civic Health Index
          </span>
        </div>
        <div className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border flex items-center gap-1.5 ${statusBadgeBg}`}>
          <StatusIcon className="w-3 h-3" />
          <span>{status.toUpperCase()}</span>
        </div>
      </div>

      {/* Main Semi-Circle Gauge */}
      <div className="relative flex flex-col items-center justify-center my-3">
        <svg className="w-44 h-24 overflow-visible" viewBox="0 0 160 85">
          {/* Background Track */}
          <path
            d="M 16 80 A 64 64 0 0 1 144 80"
            fill="none"
            stroke="#261C17"
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
          <div className="text-3xl font-black tracking-tight text-[#FFF5EE] font-serif">
            {score}
            <span className="text-sm font-normal text-[#B88E77]">/100</span>
          </div>
          <div className="text-[10px] font-mono text-[#A67E68] tracking-widest uppercase">
            COMPOSITE SCORE
          </div>
        </div>
      </div>

      {/* 4 Vector Micro Bars */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#241A15] text-xs font-mono">
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-[#B88E77]">🚗 Mobility</span>
            <span className="text-[#FFF5EE] font-bold">{vectorScores.mobility}%</span>
          </div>
          <div className="w-full bg-[#241A15] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#FFAA7A] h-full rounded-full transition-all duration-500"
              style={{ width: `${vectorScores.mobility}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-[#B88E77]">🍃 Environment</span>
            <span className="text-[#FFF5EE] font-bold">{vectorScores.environment}%</span>
          </div>
          <div className="w-full bg-[#241A15] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#FFD2B8] h-full rounded-full transition-all duration-500"
              style={{ width: `${vectorScores.environment}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-[#B88E77]">⚡ Infra</span>
            <span className="text-[#FFF5EE] font-bold">{vectorScores.infrastructure}%</span>
          </div>
          <div className="w-full bg-[#241A15] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#D6B49F] h-full rounded-full transition-all duration-500"
              style={{ width: `${vectorScores.infrastructure}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-[#B88E77]">📢 Sentiment</span>
            <span className="text-[#FFF5EE] font-bold">{vectorScores.sentiment}%</span>
          </div>
          <div className="w-full bg-[#241A15] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#E86A38] h-full rounded-full transition-all duration-500"
              style={{ width: `${vectorScores.sentiment}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
