import { NextResponse } from 'next/server';
import { SAN_FRANCISCO_CONFIG } from '@/lib/data/metro-seeds';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    count: SAN_FRANCISCO_CONFIG.initialIncidents.length,
    incidents: SAN_FRANCISCO_CONFIG.initialIncidents,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newIncident = {
      id: `INC-API-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
      status: 'active',
      ...body,
    };
    return NextResponse.json({ status: 'success', incident: newIncident }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 400 });
  }
}
