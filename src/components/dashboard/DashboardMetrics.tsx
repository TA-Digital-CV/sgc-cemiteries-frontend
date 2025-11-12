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
} from "@igrp/igrp-framework-react-design-system";
import { useCemetery } from "@/hooks/useCemetery";
import { usePlot } from "@/hooks/usePlot";
import type { PlotStatistics } from "@/types/Plot";

interface DashboardMetricsProps {
  className?: string;
}

/**
 * DashboardMetrics renders key metric cards at the top of the dashboard.
 * Uses stable keys for items to prevent index-based key issues.
 */
export function DashboardMetrics({ className }: DashboardMetricsProps) {
  const { cemeteries, isLoading: cemeteriesLoading } = useCemetery();
  const { plots, plotStatistics, isLoading: plotsLoading } = usePlot();

  const isLoading = cemeteriesLoading || plotsLoading;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <IGRPCard key={`skeleton-${i}`} className="animate-pulse">
            <IGRPCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </IGRPCardHeader>
            <IGRPCardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </IGRPCardContent>
          </IGRPCard>
        ))}
      </div>
    );
  }

  const totalCemeteries = cemeteries.length;
  const totalPlots = plotStatistics?.totalPlots ?? plots.length;
  const occupiedPlots = plotStatistics?.occupiedPlots || 0;
  const availablePlots = plotStatistics?.availablePlots || 0;
  const occupancyRate = totalPlots > 0 ? (occupiedPlots / totalPlots) * 100 : 0;

  const metrics = [
    {
      title: "Total de Cemitérios",
      value: totalCemeteries.toString(),
      description: "Ativos no sistema",
      iconName: "MapPin",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total de Sepulturas",
      value: totalPlots.toLocaleString("pt-BR"),
      description: "Cadastradas",
      iconName: "Users",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Taxa de Ocupação",
      value: `${occupancyRate.toFixed(1)}%`,
      description: "Média geral",
      iconName: "TrendingUp",
      color:
        occupancyRate > 80
          ? "text-red-600"
          : occupancyRate > 60
            ? "text-yellow-600"
            : "text-green-600",
      bgColor:
        occupancyRate > 80
          ? "bg-red-100"
          : occupancyRate > 60
            ? "bg-yellow-100"
            : "bg-green-100",
    },
    {
      title: "Sepulturas Disponíveis",
      value: availablePlots.toLocaleString("pt-BR"),
      description: "Para novos cadastros",
      iconName: "CheckCircle",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
  ];

  return (
    <div
      className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className || ""}`}
    >
      {metrics.map((metric) => {
        return (
          <IGRPCard key={metric.title}>
            <IGRPCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <IGRPCardTitle className="text-sm font-medium">
                {metric.title}
              </IGRPCardTitle>
              <div className={`p-2 rounded-full ${metric.bgColor}`}>
                <IGRPIcon
                  iconName={metric.iconName}
                  className={`h-4 w-4 ${metric.color}`}
                />
              </div>
            </IGRPCardHeader>
            <IGRPCardContent>
              <div className={`text-2xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {metric.description}
              </p>
            </IGRPCardContent>
          </IGRPCard>
        );
      })}
    </div>
  );
}

interface OccupancyChartProps {
  className?: string;
}

export function OccupancyChart({ className }: OccupancyChartProps) {
  const { plotStatistics, isLoading } = usePlot();

  /**
   * Renders the plot status distribution chart using PlotStatistics fields.
   * Aligns with PlotStatistics schema: availablePlots, occupiedPlots,
   * reservedPlots, maintenancePlots, and computes percentages accordingly.
   */

  if (isLoading || !plotStatistics) {
    return (
      <IGRPCard className={className}>
        <IGRPCardHeader>
          <IGRPCardTitle>Distribuição de Sepulturas</IGRPCardTitle>
          <IGRPCardDescription>
            Status das sepulturas no sistema
          </IGRPCardDescription>
        </IGRPCardHeader>
        <IGRPCardContent>
          <div className="h-64 animate-pulse bg-gray-100 rounded"></div>
        </IGRPCardContent>
      </IGRPCard>
    );
  }

  const { availablePlots, occupiedPlots, reservedPlots, maintenancePlots } =
    plotStatistics;
  const total =
    availablePlots + occupiedPlots + reservedPlots + maintenancePlots;

  const data = [
    {
      label: "Disponíveis",
      value: availablePlots,
      color: "bg-green-500",
      percentage: (availablePlots / total) * 100,
    },
    {
      label: "Ocupadas",
      value: occupiedPlots,
      color: "bg-red-500",
      percentage: (occupiedPlots / total) * 100,
    },
    {
      label: "Reservadas",
      value: reservedPlots,
      color: "bg-yellow-500",
      percentage: (reservedPlots / total) * 100,
    },
    {
      label: "Manutenção",
      value: maintenancePlots,
      color: "bg-gray-500",
      percentage: (maintenancePlots / total) * 100,
    },
  ];

  return (
    <IGRPCard className={className}>
      <IGRPCardHeader>
        <IGRPCardTitle>Distribuição de Sepulturas</IGRPCardTitle>
        <IGRPCardDescription>
          Status das sepulturas no sistema
        </IGRPCardDescription>
      </IGRPCardHeader>
      <IGRPCardContent>
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold">{item.value}</span>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded h-2">
                <div
                  className={`h-2 rounded ${item.color}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </IGRPCardContent>
    </IGRPCard>
  );
}

interface RecentActivityProps {
  className?: string;
}

export function RecentActivity({ className }: RecentActivityProps) {
  const { cemeteries, selectedCemetery } = useCemetery();
  const { plots } = usePlot();

  // Simular atividades recentes (em produção, isso viria da API)
  const recentActivities = [
    {
      id: "1",
      type: "occupation",
      description: "Nova ocupação registrada - Quadra A, Lote 15",
      cemetery: "Cemitério Municipal",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      status: "success",
    },
    {
      id: "2",
      type: "reservation",
      description: "Reserva realizada - Quadra B, Lote 23",
      cemetery: "Cemitério da Paz",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
      status: "warning",
    },
    {
      id: "3",
      type: "maintenance",
      description: "Manutenção concluída - Quadra C, Lotes 1-10",
      cemetery: "Cemitério São João",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
      status: "info",
    },
    {
      id: "4",
      type: "creation",
      description: "Novas sepulturas cadastradas - Quadra D",
      cemetery: "Cemitério Municipal",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 horas atrás
      status: "success",
    },
  ];

  // Removed deprecated icon mapping that relied on non-IGRP icon components.

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "error":
        return "text-red-600 bg-red-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "agora";
    if (diffInHours === 1) return "1 hora atrás";
    if (diffInHours < 24) return `${diffInHours} horas atrás`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 dia atrás";
    return `${diffInDays} dias atrás`;
  };

  return (
    <IGRPCard className={className}>
      <IGRPCardHeader>
        <div className="flex items-center justify-between">
          <div>
            <IGRPCardTitle>Atividade Recente</IGRPCardTitle>
            <IGRPCardDescription>Últimas ações no sistema</IGRPCardDescription>
          </div>
          <IGRPButton variant="outline" size="sm">
            Ver todas
          </IGRPButton>
        </div>
      </IGRPCardHeader>
      <IGRPCardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div
                className={`p-2 rounded-full ${getStatusColor(activity.status)}`}
              >
                <IGRPIcon
                  iconName={
                    activity.type === "occupation"
                      ? "Users"
                      : activity.type === "reservation"
                        ? "Clock"
                        : activity.type === "maintenance"
                          ? "Activity"
                          : activity.type === "creation"
                            ? "CheckCircle"
                            : "BarChart3"
                  }
                  className="h-4 w-4"
                />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.cemetery} • {formatTimeAgo(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </IGRPCardContent>
    </IGRPCard>
  );
}

interface DashboardHeaderProps {
  className?: string;
}

export function DashboardHeader({ className }: DashboardHeaderProps) {
  return (
    <div className={`flex items-center justify-between ${className || ""}`}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema de gerenciamento de cemitérios
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <IGRPButton variant="outline" size="sm">
          <IGRPIcon iconName="Calendar" className="h-4 w-4 mr-2" />
          Filtrar data
        </IGRPButton>
        <IGRPButton size="sm">
          <IGRPIcon iconName="BarChart3" className="h-4 w-4 mr-2" />
          Exportar relatório
        </IGRPButton>
      </div>
    </div>
  );
}
