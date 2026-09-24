import { NextResponse } from 'next/server';
import { SAN_FRANCISCO_CONFIG } from '@/lib/data/metro-seeds';
import { AnomalyDetector } from '@/lib/engine/anomaly-engine';

export async function GET() {
  const anomalies = AnomalyDetector.evaluate(SAN_FRANCISCO_CONFIG.initialVectors);
  return NextResponse.json({
    status: 'success',
    anomaliesCount: anomalies.length,
    anomalies,
    timestamp: new Date().toISOString(),
  });
}
