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
  Droplets,
  Flame,
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
    <header className="sticky top-0 z-50 bg-[#0E0B09]/90 backdrop-blur-xl border-b border-[#2C201A] text-[#FFF5EE]">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-8 h-18 py-3.5 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFAA7A] via-[#E86A38] to-[#412E25] shadow-peach border border-[#FFAA7A]/30">
            <Activity className="w-5 h-5 text-[#0D0A09]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#FFAA7A] border-2 border-[#0E0B09] rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#FFAA7A] border-2 border-[#0E0B09] rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight font-serif text-[#FFF5EE]">
                CityPulse
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-widest bg-[#221813] text-[#FFAA7A] border border-[#543C30] uppercase">
                Civic Health
              </span>
            </div>
            <p className="text-[11px] text-[#B88E77] font-mono tracking-wide hidden sm:block">
              {city.name} Metro Grid • Live Sensor Telemetry
            </p>
          </div>
        </div>

        {/* View Mode Toggle (Classic Peach & Brown) */}
        <div className="flex items-center p-1 bg-[#150F0D] border border-[#33251E] rounded-xl shadow-inner">
          <button
            onClick={() => setViewMode('executive')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'executive'
                ? 'bg-[#FFAA7A] text-[#0F0B09] font-bold shadow-peach'
                : 'text-[#B88E77] hover:text-[#FFF5EE]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Executive Operations</span>
            <span className="md:hidden">Executive</span>
          </button>

          <button
            onClick={() => setViewMode('citizen')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'citizen'
                ? 'bg-[#FFAA7A] text-[#0F0B09] font-bold shadow-peach'
                : 'text-[#B88E77] hover:text-[#FFF5EE]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Citizen Pulse Portal</span>
            <span className="md:hidden">Citizen</span>
          </button>
        </div>

        {/* Controls & Hackathon Demo Dropdown */}
        <div className="flex items-center gap-2.5">
          {/* Health Score Pill */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-[#17110E] border border-[#33251E] rounded-lg text-xs font-mono">
            <span className="text-[#B88E77]">Health Index:</span>
            <span
              className={`font-bold ${
                healthIndex.score > 80
                  ? 'text-[#FFAA7A]'
                  : healthIndex.score > 65
                  ? 'text-[#FFD2B8]'
                  : 'text-[#E86A38]'
              }`}
            >
              {healthIndex.score}/100 ({healthIndex.status})
            </span>
          </div>

          {/* Active Hazard Tag */}
          {activeAnomalyCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#2A1610] border border-[#703020] text-[#FF8F66] rounded-lg text-xs font-mono animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-[#FF8F66]" />
              <span>{activeAnomalyCount} Hazard{activeAnomalyCount > 1 ? 's' : ''}</span>
            </div>
          )}

          {/* Stream Ticker Toggle */}
          <button
            onClick={toggleSimulation}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition ${
              isSimulating
                ? 'bg-[#221813] border-[#543C30] text-[#FFAA7A] hover:bg-[#2C201A]'
                : 'bg-[#150F0D] border-[#291E18] text-[#8C6D5D] hover:bg-[#1E1613]'
            }`}
            title="Toggle Live Stream Simulation"
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5 text-[#FFAA7A]" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isSimulating ? 'LIVE FEED' : 'PAUSED'}</span>
          </button>

          {/* Crisis Simulator Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCrisisDropdownOpen(!crisisDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-[#33251E] to-[#453026] hover:from-[#3E2E25] hover:to-[#553C30] border border-[#543C30] text-[#FFE0CC] transition shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFAA7A]" />
              <span className="hidden md:inline">Simulate Crisis</span>
              <span className="md:hidden">Crisis</span>
            </button>

            {crisisDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#17110E] border border-[#443026] rounded-xl shadow-brown p-2 z-[2000] text-xs font-mono animate-fadeIn">
                <div className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-[#A67E68] font-semibold border-b border-[#2C201A] mb-1">
                  Inject Hackathon Demo Crisis
                </div>
                <button
                  onClick={() => handleCrisisClick('water_main_burst')}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#251B16] text-[#FFF5EE] flex items-center gap-2.5 transition"
                >
                  <Droplets className="w-4 h-4 text-[#FFAA7A]" />
                  <div>
                    <div className="font-semibold text-[#FFF5EE]">Water Main Burst</div>
                    <div className="text-[10px] text-[#A67E68]">Pressure loss & street flooding</div>
                  </div>
                </button>
                <button
                  onClick={() => handleCrisisClick('smog_plume')}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#251B16] text-[#FFF5EE] flex items-center gap-2.5 transition"
                >
                  <Flame className="w-4 h-4 text-[#FF8F66]" />
                  <div>
                    <div className="font-semibold text-[#FFF5EE]">Smog / Air Inversion</div>
                    <div className="text-[10px] text-[#A67E68]">PM2.5 spike & shelter advisory</div>
                  </div>
                </button>
                <button
                  onClick={() => handleCrisisClick('grid_blackout')}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#251B16] text-[#FFF5EE] flex items-center gap-2.5 transition"
                >
                  <Zap className="w-4 h-4 text-[#FFC8A3]" />
                  <div>
                    <div className="font-semibold text-[#FFF5EE]">Substation Power Sag</div>
                    <div className="text-[10px] text-[#A67E68]">Grid thermal warning</div>
                  </div>
                </button>
                <button
                  onClick={() => handleCrisisClick('transit_strike_rush')}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#251B16] text-[#FFF5EE] flex items-center gap-2.5 transition"
                >
                  <Car className="w-4 h-4 text-[#E86A38]" />
                  <div>
                    <div className="font-semibold text-[#FFF5EE]">Arterial Gridlock</div>
                    <div className="text-[10px] text-[#A67E68]">Bay Bridge bottleneck</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Reset Baseline */}
          <button
            onClick={resetToBaseline}
            className="p-1.5 rounded-lg text-[#A67E68] hover:text-[#FFF5EE] hover:bg-[#221813] border border-[#2C201A] transition"
            title="Reset telemetry to baseline"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
