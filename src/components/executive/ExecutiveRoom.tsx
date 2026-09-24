'use client';

import React from 'react';
import CivicMap from '../map/CivicMap';
import MetricGauge from './MetricGauge';
import VectorMetricsGrid from './VectorMetricsGrid';
import IncidentFeed from './IncidentFeed';
import DistrictTable from './DistrictTable';
import AnomalyAlertBanner from './AnomalyAlertBanner';
import { Download } from 'lucide-react';
import { useCityPulse } from '@/lib/context/CityPulseContext';

export default function ExecutiveRoom() {
  const { city, healthIndex, incidents, anomalies } = useCityPulse();

  const exportSituationReport = () => {
    const reportData = {
      city: city.name,
      timestamp: new Date().toISOString(),
      compositeHealthIndex: healthIndex,
      activeIncidents: incidents.filter((i) => i.status !== 'resolved'),
      activeAnomalies: anomalies.filter((a) => a.status === 'active'),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CityPulse-Situation-Report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner: Predictive AI / Anomaly Detection */}
      <AnomalyAlertBanner />

      {/* 4 Core Vector Telemetry Cards */}
      <VectorMetricsGrid />

      {/* Main Command Center: Interactive Civic Map + Analytics HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Interactive Map */}
        <div className="lg:col-span-8 min-h-[520px] flex flex-col">
          <CivicMap />
        </div>

        {/* Right Side: Health Gauge & District Breakdown */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <MetricGauge />
          <div className="flex-1">
            <DistrictTable />
          </div>
        </div>
      </div>

      {/* Bottom Command Center Section: Incident Feed & Situation Export */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <IncidentFeed />
        </div>

        <div className="lg:col-span-4 flex flex-col justify-between bg-[#140F0D] border border-[#2C201A] rounded-2xl p-5 shadow-brown">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#241A15]">
              <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-[#D6B49F]">
                Municipal Operations Telemetry
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#241712] text-[#FFAA7A] border border-[#543C30]">
                ACTIVE FEED
              </span>
            </div>

            <div className="mt-4 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0E0B09] border border-[#241A15]">
                <span className="text-[#A67E68]">Telemetry Rate</span>
                <span className="text-[#FFAA7A] font-bold">14,280 msgs/sec</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0E0B09] border border-[#241A15]">
                <span className="text-[#A67E68]">Sensor Mesh Nodes</span>
                <span className="text-[#FFF5EE] font-bold">1,842 IoT Nodes Online</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0E0B09] border border-[#241A15]">
                <span className="text-[#A67E68]">Emergency Dispatch Sync</span>
                <span className="text-[#FFAA7A] font-bold">CAD/911 Connected</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0E0B09] border border-[#241A15]">
                <span className="text-[#A67E68]">Hazard Buffer Forecast</span>
                <span className="text-[#FFD2B8] font-bold">~42 mins lead time</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-[#241A15] flex items-center gap-2">
            <button
              onClick={exportSituationReport}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#221813] hover:bg-[#2C201A] text-[#FFE0CC] text-xs font-mono font-semibold transition border border-[#443026] flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5 text-[#FFAA7A]" />
              <span>Export Situation JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
