"use client";

import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  IGRPCard,
  IGRPCardContent,
  IGRPCardHeader,
  IGRPCardTitle,
  IGRPIcon,
} from "@igrp/igrp-framework-react-design-system";
import type { Cemetery } from "@/app/(myapp)/types/cemetery";
import type { MapData } from "@/app/(myapp)/types/Map";

interface CemeteryMapProps {
  selectedCemetery: Cemetery | null;
  mapData: MapData | null;
  showSkeleton: boolean;
  mapError: string | null;
  setMapError: (error: string | null) => void;
  onMapInstance?: (map: maplibregl.Map) => void;
}

export default function CemeteryMap({
  selectedCemetery,
  mapData,
  showSkeleton,
  mapError,
  setMapError,
  onMapInstance,
}: CemeteryMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  // Effect to initialize map
  useEffect(() => {
    if (
      !mapContainerRef.current ||
      !selectedCemetery?.geoPoint ||
      mapInstanceRef.current
    )
      return;

    const styleUrl =
      mapData?.style?.url || "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: [styleUrl],
              tileSize: 256,
              attribution: "© OpenStreetMap contributors",
            },
          },
          layers: [
            {
              id: "osm",
              type: "raster",
              source: "osm",
            },
          ],
        } as any,
        center: [
          selectedCemetery.geoPoint.longitude,
          selectedCemetery.geoPoint.latitude,
        ],
        zoom: 16,
      });

      map.addControl(new maplibregl.NavigationControl(), "top-right");

      // Add marker
      const marker = new maplibregl.Marker({ color: "#ef4444" })
        .setLngLat([
          selectedCemetery.geoPoint.longitude,
          selectedCemetery.geoPoint.latitude,
        ])
        .addTo(map);

      mapInstanceRef.current = map;
      markerRef.current = marker;

      if (onMapInstance) {
        onMapInstance(map);
      }

      // Add error event listener
      map.on("error", (e) => {
        console.error("Map error:", e);
        setMapError("Erro ao carregar o mapa. Por favor, tente novamente.");
      });
    } catch (err) {
      console.error("Error initializing map:", err);
      setMapError("Não foi possível inicializar o mapa.");
    }

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [selectedCemetery, mapData, onMapInstance, setMapError]);

  if (showSkeleton) {
    return (
      <IGRPCard>
        <IGRPCardHeader>
          <div className="h-6 w-48 bg-gray-200 animate-pulse rounded" />
        </IGRPCardHeader>
        <IGRPCardContent className="space-y-4">
          <div className="h-64 bg-gray-200 animate-pulse rounded" />
        </IGRPCardContent>
      </IGRPCard>
    );
  }

  return (
    <IGRPCard className="flex flex-col h-full overflow-hidden">
      <IGRPCardHeader className="pb-2">
        <IGRPCardTitle className="flex items-center">
          <IGRPIcon iconName="Map" className="h-5 w-5 mr-2" />
          Localização
        </IGRPCardTitle>
      </IGRPCardHeader>
      <div className="flex-1 min-h-[300px] relative">
        {mapError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-red-500 font-medium p-4 text-center">
            {mapError}
          </div>
        ) : !selectedCemetery?.geoPoint ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-muted-foreground">
            Localização não disponível
          </div>
        ) : (
          <div
            ref={mapContainerRef}
            className="absolute inset-0 w-full h-full"
          />
        )}
      </div>
    </IGRPCard>
  );
}
