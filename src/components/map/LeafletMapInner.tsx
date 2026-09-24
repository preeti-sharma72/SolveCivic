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

    // Dark Matter tiles by CartoDB
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    layersRef.current.districtsLayer.addTo(map);
    layersRef.current.incidentsLayer.addTo(map);
    layersRef.current.reportsLayer.addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [city]);

  // Sync Districts with Peach & Brown Styling
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const layer = layersRef.current.districtsLayer;
    layer.clearLayers();

    city.districts.forEach((dist: DistrictSummary) => {
      // Classic Peach / Warm Brown / Terracotta color graduation
      let color = '#FFAA7A'; // Peach
      if (dist.healthScore < 70) color = '#E86A38'; // Terracotta
      else if (dist.healthScore < 80) color = '#D6B49F'; // Warm Sand Brown

      // Circle area with warm border
      const circle = L.circle(dist.center, {
        radius: 1100,
        color: color,
        weight: 1.5,
        fillColor: color,
        fillOpacity: selectedDistrict?.id === dist.id ? 0.22 : 0.07,
        dashArray: '4, 6',
      });

      // Classic badge marker
      const markerHtml = `
        <div class="px-2.5 py-1 bg-[#140F0D]/95 border border-[#443026] rounded-lg shadow-lg flex items-center gap-1.5 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-105 transition-all text-xs font-mono backdrop-blur-md">
          <span class="w-2 h-2 rounded-full inline-block" style="background-color: ${color}"></span>
          <span class="font-bold text-[#FFF5EE]">${dist.code}</span>
          <span class="text-[#B88E77] text-[10px]">${dist.healthScore}%</span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-district-marker',
        iconSize: [84, 26],
        iconAnchor: [42, 13],
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
        <div style="font-family: inherit; min-width: 190px; color: #FFF5EE; padding: 4px;">
          <h4 style="font-weight: 700; margin: 0 0 4px 0; font-size: 13px; color: #FFAA7A;">${dist.name}</h4>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #B88E77;">Population: ${dist.population}</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 11px; color: #FFF5EE;">
            <div>Health: <b>${dist.healthScore}/100</b></div>
            <div>AQI: <b>${dist.aqi}</b></div>
            <div>Congestion: <b>${dist.congestion}%</b></div>
            <div>Issues: <b>${dist.activeIssues}</b></div>
          </div>
        </div>
      `);

      layer.addLayer(circle);
      layer.addLayer(marker);
    });
  }, [city, selectedDistrict, setSelectedDistrict]);

  // Sync Incidents with Peach & Mocha Beacons
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
      let vectorColor = '#FFAA7A'; // Peach: mobility
      if (inc.vector === 'environment') vectorColor = '#FFD2B8'; // Soft Peach: environment
      if (inc.vector === 'infrastructure') vectorColor = '#D6B49F'; // Mocha Brown: infrastructure
      if (inc.vector === 'sentiment') vectorColor = '#E86A38'; // Terracotta: sentiment

      const isCritical = inc.severity === 'critical';
      const isResolved = inc.status === 'resolved';

      const iconHtml = `
        <div class="relative group cursor-pointer">
          ${!isResolved ? `<div class="absolute -inset-2 rounded-full animate-ping opacity-60" style="background-color: ${isCritical ? '#E86A38' : vectorColor}"></div>` : ''}
          <div class="relative w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-125"
               style="background-color: #1A1310; border-color: ${isResolved ? '#543C30' : isCritical ? '#E86A38' : vectorColor}">
            <span class="text-xs font-bold" style="color: ${isResolved ? '#8C6D5D' : isCritical ? '#E86A38' : vectorColor}">
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
        <div style="font-family: inherit; min-width: 240px; color: #FFF5EE; padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; background: ${isCritical ? '#381610' : '#2C201A'}; color: ${isCritical ? '#FF8F66' : '#FFAA7A'}; border: 1px solid ${isCritical ? '#703020' : '#543C30'};">
              ${inc.severity} • ${inc.vector}
            </span>
            <span style="font-size: 10px; color: #B88E77;">${inc.timestamp}</span>
          </div>
          <h3 style="font-size: 13px; font-weight: 700; margin: 0 0 4px 0; color: #FFF5EE; line-height: 1.3;">${inc.title}</h3>
          <p style="font-size: 11px; color: #D6B49F; margin: 0 0 6px 0;">${inc.description}</p>
          <div style="font-size: 11px; background: #140F0D; padding: 6px; border-radius: 4px; margin-bottom: 6px; border-left: 3px solid ${vectorColor}; color: #FFF5EE;">
            <strong style="color: #FFAA7A;">Impact:</strong> ${inc.impactMetrics}
          </div>
          ${inc.assignedUnit ? `<div style="font-size: 10px; color: #B88E77; margin-bottom: 6px;">Unit: <b style="color: #FFF5EE;">${inc.assignedUnit}</b></div>` : ''}
          <div style="font-size: 10px; color: #FFAA7A; font-weight: 600;">Status: ${inc.status.toUpperCase()}</div>
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
          <div class="w-6 h-6 rounded-full bg-[#1A1310] border border-[#FFAA7A] flex items-center justify-center text-[10px] text-[#FFAA7A] shadow cursor-pointer hover:scale-125 transition-transform" title="${report.category}">
            📍
          </div>
        `,
        className: 'custom-report-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker(report.coordinates, { icon: reportIcon });
      marker.bindPopup(`
        <div style="font-family: inherit; min-width: 200px; color: #FFF5EE; padding: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 10px; background: #2C201A; color: #FFAA7A; font-weight: 700; padding: 2px 6px; border-radius: 4px; border: 1px solid #543C30;">
              ${report.category}
            </span>
            <span style="font-size: 10px; color: #B88E77;">${report.timestamp}</span>
          </div>
          <p style="font-size: 11px; margin: 0 0 6px 0; color: #D6B49F;">${report.description}</p>
          <div style="font-size: 10px; color: #B88E77;">📍 ${report.address} (${report.district})</div>
          <div style="font-size: 10px; font-weight: 600; color: #FFAA7A; margin-top: 4px;">👍 ${report.upvotes} Citizens confirmed</div>
        </div>
      `);
      layer.addLayer(marker);
    });
  }, [citizenReports]);

  // Pan to selected district
  useEffect(() => {
    if (selectedDistrict && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(selectedDistrict.center, 14, { duration: 1.0 });
    }
  }, [selectedDistrict]);

  return <div ref={mapContainerRef} className="w-full h-full min-h-[460px] rounded-xl overflow-hidden shadow-2xl" />;
}
