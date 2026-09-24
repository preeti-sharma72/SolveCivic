'use client';

import React from 'react';
import { useCityPulse } from '@/lib/context/CityPulseContext';
import { MetricHistoryPoint } from '@/lib/types/civic';
import {
  Car,
  Wind,
  Zap,
  Smile,
  Clock,
  Volume2,
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
        className={`bg-[#140F0D] border rounded-2xl p-4 shadow-brown cursor-pointer transition-all hover:border-[#FFAA7A]/70 ${
          selectedVector === 'mobility'
            ? 'border-[#FFAA7A] ring-1 ring-[#FFAA7A]/40'
            : 'border-[#2C201A]'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#261A14] text-[#FFAA7A] border border-[#443026]">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-[#D6B49F]">
                Mobility & Traffic
              </h4>
              <span className="text-[10px] text-[#FFAA7A] font-mono">Arterial Flow</span>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#201612] text-[#B88E77] border border-[#33251E]">
            {mobility.activeBottlenecks} Nodes
          </span>
        </div>

        <div className="mt-3.5 flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-black font-serif text-[#FFF5EE] tracking-tight">
              {mobility.congestionIndex}%
            </div>
            <div className="text-[11px] text-[#A67E68] font-mono">Congestion Index</div>
          </div>
          <div className="w-28">
            <Sparkline data={mobility.history} color="#FFAA7A" />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#241A15] grid grid-cols-2 gap-2 text-xs font-mono">
          <div>
            <span className="text-[#A67E68] text-[11px] block">Transit Delay</span>
            <span className="text-[#FFF5EE] font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#FFAA7A]" />
              +{mobility.avgTransitDelayMins.toFixed(1)} mins
            </span>
          </div>
          <div>
            <span className="text-[#A67E68] text-[11px] block">On-Time Rate</span>
            <span className="text-[#FFAA7A] font-semibold">{mobility.transitOnTimeRate}%</span>
          </div>
        </div>
      </div>

      {/* 2. ENVIRONMENT & AIR QUALITY */}
      <div
        onClick={() => setSelectedVector(selectedVector === 'environment' ? 'all' : 'environment')}
        className={`bg-[#140F0D] border rounded-2xl p-4 shadow-brown cursor-pointer transition-all hover:border-[#FFAA7A]/70 ${
          selectedVector === 'environment'
            ? 'border-[#FFAA7A] ring-1 ring-[#FFAA7A]/40'
            : 'border-[#2C201A]'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#261A14] text-[#FFD2B8] border border-[#443026]">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-[#D6B49F]">
                Environment
              </h4>
              <span className="text-[10px] text-[#FFD2B8] font-mono">Sensors Mesh</span>
            </div>
          </div>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
              environment.aqi <= 50
                ? 'bg-[#221813] text-[#FFAA7A] border-[#443026]'
                : 'bg-[#2A150F] text-[#FF8F66] border-[#703020]'
            }`}
          >
            {environment.aqiCategory}
          </span>
        </div>

        <div className="mt-3.5 flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-black font-serif text-[#FFF5EE] tracking-tight">
              {Math.round(environment.aqi)}
              <span className="text-xs font-normal text-[#A67E68] ml-1">AQI</span>
            </div>
            <div className="text-[11px] text-[#A67E68] font-mono">PM2.5: {environment.pm25} µg/m³</div>
          </div>
          <div className="w-28">
            <Sparkline data={environment.history} color="#FFD2B8" />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#241A15] grid grid-cols-2 gap-2 text-xs font-mono">
          <div>
            <span className="text-[#A67E68] text-[11px] block">Ambient Sound</span>
            <span className="text-[#FFF5EE] font-semibold flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-[#FFD2B8]" />
              {environment.noiseDb.toFixed(1)} dB
            </span>
          </div>
          <div>
            <span className="text-[#A67E68] text-[11px] block">Atmosphere</span>
            <span className="text-[#FFF5EE] font-semibold">
              {environment.temperatureC}°C • {environment.humidityPercent}% RH
            </span>
          </div>
        </div>
      </div>

      {/* 3. PUBLIC INFRASTRUCTURE & SAFETY */}
      <div
        onClick={() => setSelectedVector(selectedVector === 'infrastructure' ? 'all' : 'infrastructure')}
        className={`bg-[#140F0D] border rounded-2xl p-4 shadow-brown cursor-pointer transition-all hover:border-[#FFAA7A]/70 ${
          selectedVector === 'infrastructure'
            ? 'border-[#FFAA7A] ring-1 ring-[#FFAA7A]/40'
            : 'border-[#2C201A]'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#261A14] text-[#D6B49F] border border-[#443026]">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-[#D6B49F]">
                Infrastructure
              </h4>
              <span className="text-[10px] text-[#D6B49F] font-mono">Grid & Outages</span>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#201612] text-[#B88E77] border border-[#33251E]">
            {infrastructure.gridStabilityPercent}% Grid
          </span>
        </div>

        <div className="mt-3.5 flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-black font-serif text-[#FFF5EE] tracking-tight">
              {infrastructure.waterOutageCount + infrastructure.powerOutageCount}
              <span className="text-xs font-normal text-[#A67E68] ml-1">Outages</span>
            </div>
            <div className="text-[11px] text-[#A67E68] font-mono">
              {infrastructure.waterOutageCount} Water • {infrastructure.powerOutageCount} Power
            </div>
          </div>
          <div className="w-28">
            <Sparkline data={infrastructure.history} color="#D6B49F" />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#241A15] grid grid-cols-2 gap-2 text-xs font-mono">
          <div>
            <span className="text-[#A67E68] text-[11px] block">Emergency Response</span>
            <span className="text-[#FFAA7A] font-semibold">
              {infrastructure.avgEmergencyResponseMins.toFixed(1)} mins
            </span>
          </div>
          <div>
            <span className="text-[#A67E68] text-[11px] block">Hospital Capacity</span>
            <span className="text-[#FFF5EE] font-semibold">{infrastructure.hospitalBedCapacityPercent}%</span>
          </div>
        </div>
      </div>

      {/* 4. CIVIC SENTIMENT */}
      <div
        onClick={() => setSelectedVector(selectedVector === 'sentiment' ? 'all' : 'sentiment')}
        className={`bg-[#140F0D] border rounded-2xl p-4 shadow-brown cursor-pointer transition-all hover:border-[#FFAA7A]/70 ${
          selectedVector === 'sentiment'
            ? 'border-[#FFAA7A] ring-1 ring-[#FFAA7A]/40'
            : 'border-[#2C201A]'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#261A14] text-[#E86A38] border border-[#443026]">
              <Smile className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-[#D6B49F]">
                Civic Sentiment
              </h4>
              <span className="text-[10px] text-[#E86A38] font-mono">311 Ingestion</span>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#201612] text-[#B88E77] border border-[#33251E]">
            {sentiment.dailyReportVolume} Logs/24h
          </span>
        </div>

        <div className="mt-3.5 flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-black font-serif text-[#FFF5EE] tracking-tight">
              {sentiment.overallScore}
              <span className="text-xs font-normal text-[#A67E68] ml-1">/100</span>
            </div>
            <div className="text-[11px] text-[#A67E68] font-mono">{sentiment.sentimentLabel}</div>
          </div>
          <div className="w-28">
            <Sparkline data={sentiment.history} color="#E86A38" />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#241A15] grid grid-cols-2 gap-2 text-xs font-mono">
          <div>
            <span className="text-[#A67E68] text-[11px] block">Polarity</span>
            <span className="text-[#FFAA7A] font-semibold">{sentiment.positiveRatio}% Pos</span>
            <span className="text-[#E86A38] font-semibold ml-1">/{sentiment.negativeRatio}% Neg</span>
          </div>
          <div>
            <span className="text-[#A67E68] text-[11px] block">Top Hotspot</span>
            <span className="text-[#FFF5EE] font-medium truncate block" title={sentiment.topConcern}>
              {sentiment.topConcern}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
