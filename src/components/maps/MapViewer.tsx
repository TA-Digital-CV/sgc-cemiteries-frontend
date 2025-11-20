"use client";

import {
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPCardDescription,
  IGRPCardHeader,
  IGRPCardTitle,
  IGRPCheckbox,
  IGRPIcon,
  IGRPInputText,
  IGRPLabel,
  IGRPSelect,
} from "@igrp/igrp-framework-react-design-system";
import { useCallback, useEffect, useState } from "react";
import { useMap } from "@/app/(myapp)/hooks/useMap";
import type {
  LayerStyle,
  LayerType,
  MapViewport,
} from "@/app/(myapp)/types/Map";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// Available map layers used for UI toggling only (not full MapLayer objects)
const AVAILABLE_LAYERS: Array<{
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  style: LayerStyle;
}> = [
  {
    id: "plots",
    name: "Sepulturas",
    type: "MARKER" as LayerType,
    visible: true,
    style: { strokeColor: "#3b82f6", icon: "grave" },
  },
  {
    id: "blocks",
    name: "Blocos",
    type: "POLYGON" as LayerType,
    visible: true,
    style: { strokeColor: "#6b7280", fillColor: "#f3f4f6" },
  },
  {
    id: "sections",
    name: "Seções",
    type: "POLYGON" as LayerType,
    visible: false,
    style: { strokeColor: "#10b981", fillColor: "#d1fae5" },
  },
  {
    id: "lots",
    name: "Lotes",
    type: "POLYGON" as LayerType,
    visible: false,
    style: { strokeColor: "#f59e0b", fillColor: "#fef3c7" },
  },
  {
    id: "roads",
    name: "Vias",
    type: "POLYLINE" as LayerType,
    visible: true,
    style: { strokeColor: "#8b5cf6" },
  },
  {
    id: "vegetation",
    name: "Vegetação",
    type: "POLYGON" as LayerType,
    visible: false,
    style: { strokeColor: "#22c55e", fillColor: "#dcfce7" },
  },
  {
    id: "buildings",
    name: "Edificações",
    type: "POLYGON" as LayerType,
    visible: false,
    style: { strokeColor: "#ef4444", fillColor: "#fee2e2" },
  },
];

interface MapViewerProps {
  cemeteryId?: string;
  className?: string;
}

/**
 * MapViewer renders map controls, search, layers, and printing features.
 * Uses stable keys for search result items to avoid index-based key warnings.
 */
export function MapViewer({ cemeteryId, className }: MapViewerProps) {
  const {
    mapData,
    layers: _layers,
    markers,
    heatmapPoints: _heatmapPoints,
    viewport: _viewport,
    activeLevel,
    legendItems,
    searchResults,
    loading,
    error: _error,
    fetchMapData,
    fetchLayers,
    fetchSections,
    fetchBlocks,
    fetchMarkers,
    fetchHeatmapData,
    fetchOccupancy,
    searchLocations,
    addMarker: _addMarker,
    updateMarker: _updateMarker,
    deleteMarker,
    toggleLayer,
    clearSearch,
    centerOnLocation,
    exportMap,
    printMap,
    setActiveLevel,
  } = useMap();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLayers, setSelectedLayers] = useState<string[]>([
    "plots",
    "blocks",
  ]);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [mapViewport, setMapViewport] = useState<MapViewport>({
    center: { latitude: -23.5505, longitude: -46.6333 }, // São Paulo
    zoom: 15,
    bounds: {
      northEast: { latitude: -23.5405, longitude: -46.6233 },
      southWest: { latitude: -23.5605, longitude: -46.6433 },
    },
    bearing: 0,
    pitch: 0,
  });

  const [filters, setFilters] = useState({
    plotType: "all",
    status: "all",
    block: "all",
    section: "all",
    lot: "all",
  });

  const loadMapDataCb = useCallback(async () => {
    if (!cemeteryId) return;
    await Promise.all([
      fetchMapData(cemeteryId),
      fetchBlocks(cemeteryId),
      fetchSections(cemeteryId),
      fetchLayers(cemeteryId),
      fetchMarkers(cemeteryId),
      fetchHeatmapData(cemeteryId),
      fetchOccupancy(cemeteryId),
    ]);
  }, [cemeteryId, fetchMapData, fetchLayers, fetchMarkers, fetchHeatmapData]);

  useEffect(() => {
    void loadMapDataCb();
  }, [loadMapDataCb]);

  const _loadMapData = async () => {
    if (!cemeteryId) return;

    await Promise.all([
      fetchMapData(cemeteryId),
      fetchBlocks(cemeteryId),
      fetchSections(cemeteryId),
      fetchLayers(cemeteryId),
      fetchMarkers(cemeteryId),
      fetchHeatmapData(cemeteryId),
      fetchOccupancy(cemeteryId),
    ]);
  };

  /**
   * Executes a location search using the map hook API.
   * Ensures query and cemetery context are present before requesting.
   */
  const handleSearch = async () => {
    if (!searchQuery.trim() || !cemeteryId) return;
    await searchLocations(searchQuery, cemeteryId);
  };

  const handleLayerToggle = (layerId: string) => {
    const newSelectedLayers = selectedLayers.includes(layerId)
      ? selectedLayers.filter((id) => id !== layerId)
      : [...selectedLayers, layerId];

    setSelectedLayers(newSelectedLayers);
    toggleLayer(layerId);
  };

  const handleZoomIn = () => {
    setMapViewport((prev) => ({ ...prev, zoom: Math.min(prev.zoom + 1, 20) }));
  };

  const handleZoomOut = () => {
    setMapViewport((prev) => ({ ...prev, zoom: Math.max(prev.zoom - 1, 1) }));
  };

  /**
   * Centers the map on the current viewport center using precise coordinates.
   */
  const handleCenterMap = () => {
    if (cemeteryId) {
      centerOnLocation(
        mapViewport.center.latitude,
        mapViewport.center.longitude,
      );
    }
  };

  /**
   * Exports the current map view in the selected format.
   */
  const handleExport = async (format: "pdf" | "png" | "svg") => {
    if (!cemeteryId) return;
    await exportMap(format);
  };

  /**
   * Triggers the print dialog for the current map view.
   */
  const handlePrint = async () => {
    if (!cemeteryId) return;
    await printMap();
  };

  const availableLayers = AVAILABLE_LAYERS;

  // MapLibre GL rendering
  useEffect(() => {
    const container = document.getElementById("cemetery-map-container");
    if (!container || !mapData) return;

    const map = new maplibregl.Map({
      container,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: [mapData.style.url],
            tileSize: mapData.style.tileSize,
            attribution: mapData.style.attribution,
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
      center: [mapViewport.center.longitude, mapViewport.center.latitude],
      zoom: mapViewport.zoom,
    });

    // Add layers from mapData and hook layers
    const allLayers = [...(mapData.layers ?? []), ..._layers];
    allLayers.forEach((layer) => {
      if (!layer.data?.geoJson) return;
      const srcId = `src-${layer.id}`;
      const lyrId = `lyr-${layer.id}`;
      if (!map.getSource(srcId)) {
        map.addSource(srcId, {
          type: "geojson",
          data: layer.data.geoJson as any,
        });
      }
      if (!map.getLayer(lyrId)) {
        const isPlots = layer.id === "plots";
        const paint: any = isPlots
          ? {
              "fill-color": [
                "match",
                ["get", "occupationStatus"],
                "AVAILABLE",
                "#22c55e",
                "OCCUPIED",
                "#ef4444",
                "RESERVED",
                "#f59e0b",
                "MAINTENANCE",
                "#fb923c",
                layer.style?.fillColor ?? layer.style?.strokeColor ?? "#3b82f6",
              ],
              "fill-opacity": layer.style?.fillOpacity ?? 0.5,
              "line-color": layer.style?.strokeColor ?? "#3b82f6",
              "line-width": layer.style?.strokeWidth ?? 1.5,
            }
          : {
              "fill-color":
                layer.style?.fillColor ?? layer.style?.strokeColor ?? "#3b82f6",
              "fill-opacity": layer.style?.fillOpacity ?? 0.4,
              "line-color": layer.style?.strokeColor ?? "#3b82f6",
              "line-width": layer.style?.strokeWidth ?? 2,
            };

        map.addLayer({
          id: lyrId,
          type: layer.type === "POLYLINE" ? "line" : "fill",
          source: srcId,
          paint,
        } as any);
      }
      map.setLayoutProperty(
        lyrId,
        "visibility",
        layer.visible ? "visible" : "none",
      );
    });

    return () => {
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mapData,
    _layers,
    mapViewport.center.latitude,
    mapViewport.center.longitude,
    mapViewport.zoom,
  ]);

  return (
    <IGRPCard className={className}>
      <IGRPCardHeader>
        <div className="flex items-center justify-between">
          <div>
            <IGRPCardTitle className="flex items-center">
              <IGRPIcon iconName="MapPin" className="h-5 w-5 mr-2" />
              Visualizador de Mapas
            </IGRPCardTitle>
            <IGRPCardDescription>
              Visualização interativa do cemitério
            </IGRPCardDescription>
          </div>
          <div className="flex gap-2">
            <IGRPButton
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              showIcon
              iconName="Filter"
            >
              Filtros
            </IGRPButton>
            <IGRPButton
              variant="outline"
              size="sm"
              onClick={_loadMapData}
              disabled={loading}
              showIcon
              iconName="RefreshCw"
            >
              Atualizar
            </IGRPButton>
            <IGRPButton
              variant="outline"
              size="sm"
              onClick={() => handleExport("pdf")}
              showIcon
              iconName="Download"
            >
              Exportar
            </IGRPButton>
            <IGRPButton
              variant="outline"
              size="sm"
              onClick={handlePrint}
              showIcon
              iconName="Printer"
            >
              Imprimir
            </IGRPButton>
          </div>
        </div>
      </IGRPCardHeader>

      <IGRPCardContent className="space-y-6">
        {/* Seleção de nível / hierarquia */}
        <div className="flex items-center gap-2">
          <IGRPLabel htmlFor="level">Nível</IGRPLabel>
          <IGRPSelect
            options={[
              { value: "BLOCKS", label: "Blocos" },
              { value: "SECTIONS", label: "Seções" },
              { value: "PLOTS", label: "Sepulturas" },
            ]}
            value={activeLevel}
            onValueChange={(v) => setActiveLevel(v as any)}
            placeholder="Blocos"
          />
        </div>

        {/* Mensagem de erro */}
        {_error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <IGRPIcon iconName="MapPin" className="h-4 w-4" />
            <span className="text-sm">{_error}</span>
          </div>
        )}

        {/* Barra de busca */}
        <div className="flex gap-2">
          <div className="flex-1">
            <IGRPInputText
              placeholder="Buscar localização, sepultura, bloco..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <IGRPButton
            onClick={handleSearch}
            disabled={!searchQuery.trim() || loading}
            showIcon
            iconName="Search"
          >
            Buscar
          </IGRPButton>
        </div>

        {/* Resultados da busca */}
        {searchResults.length > 0 && (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Resultados da Busca</h3>
              <IGRPButton variant="ghost" size="sm" onClick={clearSearch}>
                Limpar
              </IGRPButton>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {searchResults.map((result) => (
                <div
                  key={`${result.type}-${result.name}-${result.position.latitude}-${result.position.longitude}`}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium text-sm">{result.name}</p>
                    <p className="text-xs text-gray-600">
                      {result.type} • {result.position.latitude.toFixed(6)},{" "}
                      {result.position.longitude.toFixed(6)}
                    </p>
                  </div>
                  <IGRPButton
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      centerOnLocation(
                        result.position.latitude,
                        result.position.longitude,
                        cemeteryId || "",
                      )
                    }
                    showIcon
                    iconName="Navigation"
                  >
                    Centralizar
                  </IGRPButton>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filtros avançados */}
        {showFilters && (
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-4">Filtros Avançados</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <IGRPLabel htmlFor="plotType">Tipo de Sepultura</IGRPLabel>
                <IGRPSelect
                  options={[
                    { value: "all", label: "Todos" },
                    { value: "tomb", label: "Túmulo" },
                    { value: "crypt", label: "Cripta" },
                    { value: "niche", label: "Nicho" },
                    { value: "mausoleum", label: "Mausoléu" },
                    { value: "lawn", label: "Gramado" },
                  ]}
                  value={filters.plotType}
                  onValueChange={(v) =>
                    setFilters((prev) => ({ ...prev, plotType: v }))
                  }
                  placeholder="Todos"
                />
              </div>
              <div>
                <IGRPLabel htmlFor="status">Status</IGRPLabel>
                <IGRPSelect
                  options={[
                    { value: "all", label: "Todos" },
                    { value: "available", label: "Disponível" },
                    { value: "occupied", label: "Ocupado" },
                    { value: "reserved", label: "Reservado" },
                    { value: "maintenance", label: "Manutenção" },
                  ]}
                  value={filters.status}
                  onValueChange={(v) =>
                    setFilters((prev) => ({ ...prev, status: v }))
                  }
                  placeholder="Todos"
                />
              </div>
              <div>
                <IGRPLabel htmlFor="heatmap">Mapa de Calor</IGRPLabel>
                <div className="flex items-center gap-2">
                  <IGRPCheckbox
                    id="heatmap"
                    name="heatmap"
                    checked={showHeatmap}
                    onCheckedChange={(checked) =>
                      setShowHeatmap(Boolean(checked))
                    }
                    className="rounded"
                  />
                  <IGRPLabel htmlFor="heatmap" className="mb-0">
                    Exibir mapa de calor
                  </IGRPLabel>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controles do mapa */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <IGRPButton
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              showIcon
              iconName="ZoomIn"
            ></IGRPButton>
            <IGRPButton
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              showIcon
              iconName="ZoomOut"
            ></IGRPButton>
            <IGRPButton
              variant="outline"
              size="sm"
              onClick={handleCenterMap}
              showIcon
              iconName="Maximize2"
            ></IGRPButton>
          </div>
          <div className="text-sm text-gray-600">
            Zoom: {mapViewport.zoom} • Centro:{" "}
            {mapViewport.center.latitude.toFixed(4)},{" "}
            {mapViewport.center.longitude.toFixed(4)}
          </div>
        </div>

        {/* Visualização do mapa */}
        <div className="border rounded-lg h-96 bg-gray-50">
          <div id="cemetery-map-container" className="w-full h-full" />
        </div>

        {/* Legenda dinâmica */}
        <div>
          <h3 className="font-medium mb-3 flex items-center">
            <IGRPIcon iconName="List" className="h-4 w-4 mr-2" />
            Legenda
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Camadas do mapa */}
        <div>
          <h3 className="font-medium mb-3 flex items-center">
            <IGRPIcon iconName="Layers" className="h-4 w-4 mr-2" />
            Camadas do Mapa
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {availableLayers.map((layer) => (
              <div key={layer.id} className="flex items-center space-x-2">
                <IGRPCheckbox
                  id={layer.id}
                  name={layer.id}
                  checked={selectedLayers.includes(layer.id)}
                  onCheckedChange={() => handleLayerToggle(layer.id)}
                  className="rounded"
                />
                <IGRPLabel htmlFor={layer.id} className="text-sm mb-0">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          layer.style.strokeColor ||
                          layer.style.fillColor ||
                          "#999999",
                      }}
                    ></div>
                    {layer.name}
                  </div>
                </IGRPLabel>
              </div>
            ))}
          </div>
        </div>

        {/* Marcadores do mapa */}
        {markers.length > 0 && (
          <div>
            <h3 className="font-medium mb-3">Marcadores</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {markers.map((marker) => (
                <IGRPCard key={marker.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{marker.title}</p>
                      <p className="text-xs text-gray-600">
                        {marker.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {marker.position.latitude.toFixed(6)},{" "}
                        {marker.position.longitude.toFixed(6)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <IGRPButton
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          centerOnLocation(
                            marker.position.latitude,
                            marker.position.longitude,
                            cemeteryId || "",
                          )
                        }
                        showIcon
                        iconName="Navigation"
                      />
                      <IGRPButton
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMarker(marker.id)}
                      >
                        ×
                      </IGRPButton>
                    </div>
                  </div>
                </IGRPCard>
              ))}
            </div>
          </div>
        )}

        {/* Informações do mapa */}
        {mapData && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium mb-3">Informações do Mapa</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Camadas:</span>
                <p className="font-medium">{mapData.layers?.length || 0}</p>
              </div>
              <div>
                <span className="text-gray-600">Marcadores:</span>
                <p className="font-medium">{mapData.markers?.length || 0}</p>
              </div>
              <div>
                <span className="text-gray-600">Zoom Atual:</span>
                <p className="font-medium">{mapData.zoom}</p>
              </div>
              <div>
                <span className="text-gray-600">Atualizado:</span>
                <p className="font-medium">{mapData.lastUpdated}</p>
              </div>
            </div>
          </div>
        )}
      </IGRPCardContent>
    </IGRPCard>
  );
}
