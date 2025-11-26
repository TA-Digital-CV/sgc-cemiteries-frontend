"use client";

import {
  IGRPCard,
  IGRPCardContent,
  IGRPCardHeader,
  IGRPCardTitle,
} from "@igrp/igrp-framework-react-design-system";
import { Activity, BarChart3, Users, Warehouse } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useCemetery } from "@/app/(myapp)/hooks/useCemetery";
import { OccupancyChart } from "./OccupancyChart";
import { OperationsChart } from "./OperationsChart";

interface DashboardStatsProps {
  cemeteryId?: string;
}

export function DashboardStats({ cemeteryId }: DashboardStatsProps) {
  const {
    cemeteries,
    fetchCemeteries,
    cemeteryStatistics,
    fetchCemeteryStatistics,
  } = useCemetery();

  /**
   * Ensures statistics are fetched only once per mount to avoid
   * duplicate requests under React Strict Mode in development.
   */
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    if (cemeteryId) {
      void fetchCemeteryStatistics(cemeteryId);
    } else {
      void fetchCemeteries();
    }
  }, [cemeteryId, fetchCemeteries, fetchCemeteryStatistics]);

  const stats = useMemo(() => {
    if (cemeteryId && cemeteryStatistics) {
      return {
        totalCemeteries: 1,
        totalPlots: cemeteryStatistics.totalPlots,
        availablePlots: cemeteryStatistics.availablePlots,
        occupiedPlots: cemeteryStatistics.occupiedPlots,
        occupancyRate: cemeteryStatistics.occupancyRate,
        burials: 0,
        exhumations: 0,
        transfers: 0,
        reserved: cemeteryStatistics.reservedPlots ?? 0,
        maintenance: cemeteryStatistics.maintenancePlots ?? 0,
      };
    }

    // Global stats aggregation
    const totalPlots = cemeteries.reduce(
      (acc, c) => acc + (c.maxCapacity || 0),
      0,
    );
    const occupiedPlots = cemeteries.reduce(
      (acc, c) => acc + (c.currentOccupancy || 0),
      0,
    );
    const availablePlots = totalPlots - occupiedPlots;
    const occupancyRate =
      totalPlots > 0 ? Math.round((occupiedPlots / totalPlots) * 100) : 0;

    return {
      totalCemeteries: cemeteries.length,
      totalPlots,
      availablePlots,
      occupiedPlots,
      occupancyRate,
      burials: 0, // Global aggregation would need more data
      exhumations: 0,
      transfers: 0,
      reserved: 0,
      maintenance: 0,
    };
  }, [cemeteryId, cemeteryStatistics, cemeteries]);

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <IGRPCard>
          <IGRPCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <IGRPCardTitle className="text-sm font-medium">
              Total de Jazigos
            </IGRPCardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </IGRPCardHeader>
          <IGRPCardContent>
            <div className="text-2xl font-bold">{stats.totalPlots}</div>
            <p className="text-xs text-muted-foreground">
              Capacidade total registrada
            </p>
          </IGRPCardContent>
        </IGRPCard>

        <IGRPCard>
          <IGRPCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <IGRPCardTitle className="text-sm font-medium">
              Taxa de Ocupação
            </IGRPCardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </IGRPCardHeader>
          <IGRPCardContent>
            <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.occupiedPlots} jazigos ocupados
            </p>
          </IGRPCardContent>
        </IGRPCard>

        <IGRPCard>
          <IGRPCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <IGRPCardTitle className="text-sm font-medium">
              Disponíveis
            </IGRPCardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </IGRPCardHeader>
          <IGRPCardContent>
            <div className="text-2xl font-bold">{stats.availablePlots}</div>
            <p className="text-xs text-muted-foreground">
              Jazigos livres para uso
            </p>
          </IGRPCardContent>
        </IGRPCard>

        <IGRPCard>
          <IGRPCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <IGRPCardTitle className="text-sm font-medium">
              Operações (Total)
            </IGRPCardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </IGRPCardHeader>
          <IGRPCardContent>
            <div className="text-2xl font-bold">
              {stats.burials + stats.exhumations + stats.transfers}
            </div>
            <p className="text-xs text-muted-foreground">
              Inumações, exumações e traslados
            </p>
          </IGRPCardContent>
        </IGRPCard>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <IGRPCard className="col-span-4">
          <IGRPCardHeader>
            <IGRPCardTitle>Distribuição de Ocupação</IGRPCardTitle>
          </IGRPCardHeader>
          <IGRPCardContent className="pl-2">
            <OccupancyChart
              data={{
                occupied: stats.occupiedPlots,
                available: stats.availablePlots,
                reserved: stats.reserved,
                maintenance: stats.maintenance,
              }}
            />
          </IGRPCardContent>
        </IGRPCard>
        <IGRPCard className="col-span-3">
          <IGRPCardHeader>
            <IGRPCardTitle>Operações por Tipo</IGRPCardTitle>
          </IGRPCardHeader>
          <IGRPCardContent>
            <OperationsChart
              data={{
                burials: stats.burials,
                exhumations: stats.exhumations,
                transfers: stats.transfers,
              }}
            />
          </IGRPCardContent>
        </IGRPCard>
      </div>
    </div>
  );
}
