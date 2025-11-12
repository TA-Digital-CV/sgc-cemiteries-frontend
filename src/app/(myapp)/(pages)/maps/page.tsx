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
    // Simular carregamento de dados
    await new Promise((resolve) => setTimeout(resolve, 1000));
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
          >
            <IGRPIcon
              iconName="Settings"
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Atualizar
          </IGRPButton>
          <IGRPButton>
            <IGRPIcon iconName="Plus" className="h-4 w-4 mr-2" />
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
                <IGRPButton variant="outline" size="sm">
                  <IGRPIcon iconName="ZoomIn" className="h-4 w-4 mr-2" />
                  Zoom In
                </IGRPButton>
                <IGRPButton variant="outline" size="sm">
                  <IGRPIcon iconName="ZoomOut" className="h-4 w-4 mr-2" />
                  Zoom Out
                </IGRPButton>
                <IGRPButton variant="outline" size="sm">
                  <IGRPIcon iconName="Home" className="h-4 w-4 mr-2" />
                  Centralizar
                </IGRPButton>
                <IGRPButton variant="outline" size="sm">
                  <IGRPIcon iconName="Share2" className="h-4 w-4 mr-2" />
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
                <IGRPButton variant="outline" size="sm">
                  <IGRPIcon iconName="Eye" className="h-4 w-4 mr-2" />
                  Mostrar Todas
                </IGRPButton>
                <IGRPButton variant="outline" size="sm">
                  <IGRPIcon iconName="Settings" className="h-4 w-4 mr-2" />
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
                <IGRPButton variant="outline" size="sm">
                  <IGRPIcon iconName="Navigation" className="h-4 w-4 mr-2" />
                  GPS
                </IGRPButton>
                <IGRPButton variant="outline" size="sm">
                  <IGRPIcon iconName="Filter" className="h-4 w-4 mr-2" />
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
                    <IGRPButton className="w-full">
                      <IGRPIcon iconName="Search" className="h-4 w-4 mr-2" />
                      Buscar
                    </IGRPButton>
                  </div>
                </IGRPCardContent>
              </IGRPCard>

              <IGRPCard>
                <IGRPCardHeader>
                  <IGRPCardTitle>Resultados da Busca</IGRPCardTitle>
                  <IGRPCardDescription>
                    Resultados encontrados
                  </IGRPCardDescription>
                </IGRPCardHeader>
                <IGRPCardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <IGRPIcon
                          iconName="MapPin"
                          className="h-4 w-4 text-blue-500"
                        />
                        <div>
                          <p className="font-medium text-sm">Sepultura A-001</p>
                          <p className="text-xs text-gray-500">
                            Cemitério Central
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <IGRPIcon
                          iconName="MapPin"
                          className="h-4 w-4 text-green-500"
                        />
                        <div>
                          <p className="font-medium text-sm">Área Verde</p>
                          <p className="text-xs text-gray-500">
                            Cemitério Jardim
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <IGRPIcon
                          iconName="MapPin"
                          className="h-4 w-4 text-purple-500"
                        />
                        <div>
                          <p className="font-medium text-sm">Quadra B</p>
                          <p className="text-xs text-gray-500">
                            Cemitério São Pedro
                          </p>
                        </div>
                      </div>
                    </div>
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
                    <IGRPButton variant="outline" className="w-full">
                      <IGRPIcon iconName="Filter" className="h-4 w-4 mr-2" />
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
                    <IGRPButton className="w-full">
                      <IGRPIcon iconName="Download" className="h-4 w-4 mr-2" />
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
                    <IGRPButton className="w-full">
                      <IGRPIcon iconName="BarChart3" className="h-4 w-4 mr-2" />
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
                    <IGRPButton className="w-full">
                      <IGRPIcon iconName="Printer" className="h-4 w-4 mr-2" />
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
