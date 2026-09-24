import { NextResponse } from 'next/server';
import { SAN_FRANCISCO_CONFIG } from '@/lib/data/metro-seeds';
import { calculateCityHealthIndex } from '@/lib/engine/data-engine';
import { AnomalyDetector } from '@/lib/engine/anomaly-engine';

export async function GET() {
  const vectors = SAN_FRANCISCO_CONFIG.initialVectors;
  const healthIndex = calculateCityHealthIndex(vectors);
  const anomalies = AnomalyDetector.evaluate(vectors);

  return NextResponse.json({
    status: 'success',
    city: {
      id: SAN_FRANCISCO_CONFIG.id,
      name: SAN_FRANCISCO_CONFIG.name,
      state: SAN_FRANCISCO_CONFIG.state,
      country: SAN_FRANCISCO_CONFIG.country,
      districtsCount: SAN_FRANCISCO_CONFIG.districts.length,
    },
    compositeHealthIndex: healthIndex,
    vectors,
    activeAnomalies: anomalies,
    timestamp: new Date().toISOString(),
  });
}
