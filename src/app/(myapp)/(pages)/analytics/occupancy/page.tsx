"use client";

import {
  IGRPButton,
  IGRPCard,
  IGRPCardContent,
  IGRPCardDescription,
  IGRPCardHeader,
  IGRPCardTitle,
  IGRPLabel,
  IGRPSelect,
  IGRPIcon,
} from "@igrp/igrp-framework-react-design-system";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCemetery } from "@/hooks/useCemetery";
import { usePlot } from "@/hooks/usePlot";
import type { Cemetery } from "@/types/cemetery";

/**
 * OccupancyAnalyticsPage
 * Dedicated page for occupancy analytics with cemetery filter.
 */
export default function OccupancyAnalyticsPage() {
  const { cemeteries, fetchCemeteries } = useCemetery();
  const { plotStatistics, fetchPlotStatistics, isLoading } = usePlot();
  const [cemeteryId, setCemeteryId] = useState<string>("");

  useEffect(() => {
    void fetchCemeteries();
  }, [fetchCemeteries]);
  useEffect(() => {
    void fetchPlotStatistics(cemeteryId || undefined);
  }, [fetchPlotStatistics, cemeteryId]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/analytics">
            <IGRPButton variant="ghost" size="sm">
              <IGRPIcon iconName="ArrowLeft" className="h-4 w-4 mr-2" />
              Voltar
            </IGRPButton>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ocupação</h1>
            <p className="text-muted-foreground">
              Análise de ocupação por cemitério
            </p>
          </div>
        </div>
      </div>

      <IGRPCard>
        <IGRPCardHeader>
          <IGRPCardTitle>Filtros</IGRPCardTitle>
          <IGRPCardDescription>
            Selecione um cemitério para focar a análise
          </IGRPCardDescription>
        </IGRPCardHeader>
        <IGRPCardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <IGRPLabel>Cemitério</IGRPLabel>
              <IGRPSelect
                options={[
                  { value: "", label: "Todos" },
                  ...cemeteries.map((c: Cemetery) => ({
                    value: c.id,
                    label: c.name,
                  })),
                ]}
                placeholder="Todos"
                onValueChange={(v) => setCemeteryId(String(v))}
              />
            </div>
            <div className="flex items-end">
              <IGRPButton
                variant="outline"
                onClick={() =>
                  void fetchPlotStatistics(cemeteryId || undefined)
                }
                disabled={isLoading}
              >
                <IGRPIcon
                  iconName="RefreshCw"
                  className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Atualizar
              </IGRPButton>
            </div>
          </div>
        </IGRPCardContent>
      </IGRPCard>

      <IGRPCard>
        <IGRPCardHeader>
          <IGRPCardTitle>Métricas de Ocupação</IGRPCardTitle>
        </IGRPCardHeader>
        <IGRPCardContent>
          {!plotStatistics ? (
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              Nenhum dado disponível
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">
                  {plotStatistics.totalPlots}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Disponíveis</p>
                <p className="text-2xl font-bold">
                  {plotStatistics.availablePlots}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Ocupadas</p>
                <p className="text-2xl font-bold">
                  {plotStatistics.occupiedPlots}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Taxa</p>
                <p className="text-2xl font-bold">
                  {plotStatistics.occupancyRate}%
                </p>
              </div>
            </div>
          )}
        </IGRPCardContent>
      </IGRPCard>
    </div>
  );
}
