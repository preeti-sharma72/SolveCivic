'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCityPulse } from '@/lib/context/CityPulseContext';
import { CivicIncident, CitizenReport, DistrictSummary } from '@/lib/types/civic';

export default function LeafletMapInner() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersRef = useRef<{
    districtsLayer: L.LayerGroup;
    incidentsLayer: L.LayerGroup;
    reportsLayer: L.LayerGroup;
  }>({
    districtsLayer: L.layerGroup(),
    incidentsLayer: L.layerGroup(),
    reportsLayer: L.layerGroup(),
  });

  const {
    city,
    incidents,
    citizenReports,
    selectedDistrict,
    setSelectedDistrict,
    selectedVector,
    resolveIncident,
  } = useCityPulse();

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: city.center,
      zoom: city.zoom,
      zoomControl: false,
      attributionControl: false,
    });

    // Dark Matter tiles by CartoDB (free, high performance, high tech civic dashboard aesthetic)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Zoom control in top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Add layer groups
    layersRef.current.districtsLayer.addTo(map);
    layersRef.current.incidentsLayer.addTo(map);
    layersRef.current.reportsLayer.addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [city]);

  // Sync Districts
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const layer = layersRef.current.districtsLayer;
    layer.clearLayers();

    city.districts.forEach((dist: DistrictSummary) => {
      // Color based on health score
      let color = '#10B981'; // green
      if (dist.healthScore < 70) color = '#F43F5E'; // red
      else if (dist.healthScore < 80) color = '#F59E0B'; // amber

      // District circle area
      const circle = L.circle(dist.center, {
        radius: 1100,
        color: color,
        weight: 1.5,
        fillColor: color,
        fillOpacity: selectedDistrict?.id === dist.id ? 0.25 : 0.08,
        dashArray: '4, 6',
      });

      // District marker badge
      const markerHtml = `
        <div class="px-2 py-1 bg-slate-900/90 border border-slate-700/80 rounded-lg shadow-lg flex items-center gap-1.5 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-105 transition-all text-xs font-mono backdrop-blur-md">
          <span class="w-2 h-2 rounded-full inline-block" style="background-color: ${color}"></span>
          <span class="font-bold text-slate-100">${dist.code}</span>
          <span class="text-slate-400 text-[10px]">${dist.healthScore}%</span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-district-marker',
        iconSize: [80, 24],
        iconAnchor: [40, 12],
      });

      const marker = L.marker(dist.center, { icon: customIcon });

      marker.on('click', () => {
        setSelectedDistrict(dist);
        map.flyTo(dist.center, 14, { duration: 0.8 });
      });

      circle.on('click', () => {
        setSelectedDistrict(dist);
        map.flyTo(dist.center, 14, { duration: 0.8 });
      });

      marker.bindPopup(`
        <div style="font-family: sans-serif; min-width: 180px; color: #1e293b; padding: 2px;">
          <h4 style="font-weight: 700; margin: 0 0 4px 0; font-size: 14px;">${dist.name}</h4>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748b;">Population: ${dist.population}</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 11px;">
            <div>Health: <b>${dist.healthScore}/100</b></div>
            <div>AQI: <b>${dist.aqi}</b></div>
            <div>Congestion: <b>${dist.congestion}%</b></div>
            <div>Active Issues: <b>${dist.activeIssues}</b></div>
          </div>
        </div>
      `);

      layer.addLayer(circle);
      layer.addLayer(marker);
    });
  }, [city, selectedDistrict, setSelectedDistrict]);

  // Sync Incidents
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const layer = layersRef.current.incidentsLayer;
    layer.clearLayers();

    const filtered = incidents.filter((inc) => {
      if (selectedVector !== 'all' && inc.vector !== selectedVector) return false;
      if (selectedDistrict && inc.district !== selectedDistrict.name) return false;
      return true;
    });

    filtered.forEach((inc: CivicIncident) => {
      let vectorColor = '#38BDF8'; // cyan: mobility
      if (inc.vector === 'environment') vectorColor = '#10B981'; // emerald
      if (inc.vector === 'infrastructure') vectorColor = '#8B5CF6'; // violet
      if (inc.vector === 'sentiment') vectorColor = '#F59E0B'; // amber

      const isCritical = inc.severity === 'critical';
      const isResolved = inc.status === 'resolved';

      const iconHtml = `
        <div class="relative group cursor-pointer">
          ${!isResolved ? `<div class="absolute -inset-2 rounded-full animate-ping opacity-60" style="background-color: ${isCritical ? '#F43F5E' : vectorColor}"></div>` : ''}
          <div class="relative w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-125"
               style="background-color: #0F172A; border-color: ${isResolved ? '#64748B' : isCritical ? '#F43F5E' : vectorColor}">
            <span class="text-xs font-bold" style="color: ${isResolved ? '#94A3B8' : isCritical ? '#F43F5E' : vectorColor}">
              ${inc.vector === 'mobility' ? '🚗' : inc.vector === 'environment' ? '🍃' : inc.vector === 'infrastructure' ? '⚡' : '📢'}
            </span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-incident-pin',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker(inc.coordinates, { icon: customIcon });

      const popupContent = `
        <div style="font-family: inherit; min-width: 240px; color: #0F172A; padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; background: ${isCritical ? '#FFE4E6' : '#E0F2FE'}; color: ${isCritical ? '#BE123C' : '#0369A1'}">
              ${inc.severity} • ${inc.vector}
            </span>
            <span style="font-size: 10px; color: #64748B;">${inc.timestamp}</span>
          </div>
          <h3 style="font-size: 13px; font-weight: 700; margin: 0 0 4px 0; line-height: 1.3;">${inc.title}</h3>
          <p style="font-size: 11px; color: #475569; margin: 0 0 6px 0;">${inc.description}</p>
          <div style="font-size: 11px; background: #F8FAFC; padding: 6px; border-radius: 4px; margin-bottom: 6px; border-left: 3px solid ${vectorColor};">
            <strong style="color: #0F172A;">Impact:</strong> ${inc.impactMetrics}
          </div>
          ${inc.assignedUnit ? `<div style="font-size: 10px; color: #64748B; margin-bottom: 6px;">Unit: <b>${inc.assignedUnit}</b></div>` : ''}
          <div style="font-size: 10px; color: #059669; font-weight: 600;">Status: ${inc.status.toUpperCase()}</div>
        </div>
      `;

      marker.bindPopup(popupContent);
      layer.addLayer(marker);
    });
  }, [incidents, selectedVector, selectedDistrict]);

  // Sync Citizen Reports
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const layer = layersRef.current.reportsLayer;
    layer.clearLayers();

    citizenReports.slice(0, 15).forEach((report: CitizenReport) => {
      const reportIcon = L.divIcon({
        html: `
          <div class="w-6 h-6 rounded-full bg-slate-900/90 border border-amber-400/80 flex items-center justify-center text-[10px] text-amber-300 shadow cursor-pointer hover:scale-125 transition-transform" title="${report.category}">
            📍
          </div>
        `,
        className: 'custom-report-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker(report.coordinates, { icon: reportIcon });
      marker.bindPopup(`
        <div style="font-family: inherit; min-width: 200px; color: #0f172a; padding: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 10px; background: #FEF3C7; color: #92400E; font-weight: 700; padding: 2px 6px; border-radius: 4px;">
              ${report.category}
            </span>
            <span style="font-size: 10px; color: #64748B;">${report.timestamp}</span>
          </div>
          <p style="font-size: 11px; margin: 0 0 6px 0; color: #334155;">${report.description}</p>
          <div style="font-size: 10px; color: #64748B;">📍 ${report.address} (${report.district})</div>
          <div style="font-size: 10px; font-weight: 600; color: #0284C7; margin-top: 4px;">👍 ${report.upvotes} Citizens confirmed</div>
        </div>
      `);
      layer.addLayer(marker);
    });
  }, [citizenReports]);

  // Pan to selected district if changed
  useEffect(() => {
    if (selectedDistrict && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(selectedDistrict.center, 14, { duration: 1.0 });
    }
  }, [selectedDistrict]);

  return <div ref={mapContainerRef} className="w-full h-full min-h-[460px] rounded-xl overflow-hidden shadow-2xl" />;
}
