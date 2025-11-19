"use client";
import {
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPCardDescription,
  IGRPCardHeader,
  IGRPCardTitle,
  IGRPCheckbox,
  IGRPDatePicker,
  IGRPIcon,
  IGRPInputText,
  IGRPLabel,
  IGRPSelect,
} from "@igrp/igrp-framework-react-design-system";
import { useState } from "react";
import { MapLayers } from "@/components/maps/MapLayers";
import { MapViewer } from "@/components/maps/MapViewer";

export default function MapsPage() {
  /**
   * MapsPage provides the main navigation and feature sections
   * for cemetery maps: viewer, layers, search, and export.
   * It composes MapViewer and MapLayers and uses IGRP DS primitives
   * for actions, forms, cards, and controls.
   */
  const [activeTab, setActiveTab] = useState<
    "viewer" | "layers" | "search" | "export"
  >("viewer");
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: "viewer", label: "Visualizador", icon: "Map" },
    { id: "layers", label: "Camadas", icon: "Layers" },
    { id: "search", label: "Busca", icon: "Search" },
    { id: "export", label: "Exportar", icon: "Download" },
  ];

  const handleRefresh = async () => {
    setLoading(true);
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Mapas e Georreferenciamento
          </h1>
          <p className="text-muted-foreground">
            Visualização interativa e gerenciamento de mapas de cemitérios
          </p>
        </div>
        <div className="flex gap-2">
          <IGRPButton
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            showIcon
            iconName="Settings"
          >
            Atualizar
          </IGRPButton>
          <IGRPButton showIcon iconName="Plus">
            Novo Mapa
          </IGRPButton>
        </div>
      </div>

      {/* Navegação por abas */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as "viewer" | "layers" | "search" | "export",
                )
              }
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
              }`}
            >
              <IGRPIcon iconName={tab.icon} className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo por aba */}
      <div className="space-y-6">
        {activeTab === "viewer" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Visualizador de Mapas</h2>
                <p className="text-muted-foreground">
                  Visualização interativa dos mapas de cemitérios
                </p>
              </div>
              <div className="flex gap-2">
                <IGRPButton
                  variant="outline"
                  size="sm"
                  showIcon
                  iconName="ZoomIn"
                >
                  Zoom In
                </IGRPButton>
                <IGRPButton
                  variant="outline"
                  size="sm"
                  showIcon
                  iconName="ZoomOut"
                >
                  Zoom Out
                </IGRPButton>
                <IGRPButton
                  variant="outline"
                  size="sm"
                  showIcon
                  iconName="Home"
                >
                  Centralizar
                </IGRPButton>
                <IGRPButton
                  variant="outline"
                  size="sm"
                  showIcon
                  iconName="Share2"
                >
                  Compartilhar
                </IGRPButton>
              </div>
            </div>

            <MapViewer />
          </div>
        )}

        {activeTab === "layers" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Camadas do Mapa</h2>
                <p className="text-muted-foreground">
                  Gerencie camadas de visualização e sobreposições
                </p>
              </div>
              <div className="flex gap-2">
                <IGRPButton variant="outline" size="sm" showIcon iconName="Eye">
                  Mostrar Todas
                </IGRPButton>
                <IGRPButton
                  variant="outline"
                  size="sm"
                  showIcon
                  iconName="Settings"
                >
                  Configurar
                </IGRPButton>
              </div>
            </div>

            <MapLayers />
          </div>
        )}

        {activeTab === "search" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Busca e Navegação</h2>
                <p className="text-muted-foreground">
                  Pesquise locais e navegue pelos mapas
                </p>
              </div>
              <div className="flex gap-2">
                <IGRPButton
                  variant="outline"
                  size="sm"
                  showIcon
                  iconName="Navigation"
                >
                  GPS
                </IGRPButton>
                <IGRPButton
                  variant="outline"
                  size="sm"
                  showIcon
                  iconName="Filter"
                >
                  Filtros
                </IGRPButton>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <IGRPCard>
                <IGRPCardHeader>
                  <IGRPCardTitle>Pesquisa Rápida</IGRPCardTitle>
                  <IGRPCardDescription>
                    Encontre sepulturas e áreas específicas
                  </IGRPCardDescription>
                </IGRPCardHeader>
                <IGRPCardContent>
                  <div className="space-y-4">
                    <div>
                      <IGRPLabel htmlFor="searchName">Nome ou Código</IGRPLabel>
                      <IGRPInputText
                        id="searchName"
                        placeholder="Digite o nome ou código"
                      />
                    </div>
                    <div>
                      <IGRPLabel htmlFor="searchCemetery">Cemitério</IGRPLabel>
                      <IGRPInputText
                        id="searchCemetery"
                        placeholder="Selecione o cemitério"
                      />
                    </div>
                    <IGRPButton className="w-full" showIcon iconName="Search">
                      Buscar
                    </IGRPButton>
                  </div>
                </IGRPCardContent>
              </IGRPCard>

              <IGRPCard>
                <IGRPCardHeader>
                  <IGRPCardTitle>Resultados da Busca</IGRPCardTitle>
                  <IGRPCardDescription>
                    Sem dados disponíveis
                  </IGRPCardDescription>
                </IGRPCardHeader>
                <IGRPCardContent>
                  <div className="text-sm text-muted-foreground">
                    No data available
                  </div>
                </IGRPCardContent>
              </IGRPCard>

              <IGRPCard>
                <IGRPCardHeader>
                  <IGRPCardTitle>Filtros Avançados</IGRPCardTitle>
                  <IGRPCardDescription>Refine sua busca</IGRPCardDescription>
                </IGRPCardHeader>
                <IGRPCardContent>
                  <div className="space-y-4">
                    <div>
                      <IGRPLabel htmlFor="filterType">Tipo de Área</IGRPLabel>
                      <IGRPSelect
                        options={[
                          { value: "", label: "Todos" },
                          { value: "plot", label: "Sepultura" },
                          { value: "niche", label: "Nicho" },
                          { value: "mausoleum", label: "Mausoléu" },
                        ]}
                        placeholder="Todos"
                      />
                    </div>
                    <div>
                      <IGRPLabel htmlFor="filterStatus">Status</IGRPLabel>
                      <IGRPSelect
                        options={[
                          { value: "", label: "Todos" },
                          { value: "available", label: "Disponível" },
                          { value: "occupied", label: "Ocupado" },
                          { value: "reserved", label: "Reservado" },
                        ]}
                        placeholder="Todos"
                      />
                    </div>
                    <div>
                      <IGRPLabel htmlFor="filterDate">
                        Data de Cadastro
                      </IGRPLabel>
                      <IGRPDatePicker id="filterDate" />
                    </div>
                    <IGRPButton
                      variant="outline"
                      className="w-full"
                      showIcon
                      iconName="Filter"
                    >
                      Aplicar Filtros
                    </IGRPButton>
                  </div>
                </IGRPCardContent>
              </IGRPCard>
            </div>
          </div>
        )}

        {activeTab === "export" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Exportação e Impressão</h2>
                <p className="text-muted-foreground">
                  Exporte e imprima mapas e relatórios
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <IGRPCard>
                <IGRPCardHeader>
                  <IGRPCardTitle>Exportar Mapa</IGRPCardTitle>
                  <IGRPCardDescription>
                    Baixe mapas em diferentes formatos
                  </IGRPCardDescription>
                </IGRPCardHeader>
                <IGRPCardContent>
                  <div className="space-y-4">
                    <div>
                      <IGRPLabel htmlFor="exportFormat">Formato</IGRPLabel>
                      <IGRPSelect
                        options={[
                          { value: "pdf", label: "PDF" },
                          { value: "png", label: "PNG" },
                          { value: "svg", label: "SVG" },
                          { value: "kml", label: "KML" },
                          { value: "geojson", label: "GeoJSON" },
                        ]}
                        placeholder="PDF"
                      />
                    </div>
                    <div>
                      <IGRPLabel htmlFor="exportScale">Escala</IGRPLabel>
                      <IGRPSelect
                        options={[
                          { value: "1:100", label: "1:100" },
                          { value: "1:500", label: "1:500" },
                          { value: "1:1000", label: "1:1000" },
                          { value: "1:5000", label: "1:5000" },
                        ]}
                        placeholder="1:100"
                      />
                    </div>
                    <div>
                      <IGRPLabel htmlFor="exportQuality">Qualidade</IGRPLabel>
                      <IGRPSelect
                        options={[
                          { value: "low", label: "Baixa" },
                          { value: "medium", label: "Média" },
                          { value: "high", label: "Alta" },
                        ]}
                        placeholder="Média"
                      />
                    </div>
                    <IGRPButton className="w-full" showIcon iconName="Download">
                      Exportar Mapa
                    </IGRPButton>
                  </div>
                </IGRPCardContent>
              </IGRPCard>

              <IGRPCard>
                <IGRPCardHeader>
                  <IGRPCardTitle>Relatórios de Mapa</IGRPCardTitle>
                  <IGRPCardDescription>
                    Gere relatórios com informações do mapa
                  </IGRPCardDescription>
                </IGRPCardHeader>
                <IGRPCardContent>
                  <div className="space-y-4">
                    <div>
                      <IGRPLabel htmlFor="reportType">
                        Tipo de Relatório
                      </IGRPLabel>
                      <IGRPSelect
                        options={[
                          { value: "occupancy", label: "Ocupação" },
                          { value: "inventory", label: "Inventário" },
                          { value: "maintenance", label: "Manutenção" },
                          { value: "usage", label: "Uso" },
                        ]}
                        placeholder="Ocupação"
                      />
                    </div>
                    <div>
                      <IGRPLabel htmlFor="reportFormat">
                        Formato do Relatório
                      </IGRPLabel>
                      <IGRPSelect
                        options={[
                          { value: "pdf", label: "PDF" },
                          { value: "excel", label: "Excel" },
                          { value: "csv", label: "CSV" },
                        ]}
                        placeholder="PDF"
                      />
                    </div>
                    <div>
                      <IGRPLabel htmlFor="reportDate">
                        Data do Relatório
                      </IGRPLabel>
                      <IGRPDatePicker id="reportDate" />
                    </div>
                    <IGRPButton
                      className="w-full"
                      showIcon
                      iconName="BarChart3"
                    >
                      Gerar Relatório
                    </IGRPButton>
                  </div>
                </IGRPCardContent>
              </IGRPCard>

              <IGRPCard>
                <IGRPCardHeader>
                  <IGRPCardTitle>Impressão</IGRPCardTitle>
                  <IGRPCardDescription>
                    Configure e imprima mapas
                  </IGRPCardDescription>
                </IGRPCardHeader>
                <IGRPCardContent>
                  <div className="space-y-4">
                    <div>
                      <IGRPLabel htmlFor="printLayout">Layout</IGRPLabel>
                      <IGRPSelect
                        options={[
                          { value: "portrait", label: "Retrato" },
                          { value: "landscape", label: "Paisagem" },
                        ]}
                        placeholder="Retrato"
                      />
                    </div>
                    <div>
                      <IGRPLabel htmlFor="printSize">
                        Tamanho do Papel
                      </IGRPLabel>
                      <IGRPSelect
                        options={[
                          { value: "a4", label: "A4" },
                          { value: "a3", label: "A3" },
                          { value: "a2", label: "A2" },
                          { value: "a1", label: "A1" },
                        ]}
                        placeholder="A4"
                      />
                    </div>
                    <div className="flex items-center">
                      <IGRPCheckbox
                        id="printLegend"
                        className="mr-2"
                        name={""}
                      />
                      <IGRPLabel htmlFor="printLegend">
                        Incluir legenda
                      </IGRPLabel>
                    </div>
                    <div className="flex items-center">
                      <IGRPCheckbox
                        id="printScale"
                        className="mr-2"
                        name={""}
                      />
                      <IGRPLabel htmlFor="printScale">Incluir escala</IGRPLabel>
                    </div>
                    <IGRPButton className="w-full" showIcon iconName="Printer">
                      Imprimir
                    </IGRPButton>
                  </div>
                </IGRPCardContent>
              </IGRPCard>

              <IGRPCard>
                <IGRPCardHeader>
                  <IGRPCardTitle>Configurações de Exportação</IGRPCardTitle>
                  <IGRPCardDescription>
                    Configure opções avançadas de exportação
                  </IGRPCardDescription>
                </IGRPCardHeader>
                <IGRPCardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <IGRPCheckbox
                        id="exportLayers"
                        className="mr-2"
                        defaultChecked
                        name={""}
                      />
                      <IGRPLabel htmlFor="exportLayers">
                        Incluir camadas
                      </IGRPLabel>
                    </div>
                    <div className="flex items-center">
                      <IGRPCheckbox
                        id="exportMarkers"
                        className="mr-2"
                        defaultChecked
                        name={""}
                      />
                      <IGRPLabel htmlFor="exportMarkers">
                        Incluir marcadores
                      </IGRPLabel>
                    </div>
                    <div className="flex items-center">
                      <IGRPCheckbox
                        id="exportLabels"
                        className="mr-2"
                        defaultChecked
                        name={""}
                      />
                      <IGRPLabel htmlFor="exportLabels">
                        Incluir rótulos
                      </IGRPLabel>
                    </div>
                    <div className="flex items-center">
                      <IGRPCheckbox
                        id="exportGrid"
                        className="mr-2"
                        name={""}
                      />
                      <IGRPLabel htmlFor="exportGrid">Incluir grade</IGRPLabel>
                    </div>
                    <div className="flex items-center">
                      <IGRPCheckbox
                        id="exportCoordinates"
                        className="mr-2"
                        name={""}
                      />
                      <IGRPLabel htmlFor="exportCoordinates">
                        Incluir coordenadas
                      </IGRPLabel>
                    </div>
                  </div>
                </IGRPCardContent>
              </IGRPCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
