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
  IGRPStatsCard,
} from "@igrp/igrp-framework-react-design-system";
import { useCemetery } from "@/hooks/useCemetery";
import { usePlot } from "@/hooks/usePlot";
import type { PlotStatistics } from "@/types/Plot";

interface DashboardMetricsProps {
  className?: string;
}

/**
 * DashboardMetrics
 * Renders statistics cards using IGRPStatsCard with data from cemeteries and plots.
 */
export function DashboardMetrics({ className }: DashboardMetricsProps) {
  const { cemeteries, isLoading: cemeteriesLoading } = useCemetery();
  const { plots, plotStatistics, isLoading: plotsLoading } = usePlot();

  const isLoading = cemeteriesLoading || plotsLoading;

  if (isLoading) {
    return (
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className || ""}`}
      >
        <IGRPStatsCard
          name={`loading-total-cemeteries`}
          cardBorderPosition={`top`}
          cardBorder={`rounded-xl`}
          cardVariant={`info`}
          iconBackground={`square`}
          title={`Total de Cemitérios`}
          titleSize={`sm`}
          valueSize={`2xl`}
          showIcon={true}
          iconName={`MapPin`}
          iconSize={`md`}
          iconVariant={`info`}
          iconPlacement={`end`}
          itemPlacement={`start`}
          showIconBackground={true}
          className={`col-span-1 animate-pulse`}
          value={`...`}
        ></IGRPStatsCard>
        <IGRPStatsCard
          name={`loading-total-plots`}
          cardBorderPosition={`top`}
          cardBorder={`rounded-xl`}
          cardVariant={`success`}
          iconBackground={`square`}
          title={`Total de Sepulturas`}
          titleSize={`sm`}
          valueSize={`2xl`}
          showIcon={true}
          iconName={`Users`}
          iconSize={`md`}
          iconVariant={`success`}
          iconPlacement={`end`}
          itemPlacement={`start`}
          showIconBackground={true}
          className={`col-span-1 animate-pulse`}
          value={`...`}
        ></IGRPStatsCard>
        <IGRPStatsCard
          name={`loading-occupancy-rate`}
          cardBorderPosition={`top`}
          cardBorder={`rounded-xl`}
          cardVariant={`warning`}
          iconBackground={`square`}
          title={`Taxa de Ocupação`}
          titleSize={`sm`}
          valueSize={`2xl`}
          showIcon={true}
          iconName={`TrendingUp`}
          iconSize={`md`}
          iconVariant={`warning`}
          iconPlacement={`end`}
          itemPlacement={`start`}
          showIconBackground={true}
          className={`col-span-1 animate-pulse`}
          value={`...`}
        ></IGRPStatsCard>
        <IGRPStatsCard
          name={`loading-available-plots`}
          cardBorderPosition={`top`}
          cardBorder={`rounded-xl`}
          cardVariant={`primary`}
          iconBackground={`square`}
          title={`Sepulturas Disponíveis`}
          titleSize={`sm`}
          valueSize={`2xl`}
          showIcon={true}
          iconName={`CheckCircle`}
          iconSize={`md`}
          iconVariant={`primary`}
          iconPlacement={`end`}
          itemPlacement={`start`}
          showIconBackground={true}
          className={`col-span-1 animate-pulse`}
          value={`...`}
        ></IGRPStatsCard>
      </div>
    );
  }

  const totalCemeteries = cemeteries.length;
  const totalPlots = plotStatistics?.totalPlots ?? plots.length;
  const occupiedPlots = plotStatistics?.occupiedPlots || 0;
  const availablePlots = plotStatistics?.availablePlots || 0;
  const occupancyRate = totalPlots > 0 ? (occupiedPlots / totalPlots) * 100 : 0;

  const occupancyVariant =
    occupancyRate > 80 ? "warning" : occupancyRate > 60 ? "primary" : "success";

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className || ""}`}
    >
      <IGRPStatsCard
        name={`stat-total-cemeteries`}
        cardBorderPosition={`top`}
        cardBorder={`rounded-xl`}
        cardVariant={`info`}
        iconBackground={`square`}
        title={`Total de Cemitérios`}
        titleSize={`sm`}
        valueSize={`2xl`}
        showIcon={true}
        iconName={`MapPin`}
        iconSize={`md`}
        iconVariant={`info`}
        iconPlacement={`end`}
        itemPlacement={`start`}
        showIconBackground={true}
        className={`col-span-1`}
        value={totalCemeteries.toString()}
      ></IGRPStatsCard>

      <IGRPStatsCard
        name={`stat-total-plots`}
        cardBorderPosition={`top`}
        cardBorder={`rounded-xl`}
        cardVariant={`success`}
        iconBackground={`square`}
        title={`Total de Sepulturas`}
        titleSize={`sm`}
        valueSize={`2xl`}
        showIcon={true}
        iconName={`Users`}
        iconSize={`md`}
        iconVariant={`success`}
        iconPlacement={`end`}
        itemPlacement={`start`}
        showIconBackground={true}
        className={`col-span-1`}
        value={totalPlots.toLocaleString("pt-CV")}
      ></IGRPStatsCard>

      <IGRPStatsCard
        name={`stat-occupancy-rate`}
        cardBorderPosition={`top`}
        cardBorder={`rounded-xl`}
        cardVariant={occupancyVariant}
        iconBackground={`square`}
        title={`Taxa de Ocupação`}
        titleSize={`sm`}
        valueSize={`2xl`}
        showIcon={true}
        iconName={`TrendingUp`}
        iconSize={`md`}
        iconVariant={occupancyVariant}
        iconPlacement={`end`}
        itemPlacement={`start`}
        showIconBackground={true}
        className={`col-span-1`}
        value={`${occupancyRate.toFixed(1)}%`}
      ></IGRPStatsCard>

      <IGRPStatsCard
        name={`stat-available-plots`}
        cardBorderPosition={`top`}
        cardBorder={`rounded-xl`}
        cardVariant={`primary`}
        iconBackground={`square`}
        title={`Sepulturas Disponíveis`}
        titleSize={`sm`}
        valueSize={`2xl`}
        showIcon={true}
        iconName={`CheckLine`}
        iconSize={`md`}
        iconVariant={`primary`}
        iconPlacement={`end`}
        itemPlacement={`start`}
        showIconBackground={true}
        className={`col-span-1`}
        value={availablePlots.toLocaleString("pt-CV")}
      ></IGRPStatsCard>
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

  // No mock data: show a clear message if no real activity is available
  const recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    cemetery: string;
    timestamp: Date;
    status: string;
  }> = [];

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
        {recentActivities.length > 0 ? (
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
        ) : (
          <div className="text-sm text-muted-foreground">No data available</div>
        )}
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
