"use client";

import {
  IGRPBadge,
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPCardDescription,
  IGRPCardHeader,
  IGRPCardTitle,
  IGRPIcon,
  IGRPInputText,
  IGRPLabel,
  IGRPSelect,
} from "@igrp/igrp-framework-react-design-system";
import { useEffect, useState } from "react";
import { useMap } from "@/hooks/useMap";
import type { LayerType, MapLayer } from "@/types/Map";

interface MapLayersProps {
  className?: string;
  cemeteryId?: string;
}

/**
 * MapLayers renders and manages map visualization layers.
 * Responsibilities:
 * - Loads layers and related map data using the useMap hook
 * - Provides filtering, selection, editing and toggling of layers
 * - Uses IGRP Design System components for consistent UI
 */
export function MapLayers({ className, cemeteryId }: MapLayersProps) {
  const { layers, loading, error, fetchLayers, toggleLayer } = useMap();

  const [selectedLayer, setSelectedLayer] = useState<MapLayer | null>(null);
  const [showLayerForm, setShowLayerForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const [layerForm, setLayerForm] = useState<Partial<MapLayer>>({
    name: "",
    type: "MARKER" as LayerType,
    data: { markers: [] },
    style: {
      strokeColor: "#3B82F6",
      strokeOpacity: 0.8,
      strokeWidth: 2,
      fillColor: "#3B82F6",
      fillOpacity: 0.3,
    },
    visible: true,
    zIndex: 1,
  });

  useEffect(() => {
    loadLayers();
  }, [cemeteryId]);

  /**
   * Loads map layers for the given cemetery context.
   * Ensures a string argument is passed to fetchLayers to satisfy the hook API.
   */
  const loadLayers = async () => {
    await fetchLayers(cemeteryId ?? "");
  };

  /**
   * Returns the number of items contained in a layer's data
   * depending on its type (markers, features, points, heatmap data).
   */
  const getLayerItemsCount = (layer: MapLayer): number => {
    switch (layer.type) {
      case "MARKER":
        return layer.data?.markers?.length ?? 0;
      case "POLYGON":
        return layer.data?.geoJson?.features?.length ?? 0;
      case "POLYLINE":
        return layer.data?.points?.length ?? 0;
      case "HEATMAP":
        return layer.data?.heatmapData?.length ?? 0;
      default:
        return 0;
    }
  };

  const handleCreateLayer = () => {
    setSelectedLayer(null);
    setLayerForm({
      name: "",
      type: "MARKER" as LayerType,
      data: { markers: [] },
      style: {
        strokeColor: "#3B82F6",
        strokeOpacity: 0.8,
        strokeWidth: 2,
        fillColor: "#3B82F6",
        fillOpacity: 0.3,
      },
      visible: true,
      zIndex: 1,
    });
    setShowLayerForm(true);
  };

  const handleEditLayer = (layer: MapLayer) => {
    setSelectedLayer(layer);
    setLayerForm(layer);
    setShowLayerForm(true);
  };

  const handleSaveLayer = async () => {
    // Editing and creating layers is not supported by current map API
    // Close the form to avoid inconsistent state.
    setShowLayerForm(false);
    setSelectedLayer(null);
  };

  const handleToggleLayer = async (layerId: string) => {
    try {
      await toggleLayer(layerId);
    } catch (error) {
      console.error("Erro ao alternar camada:", error);
    }
  };

  const handleDeleteLayer = async (_layerId: string) => {
    // Deleting layers is not supported by current map API
    console.warn("Layer deletion is not supported");
  };

  const typeMap: Record<string, LayerType> = {
    marker: "MARKER",
    polygon: "POLYGON",
    polyline: "POLYLINE",
    heatmap: "HEATMAP",
    tile: "TILE",
  };

  const filteredLayers = layers.filter((layer) => {
    const matchesSearch =
      layer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      layer.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "all" || layer.type === typeMap[filterType];
    return matchesSearch && matchesType;
  });

  // Maps layer types to IGRP icon names
  const layerTypeIcons: Record<LayerType, string> = {
    MARKER: "MapPin",
    POLYGON: "Layers",
    POLYLINE: "BarChart3",
    HEATMAP: "BarChart3",
    TILE: "Layers",
    CIRCLE: "Circle",
    RECTANGLE: "RectangleHorizontal",
    GEOJSON: "FileJson",
  };

  const layerTypeLabels: Record<LayerType, string> = {
    MARKER: "Marcadores",
    POLYGON: "Polígonos",
    POLYLINE: "Linhas",
    HEATMAP: "Mapa de Calor",
    TILE: "Camada de Tile",
    CIRCLE: "Círculos",
    RECTANGLE: "Retângulos",
    GEOJSON: "GeoJSON",
  };

  return (
    <IGRPCard className={className}>
      <IGRPCardHeader>
        <div className="flex items-center justify-between">
          <div>
            <IGRPCardTitle className="flex items-center">
              <IGRPIcon iconName="Layers" className="h-5 w-5 mr-2" />
              Camadas do Mapa
            </IGRPCardTitle>
            <IGRPCardDescription>
              Gerencie camadas de visualização do mapa
            </IGRPCardDescription>
          </div>
          <div className="flex gap-2">
            <IGRPButton
              variant="outline"
              size="sm"
              onClick={() => setShowStats(!showStats)}
            >
              <IGRPIcon iconName="BarChart3" className="h-4 w-4 mr-2" />
              Estatísticas
            </IGRPButton>
            <IGRPButton
              variant="outline"
              size="sm"
              onClick={loadLayers}
              disabled={loading}
            >
              <IGRPIcon
                iconName="RefreshCw"
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Atualizar
            </IGRPButton>
            <IGRPButton
              onClick={handleCreateLayer}
              className="flex items-center gap-2"
            >
              <IGRPIcon iconName="Plus" className="h-4 w-4" />
              Nova Camada
            </IGRPButton>
          </div>
        </div>
      </IGRPCardHeader>

      <IGRPCardContent className="space-y-6">
        {/* Mensagem de erro */}
        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <IGRPIcon iconName="AlertTriangle" className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Filtros e busca */}
        <div className="flex gap-4">
          <div className="flex-1">
            <IGRPInputText
              placeholder="Buscar camadas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <IGRPSelect
              options={[
                { value: "all", label: "Todos os Tipos" },
                { value: "marker", label: "Marcadores" },
                { value: "polygon", label: "Polígonos" },
                { value: "polyline", label: "Linhas" },
                { value: "heatmap", label: "Mapa de Calor" },
                { value: "tile", label: "Camada de Tile" },
              ]}
              value={filterType}
              onValueChange={(v) => setFilterType(v)}
              placeholder="Todos os Tipos"
            />
          </div>
        </div>

        {/* Lista de camadas */}
        <div className="space-y-2">
          {filteredLayers.map((layer) => {
            const iconName = layerTypeIcons[layer.type] || "Layers";
            const label = layerTypeLabels[layer.type] || layer.type;

            return (
              <IGRPCard key={layer.id} className="overflow-hidden">
                <IGRPCardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <IGRPButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleLayer(layer.id)}
                        className={`h-8 w-8 p-0 ${layer.visible ? "text-blue-600" : "text-gray-400"}`}
                        showIcon
                        iconName={layer.visible ? "Eye" : "EyeOff"}
                      />

                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <IGRPIcon
                            iconName={iconName}
                            className="h-4 w-4 text-blue-600"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{layer.name}</p>
                          <IGRPBadge variant="outline">{label}</IGRPBadge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right text-xs text-gray-500">
                        <p>{getLayerItemsCount(layer)} itens</p>
                        <p>Z-index: {layer.zIndex}</p>
                      </div>

                      <div className="flex gap-1">
                        <IGRPButton
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditLayer(layer)}
                          className="h-6 w-6 p-0"
                        >
                          <IGRPIcon iconName="Edit" className="h-3 w-3" />
                        </IGRPButton>
                        <IGRPButton
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteLayer(layer.id)}
                          className="h-6 w-6 p-0 text-red-600"
                        >
                          <IGRPIcon iconName="Trash2" className="h-3 w-3" />
                        </IGRPButton>
                      </div>
                    </div>
                  </div>

                  {/* Visualização de estilo */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border"
                          style={{
                            backgroundColor:
                              layer.style?.strokeColor ||
                              layer.style?.fillColor ||
                              "#3B82F6",
                            opacity:
                              layer.style?.strokeOpacity ??
                              layer.style?.fillOpacity ??
                              0.8,
                          }}
                        />
                        <span>
                          Cor:{" "}
                          {layer.style?.strokeColor ||
                            layer.style?.fillColor ||
                            "#3B82F6"}
                        </span>
                      </div>
                      <span>
                        Opacidade:{" "}
                        {(
                          ((layer.style?.strokeOpacity ??
                            layer.style?.fillOpacity ??
                            0.8) * 100) as number
                        ).toFixed(0)}
                        %
                      </span>
                    </div>
                  </div>
                </IGRPCardContent>
              </IGRPCard>
            );
          })}
        </div>

        {filteredLayers.length === 0 && !loading && (
          <div className="text-center text-gray-500 py-8">
            <IGRPIcon
              iconName="Layers"
              className="h-12 w-12 mx-auto mb-4 text-gray-300"
            />
            <p className="text-lg font-medium">Nenhuma camada encontrada</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchTerm || filterType !== "all"
                ? "Tente ajustar seus filtros de busca"
                : "Crie sua primeira camada de mapa"}
            </p>
            {(searchTerm || filterType !== "all") && (
              <IGRPButton
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                }}
                className="mt-4"
              >
                Limpar Filtros
              </IGRPButton>
            )}
          </div>
        )}

        {/* Estatísticas das camadas */}
        {showStats && (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Estatísticas das Camadas</h3>
              <IGRPBadge variant="outline">{layers.length} camadas</IGRPBadge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {layers.filter((l) => l.type === "MARKER").length}
                </div>
                <p className="text-xs text-gray-500">Marcadores</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {layers.filter((l) => l.type === "POLYGON").length}
                </div>
                <p className="text-xs text-gray-500">Polígonos</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {layers.filter((l) => l.type === "POLYLINE").length}
                </div>
                <p className="text-xs text-gray-500">Linhas</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {layers.filter((l) => l.type === "HEATMAP").length}
                </div>
                <p className="text-xs text-gray-500">Mapas de Calor</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span>Camadas visíveis:</span>
                <span className="font-medium">
                  {layers.filter((l) => l.visible).length} / {layers.length}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Total de elementos:</span>
                <span className="font-medium">
                  {layers.reduce(
                    (total, layer) => total + getLayerItemsCount(layer),
                    0,
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Formulário de camada */}
        {showLayerForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <IGRPCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <IGRPCardHeader>
                <IGRPCardTitle>
                  {selectedLayer ? "Editar Camada" : "Nova Camada"}
                </IGRPCardTitle>
                <IGRPCardDescription>
                  Configure as opções da camada de mapa
                </IGRPCardDescription>
              </IGRPCardHeader>
              <IGRPCardContent className="space-y-4">
                <div>
                  <IGRPLabel htmlFor="layerName">Nome da Camada</IGRPLabel>
                  <IGRPInputText
                    id="layerName"
                    value={layerForm.name || ""}
                    onChange={(e) =>
                      setLayerForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Ex: Sepulturas Ativas"
                  />
                </div>

                <div>
                  <IGRPLabel htmlFor="layerType">Tipo de Camada</IGRPLabel>
                  <IGRPSelect
                    options={[
                      { value: "marker", label: "Marcadores" },
                      { value: "polygon", label: "Polígonos" },
                      { value: "polyline", label: "Linhas" },
                      { value: "heatmap", label: "Mapa de Calor" },
                      { value: "tile", label: "Camada de Tile" },
                    ]}
                    value={
                      layerForm.type ? layerForm.type.toLowerCase() : "marker"
                    }
                    onValueChange={(v) =>
                      setLayerForm((prev) => ({
                        ...prev,
                        type: typeMap[v],
                      }))
                    }
                    placeholder="Selecione o tipo"
                  />
                </div>

                <div>
                  <IGRPLabel htmlFor="layerZIndex">
                    Z-Index (ordem de sobreposição)
                  </IGRPLabel>
                  <IGRPInputText
                    id="layerZIndex"
                    type="number"
                    min="0"
                    max="1000"
                    value={layerForm.zIndex || 1}
                    onChange={(e) =>
                      setLayerForm((prev) => ({
                        ...prev,
                        zIndex: parseInt(e.target.value) || 1,
                      }))
                    }
                    placeholder="Ordem de sobreposição"
                  />
                </div>

                {/* Configurações de estilo */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Estilo da Camada</h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <IGRPLabel htmlFor="layerColor">Cor Principal</IGRPLabel>
                      <IGRPInputText
                        id="layerColor"
                        type="text"
                        value={layerForm.style?.strokeColor || "#3B82F6"}
                        onChange={(e) =>
                          setLayerForm((prev) => ({
                            ...prev,
                            style: {
                              ...prev.style,
                              strokeColor: e.target.value,
                            },
                          }))
                        }
                        placeholder="#3B82F6"
                      />
                    </div>

                    <div>
                      <IGRPLabel htmlFor="layerOpacity">Opacidade</IGRPLabel>
                      <IGRPInputText
                        id="layerOpacity"
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={layerForm.style?.strokeOpacity ?? 0.8}
                        onChange={(e) =>
                          setLayerForm((prev) => ({
                            ...prev,
                            style: {
                              ...prev.style,
                              strokeOpacity: parseFloat(e.target.value),
                            },
                          }))
                        }
                      />
                      <span className="text-xs text-gray-500">
                        {(
                          (layerForm.style?.strokeOpacity ?? 0.8) * 100
                        ).toFixed(0)}
                        %
                      </span>
                    </div>

                    <div>
                      <IGRPLabel htmlFor="layerWeight">
                        Espessura da Borda
                      </IGRPLabel>
                      <IGRPInputText
                        id="layerWeight"
                        type="number"
                        min="1"
                        max="10"
                        value={layerForm.style?.strokeWidth ?? 2}
                        onChange={(e) =>
                          setLayerForm((prev) => ({
                            ...prev,
                            style: {
                              ...prev.style,
                              strokeWidth: parseInt(e.target.value) || 2,
                            },
                          }))
                        }
                        placeholder="Espessura da borda"
                      />
                    </div>

                    <div>
                      <IGRPLabel htmlFor="layerFillColor">
                        Cor de Preenchimento
                      </IGRPLabel>
                      <IGRPInputText
                        id="layerFillColor"
                        type="text"
                        value={layerForm.style?.fillColor || "#3B82F6"}
                        onChange={(e) =>
                          setLayerForm((prev) => ({
                            ...prev,
                            style: { ...prev.style, fillColor: e.target.value },
                          }))
                        }
                        placeholder="#3B82F6"
                      />
                    </div>

                    <div>
                      <IGRPLabel htmlFor="layerFillOpacity">
                        Opacidade do Preenchimento
                      </IGRPLabel>
                      <IGRPInputText
                        id="layerFillOpacity"
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={layerForm.style?.fillOpacity ?? 0.3}
                        onChange={(e) =>
                          setLayerForm((prev) => ({
                            ...prev,
                            style: {
                              ...prev.style,
                              fillOpacity: parseFloat(e.target.value),
                            },
                          }))
                        }
                      />
                      <span className="text-xs text-gray-500">
                        {((layerForm.style?.fillOpacity ?? 0.3) * 100).toFixed(
                          0,
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <IGRPButton onClick={handleSaveLayer} className="flex-1">
                    Salvar Camada
                  </IGRPButton>
                  <IGRPButton
                    variant="outline"
                    onClick={() => {
                      setShowLayerForm(false);
                      setSelectedLayer(null);
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </IGRPButton>
                </div>
              </IGRPCardContent>
            </IGRPCard>
          </div>
        )}
      </IGRPCardContent>
    </IGRPCard>
  );
}
