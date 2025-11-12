// Tipos para Analytics e Dashboard
export interface DashboardMetrics {
  totalCemeteries: number;
  activeCemeteries: number;
  totalPlots: number;
  occupiedPlots: number;
  availablePlots: number;
  overallOccupancyRate: number;
  criticalCapacityCemeteries: number;
  lastSyncDate: string;
}

export interface OccupancyData {
  date: string;
  cemeteryId: string;
  cemeteryName: string;
  totalPlots: number;
  occupiedPlots: number;
  availablePlots: number;
  occupancyRate: number;
  trend: "up" | "down" | "stable";
  trendValue?: number;
}

export interface OccupancyTrend {
  cemeteryId: string;
  cemeteryName: string;
  data: OccupancyDataPoint[];
  averageGrowthRate: number;
  projectedFullDate?: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface OccupancyDataPoint {
  date: string;
  occupancyRate: number;
  totalPlots: number;
  occupiedPlots: number;
}

export interface CemeteryStatistics {
  cemeteryId: string;
  cemeteryName: string;
  totalPlots: number;
  occupiedPlots: number;
  availablePlots: number;
  reservedPlots: number;
  maintenancePlots: number;
  occupancyRate: number;
  monthlyGrowthRate: number;
  yearlyGrowthRate: number;
  capacityProjection: CapacityProjection;
  plotTypeDistribution: PlotTypeDistribution;
  statusDistribution: StatusDistribution;
  lastUpdated: string;
}

export interface PlotTypeDistribution {
  GROUND: number;
  MAUSOLEUM: number;
  NICHE: number;
  OSSUARY: number;
}

export interface StatusDistribution {
  AVAILABLE: number;
  OCCUPIED: number;
  RESERVED: number;
  MAINTENANCE: number;
}

export interface CapacityProjection {
  currentDate: string;
  projectionDate: string;
  monthsRemaining: number;
  projectedOccupancyRate: number;
  confidenceLevel: number;
  scenario: GrowthScenario;
  riskFactors: string[];
}

export interface GrowthScenario {
  type: "CONSERVATIVE" | "MODERATE" | "AGGRESSIVE";
  growthRate: number;
  description: string;
  assumptions: string[];
}

export interface HeatmapData {
  id: string;
  cemeteryId: string;
  cemeteryName: string;
  geoPoint: GeoPoint;
  metric: HeatmapMetric;
  value: number;
  intensity: number;
  label: string;
  description?: string;
}

export type HeatmapMetric =
  | "occupancy"
  | "availability"
  | "density"
  | "growth"
  | "risk";

export interface HeatmapFilters {
  metric?: HeatmapMetric;
  cemeteryIds?: string[];
  dateRange?: DateRange;
  minIntensity?: number;
  maxIntensity?: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface AnalyticsFilters {
  cemeteryIds?: string[];
  dateRange?: DateRange;
  plotTypes?: PlotType[];
  status?: PlotStatus[];
  municipalities?: string[];
  includeProjections?: boolean;
  scenario?: GrowthScenario;
}

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  description?: string;
  data: unknown;
  config: WidgetConfig;
  refreshInterval?: number;
  lastUpdated: string;
}

export type WidgetType =
  | "STATS"
  | "CHART_LINE"
  | "CHART_BAR"
  | "CHART_PIE"
  | "CHART_DOUGHNUT"
  | "HEATMAP"
  | "TABLE"
  | "GAUGE"
  | "PROGRESS"
  | "ALERT"
  | "SYNCHRONIZATION";

export interface WidgetConfig {
  width?: "SMALL" | "MEDIUM" | "LARGE" | "FULL";
  height?: number;
  colorScheme?: ColorScheme;
  showLegend?: boolean;
  showLabels?: boolean;
  animation?: boolean;
  responsive?: boolean;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
}

export interface SynchronizationStatus {
  lastSyncDate: string;
  nextSyncDate: string;
  syncStatus: "SYNCED" | "SYNCING" | "FAILED" | "PENDING";
  syncError?: string;
  dataSources: DataSourceStatus[];
}

export interface DataSourceStatus {
  source: string;
  status: "CONNECTED" | "DISCONNECTED" | "ERROR";
  lastSync: string;
  recordsProcessed: number;
  errors: number;
}

export interface AlertConfig {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  threshold: number;
  comparison: "GREATER_THAN" | "LESS_THAN" | "EQUALS";
  enabled: boolean;
  recipients: string[];
  cooldownMinutes: number;
}

export type AlertType =
  | "CAPACITY_CRITICAL"
  | "CAPACITY_WARNING"
  | "SYNC_FAILURE"
  | "MAINTENANCE_DUE"
  | "DATA_INCONSISTENCY";

export interface Alert {
  id: string;
  configId: string;
  type: AlertType;
  title: string;
  description: string;
  severity: "INFO" | "WARNING" | "ERROR" | "CRITICAL";
  triggeredAt: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  metadata?: Record<string, unknown>;
}

// Enums reutilizados
export type PlotType = "GROUND" | "MAUSOLEUM" | "NICHE" | "OSSUARY";
export type PlotStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE";
export type GrowthScenarioType = "CONSERVATIVE" | "MODERATE" | "AGGRESSIVE";

// Tipos auxiliares
export interface GeoPoint {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ResponseMetadata {
  timestamp: string;
  version: string;
  requestId: string;
}
