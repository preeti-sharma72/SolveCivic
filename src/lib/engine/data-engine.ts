import {
  CivicVectorsState,
  CityHealthIndex,
  CivicIncident,
  CitizenReport,
  DistrictSummary,
} from '../types/civic';

export function calculateCityHealthIndex(state: CivicVectorsState): CityHealthIndex {
  // Mobility Score: 100 is best, penalty for congestion and delays
  const mobScore = Math.max(0, Math.min(100, Math.round(
    100 - (state.mobility.congestionIndex * 0.5) - (Math.min(state.mobility.avgTransitDelayMins, 20) * 2)
  )));

  // Environment Score: 100 is pristine, AQI 0 = 100, AQI 200 = 0
  const envScore = Math.max(0, Math.min(100, Math.round(
    100 - (state.environment.aqi * 0.5)
  )));

  // Infrastructure Score: based on grid stability and outages
  const totalOutages = state.infrastructure.waterOutageCount + state.infrastructure.powerOutageCount;
  const infScore = Math.max(0, Math.min(100, Math.round(
    (state.infrastructure.gridStabilityPercent * 0.7) + Math.max(0, 30 - (totalOutages * 5))
  )));

  // Sentiment Score: directly proportional to civic morale
  const senScore = Math.max(0, Math.min(100, Math.round(state.sentiment.overallScore)));

  // Composite Weighted Score
  // Weights: Mobility 25%, Environment 25%, Infrastructure 30%, Sentiment 20%
  const composite = Math.round(
    (mobScore * 0.25) +
    (envScore * 0.25) +
    (infScore * 0.30) +
    (senScore * 0.20)
  );

  let status: CityHealthIndex['status'] = 'Optimal';
  if (composite < 60) status = 'Emergency';
  else if (composite < 75) status = 'Caution';
  else if (composite < 85) status = 'Stable';

  return {
    score: composite,
    status,
    vectorScores: {
      mobility: mobScore,
      environment: envScore,
      infrastructure: infScore,
      sentiment: senScore,
    },
  };
}

export function getAqiCategory(aqi: number): 'Good' | 'Moderate' | 'Unhealthy for Sensitive' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous' {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

export function simulateTick(current: CivicVectorsState): CivicVectorsState {
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Stochastic jitter (-1 to +1 scaled)
  const rand = (mag: number) => (Math.random() - 0.48) * mag;

  // 1. Mobility
  const newCongestion = Math.max(15, Math.min(98, Math.round(current.mobility.congestionIndex + rand(2))));
  const newTransitDelay = Math.max(1, Math.min(25, Number((current.mobility.avgTransitDelayMins + rand(0.4)).toFixed(1))));
  const newMobHistory = [
    ...current.mobility.history.slice(-15),
    { timestamp: timeStr, value: newCongestion, baseline: 50 },
  ];

  // 2. Environment
  const newAqi = Math.max(10, Math.min(240, Math.round(current.environment.aqi + rand(2))));
  const newPm25 = Number((newAqi * 0.24 + rand(0.5)).toFixed(1));
  const newEnvHistory = [
    ...current.environment.history.slice(-15),
    { timestamp: timeStr, value: newAqi, baseline: 45 },
  ];

  // 3. Infrastructure
  const gridJitter = Number((Math.min(100, Math.max(94, current.infrastructure.gridStabilityPercent + rand(0.15)))).toFixed(1));
  const newInfHistory = [
    ...current.infrastructure.history.slice(-15),
    { timestamp: timeStr, value: gridJitter, baseline: 99.2 },
  ];

  // 4. Sentiment
  const newSentimentScore = Math.max(30, Math.min(95, Math.round(current.sentiment.overallScore + rand(1.5))));
  const newSenHistory = [
    ...current.sentiment.history.slice(-15),
    { timestamp: timeStr, value: newSentimentScore, baseline: 72 },
  ];

  return {
    mobility: {
      ...current.mobility,
      congestionIndex: newCongestion,
      avgTransitDelayMins: newTransitDelay,
      trend: newCongestion > current.mobility.congestionIndex ? 'worsening' : 'improving',
      history: newMobHistory,
    },
    environment: {
      ...current.environment,
      aqi: newAqi,
      aqiCategory: getAqiCategory(newAqi),
      pm25: newPm25,
      trend: newAqi > current.environment.aqi ? 'worsening' : 'improving',
      history: newEnvHistory,
    },
    infrastructure: {
      ...current.infrastructure,
      gridStabilityPercent: gridJitter,
      trend: gridJitter < current.infrastructure.gridStabilityPercent ? 'worsening' : 'improving',
      history: newInfHistory,
    },
    sentiment: {
      ...current.sentiment,
      overallScore: newSentimentScore,
      negativeRatio: Math.max(10, Math.min(50, Math.round(100 - newSentimentScore * 0.9))),
      positiveRatio: Math.max(20, Math.min(80, Math.round(newSentimentScore * 0.75))),
      trend: newSentimentScore < current.sentiment.overallScore ? 'worsening' : 'improving',
      history: newSenHistory,
    },
  };
}

export type CrisisScenarioType = 'water_main_burst' | 'smog_plume' | 'grid_blackout' | 'transit_strike_rush';

export function injectCrisisScenario(
  current: CivicVectorsState,
  scenario: CrisisScenarioType
): { state: CivicVectorsState; incident: CivicIncident } {
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const idStr = Date.now().toString().slice(-4);

  switch (scenario) {
    case 'water_main_burst': {
      return {
        state: {
          ...current,
          infrastructure: {
            ...current.infrastructure,
            waterOutageCount: current.infrastructure.waterOutageCount + 4,
            gridStabilityPercent: Math.max(92, current.infrastructure.gridStabilityPercent - 2.5),
          },
          mobility: {
            ...current.mobility,
            congestionIndex: Math.min(95, current.mobility.congestionIndex + 18),
            avgTransitDelayMins: Number((current.mobility.avgTransitDelayMins + 5.2).toFixed(1)),
          },
          sentiment: {
            ...current.sentiment,
            overallScore: Math.max(35, current.sentiment.overallScore - 15),
            negativeRatio: Math.min(48, current.sentiment.negativeRatio + 16),
          },
        },
        incident: {
          id: `INC-CRISIS-${idStr}`,
          title: 'High-Volume Water Main Rupture & Subterranean Flooding',
          vector: 'infrastructure',
          district: 'South of Market (SoMa)',
          coordinates: [37.7788, -122.4045],
          severity: 'critical',
          status: 'active',
          timestamp: timeStr,
          description: 'Catastrophic 24" transmission rupture on Howard St. Hydro-static pressure collapse impacting 12 blocks.',
          impactMetrics: '1,400 properties without water pressure, 3 lanes submerged',
          actionTaken: 'Remote isolation telemetry initiated; Emergency Public Works hydro-vacuum rigs dispatched.',
          assignedUnit: 'SF Water Command Alpha',
        },
      };
    }
    case 'smog_plume': {
      return {
        state: {
          ...current,
          environment: {
            ...current.environment,
            aqi: Math.min(220, current.environment.aqi + 75),
            aqiCategory: 'Very Unhealthy',
            pm25: Number((current.environment.pm25 + 45).toFixed(1)),
          },
          sentiment: {
            ...current.sentiment,
            overallScore: Math.max(40, current.sentiment.overallScore - 12),
            negativeRatio: Math.min(44, current.sentiment.negativeRatio + 14),
          },
        },
        incident: {
          id: `INC-CRISIS-${idStr}`,
          title: 'Wildfire Smoke Inversion & Industrial Particulate Spike',
          vector: 'environment',
          district: 'Bayview / Hunters Point',
          coordinates: [37.732, -122.382],
          severity: 'critical',
          status: 'active',
          timestamp: timeStr,
          description: 'Sudden marine inversion layer trapped high density particulate matter (PM2.5 > 110 µg/m³).',
          impactMetrics: 'Regional AQI jumped to 185; 4 elementary schools initiating indoor sheltering protocols',
          actionTaken: 'Civic Health Emergency Advisory pushed via municipal SMS; Public clean-air shelters opened.',
          assignedUnit: 'Bay Area Air Quality Management District',
        },
      };
    }
    case 'grid_blackout': {
      return {
        state: {
          ...current,
          infrastructure: {
            ...current.infrastructure,
            powerOutageCount: current.infrastructure.powerOutageCount + 5,
            gridStabilityPercent: 88.4,
          },
          mobility: {
            ...current.mobility,
            congestionIndex: Math.min(94, current.mobility.congestionIndex + 22),
          },
          sentiment: {
            ...current.sentiment,
            overallScore: Math.max(38, current.sentiment.overallScore - 20),
          },
        },
        incident: {
          id: `INC-CRISIS-${idStr}`,
          title: 'Substation Feeder Breaker Cascade & Grid Sags',
          vector: 'infrastructure',
          district: 'Downtown & Financial District',
          coordinates: [37.7915, -122.402],
          severity: 'critical',
          status: 'active',
          timestamp: timeStr,
          description: 'Substation 4 tripped after thermal overload during synchronized HVAC spikes. 18 traffic signals offline.',
          impactMetrics: '3,800 commercial offices on backup generators; arterial intersections operating as 4-way stops',
          actionTaken: 'Traffic officers deployed to key intersections; mobile battery energy storage system synced.',
          assignedUnit: 'PG&E Grid Rescue 1',
        },
      };
    }
    case 'transit_strike_rush': {
      return {
        state: {
          ...current,
          mobility: {
            ...current.mobility,
            congestionIndex: 96,
            avgTransitDelayMins: 19.5,
            transitOnTimeRate: 48,
          },
          sentiment: {
            ...current.sentiment,
            overallScore: Math.max(42, current.sentiment.overallScore - 18),
            negativeRatio: 46,
          },
        },
        incident: {
          id: `INC-CRISIS-${idStr}`,
          title: 'Heavy Arterial Gridlock & Regional Commuter Bottleneck',
          vector: 'mobility',
          district: 'Downtown & Financial District',
          coordinates: [37.794, -122.398],
          severity: 'high',
          status: 'active',
          timestamp: timeStr,
          description: 'Bay Bridge on-ramp closure coinciding with evening metro rush hour. Average velocity < 4 mph.',
          impactMetrics: '14,000 vehicles in holding patterns across 6 major arteries',
          actionTaken: 'Automated metering signals switched to express flushing cycle; express bus lanes prioritized.',
          assignedUnit: 'SFMTA Tactical Traffic Group',
        },
      };
    }
  }
}
