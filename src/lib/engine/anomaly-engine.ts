import { CivicVectorType, AnomalyAlert, CivicVectorsState } from '../types/civic';

export class AnomalyDetector {
  /**
   * Evaluates current civic telemetry against baselines and statistical thresholds
   * to detect multi-vector civic hazards and anomalies.
   */
  static evaluate(state: CivicVectorsState): AnomalyAlert[] {
    const alerts: AnomalyAlert[] = [];
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Mobility Check
    const mob = state.mobility;
    if (mob.congestionIndex > 75 || mob.avgTransitDelayMins > 10) {
      const z = Number(((mob.congestionIndex - 50) / 12).toFixed(2));
      alerts.push({
        id: `ANOM-MOB-${Date.now().toString().slice(-4)}`,
        vector: 'mobility',
        metricName: 'Gridlock & Transit Desynchronization',
        currentValue: mob.congestionIndex,
        baselineValue: 50,
        zScore: z,
        severity: mob.congestionIndex > 85 ? 'critical' : 'warning',
        timestamp: now,
        title: `Congestion Surge (${mob.congestionIndex}%) with ${mob.avgTransitDelayMins.toFixed(1)}m Transit Lag`,
        aiRationale: `Real-time sensor nodes indicate arterial vehicle velocity down 42% across core transit corridors. Coincides with transit headway delays exceeding tolerance buffer.`,
        recommendedInterventions: [
          'Trigger Adaptive Signal Timing (AST) plan #04 along Market & Mission corridors',
          'Deploy SFMTA transit fare inspectors to facilitate expedited bus boarding',
          'Broadcast real-time detour advisories to regional navigation feeds (Waze/Google Maps)',
        ],
        status: 'active',
      });
    }

    // 2. Environment Check
    const env = state.environment;
    if (env.aqi > 70) {
      const z = Number(((env.aqi - 45) / 10).toFixed(2));
      alerts.push({
        id: `ANOM-ENV-${Date.now().toString().slice(-4)}`,
        vector: 'environment',
        metricName: 'Atmospheric Particulate PM2.5 Inversion',
        currentValue: env.aqi,
        baselineValue: 42,
        zScore: z,
        severity: env.aqi > 100 ? 'critical' : 'warning',
        timestamp: now,
        title: `Air Quality Index Spike (AQI: ${Math.round(env.aqi)}) - ${env.aqiCategory}`,
        aiRationale: `Micro-sensor cluster registered PM2.5 at ${env.pm25.toFixed(1)} µg/m³. Local meteorological telemetry indicates stagnant surface wind (< 2.1 knots) causing particulate entrapment.`,
        recommendedInterventions: [
          'Issue automated civic health push notification to vulnerable populations & senior centers',
          'Authorize municipal HVAC systems to activate MERV-15 recirculating filtration mode',
          'Restrict municipal heavy-duty diesel fleet operations in affected sectors',
        ],
        status: 'active',
      });
    }

    // 3. Infrastructure Check
    const inf = state.infrastructure;
    if (inf.waterOutageCount > 4 || inf.gridStabilityPercent < 98.0 || inf.powerOutageCount > 3) {
      const z = Number(((100 - inf.gridStabilityPercent) * 3).toFixed(2));
      alerts.push({
        id: `ANOM-INF-${Date.now().toString().slice(-4)}`,
        vector: 'infrastructure',
        metricName: 'Utility Distribution Strain & Outage Clustered Alert',
        currentValue: inf.waterOutageCount + inf.powerOutageCount,
        baselineValue: 2,
        zScore: Math.max(z, 2.4),
        severity: 'critical',
        timestamp: now,
        title: `Multi-Utility Pressure Anomaly (${inf.waterOutageCount} Water, ${inf.powerOutageCount} Power Incident Nodes)`,
        aiRationale: `Correlated telemetry reveals hydraulic pressure drop in Zone 3 concurrent with electrical feeder thermal warnings. High probability of unisolated pipe breach.`,
        recommendedInterventions: [
          'Command automatic telemetry shut-off valves for Grid Sector 4B',
          'Dispatch tier-1 emergency public works repair crew with acoustic leak detectors',
          'Spin up auxiliary grid microturbines to buffer substation voltage sag',
        ],
        status: 'active',
      });
    }

    // 4. Civic Sentiment Check
    const sen = state.sentiment;
    if (sen.negativeRatio > 25 || sen.overallScore < 60) {
      const z = Number(((sen.negativeRatio - 15) / 4).toFixed(2));
      alerts.push({
        id: `ANOM-SEN-${Date.now().toString().slice(-4)}`,
        vector: 'sentiment',
        metricName: 'Citizen Distress Velocity Spike',
        currentValue: sen.negativeRatio,
        baselineValue: 16,
        zScore: z,
        severity: sen.negativeRatio > 35 ? 'critical' : 'warning',
        timestamp: now,
        title: `Citizen Negative Sentiment Spike (${sen.negativeRatio}% Frustration Index)`,
        aiRationale: `NLP sentiment classification detected a 180% surge in keywords: "water shutoff", "delay", "gridlock", and "crosswalk hazard" across incoming citizen 311 reports in the past 45 mins.`,
        recommendedInterventions: [
          'Release official civic transparency bulletin explaining ongoing repairs and ETA',
          'Prioritize public works dispatch queue for top 5 upvoted citizen reports',
          'Open direct municipal liaison channel for affected merchant associations',
        ],
        status: 'active',
      });
    }

    return alerts;
  }
}
