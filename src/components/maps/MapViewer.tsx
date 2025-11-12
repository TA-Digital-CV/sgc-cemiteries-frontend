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
import { useEffect, useState } from "react";
import { useMap } from "@/hooks/useMap";
import type { LayerType, MapViewport } from "@/types/Map";

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
    layers,
    markers,
    heatmapPoints,
    viewport,
    searchResults,
    loading,
    error,
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

  useEffect(() => {
    loadMapData();
  }, [cemeteryId]);

  const loadMapData = async () => {
    if (!cemeteryId) return;

    await Promise.all([
      fetchMapData(cemeteryId),
      fetchLayers(cemeteryId),
      fetchMarkers(cemeteryId),
      fetchHeatmapData(cemeteryId),
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

  // Available map layers used for UI toggling only (not full MapLayer objects)
  const availableLayers = [
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
            >
              <IGRPIcon iconName="Filter" className="h-4 w-4 mr-2" />
              Filtros
            </IGRPButton>
            <IGRPButton
              variant="outline"
              size="sm"
              onClick={loadMapData}
              disabled={loading}
            >
              <IGRPIcon
                iconName="RefreshCw"
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Atualizar
            </IGRPButton>
            <IGRPButton
              variant="outline"
              size="sm"
              onClick={() => handleExport("pdf")}
            >
              <IGRPIcon iconName="Download" className="h-4 w-4 mr-2" />
              Exportar
            </IGRPButton>
            <IGRPButton variant="outline" size="sm" onClick={handlePrint}>
              <IGRPIcon iconName="Printer" className="h-4 w-4 mr-2" />
              Imprimir
            </IGRPButton>
          </div>
        </div>
      </IGRPCardHeader>

      <IGRPCardContent className="space-y-6">
        {/* Mensagem de erro */}
        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <IGRPIcon iconName="MapPin" className="h-4 w-4" />
            <span className="text-sm">{error}</span>
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
          >
            <IGRPIcon iconName="Search" className="h-4 w-4 mr-2" />
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
                  >
                    <IGRPIcon iconName="Navigation" className="h-3 w-3 mr-1" />
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
            <IGRPButton variant="outline" size="sm" onClick={handleZoomIn}>
              <IGRPIcon iconName="ZoomIn" className="h-4 w-4" />
            </IGRPButton>
            <IGRPButton variant="outline" size="sm" onClick={handleZoomOut}>
              <IGRPIcon iconName="ZoomOut" className="h-4 w-4" />
            </IGRPButton>
            <IGRPButton variant="outline" size="sm" onClick={handleCenterMap}>
              <IGRPIcon iconName="Maximize2" className="h-4 w-4" />
            </IGRPButton>
          </div>
          <div className="text-sm text-gray-600">
            Zoom: {mapViewport.zoom} • Centro:{" "}
            {mapViewport.center.latitude.toFixed(4)},{" "}
            {mapViewport.center.longitude.toFixed(4)}
          </div>
        </div>

        {/* Visualização do mapa (placeholder) */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <IGRPIcon
              iconName="MapPin"
              className="h-16 w-16 text-gray-400 mx-auto mb-4"
            />
            <p className="text-gray-600 font-medium">Visualização do Mapa</p>
            <p className="text-sm text-gray-500 mt-2">
              {cemeteryId
                ? `Carregando mapa do cemitério ${cemeteryId}...`
                : "Selecione um cemitério para visualizar o mapa"}
            </p>
            {loading && (
              <div className="mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">
                  Carregando dados do mapa...
                </p>
              </div>
            )}
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
                          (layer.style as any).strokeColor ||
                          (layer.style as any).fillColor ||
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
                      >
                        <IGRPIcon iconName="Navigation" className="h-3 w-3" />
                      </IGRPButton>
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
