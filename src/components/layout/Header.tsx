'use client';

import React, { useState } from 'react';
import { useCityPulse } from '@/lib/context/CityPulseContext';
import {
  Activity,
  Shield,
  Users,
  Play,
  Pause,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Radio,
  Flame,
  Droplets,
  Zap,
  Car,
} from 'lucide-react';
import { CrisisScenarioType } from '@/lib/engine/data-engine';

export default function Header() {
  const {
    city,
    healthIndex,
    viewMode,
    setViewMode,
    isSimulating,
    toggleSimulation,
    triggerCrisis,
    resetToBaseline,
    anomalies,
  } = useCityPulse();

  const [crisisDropdownOpen, setCrisisDropdownOpen] = useState(false);

  const activeAnomalyCount = anomalies.filter((a) => a.status === 'active').length;

  const handleCrisisClick = (scenario: CrisisScenarioType) => {
    triggerCrisis(scenario);
    setCrisisDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 text-white">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo and Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
            <Activity className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-950 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                CityPulse
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800/60 uppercase">
                Track B: Open Innovation
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              {city.name} Metro • Live Civic Health Telemetry
            </p>
          </div>
        </div>

        {/* View Mode Switcher (Executive vs Citizen) */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl shadow-inner">
          <button
            onClick={() => setViewMode('executive')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'executive'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Executive Operations Room</span>
            <span className="md:hidden">Executive</span>
          </button>

          <button
            onClick={() => setViewMode('citizen')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'citizen'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Citizen Pulse Portal</span>
            <span className="md:hidden">Citizen</span>
          </button>
        </div>

        {/* Simulation Controls & Hackathon Demo Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Health Index Badge */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg text-xs font-mono">
            <span className="text-slate-400">Health Index:</span>
            <span
              className={`font-bold ${
                healthIndex.score > 80
                  ? 'text-emerald-400'
                  : healthIndex.score > 65
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {healthIndex.score}/100 ({healthIndex.status})
            </span>
          </div>

          {/* Anomaly Notification Pill */}
          {activeAnomalyCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-950/60 border border-rose-800/80 text-rose-300 rounded-lg text-xs font-mono animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>{activeAnomalyCount} Hazard{activeAnomalyCount > 1 ? 's' : ''}</span>
            </div>
          )}

          {/* Simulation Toggle */}
          <button
            onClick={toggleSimulation}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition ${
              isSimulating
                ? 'bg-emerald-950/60 border-emerald-800/70 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
            }`}
            title="Toggle Live Stream Simulation"
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isSimulating ? 'STREAM LIVE' : 'PAUSED'}</span>
          </button>

          {/* Hackathon Demo Crisis Trigger Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCrisisDropdownOpen(!crisisDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-amber-600/30 to-rose-600/30 border border-amber-500/50 text-amber-200 hover:from-amber-600/50 hover:to-rose-600/50 transition shadow-lg"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span className="hidden md:inline">Simulate Crisis</span>
              <span className="md:hidden">Crisis</span>
            </button>

            {crisisDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-[2000] text-xs font-mono">
                <div className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800 mb-1">
                  Inject Hackathon Demo Crisis
                </div>
                <button
                  onClick={() => handleCrisisClick('water_main_burst')}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800/90 text-slate-200 flex items-center gap-2 transition"
                >
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="font-semibold text-white">Water Main Burst</div>
                    <div className="text-[10px] text-slate-400">Pressure loss & street flooding</div>
                  </div>
                </button>
                <button
                  onClick={() => handleCrisisClick('smog_plume')}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800/90 text-slate-200 flex items-center gap-2 transition"
                >
                  <Flame className="w-4 h-4 text-rose-400" />
                  <div>
                    <div className="font-semibold text-white">Smog / Air Inversion</div>
                    <div className="text-[10px] text-slate-400">PM2.5 spike & shelter advisory</div>
                  </div>
                </button>
                <button
                  onClick={() => handleCrisisClick('grid_blackout')}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800/90 text-slate-200 flex items-center gap-2 transition"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-semibold text-white">Substation Power Sag</div>
                    <div className="text-[10px] text-slate-400">Traffic signals & grid strain</div>
                  </div>
                </button>
                <button
                  onClick={() => handleCrisisClick('transit_strike_rush')}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800/90 text-slate-200 flex items-center gap-2 transition"
                >
                  <Car className="w-4 h-4 text-indigo-400" />
                  <div>
                    <div className="font-semibold text-white">Arterial Gridlock</div>
                    <div className="text-[10px] text-slate-400">Bay Bridge bottleneck & delays</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Reset Baseline */}
          <button
            onClick={resetToBaseline}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800 transition"
            title="Reset telemetry to baseline"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
