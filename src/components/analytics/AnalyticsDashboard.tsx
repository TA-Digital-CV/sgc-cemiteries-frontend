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
import { useCallback, useEffect, useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import type {
  AnalyticsFilters,
  DateRange,
  PlotStatus,
  PlotType,
} from "@/types/Analytics";

interface AnalyticsDashboardProps {
  className?: string;
}

/**
 * AnalyticsDashboard renders analytics filters, metric cards, charts, and alerts.
 * Uses stable React keys for lists to improve reconciliation and performance.
 */
/**
 * AnalyticsDashboard
 * Renders analytics filters, metric cards, charts, and alerts using IGRP components.
 * Aligns with Typescript types in '@/types/Analytics' and the useAnalytics hook contracts.
 */
export function AnalyticsDashboard({ className }: AnalyticsDashboardProps) {
  const {
    metrics,
    occupancyData,
    statistics,
    projections,
    heatmapData,
    alerts,
    loading,
    error,
    fetchMetrics,
    fetchOccupancyData,
    fetchStatistics,
    fetchProjections,
    fetchHeatmapData,
    fetchAlerts,
    setFilters,
    clearFilters,
    exportData,
  } = useAnalytics();

  // Local date range state aligned to DateRange type (startDate/endDate)
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().getFullYear(), 0, 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const [selectedMetric, setSelectedMetric] = useState<string>("occupancy");
  const [filters, setLocalFilters] = useState({
    cemeteryId: "",
    plotType: "all",
    status: "all",
  });

  const loadAnalyticsData = useCallback(async () => {
    const selectedCemeteryId = filters.cemeteryId || undefined;

    const analyticsFilters: AnalyticsFilters = {
      dateRange: {
        startDate:
          typeof dateRange.startDate === "string"
            ? dateRange.startDate
            : new Date(dateRange.startDate).toISOString().split("T")[0],
        endDate:
          typeof dateRange.endDate === "string"
            ? dateRange.endDate
            : new Date(dateRange.endDate).toISOString().split("T")[0],
      },
      cemeteryIds: selectedCemeteryId ? [selectedCemeteryId] : undefined,
      // Map simple strings to PlotType/PlotStatus if needed; keep undefined for 'all'
      plotTypes:
        filters.plotType && filters.plotType !== "all"
          ? ([filters.plotType.toUpperCase() as PlotType] as PlotType[])
          : undefined,
      status:
        filters.status && filters.status !== "all"
          ? ([filters.status.toUpperCase() as PlotStatus] as PlotStatus[])
          : undefined,
    };

    await Promise.all([
      fetchMetrics(selectedCemeteryId),
      fetchOccupancyData(selectedCemeteryId),
      fetchStatistics(analyticsFilters),
      fetchProjections(selectedCemeteryId),
      fetchHeatmapData(selectedCemeteryId),
      fetchAlerts(selectedCemeteryId),
    ]);
  }, [
    dateRange,
    filters,
    fetchMetrics,
    fetchOccupancyData,
    fetchStatistics,
    fetchProjections,
    fetchHeatmapData,
    fetchAlerts,
  ]);

  useEffect(() => {
    void loadAnalyticsData();
  }, [loadAnalyticsData]);

  const handleExport = async (format: "pdf" | "csv" | "json") => {
    await exportData(format);
  };

  const handleRefresh = () => {
    loadAnalyticsData();
  };

  const handleFilterChange = (key: string, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const metricCards = [
    {
      title: "Taxa de Ocupação Geral",
      value: `${metrics?.overallOccupancyRate ?? 0}%`,
      iconName: "PieChart" as const,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: 0,
    },
    {
      title: "Total de Sepulturas",
      value: (metrics?.totalPlots ?? 0).toLocaleString("pt-CV"),
      iconName: "MapPin" as const,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: 0,
    },
    {
      title: "Cemitérios Ativos",
      value: (metrics?.activeCemeteries ?? 0).toLocaleString("pt-CV"),
      iconName: "Users" as const,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      trend: 0,
    },
    {
      title: "Capacidade Crítica",
      value: (metrics?.criticalCapacityCemeteries ?? 0).toLocaleString("pt-CV"),
      iconName: "Activity" as const,
      color: "text-red-600",
      bgColor: "bg-red-50",
      trend: 0,
    },
  ];

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Análise detalhada do cemitério</p>
        </div>
        <div className="flex gap-2">
          <IGRPButton
            variant="outline"
            onClick={handleRefresh}
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
            onClick={() => handleExport("pdf")}
            disabled={loading}
          >
            <IGRPIcon iconName="Download" className="h-4 w-4 mr-2" />
            Exportar PDF
          </IGRPButton>
          <IGRPButton
            variant="outline"
            onClick={() => handleExport("csv")}
            disabled={loading}
          >
            <IGRPIcon iconName="Download" className="h-4 w-4 mr-2" />
            Exportar CSV
          </IGRPButton>
        </div>
      </div>

      {/* Filtros */}
      <IGRPCard className="mb-6">
        <IGRPCardHeader>
          <IGRPCardTitle className="flex items-center">
            <IGRPIcon iconName="Filter" className="h-5 w-5 mr-2" />
            Filtros
          </IGRPCardTitle>
        </IGRPCardHeader>
        <IGRPCardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <IGRPLabel htmlFor="startDate">Data Inicial</IGRPLabel>
              <IGRPInputText
                id="startDate"
                type="text"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange((prev) => ({
                    ...prev,
                    startDate: (e.target as HTMLInputElement).value,
                  }))
                }
              />
            </div>
            <div>
              <IGRPLabel htmlFor="endDate">Data Final</IGRPLabel>
              <IGRPInputText
                id="endDate"
                type="text"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange((prev) => ({
                    ...prev,
                    endDate: (e.target as HTMLInputElement).value,
                  }))
                }
              />
            </div>
            <div>
              <IGRPLabel htmlFor="cemeteryId">Cemitério</IGRPLabel>
              <IGRPInputText
                id="cemeteryId"
                value={filters.cemeteryId}
                onChange={(e) =>
                  handleFilterChange(
                    "cemeteryId",
                    (e.target as HTMLInputElement).value,
                  )
                }
                placeholder="ID do cemitério (opcional)"
              />
            </div>
            <div>
              <IGRPLabel htmlFor="plotType">Tipo de Sepultura</IGRPLabel>
              <IGRPSelect
                value={filters.plotType}
                onValueChange={(value) =>
                  handleFilterChange("plotType", String(value))
                }
                options={[
                  { label: "Todos", value: "all" },
                  { label: "Terras", value: "GROUND" },
                  { label: "Mausoléu", value: "MAUSOLEUM" },
                  { label: "Nicho", value: "NICHE" },
                  { label: "Ossuário", value: "OSSUARY" },
                ]}
                placeholder="Selecione o tipo"
              ></IGRPSelect>
            </div>
          </div>
        </IGRPCardContent>
      </IGRPCard>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {metricCards.map((metric) => {
          return (
            <IGRPCard key={metric.title} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <IGRPIcon
                    iconName={metric.iconName}
                    className={`h-6 w-6 ${metric.color}`}
                  />
                </div>
                <div className={`text-sm text-gray-600`}> </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                {metric.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            </IGRPCard>
          );
        })}
      </div>

      {/* Gráficos e Análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Taxa de Ocupação por Período */}
        <IGRPCard>
          <IGRPCardHeader>
            <IGRPCardTitle className="flex items-center">
              <IGRPIcon iconName="TrendingUp" className="h-5 w-5 mr-2" />
              Taxa de Ocupação
            </IGRPCardTitle>
            <IGRPCardDescription>
              Evolução da taxa de ocupação ao longo do tempo
            </IGRPCardDescription>
          </IGRPCardHeader>
          <IGRPCardContent>
            {occupancyData && occupancyData.length > 0 ? (
              <div className="space-y-4">
                {occupancyData.map((item) => (
                  <div
                    key={item.date}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600">{item.date}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${item.occupancyRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {item.occupancyRate}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Nenhum dado de ocupação disponível
              </div>
            )}
          </IGRPCardContent>
        </IGRPCard>

        {/* Estatísticas por Tipo */}
        <IGRPCard>
          <IGRPCardHeader>
            <IGRPCardTitle className="flex items-center">
              <IGRPIcon iconName="BarChart3" className="h-5 w-5 mr-2" />
              Estatísticas por Tipo
            </IGRPCardTitle>
            <IGRPCardDescription>
              Distribuição de sepulturas por tipo
            </IGRPCardDescription>
          </IGRPCardHeader>
          <IGRPCardContent>
            {statistics && statistics.length > 0 ? (
              (() => {
                const aggregated = statistics.reduce(
                  (acc, stat) => {
                    acc.GROUND += stat.plotTypeDistribution.GROUND || 0;
                    acc.MAUSOLEUM += stat.plotTypeDistribution.MAUSOLEUM || 0;
                    acc.NICHE += stat.plotTypeDistribution.NICHE || 0;
                    acc.OSSUARY += stat.plotTypeDistribution.OSSUARY || 0;
                    acc.totalPlots += stat.totalPlots || 0;
                    return acc;
                  },
                  {
                    GROUND: 0,
                    MAUSOLEUM: 0,
                    NICHE: 0,
                    OSSUARY: 0,
                    totalPlots: 0,
                  },
                );
                const items = [
                  {
                    label: "Terras",
                    key: "GROUND" as const,
                    count: aggregated.GROUND,
                  },
                  {
                    label: "Mausoléu",
                    key: "MAUSOLEUM" as const,
                    count: aggregated.MAUSOLEUM,
                  },
                  {
                    label: "Nicho",
                    key: "NICHE" as const,
                    count: aggregated.NICHE,
                  },
                  {
                    label: "Ossuário",
                    key: "OSSUARY" as const,
                    count: aggregated.OSSUARY,
                  },
                ];
                return (
                  <div className="space-y-4">
                    {items.map((stat) => (
                      <div
                        key={stat.key}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-600 capitalize">
                          {stat.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{
                                width: `${((stat.count / (aggregated.totalPlots || 1)) * 100).toFixed(2)}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {stat.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()
            ) : (
              <div className="text-center text-gray-500 py-8">
                Nenhuma estatística disponível
              </div>
            )}
          </IGRPCardContent>
        </IGRPCard>
      </div>

      {/* Projeções e Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projeções Futuras */}
        <IGRPCard>
          <IGRPCardHeader>
            <IGRPCardTitle className="flex items-center">
              <IGRPIcon iconName="TrendingUp" className="h-5 w-5 mr-2" />
              Projeções Futuras
            </IGRPCardTitle>
            <IGRPCardDescription>
              Previsões baseadas em tendências históricas
            </IGRPCardDescription>
          </IGRPCardHeader>
          <IGRPCardContent>
            {projections && projections.length > 0 ? (
              <div className="space-y-4">
                {projections.map((projection) => (
                  <div
                    key={`${projection.currentDate}-${projection.projectionDate}`}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {projection.scenario.type}
                      </span>
                      <IGRPBadge
                        variant="soft"
                        color={
                          projection.confidenceLevel > 0.8
                            ? "success"
                            : projection.confidenceLevel > 0.5
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {Math.round(projection.confidenceLevel * 100)}%
                        confiança
                      </IGRPBadge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Data da projeção: {projection.projectionDate}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">
                        {projection.projectedOccupancyRate}%
                      </span>
                      <span className="text-sm text-gray-600">
                        Meses restantes: {projection.monthsRemaining}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Nenhuma projeção disponível
              </div>
            )}
          </IGRPCardContent>
        </IGRPCard>

        {/* Alertas e Notificações */}
        <IGRPCard>
          <IGRPCardHeader>
            <IGRPCardTitle className="flex items-center">
              <IGRPIcon iconName="Activity" className="h-5 w-5 mr-2" />
              Alertas e Notificações
            </IGRPCardTitle>
            <IGRPCardDescription>
              Alertas importantes sobre o cemitério
            </IGRPCardDescription>
          </IGRPCardHeader>
          <IGRPCardContent>
            {alerts && alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={`${alert.title}-${alert.triggeredAt}`}
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.severity === "CRITICAL"
                        ? "border-red-600 bg-red-50"
                        : alert.severity === "ERROR"
                          ? "border-red-500 bg-red-50"
                          : alert.severity === "WARNING"
                            ? "border-yellow-500 bg-yellow-50"
                            : "border-blue-500 bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{alert.title}</span>
                      <IGRPBadge
                        variant="soft"
                        color={
                          alert.severity === "CRITICAL"
                            ? "destructive"
                            : alert.severity === "ERROR"
                              ? "destructive"
                              : alert.severity === "WARNING"
                                ? "warning"
                                : "info"
                        }
                      >
                        {alert.severity}
                      </IGRPBadge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {alert.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(alert.triggeredAt).toLocaleDateString("pt-CV")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Nenhum alerta disponível
              </div>
            )}
          </IGRPCardContent>
        </IGRPCard>
      </div>
    </div>
  );
}
