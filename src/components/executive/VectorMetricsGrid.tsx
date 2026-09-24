'use client';

import React from 'react';
import { useCityPulse } from '@/lib/context/CityPulseContext';
import { MetricHistoryPoint } from '@/lib/types/civic';
import {
  Car,
  Wind,
  Zap,
  Smile,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Clock,
  Volume2,
  Droplet,
  MessageSquareWarning,
} from 'lucide-react';

function Sparkline({ data, color }: { data: MetricHistoryPoint[]; color: string }) {
  if (!data || data.length < 2) return null;

  const width = 120;
  const height = 32;
  const padding = 2;

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
      const y = height - padding - ((d.value - min) / range) * (height - padding * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg className="w-full h-8 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export default function VectorMetricsGrid() {
  const { vectors, setSelectedVector, selectedVector } = useCityPulse();
  const { mobility, environment, infrastructure, sentiment } = vectors;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* 1. MOBILITY & TRAFFIC */}
      <div
        onClick={() => setSelectedVector(selectedVector === 'mobility' ? 'all' : 'mobility')}
        className={`bg-slate-900/90 border rounded-2xl p-4 shadow-xl cursor-pointer transition-all hover:border-cyan-500/80 ${
          selectedVector === 'mobility'
            ? 'border-cyan-500 ring-1 ring-cyan-500/40 bg-slate-900'
            : 'border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Mobility & Traffic
              </h4>
              <span className="text-[10px] text-cyan-400 font-mono">Arterial Telemetry</span>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            {mobility.activeBottlenecks} Bottlenecks
          </span>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-black font-mono text-white tracking-tight">
              {mobility.congestionIndex}%
            </div>
            <div className="text-[11px] text-slate-400 font-mono">Congestion Index</div>
          </div>
          <div className="w-28">
            <Sparkline data={mobility.history} color="#38BDF8" />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
          <div>
            <span className="text-slate-400 text-[11px] block">Avg Transit Delay</span>
            <span className="text-white font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              +{mobility.avgTransitDelayMins.toFixed(1)} mins
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">On-Time Rate</span>
            <span className="text-emerald-400 font-semibold">{mobility.transitOnTimeRate}%</span>
          </div>
        </div>
      </div>

      {/* 2. ENVIRONMENT & AIR QUALITY */}
      <div
        onClick={() => setSelectedVector(selectedVector === 'environment' ? 'all' : 'environment')}
        className={`bg-slate-900/90 border rounded-2xl p-4 shadow-xl cursor-pointer transition-all hover:border-emerald-500/80 ${
          selectedVector === 'environment'
            ? 'border-emerald-500 ring-1 ring-emerald-500/40 bg-slate-900'
            : 'border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Environment & Air
              </h4>
              <span className="text-[10px] text-emerald-400 font-mono">Sensor Cluster</span>
            </div>
          </div>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded ${
              environment.aqi <= 50
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-amber-950 text-amber-300 border border-amber-800'
            }`}
          >
            {environment.aqiCategory}
          </span>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-black font-mono text-white tracking-tight">
              {Math.round(environment.aqi)}
              <span className="text-xs font-normal text-slate-400 ml-1">AQI</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">PM2.5: {environment.pm25} µg/m³</div>
          </div>
          <div className="w-28">
            <Sparkline data={environment.history} color="#10B981" />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
          <div>
            <span className="text-slate-400 text-[11px] block">Ambient Sound</span>
            <span className="text-white font-semibold flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-emerald-400" />
              {environment.noiseDb.toFixed(1)} dB
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Atmospheric</span>
            <span className="text-white font-semibold">
              {environment.temperatureC}°C • {environment.humidityPercent}% RH
            </span>
          </div>
        </div>
      </div>

      {/* 3. PUBLIC INFRASTRUCTURE & SAFETY */}
      <div
        onClick={() => setSelectedVector(selectedVector === 'infrastructure' ? 'all' : 'infrastructure')}
        className={`bg-slate-900/90 border rounded-2xl p-4 shadow-xl cursor-pointer transition-all hover:border-violet-500/80 ${
          selectedVector === 'infrastructure'
            ? 'border-violet-500 ring-1 ring-violet-500/40 bg-slate-900'
            : 'border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Infrastructure
              </h4>
              <span className="text-[10px] text-violet-400 font-mono">Grid & Utilities</span>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            {infrastructure.gridStabilityPercent}% Grid
          </span>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-black font-mono text-white tracking-tight">
              {infrastructure.waterOutageCount + infrastructure.powerOutageCount}
              <span className="text-xs font-normal text-slate-400 ml-1">Outages</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {infrastructure.waterOutageCount} Water • {infrastructure.powerOutageCount} Power
            </div>
          </div>
          <div className="w-28">
            <Sparkline data={infrastructure.history} color="#8B5CF6" />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
          <div>
            <span className="text-slate-400 text-[11px] block">Emergency Response</span>
            <span className="text-emerald-400 font-semibold">
              {infrastructure.avgEmergencyResponseMins.toFixed(1)} mins
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Hospital Capacity</span>
            <span className="text-white font-semibold">{infrastructure.hospitalBedCapacityPercent}%</span>
          </div>
        </div>
      </div>

      {/* 4. CIVIC SENTIMENT & CITIZEN LOGS */}
      <div
        onClick={() => setSelectedVector(selectedVector === 'sentiment' ? 'all' : 'sentiment')}
        className={`bg-slate-900/90 border rounded-2xl p-4 shadow-xl cursor-pointer transition-all hover:border-amber-500/80 ${
          selectedVector === 'sentiment'
            ? 'border-amber-500 ring-1 ring-amber-500/40 bg-slate-900'
            : 'border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Smile className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Civic Sentiment
              </h4>
              <span className="text-[10px] text-amber-400 font-mono">311 NLP Ingestion</span>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            {sentiment.dailyReportVolume} Logs/24h
          </span>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-black font-mono text-white tracking-tight">
              {sentiment.overallScore}
              <span className="text-xs font-normal text-slate-400 ml-1">/100</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">{sentiment.sentimentLabel}</div>
          </div>
          <div className="w-28">
            <Sparkline data={sentiment.history} color="#F59E0B" />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
          <div>
            <span className="text-slate-400 text-[11px] block">Citizen Polarity</span>
            <span className="text-emerald-400 font-semibold">{sentiment.positiveRatio}% Pos</span>
            <span className="text-rose-400 font-semibold ml-1">/{sentiment.negativeRatio}% Neg</span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Top Hotspot</span>
            <span className="text-slate-200 font-medium truncate block" title={sentiment.topConcern}>
              {sentiment.topConcern}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
