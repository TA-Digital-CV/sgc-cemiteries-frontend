/* eslint-disable @typescript-eslint/no-explicit-any */
// Temporary type relaxations while aligning hook API to Map types.
// Filters and configuration will be revisited when backend schemas are integrated.
import { useCallback, useEffect, useState } from "react";
import {
  type ActionResult,
  ApiResponse,
  PaginatedResponse,
} from "@/types/Common";
import type {
  HeatmapPoint,
  MapData,
  MapLayer,
  MapMarker,
  MapSearchResult,
  MapViewport,
} from "@/types/Map";

interface UseMapReturn {
  // Estado do mapa
  mapData: MapData | null;
  layers: MapLayer[];
  markers: MapMarker[];
  heatmapPoints: HeatmapPoint[];
  viewport: MapViewport;
  loading: boolean;
  error: string | null;

  // Filtros e busca
  filters: any;
  searchResults: MapSearchResult[];
  searchQuery: string;

  // Ações
  setViewport: (viewport: MapViewport) => void;
  setFilters: (filters: any) => void;
  setSearchQuery: (query: string) => void;
  fetchMapData: (cemeteryId: string) => Promise<void>;
  fetchLayers: (cemeteryId: string) => Promise<void>;
  fetchMarkers: (cemeteryId: string) => Promise<void>;
  fetchHeatmapData: (cemeteryId: string) => Promise<void>;
  searchLocations: (query: string, cemeteryId?: string) => Promise<void>;
  addMarker: (
    marker: Omit<MapMarker, "id">,
  ) => Promise<ActionResult<MapMarker>>;
  updateMarker: (
    markerId: string,
    updates: Partial<MapMarker>,
  ) => Promise<ActionResult<MapMarker>>;
  deleteMarker: (markerId: string) => Promise<ActionResult<void>>;
  toggleLayer: (layerId: string) => void;
  clearSearch: () => void;
  centerOnLocation: (
    latitude: number,
    longitude: number,
    cemeteryId?: string,
  ) => void;
  exportMap: (format: "png" | "pdf" | "svg") => Promise<ActionResult<any>>;
  printMap: () => Promise<ActionResult<any>>;
}

export function useMap(): UseMapReturn {
  // Estado do mapa
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [layers, setLayers] = useState<MapLayer[]>([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [heatmapPoints, setHeatmapPoints] = useState<HeatmapPoint[]>([]);
  const [viewport, setViewport] = useState<MapViewport>({
    center: { latitude: -23.5505, longitude: -46.6333 },
    zoom: 12,
    bounds: {
      northEast: { latitude: -23.5405, longitude: -46.6233 },
      southWest: { latitude: -23.5605, longitude: -46.6433 },
    },
    bearing: 0,
    pitch: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros e busca
  const [filters, setFilters] = useState<any>({
    status: "all",
    plotTypes: [],
  });
  const [searchResults, setSearchResults] = useState<MapSearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Funções de busca de dados
  /**
   * fetchMapData
   * Retrieves GeoJSON map data from backend and maps to MapData.
   */
  const fetchMapData = useCallback(async (cemeteryId: string) => {
    try {
      setLoading(true);
      setError(null);
      const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
      const res = await fetch(
        `${API_BASE}/api/v1/cemeteries/${cemeteryId}/map-data?level=BLOCKS&format=GEOJSON`,
        { headers: { "Content-Type": "application/json" }, cache: "no-store" },
      );
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const json: any = await res.json();
      const features: any[] = Array.isArray(json?.features)
        ? json.features
        : [];
      const bounds = json?.metadata?.bounds;
      const centerLat = bounds
        ? (Number(bounds.minLat) + Number(bounds.maxLat)) / 2
        : 0;
      const centerLng = bounds
        ? (Number(bounds.minLng) + Number(bounds.maxLng)) / 2
        : 0;
      const geoLayer: MapLayer = {
        id: "blocks",
        name: "Blocos",
        type: "GEOJSON",
        visible: true,
        opacity: 0.6,
        zIndex: 1,
        data: { geoJson: { type: "FeatureCollection", features } },
        style: {
          strokeColor: "#6b7280",
          fillColor: "#f3f4f6",
          fillOpacity: 0.5,
          strokeWidth: 2,
        },
      };
      setMapData({
        id: cemeteryId,
        cemeteryId,
        name: String(json?.metadata?.cemeteryId ?? cemeteryId),
        center: { latitude: centerLat, longitude: centerLng },
        zoom: 12,
        bounds: bounds
          ? {
              northEast: {
                latitude: Number(bounds.maxLat ?? 0),
                longitude: Number(bounds.maxLng ?? 0),
              },
              southWest: {
                latitude: Number(bounds.minLat ?? 0),
                longitude: Number(bounds.minLng ?? 0),
              },
            }
          : {
              northEast: { latitude: centerLat, longitude: centerLng },
              southWest: { latitude: centerLat, longitude: centerLng },
            },
        layers: [geoLayer],
        markers: [],
        controls: {
          zoom: true,
          pan: true,
          rotate: false,
          scale: true,
          fullscreen: true,
          search: true,
          layers: true,
          measure: false,
          draw: false,
          print: true,
          share: true,
        },
        style: {
          name: "OpenStreetMap",
          url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution: "© OpenStreetMap contributors",
          maxZoom: 19,
          minZoom: 2,
          tileSize: 256,
        },
        lastUpdated: new Date().toISOString(),
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar dados do mapa",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * fetchLayers
   * Loads PLOTS GeoJSON and builds layer definitions.
   */
  const fetchLayers = useCallback(async (cemeteryId: string) => {
    try {
      setLoading(true);
      setError(null);
      const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
      const res = await fetch(
        `${API_BASE}/api/v1/cemeteries/${cemeteryId}/map-data?level=PLOTS&format=GEOJSON`,
        { headers: { "Content-Type": "application/json" }, cache: "no-store" },
      );
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const json: any = await res.json();
      const features: any[] = Array.isArray(json?.features)
        ? json.features
        : [];
      const plotLayer: MapLayer = {
        id: "plots",
        name: "Sepulturas",
        type: "GEOJSON",
        visible: true,
        opacity: 1,
        zIndex: 2,
        data: { geoJson: { type: "FeatureCollection", features } },
        style: { strokeColor: "#3b82f6" },
      };
      setLayers([plotLayer]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar camadas");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * fetchMarkers
   * Extracts point features from PLOTS GeoJSON into MapMarker entries.
   */
  const fetchMarkers = useCallback(async (cemeteryId: string) => {
    try {
      setLoading(true);
      setError(null);
      const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
      const res = await fetch(
        `${API_BASE}/api/v1/cemeteries/${cemeteryId}/map-data?level=PLOTS&format=GEOJSON`,
        { headers: { "Content-Type": "application/json" }, cache: "no-store" },
      );
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const json: any = await res.json();
      const features: any[] = Array.isArray(json?.features)
        ? json.features
        : [];
      const mk: MapMarker[] = features
        .filter((f) => f?.geometry?.type === "Point")
        .map((f) => {
          const coords = Array.isArray(f?.geometry?.coordinates)
            ? f.geometry.coordinates
            : [0, 0];
          const props = f?.properties ?? {};
          return {
            id: String(props.id ?? crypto.randomUUID()),
            cemeteryId,
            position: {
              latitude: Number(coords[1] ?? 0),
              longitude: Number(coords[0] ?? 0),
            },
            type: "PLOT",
            status: "ACTIVE",
            title: String(props.name ?? props.plotNumber ?? "Plot"),
            description: String(props.type ?? ""),
            color: "#3b82f6",
            size: "MEDIUM",
            metadata: props,
          } as MapMarker;
        });
      setMarkers(mk);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar marcadores",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * fetchHeatmapData
   * Loads heatmap grid for cemetery and maps to HeatmapPoint entries.
   */
  const fetchHeatmapData = useCallback(async (cemeteryId: string) => {
    try {
      setLoading(true);
      setError(null);
      const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
      const res = await fetch(
        `${API_BASE}/api/v1/cemeteries/${cemeteryId}/heatmap-data?gridSize=50&metric=OCCUPANCY`,
        { headers: { "Content-Type": "application/json" }, cache: "no-store" },
      );
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const json: any = await res.json();
      const grid: any[] = Array.isArray(json?.data) ? json.data : [];
      const points: HeatmapPoint[] = grid.map((cell) => ({
        lat: Number(cell.coordinates?.latitude ?? 0),
        lng: Number(cell.coordinates?.longitude ?? 0),
        intensity: Number(cell.value ?? 0),
        weight: 1,
      }));
      setHeatmapPoints(points);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar dados de mapa de calor",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const searchLocations = useCallback(
    async (query: string, cemeteryId?: string) => {
      try {
        setLoading(true);
        setError(null);

        // Simular chamada API - substituir por chamada real
        await new Promise((resolve) => setTimeout(resolve, 300));

        const mockSearchResults: MapSearchResult[] = [
          {
            id: "plot-A001",
            type: "PLOT",
            name: "Sepultura A001",
            description: "Sepultura individual",
            position: { latitude: -23.5505, longitude: -46.6333 },
            relevance: 0.9,
            data: {},
          },
          {
            id: "block-A",
            type: "BLOCK",
            name: "Bloco A",
            description: "Bloco principal",
            position: { latitude: -23.5505, longitude: -46.6333 },
            relevance: 0.7,
            data: {},
          },
        ];

        setSearchResults(mockSearchResults);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao buscar localizações",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const addMarker = useCallback(
    async (marker: Omit<MapMarker, "id">): Promise<ActionResult<MapMarker>> => {
      try {
        setLoading(true);
        setError(null);

        // Simular chamada API - substituir por chamada real
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newMarker: MapMarker = {
          ...marker,
          id: Date.now().toString(),
        };

        setMarkers((prev) => [...prev, newMarker]);

        return { success: true, data: newMarker };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao adicionar marcador";
        setError(errorMessage);
        return { success: false, errors: [errorMessage] };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateMarker = useCallback(
    async (
      markerId: string,
      updates: Partial<MapMarker>,
    ): Promise<ActionResult<MapMarker>> => {
      try {
        setLoading(true);
        setError(null);

        // Simular chamada API - substituir por chamada real
        await new Promise((resolve) => setTimeout(resolve, 500));

        setMarkers((prev) =>
          prev.map((marker) =>
            marker.id === markerId ? { ...marker, ...updates } : marker,
          ),
        );

        const updatedMarker = markers.find((m) => m.id === markerId);
        if (updatedMarker) {
          return { success: true, data: { ...updatedMarker, ...updates } };
        }

        return { success: false, errors: ["Marcador não encontrado"] };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao atualizar marcador";
        setError(errorMessage);
        return { success: false, errors: [errorMessage] };
      } finally {
        setLoading(false);
      }
    },
    [markers],
  );

  const deleteMarker = useCallback(
    async (markerId: string): Promise<ActionResult<void>> => {
      try {
        setLoading(true);
        setError(null);

        // Simular chamada API - substituir por chamada real
        await new Promise((resolve) => setTimeout(resolve, 500));

        setMarkers((prev) => prev.filter((marker) => marker.id !== markerId));

        return { success: true };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao excluir marcador";
        setError(errorMessage);
        return { success: false, errors: [errorMessage] };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const toggleLayer = useCallback((layerId: string) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer,
      ),
    );
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
  }, []);

  const centerOnLocation = useCallback(
    (latitude: number, longitude: number, _cemeteryId?: string) => {
      setViewport((prev) => ({
        ...prev,
        center: { latitude, longitude },
        zoom: Math.max(prev.zoom, 16),
      }));
    },
    [],
  );

  const exportMap = useCallback(
    async (format: "png" | "pdf" | "svg"): Promise<ActionResult<any>> => {
      try {
        setLoading(true);
        setError(null);

        // Simular exportação - substituir por implementação real
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Criar um canvas ou elemento para exportação
        // Esta é uma implementação simplificada
        const dataUrl =
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

        const link = document.createElement("a");
        link.download = `map-${new Date().toISOString().split("T")[0]}.${format}`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return {
          success: true,
          data: { message: "Mapa exportado com sucesso" },
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao exportar mapa";
        setError(errorMessage);
        return { success: false, errors: [errorMessage] };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const printMap = useCallback(async (): Promise<ActionResult<any>> => {
    try {
      setLoading(true);
      setError(null);

      // Simular impressão - abrir diálogo de impressão
      window.print();

      return {
        success: true,
        data: { message: "Diálogo de impressão aberto" },
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao imprimir mapa";
      setError(errorMessage);
      return { success: false, errors: [errorMessage] };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Estado do mapa
    mapData,
    layers,
    markers,
    heatmapPoints,
    viewport,
    loading,
    error,

    // Filtros e busca
    filters,
    searchResults,
    searchQuery,

    // Ações
    setViewport,
    setFilters,
    setSearchQuery,
    fetchMapData,
    fetchLayers,
    fetchMarkers,
    fetchHeatmapData,
    searchLocations,
    addMarker,
    updateMarker,
    deleteMarker,
    toggleLayer,
    clearSearch,
    centerOnLocation,
    exportMap,
    printMap,
  };
}
