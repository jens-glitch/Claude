"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Apartment {
  id: string;
  address: string;
  city: string;
  rooms: number;
  rent: number;
  latitude: number;
  longitude: number;
  user: {
    name: string | null;
  };
}

interface ApartmentMapProps {
  apartments: Apartment[];
  onApartmentClick?: (apartmentId: string) => void;
  center?: [number, number];
  zoom?: number;
}

export function ApartmentMap({
  apartments,
  onApartmentClick,
  center = [59.3293, 18.0686], // Stockholm default
  zoom = 6,
}: ApartmentMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(center, zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add markers for apartments
    apartments.forEach((apartment) => {
      if (mapRef.current) {
        const marker = L.marker([apartment.latitude, apartment.longitude])
          .addTo(mapRef.current)
          .bindPopup(
            `
            <div class="p-2">
              <h3 class="font-semibold">${apartment.address}</h3>
              <p class="text-sm">${apartment.city}</p>
              <p class="text-sm">${apartment.rooms} rum • ${apartment.rent} kr/mån</p>
              <p class="text-sm text-muted-foreground">Uthyrare: ${apartment.user.name || "Okänd"}</p>
            </div>
            `
          );

        if (onApartmentClick) {
          marker.on("click", () => onApartmentClick(apartment.id));
        }

        markersRef.current.push(marker);
      }
    });

    // Fit bounds if there are apartments
    if (apartments.length > 0 && mapRef.current) {
      const bounds = L.latLngBounds(
        apartments.map((apt) => [apt.latitude, apt.longitude])
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [apartments, onApartmentClick, center, zoom]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div ref={mapContainerRef} className="w-full h-full min-h-[400px] rounded-lg" />;
}
