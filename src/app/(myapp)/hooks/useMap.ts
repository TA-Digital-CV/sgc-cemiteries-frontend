/* eslint-disable @typescript-eslint/no-explicit-any */
// Temporary type relaxations while aligning hook API to Map types.
// Filters and configuration will be revisited when backend schemas are integrated.
import { useCallback, useEffect, useState } from "react";
import {
  type ActionResult,
  ApiResponse,
  PaginatedResponse,
} from "@/app/(myapp)/types/Common";
import type {
  HeatmapPoint,
  MapData,
  MapLayer,
  MapMarker,
  MapSearchResult,
  MapViewport,
} from "@/app/(myapp)/types/Map";

interface UseMapReturn {
  // Estado do mapa
  mapData: MapData | null;
  layers: MapLayer[];
  markers: MapMarker[];
  heatmapPoints: HeatmapPoint[];
  viewport: MapViewport;
  activeLevel: "CEMETERY" | "BLOCKS" | "SECTIONS" | "PLOTS";
  legendItems: Array<{ label: string; color: string }>;
  loading: boolean;
  error: string | null;

  // Filtros e busca
  filters: Record<string, unknown>;
  searchResults: MapSearchResult[];
  searchQuery: string;

  // Ações
  setViewport: (viewport: MapViewport) => void;
  setActiveLevel: (level: "CEMETERY" | "BLOCKS" | "SECTIONS" | "PLOTS") => void;
  setFilters: (filters: Record<string, unknown>) => void;
  setSearchQuery: (query: string) => void;
  fetchMapData: (cemeteryId: string) => Promise<void>;
  fetchLayers: (cemeteryId: string) => Promise<void>;
  fetchSections: (cemeteryId: string) => Promise<void>;
  fetchBlocks: (cemeteryId: string) => Promise<void>;
  fetchMarkers: (cemeteryId: string) => Promise<void>;
  fetchHeatmapData: (cemeteryId: string) => Promise<void>;
  fetchOccupancy: (cemeteryId: string) => Promise<void>;
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
  exportMap: (format: "png" | "pdf" | "svg") => Promise<ActionResult<unknown>>;
  printMap: () => Promise<ActionResult<unknown>>;
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
  const [activeLevel, setActiveLevel] = useState<
    "CEMETERY" | "BLOCKS" | "SECTIONS" | "PLOTS"
  >("BLOCKS");
  const [legendItems, setLegendItems] = useState<
    Array<{ label: string; color: string }>
  >([
    { label: "Available", color: "#22c55e" },
    { label: "Occupied", color: "#ef4444" },
    { label: "Reserved", color: "#f59e0b" },
    { label: "Maintenance", color: "#fb923c" },
  ]);

  // Filtros e busca
  const [filters, setFilters] = useState<Record<string, unknown>>({
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
      const json: unknown = await res.json();
      const j = json as {
        features?: unknown[];
        metadata?: { bounds?: unknown };
      };
      const features: unknown[] = Array.isArray(j.features) ? j.features : [];
      const bounds = (j.metadata as any)?.bounds;
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
        minZoom: 10,
        maxZoom: 22,
      };
      setMapData({
        id: cemeteryId,
        cemeteryId,
        name: String((json as any)?.metadata?.cemeteryId ?? cemeteryId),
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
      // SECTIONS
      const resSections = await fetch(
        `${API_BASE}/api/v1/cemeteries/${cemeteryId}/map-data?level=SECTIONS&format=GEOJSON`,
        { headers: { "Content-Type": "application/json" }, cache: "no-store" },
      );
      if (!resSections.ok)
        throw new Error(`Fetch failed: ${resSections.status}`);
      const jsonSections: unknown = await resSections.json();
      const s = jsonSections as { features?: unknown[] };
      const sectionFeatures: unknown[] = Array.isArray(s.features)
        ? s.features
        : [];
      const sectionsLayer: MapLayer = {
        id: "sections",
        name: "Seções",
        type: "GEOJSON",
        visible: true,
        opacity: 0.8,
        zIndex: 2,
        data: {
          geoJson: { type: "FeatureCollection", features: sectionFeatures },
        },
        style: {
          strokeColor: "#10b981",
          fillColor: "#d1fae5",
          fillOpacity: 0.35,
        },
        minZoom: 13,
        maxZoom: 22,
      };

      // PLOTS
      const resPlots = await fetch(
        `${API_BASE}/api/v1/cemeteries/${cemeteryId}/map-data?level=PLOTS&format=GEOJSON`,
        { headers: { "Content-Type": "application/json" }, cache: "no-store" },
      );
      if (!resPlots.ok) throw new Error(`Fetch failed: ${resPlots.status}`);
      const jsonPlots: unknown = await resPlots.json();
      const jp = jsonPlots as { features?: unknown[] };
      const plotFeatures: unknown[] = Array.isArray(jp.features)
        ? jp.features
        : [];
      const plotsLayer: MapLayer = {
        id: "plots",
        name: "Sepulturas",
        type: "GEOJSON",
        visible: true,
        opacity: 1,
        zIndex: 3,
        data: {
          geoJson: { type: "FeatureCollection", features: plotFeatures },
        },
        style: { strokeColor: "#3b82f6" },
        minZoom: 15,
        maxZoom: 22,
      };

      setLayers([sectionsLayer, plotsLayer]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar camadas");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * fetchBlocks
   * Loads BLOCKS as a dedicated layer when needed (used in hierarchy navigation).
   */
  const fetchBlocks = useCallback(async (cemeteryId: string) => {
    try {
      setLoading(true);
      setError(null);
      const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
      const res = await fetch(
        `${API_BASE}/api/v1/cemeteries/${cemeteryId}/map-data?level=BLOCKS&format=GEOJSON`,
        { headers: { "Content-Type": "application/json" }, cache: "no-store" },
      );
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const json: unknown = await res.json();
      const j = json as { features?: unknown[] };
      const features: unknown[] = Array.isArray(j.features) ? j.features : [];
      const blocksLayer: MapLayer = {
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
        },
        minZoom: 10,
        maxZoom: 22,
      };
      // Prepend/merge blocks into mapData.layers
      setMapData((prev) =>
        prev
          ? {
              ...prev,
              layers: [blocksLayer, ...(prev.layers ?? [])],
              lastUpdated: new Date().toISOString(),
            }
          : null,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar blocos");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * fetchSections
   * Public alias to load sections layer; calls the same endpoint used in fetchLayers.
   */
  const fetchSections = useCallback(
    async (cemeteryId: string) => {
      await fetchLayers(cemeteryId);
    },
    [fetchLayers],
  );

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
      const json: unknown = await res.json();
      const j = json as { features?: unknown[] };
      const features: unknown[] = Array.isArray(j.features) ? j.features : [];
      const mk: MapMarker[] = features
        .filter((f) => (f as any)?.geometry?.type === "Point")
        .map((f) => {
          const coords = Array.isArray((f as any)?.geometry?.coordinates)
            ? (f as any).geometry.coordinates
            : [0, 0];
          const props = (f as any)?.properties ?? {};
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
      const json: unknown = await res.json();
      const j = json as { data?: unknown[] };
      const grid: unknown[] = Array.isArray(j.data) ? j.data : [];
      const points: HeatmapPoint[] = grid.map((cell) => ({
        lat: Number((cell as any).coordinates?.latitude ?? 0),
        lng: Number((cell as any).coordinates?.longitude ?? 0),
        intensity: Number((cell as any).value ?? 0),
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

  /**
   * fetchOccupancy
   * Loads occupancy breakdown and updates legend for status colors.
   */
  const fetchOccupancy = useCallback(async (cemeteryId: string) => {
    try {
      setLoading(true);
      setError(null);
      const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
      const res = await fetch(
        `${API_BASE}/api/v1/cemeteries/${cemeteryId}/occupancy?breakdown=PLOT_TYPES`,
        { headers: { "Content-Type": "application/json" }, cache: "no-store" },
      );
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      // We only need to confirm availability of data and keep legend consistent
      setLegendItems([
        { label: "Available", color: "#22c55e" },
        { label: "Occupied", color: "#ef4444" },
        { label: "Reserved", color: "#f59e0b" },
        { label: "Maintenance", color: "#fb923c" },
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar ocupação",
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

  /**
   * zoomToBounds
   * Adjusts viewport bounds and zoom for a given area.
   */
  const zoomToBounds = useCallback((bounds: MapViewport["bounds"]) => {
    setViewport((prev) => ({ ...prev, bounds, zoom: Math.max(prev.zoom, 14) }));
  }, []);

  /**
   * focusOnFeature
   * Recenters the viewport in response to a selected feature (from any layer).
   */
  const focusOnFeature = useCallback(
    (featureId: string) => {
      const allFeatures = [
        ...(mapData?.layers?.flatMap((l) => l.data?.geoJson?.features ?? []) ??
          []),
        ...layers.flatMap((l) => l.data?.geoJson?.features ?? []),
      ];
      const f = allFeatures.find(
        (f: any) => String(f?.properties?.id) === featureId,
      ) as any;
      const coords = f?.geometry?.coordinates;
      if (Array.isArray(coords) && coords.length >= 2) {
        const [lng, lat] = Array.isArray(coords[0]) ? coords[0] : coords;
        centerOnLocation(Number(lat ?? 0), Number(lng ?? 0));
      }
    },
    [centerOnLocation, layers, mapData],
  );

  return {
    // Estado do mapa
    mapData,
    layers,
    markers,
    heatmapPoints,
    viewport,
    activeLevel,
    legendItems,
    loading,
    error,

    // Filtros e busca
    filters,
    searchResults,
    searchQuery,

    // Ações
    setViewport,
    setActiveLevel,
    setFilters,
    setSearchQuery,
    fetchMapData,
    fetchLayers,
    fetchSections,
    fetchBlocks,
    fetchMarkers,
    fetchHeatmapData,
    fetchOccupancy,
    searchLocations,
    addMarker,
    updateMarker,
    deleteMarker,
    toggleLayer,
    clearSearch,
    centerOnLocation,
    exportMap,
    printMap,
    // helpers
    // (expostos para navegação hierárquica)
    // Note: helpers não incluídos na interface por compatibilidade atual
  };
}
