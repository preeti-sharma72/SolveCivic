'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  CivicVectorsState,
  CityHealthIndex,
  CivicIncident,
  CitizenReport,
  AnomalyAlert,
  CivicVectorType,
  DistrictSummary,
} from '../types/civic';
import {
  SAN_FRANCISCO_CONFIG,
  MetroCityConfig,
} from '../data/metro-seeds';
import {
  calculateCityHealthIndex,
  simulateTick,
  injectCrisisScenario,
  CrisisScenarioType,
} from '../engine/data-engine';
import { AnomalyDetector } from '../engine/anomaly-engine';

interface CityPulseContextType {
  city: MetroCityConfig;
  vectors: CivicVectorsState;
  healthIndex: CityHealthIndex;
  incidents: CivicIncident[];
  citizenReports: CitizenReport[];
  anomalies: AnomalyAlert[];
  viewMode: 'executive' | 'citizen';
  setViewMode: (mode: 'executive' | 'citizen') => void;
  selectedDistrict: DistrictSummary | null;
  setSelectedDistrict: (district: DistrictSummary | null) => void;
  selectedVector: CivicVectorType | 'all';
  setSelectedVector: (vector: CivicVectorType | 'all') => void;
  isSimulating: boolean;
  toggleSimulation: () => void;
  simulationSpeedMs: number;
  setSimulationSpeedMs: (speed: number) => void;
  triggerCrisis: (scenario: CrisisScenarioType) => void;
  resolveIncident: (id: string) => void;
  mitigateAnomaly: (id: string) => void;
  submitCitizenReport: (report: {
    category: CitizenReport['category'];
    district: string;
    address: string;
    description: string;
    urgency: CitizenReport['urgency'];
    coordinates?: [number, number];
  }) => void;
  upvoteReport: (id: string) => void;
  resetToBaseline: () => void;
}

const CityPulseContext = createContext<CityPulseContextType | undefined>(undefined);

export function CityPulseProvider({ children }: { children: React.ReactNode }) {
  const [city] = useState<MetroCityConfig>(SAN_FRANCISCO_CONFIG);
  const [vectors, setVectors] = useState<CivicVectorsState>(SAN_FRANCISCO_CONFIG.initialVectors);
  const [incidents, setIncidents] = useState<CivicIncident[]>(SAN_FRANCISCO_CONFIG.initialIncidents);
  const [citizenReports, setCitizenReports] = useState<CitizenReport[]>(SAN_FRANCISCO_CONFIG.initialReports);
  const [anomalies, setAnomalies] = useState<AnomalyAlert[]>(() => AnomalyDetector.evaluate(SAN_FRANCISCO_CONFIG.initialVectors));
  const [viewMode, setViewMode] = useState<'executive' | 'citizen'>('executive');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictSummary | null>(null);
  const [selectedVector, setSelectedVector] = useState<CivicVectorType | 'all'>('all');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simulationSpeedMs, setSimulationSpeedMs] = useState<number>(3500);

  // Compute composite City Health Index
  const healthIndex = useMemo(() => calculateCityHealthIndex(vectors), [vectors]);

  // Periodic simulation tick
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setVectors((prev) => {
        const next = simulateTick(prev);
        // Evaluate anomalies based on new vectors
        const detected = AnomalyDetector.evaluate(next);
        if (detected.length > 0) {
          setAnomalies((current) => {
            // merge detected without duplicate IDs
            const existingIds = new Set(current.map((a) => a.id));
            const newOnes = detected.filter((a) => !existingIds.has(a.id));
            return [...newOnes, ...current].slice(0, 8);
          });
        }
        return next;
      });
    }, simulationSpeedMs);

    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeedMs]);

  const toggleSimulation = useCallback(() => {
    setIsSimulating((prev) => !prev);
  }, []);

  const triggerCrisis = useCallback((scenario: CrisisScenarioType) => {
    setVectors((curr) => {
      const { state: newState, incident: newIncident } = injectCrisisScenario(curr, scenario);
      setIncidents((incList) => [newIncident, ...incList]);
      const newAnomalies = AnomalyDetector.evaluate(newState);
      setAnomalies((currAnoms) => [...newAnomalies, ...currAnoms].slice(0, 10));
      return newState;
    });
  }, []);

  const resolveIncident = useCallback((id: string) => {
    setIncidents((list) =>
      list.map((inc) => (inc.id === id ? { ...inc, status: 'resolved' as const } : inc))
    );
  }, []);

  const mitigateAnomaly = useCallback((id: string) => {
    setAnomalies((list) =>
      list.map((a) => (a.id === id ? { ...a, status: 'mitigated' as const } : a))
    );
  }, []);

  const submitCitizenReport = useCallback(
    (report: {
      category: CitizenReport['category'];
      district: string;
      address: string;
      description: string;
      urgency: CitizenReport['urgency'];
      coordinates?: [number, number];
    }) => {
      const matchedDist = city.districts.find((d) => d.name === report.district) || city.districts[0];
      const newRep: CitizenReport = {
        id: `REP-${Math.floor(600 + Math.random() * 400)}`,
        category: report.category,
        district: report.district,
        address: report.address,
        coordinates: report.coordinates || [
          matchedDist.center[0] + (Math.random() - 0.5) * 0.01,
          matchedDist.center[1] + (Math.random() - 0.5) * 0.01,
        ],
        urgency: report.urgency,
        description: report.description,
        sentiment: report.urgency === 'urgent' ? 'critical' : 'frustrated',
        status: 'received',
        upvotes: 1,
        timestamp: 'Just now',
      };

      setCitizenReports((prev) => [newRep, ...prev]);

      // Slight sentiment & report counter impact
      setVectors((v) => ({
        ...v,
        sentiment: {
          ...v.sentiment,
          dailyReportVolume: v.sentiment.dailyReportVolume + 1,
          negativeRatio: Math.min(60, v.sentiment.negativeRatio + 1),
        },
      }));
    },
    [city.districts]
  );

  const upvoteReport = useCallback((id: string) => {
    setCitizenReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  }, []);

  const resetToBaseline = useCallback(() => {
    setVectors(SAN_FRANCISCO_CONFIG.initialVectors);
    setIncidents(SAN_FRANCISCO_CONFIG.initialIncidents);
    setCitizenReports(SAN_FRANCISCO_CONFIG.initialReports);
    setAnomalies(AnomalyDetector.evaluate(SAN_FRANCISCO_CONFIG.initialVectors));
    setSelectedDistrict(null);
  }, []);

  return (
    <CityPulseContext.Provider
      value={{
        city,
        vectors,
        healthIndex,
        incidents,
        citizenReports,
        anomalies,
        viewMode,
        setViewMode,
        selectedDistrict,
        setSelectedDistrict,
        selectedVector,
        setSelectedVector,
        isSimulating,
        toggleSimulation,
        simulationSpeedMs,
        setSimulationSpeedMs,
        triggerCrisis,
        resolveIncident,
        mitigateAnomaly,
        submitCitizenReport,
        upvoteReport,
        resetToBaseline,
      }}
    >
      {children}
    </CityPulseContext.Provider>
  );
}

export function useCityPulse() {
  const context = useContext(CityPulseContext);
  if (!context) {
    throw new Error('useCityPulse must be used within a CityPulseProvider');
  }
  return context;
}
