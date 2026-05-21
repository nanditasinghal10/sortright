"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L, { type Map as LeafletMap, type Marker as LeafletMarker } from "leaflet";
import type { Coords, Dropoff } from "@/lib/api";

interface Props {
  center: Coords | null;
  dropoffs: Dropoff[];
}

const DEFAULT_CENTER: Coords = { lat: 37.77, lng: -122.42 };

const userIcon = L.divIcon({
  className: "sortright-user-marker",
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
    <circle cx="11" cy="11" r="9" fill="#C18957" stroke="#FCFBF7" stroke-width="3"/>
    <circle cx="11" cy="11" r="3" fill="#FCFBF7"/>
  </svg>`
});

const dropoffIcon = L.divIcon({
  className: "sortright-dropoff-marker",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -26],
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
    <path d="M14 1 C7.4 1 2.5 5.6 2.5 11.6 c0 7.7 9.6 14.6 11 15.4 c1.4 -0.8 11 -7.7 11 -15.4 C25.5 5.6 20.6 1 14 1 z"
      fill="#647A4D" stroke="#3A4730" stroke-width="1.4"/>
    <circle cx="14" cy="11.5" r="4" fill="#F4EFE6"/>
  </svg>`
});

export default function DropoffMap({ center, dropoffs }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LeafletMarker[]>([]);
  const userMarkerRef = useRef<LeafletMarker | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const c = center ?? DEFAULT_CENTER;
    const map = L.map(containerRef.current, {
      center: [c.lat, c.lng],
      zoom: 12,
      scrollWheelZoom: false,
      zoomControl: true
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = [];
      userMarkerRef.current = null;
    };
  }, [center]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !center) return;
    map.setView([center.lat, center.lng], map.getZoom());
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([center.lat, center.lng]);
    } else {
      userMarkerRef.current = L.marker([center.lat, center.lng], {
        icon: userIcon,
        title: "You"
      }).addTo(map);
    }
  }, [center]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const bounds: [number, number][] = [];
    dropoffs.forEach((d) => {
      const marker = L.marker([d.lat, d.lng], { icon: dropoffIcon }).addTo(map);
      const distance =
        typeof d.distanceKm === "number"
          ? d.distanceKm < 1
            ? `${Math.round(d.distanceKm * 1000)} m`
            : `${d.distanceKm.toFixed(1)} km`
          : "";
      const safeName = escapeHtml(d.name);
      const safeAddress = escapeHtml(d.address);
      const safeMaterials = d.materials.slice(0, 6).map(escapeHtml).join(", ");
      marker.bindPopup(
        `<div style="font-family: system-ui, sans-serif; min-width: 180px;">
          <strong style="color:#3A4730;">${safeName}</strong>
          <div style="color:#4A4A40; font-size: 12px; margin-top: 4px;">${safeAddress}</div>
          ${distance ? `<div style="color:#7E5634; font-size: 12px; margin-top: 4px;">${distance} away</div>` : ""}
          <div style="color:#4D5D3D; font-size: 11px; margin-top: 6px;">${safeMaterials}</div>
        </div>`
      );
      markersRef.current.push(marker);
      bounds.push([d.lat, d.lng]);
    });

    if (bounds.length > 0 && center) {
      bounds.push([center.lat, center.lng]);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }, [dropoffs, center]);

  return (
    <div
      ref={containerRef}
      className="h-[420px] md:h-[560px] w-full rounded-organic overflow-hidden border border-sage-200/70 shadow-soft bg-cream-100"
      aria-label="Map of nearby drop-off locations"
    />
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
