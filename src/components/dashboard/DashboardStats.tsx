"use client";

import {
  IGRPStatsCard,
} from "@igrp/igrp-framework-react-design-system";
import React, { useEffect, useMemo, useRef } from "react";
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
    isLoading,
  } = useCemetery();

  /**
   * Ensures statistics are fetched only once per mount or when cemeteryId changes.
   */
  const lastFetchedIdRef = useRef<string | undefined | null>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // If we have already fetched for this specific ID, skip
    if (hasFetchedRef.current && lastFetchedIdRef.current === cemeteryId) {
      return;
    }

    hasFetchedRef.current = true;
    lastFetchedIdRef.current = cemeteryId;

    if (cemeteryId) {
      console.log(`[DashboardStats] Fetching statistics for cemetery ${cemeteryId}`);
      void fetchCemeteryStatistics(cemeteryId);
    } else {
      console.log("[DashboardStats] Fetching all cemeteries for global stats");
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <IGRPStatsCard
              key={i}
              name={`loading-stat-${i}`}
              cardBorderPosition="top"
              cardBorder="rounded-xl"
              cardVariant="info"
              iconName="Activity"
              showIcon={true}
              showIconBackground={true}
              className="animate-pulse"
              value="..."
              title="Carregando..."
            />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <OccupancyChart
            className="col-span-4"
            data={{
              occupied: 0,
              available: 0,
              reserved: 0,
              maintenance: 0,
            }}
            isLoading={true}
          />
          <OperationsChart
            className="col-span-3"
            data={{
              burials: 0,
              exhumations: 0,
              transfers: 0,
            }}
            isLoading={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <IGRPStatsCard
          name="total-plots"
          cardBorderPosition="top"
          cardBorder="rounded-xl"
          cardVariant="primary"
          iconName="Warehouse"
          showIcon={true}
          showIconBackground={true}
          value={stats.totalPlots.toString()}
          title="Total de Sepulturas"
          label="Capacidade total registrada"
        />

        <IGRPStatsCard
          name="occupancy-rate"
          cardBorderPosition="top"
          cardBorder="rounded-xl"
          cardVariant={stats.occupancyRate > 80 ? "destructive" : "warning"}
          iconName="Activity"
          showIcon={true}
          showIconBackground={true}
          value={`${stats.occupancyRate}%`}
          title="Taxa de Ocupação"
          label={`${stats.occupiedPlots} jazigos ocupados`}
        />

        <IGRPStatsCard
          name="available-plots"
          cardBorderPosition="top"
          cardBorder="rounded-xl"
          cardVariant="success"
          iconName="HousePlus"
          showIcon={true}
          showIconBackground={true}
          value={stats.availablePlots.toString()}
          title="Sepulturas Disponíveis"
          label="Sepulturas livres para uso"
        />

        <IGRPStatsCard
          name="operations-total"
          cardBorderPosition="top"
          cardBorder="rounded-xl"
          cardVariant="info"
          iconName="Wrench"
          showIcon={true}
          showIconBackground={true}
          value={(stats.burials + stats.exhumations + stats.transfers).toString()}
          title="Operações (Total)"
          label="Inumações, exumações e traslados"

        />
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <OccupancyChart
          className="col-span-4"
          data={{
            occupied: stats.occupiedPlots,
            available: stats.availablePlots,
            reserved: stats.reserved,
            maintenance: stats.maintenance,
          }}
        />
        <OperationsChart
          className="col-span-3"
          data={{
            burials: stats.burials,
            exhumations: stats.exhumations,
            transfers: stats.transfers,
          }}
        />
      </div>
    </div>
  );
}
