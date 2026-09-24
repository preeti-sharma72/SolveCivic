export type CivicVectorType = 'mobility' | 'environment' | 'infrastructure' | 'sentiment';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'active' | 'investigating' | 'dispatched' | 'resolved';

export interface MetricHistoryPoint {
  timestamp: string;
  value: number;
  baseline: number;
}

export interface MobilityMetrics {
  congestionIndex: number; // 0 - 100
  transitOnTimeRate: number; // 0 - 100%
  avgTransitDelayMins: number;
  activeBottlenecks: number;
  microMobilityAvailable: number; // e.g. e-bikes / scooters
  trend: 'improving' | 'stable' | 'worsening';
  history: MetricHistoryPoint[];
}

export interface EnvironmentMetrics {
  aqi: number; // 0 - 500
  aqiCategory: 'Good' | 'Moderate' | 'Unhealthy for Sensitive' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  pm25: number; // µg/m³
  pm10: number; // µg/m³
  temperatureC: number;
  humidityPercent: number;
  noiseDb: number;
  trend: 'improving' | 'stable' | 'worsening';
  history: MetricHistoryPoint[];
}

export interface InfrastructureMetrics {
  gridStabilityPercent: number; // 0 - 100%
  waterOutageCount: number;
  powerOutageCount: number;
  avgEmergencyResponseMins: number;
  hospitalBedCapacityPercent: number;
  trend: 'improving' | 'stable' | 'worsening';
  history: MetricHistoryPoint[];
}

export interface SentimentMetrics {
  overallScore: number; // 0 - 100 (higher = more positive civic sentiment)
  sentimentLabel: 'High Civic Morale' | 'Moderate' | 'Citizen Distress' | 'Critical Discontent';
  positiveRatio: number; // %
  neutralRatio: number; // %
  negativeRatio: number; // %
  dailyReportVolume: number;
  topConcern: string;
  trend?: 'improving' | 'stable' | 'worsening';
  topicBreakdown: {
    topic: string;
    count: number;
    sentimentScore: number;
  }[];
  history: MetricHistoryPoint[];
}

export interface CivicVectorsState {
  mobility: MobilityMetrics;
  environment: EnvironmentMetrics;
  infrastructure: InfrastructureMetrics;
  sentiment: SentimentMetrics;
}

export interface CityHealthIndex {
  score: number; // 0 - 100
  status: 'Optimal' | 'Stable' | 'Caution' | 'Emergency';
  vectorScores: {
    mobility: number;
    environment: number;
    infrastructure: number;
    sentiment: number;
  };
}

export interface CivicIncident {
  id: string;
  title: string;
  vector: CivicVectorType;
  district: string;
  coordinates: [number, number]; // [lat, lng]
  severity: IncidentSeverity;
  status: IncidentStatus;
  timestamp: string;
  description: string;
  impactMetrics: string;
  actionTaken: string;
  assignedUnit?: string;
}

export interface AnomalyAlert {
  id: string;
  vector: CivicVectorType;
  metricName: string;
  currentValue: number;
  baselineValue: number;
  zScore: number;
  severity: 'warning' | 'critical';
  timestamp: string;
  title: string;
  aiRationale: string;
  recommendedInterventions: string[];
  dispatchedProtocol?: string;
  status: 'active' | 'in_progress' | 'mitigated';
}

export interface CitizenReport {
  id: string;
  category: 'Pothole' | 'Streetlight' | 'Garbage / Sanitation' | 'Water Leak' | 'Air Quality' | 'Traffic Hazard' | 'Noise' | 'Public Safety';
  district: string;
  address: string;
  coordinates: [number, number];
  urgency: 'low' | 'medium' | 'urgent';
  description: string;
  sentiment: 'positive' | 'neutral' | 'frustrated' | 'critical';
  status: 'received' | 'triaged' | 'in_progress' | 'dispatched' | 'resolved';
  upvotes: number;
  timestamp: string;
  imageUrl?: string;
}

export interface DistrictSummary {
  id: string;
  name: string;
  code: string;
  center: [number, number];
  healthScore: number;
  aqi: number;
  congestion: number;
  activeIssues: number;
  population: string;
}
