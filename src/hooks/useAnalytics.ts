import { useCallback, useEffect, useState } from "react";
import type {
  Alert,
  AnalyticsFilters,
  CapacityProjection,
  CemeteryStatistics,
  DashboardMetrics,
  HeatmapData,
  OccupancyData,
} from "@/types/Analytics";
import {
  type ActionResult,
  ApiResponse,
  PaginatedResponse,
} from "@/types/Common";

interface UseAnalyticsReturn {
  // Estado
  metrics: DashboardMetrics | null;
  occupancyData: OccupancyData[];
  statistics: CemeteryStatistics[];
  projections: CapacityProjection[];
  heatmapData: HeatmapData[];
  alerts: Alert[];
  loading: boolean;
  error: string | null;

  // Filtros
  filters: AnalyticsFilters;
  setFilters: (filters: AnalyticsFilters) => void;

  // Ações
  fetchMetrics: (cemeteryId?: string) => Promise<void>;
  fetchOccupancyData: (cemeteryId?: string) => Promise<void>;
  fetchStatistics: (filters?: AnalyticsFilters) => Promise<void>;
  fetchProjections: (cemeteryId?: string, years?: number) => Promise<void>;
  fetchHeatmapData: (cemeteryId?: string) => Promise<void>;
  fetchAlerts: (cemeteryId?: string) => Promise<void>;
  clearFilters: () => void;
  exportData: (format: "csv" | "json" | "pdf") => Promise<ActionResult<any>>;
}

/**
 * useAnalytics
 * Manages analytics state, filters, and data fetching for dashboard pages.
 * Exposes typed methods to retrieve metrics, occupancy, statistics, projections,
 * heatmap data and alerts, along with filter management and export helpers.
 */
export function useAnalytics(): UseAnalyticsReturn {
  // Estado
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [occupancyData, setOccupancyData] = useState<OccupancyData[]>([]);
  const [statistics, setStatistics] = useState<CemeteryStatistics[]>([]);
  const [projections, setProjections] = useState<CapacityProjection[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filters, setFilters] = useState<AnalyticsFilters>({
    // Default period: from start of last year to today
    dateRange: {
      startDate: new Date(new Date().getFullYear() - 1, 0, 1).toISOString(),
      endDate: new Date().toISOString(),
    },
    cemeteryIds: [],
    plotTypes: [],
    status: [],
  });

  // Funções de busca de dados
  /**
   * fetchMetrics
   * Aggregates high-level metrics using backend occupancy/statistics endpoints for a given cemetery.
   */
  const fetchMetrics = useCallback(async (cemeteryId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
      if (!cemeteryId) {
        setMetrics(null);
        setError("Error: cemeteryId required to fetch metrics");
        return;
      }
      const occRes = await fetch(
        `${API_BASE}/api/v1/cemeteries/${cemeteryId}/occupancy`,
        { headers: { "Content-Type": "application/json" }, cache: "no-store" },
      );
      if (!occRes.ok) throw new Error(`Fetch failed: ${occRes.status}`);
      const occJson: any = await occRes.json();
      const overall = occJson?.overall ?? {};
      const totalPlots = Number(overall.totalPlots ?? 0);
      const occupiedPlots = Number(overall.occupiedPlots ?? 0);
      const availablePlots = Number(overall.availablePlots ?? 0);
      const occupancyRate = Number(overall.occupancyRate ?? 0);
      const now = new Date().toISOString();
      setMetrics({
        totalCemeteries: 1,
        activeCemeteries: 1,
        totalPlots,
        occupiedPlots,
        availablePlots,
        overallOccupancyRate: occupancyRate,
        criticalCapacityCemeteries: occupancyRate >= 90 ? 1 : 0,
        lastSyncDate: now,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar métricas",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * fetchOccupancyData
   * Retrieves occupancy metrics timeline for the selected cemetery.
   */
  const fetchOccupancyData = useCallback(async (cemeteryId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
      if (!cemeteryId) {
        setOccupancyData([]);
        setError("Error: cemeteryId required to fetch occupancy data");
        return;
      }
      const res = await fetch(
        `${API_BASE}/api/v1/cemeteries/${cemeteryId}/occupancy?breakdown=TOTAL`,
        { headers: { "Content-Type": "application/json" }, cache: "no-store" },
      );
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const json: any = await res.json();
      const overall = json?.overall ?? {};
      const data: OccupancyData[] = [
        {
          date: new Date().toISOString().split("T")[0],
          cemeteryId: String(cemeteryId),
          cemeteryName: String(json?.cemeteryName ?? ""),
          totalPlots: Number(overall.totalPlots ?? 0),
          occupiedPlots: Number(overall.occupiedPlots ?? 0),
          availablePlots: Number(overall.availablePlots ?? 0),
          occupancyRate: Number(overall.occupancyRate ?? 0),
          trend: "stable",
        },
      ];
      setOccupancyData(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar dados de ocupação",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * fetchStatistics
   * Loads cemetery statistics using backend endpoint, honoring provided filters.
   */
  const fetchStatistics = useCallback(
    async (customFilters?: AnalyticsFilters) => {
      try {
        setLoading(true);
        setError(null);
        const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
        const f = customFilters || filters;
        const cemeteryId = f.cemeteryIds?.[0];
        if (!cemeteryId) {
          setStatistics([]);
          setError("Error: cemeteryId required to fetch statistics");
          return;
        }
        const res = await fetch(
          `${API_BASE}/api/v1/cemeteries/${cemeteryId}/statistics`,
          {
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          },
        );
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const json: any = await res.json();
        const occ = json?.occupancyStats ?? {};
        const dist = json?.plotTypeDistribution ?? {};
        const item: CemeteryStatistics = {
          cemeteryId: String(json?.cemeteryId ?? cemeteryId),
          cemeteryName: String(json?.cemeteryName ?? ""),
          totalPlots: Number(occ.totalPlots ?? 0),
          occupiedPlots: Number(occ.occupiedPlots ?? 0),
          availablePlots: Number(occ.availablePlots ?? 0),
          reservedPlots: Number(occ.reservedPlots ?? 0),
          maintenancePlots: Number(occ.maintenancePlots ?? 0),
          occupancyRate: Number(occ.occupancyRate ?? 0),
          monthlyGrowthRate: 0,
          yearlyGrowthRate: 0,
          capacityProjection: {
            currentDate: new Date().toISOString(),
            projectionDate:
              json?.capacityProjection?.estimatedFullCapacityDate ?? "",
            monthsRemaining: Number(
              json?.capacityProjection?.monthsRemaining ?? 0,
            ),
            projectedOccupancyRate: Number(occ.occupancyRate ?? 0),
            confidenceLevel: 0.95,
            scenario: {
              type: "MODERATE",
              growthRate: 0,
              description: "",
              assumptions: [],
            },
            riskFactors: [],
          },
          plotTypeDistribution: {
            GROUND: Number(dist.GROUND ?? 0),
            MAUSOLEUM: Number(dist.MAUSOLEUM ?? 0),
            NICHE: Number(dist.NICHE ?? 0),
            OSSUARY: Number(dist.OSSUARY ?? 0),
          },
          statusDistribution: {
            AVAILABLE: Number(occ.availablePlots ?? 0),
            OCCUPIED: Number(occ.occupiedPlots ?? 0),
            RESERVED: Number(occ.reservedPlots ?? 0),
            MAINTENANCE: Number(occ.maintenancePlots ?? 0),
          },
          lastUpdated: new Date().toISOString(),
        };
        setStatistics([item]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar estatísticas",
        );
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  /**
   * fetchProjections
   * Loads capacity projection for a cemetery and maps to internal type.
   */
  const fetchProjections = useCallback(
    async (cemeteryId?: string, years: number = 12) => {
      try {
        setLoading(true);
        setError(null);
        const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
        if (!cemeteryId) {
          setProjections([]);
          setError("Error: cemeteryId required to fetch projections");
          return;
        }
        const res = await fetch(
          `${API_BASE}/api/v1/cemeteries/${cemeteryId}/capacity-projection?projectionPeriod=${Math.max(1, years)}`,
          {
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          },
        );
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const json: any = await res.json();
        const p = json?.projections ?? {};
        const params = json?.projectionParameters ?? {};
        const current = json?.currentStatus ?? {};
        const item: CapacityProjection = {
          currentDate: new Date().toISOString(),
          projectionDate: String(p.estimatedFullCapacityDate ?? ""),
          monthsRemaining: Number(p.monthsToFullCapacity ?? 0),
          projectedOccupancyRate: Number(current.occupancyRate ?? 0),
          confidenceLevel: Number(params.confidenceLevel ?? 0),
          scenario: {
            type: "MODERATE",
            growthRate: Number(json?.historicalTrends?.growthRate ?? 0),
            description: "",
            assumptions: [],
          },
          riskFactors: [],
        };
        setProjections(item.projectionDate ? [item] : []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar projeções",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * fetchHeatmapData
   * Loads heatmap grid data and maps to HeatmapData items.
   */
  const fetchHeatmapData = useCallback(async (cemeteryId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
      if (!cemeteryId) {
        setHeatmapData([]);
        setError("Error: cemeteryId required to fetch heatmap data");
        return;
      }
      const res = await fetch(
        `${API_BASE}/api/v1/cemeteries/${cemeteryId}/heatmap-data?gridSize=50&metric=OCCUPANCY`,
        { headers: { "Content-Type": "application/json" }, cache: "no-store" },
      );
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const json: any = await res.json();
      const grid: any[] = Array.isArray(json?.data) ? json.data : [];
      const items: HeatmapData[] = grid.map((cell, idx) => ({
        id: `${cemeteryId}-${idx}`,
        cemeteryId: String(cemeteryId),
        cemeteryName: String(json?.cemeteryName ?? ""),
        geoPoint: {
          latitude: Number(cell.coordinates?.latitude ?? 0),
          longitude: Number(cell.coordinates?.longitude ?? 0),
        },
        metric: "occupancy",
        value: Number(cell.value ?? 0),
        intensity: Number(cell.value ?? 0),
        label: `${Number(cell.value ?? 0).toFixed(2)}`,
      }));
      setHeatmapData(items);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar dados de mapa de calor",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * fetchAlerts
   * Alerts are not provided by backend; enforces minimal explicit error policy.
   */
  const fetchAlerts = useCallback(async (_cemeteryId?: string) => {
    try {
      setLoading(true);
      setError(null);
      setAlerts([]);
      setError("Error: Service unavailable - Try again later");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar alertas");
    } finally {
      setLoading(false);
    }
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      dateRange: {
        startDate: new Date(new Date().getFullYear() - 1, 0, 1).toISOString(),
        endDate: new Date().toISOString(),
      },
      cemeteryIds: [],
      plotTypes: [],
      status: [],
    });
  }, []);

  const exportData = useCallback(
    async (format: "csv" | "json" | "pdf"): Promise<ActionResult<any>> => {
      try {
        setLoading(true);
        setError(null);

        // Simular exportação - substituir por chamada real
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Criar blob com os dados
        const dataToExport = {
          metrics,
          occupancyData,
          statistics,
          projections,
          heatmapData,
          alerts,
          filters,
          exportDate: new Date().toISOString(),
        };

        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `analytics-data-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        return {
          success: true,
          data: { message: "Dados exportados com sucesso" },
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao exportar dados";
        setError(errorMessage);
        return { success: false, errors: [errorMessage] };
      } finally {
        setLoading(false);
      }
    },
    [
      metrics,
      occupancyData,
      statistics,
      projections,
      heatmapData,
      alerts,
      filters,
    ],
  );

  // Efeito inicial para carregar dados
  useEffect(() => {
    fetchMetrics();
    fetchOccupancyData();
    fetchStatistics();
    fetchProjections();
    fetchHeatmapData();
    fetchAlerts();
  }, []);

  return {
    // Estado
    metrics,
    occupancyData,
    statistics,
    projections,
    heatmapData,
    alerts,
    loading,
    error,

    // Filtros
    filters,
    setFilters,

    // Ações
    fetchMetrics,
    fetchOccupancyData,
    fetchStatistics,
    fetchProjections,
    fetchHeatmapData,
    fetchAlerts,
    clearFilters,
    exportData,
  };
}
