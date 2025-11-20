// Tipos para QR Codes
import type { GeoPoint } from "@/app/(myapp)/types/Analytics";
export interface QRCodeData {
  id: string;
  plotId: string;
  cemeteryId: string;
  code: string;
  url: string;
  imageData: string;
  format: QRCodeFormat;
  size: QRCodeSize;
  errorCorrection: ErrorCorrectionLevel;
  style: QRCodeStyle;
  generatedAt: string;
  lastScannedAt?: string;
  scanCount: number;
  metadata?: QRCodeMetadata;
}

export interface QRCodeMetadata {
  generator: string;
  version: string;
  template?: string;
  customColors?: {
    foreground: string;
    background: string;
    accent?: string;
  };
  logo?: {
    url: string;
    size: number;
    position: "center" | "corner";
  };
  frame?: {
    enabled: boolean;
    text?: string;
    style?: string;
  };
}

export interface QRCodeOptions {
  format?: QRCodeFormat;
  size?: QRCodeSize;
  errorCorrection?: ErrorCorrectionLevel;
  style?: QRCodeStyle;
  customColors?: {
    foreground: string;
    background: string;
    accent?: string;
  };
  logo?: {
    url: string;
    size: number;
    position: "center" | "corner";
  };
  frame?: {
    enabled: boolean;
    text?: string;
    style?: string;
  };
  template?: string;
}

export type QRCodeFormat = "PNG" | "SVG" | "PDF" | "EPS";
export type QRCodeSize = "SMALL" | "MEDIUM" | "LARGE" | "EXTRA_LARGE";
export type ErrorCorrectionLevel = "LOW" | "MEDIUM" | "QUARTILE" | "HIGH";
export type QRCodeStyle =
  | "STANDARD"
  | "ROUNDED"
  | "DOTS"
  | "CLASSIC"
  | "MODERN";

export interface QRCodeBatchRequest {
  plotIds: string[];
  options?: QRCodeOptions;
  format?: QRCodeFormat;
  includePrintReady?: boolean;
}

export interface QRCodeBatchResponse {
  batchId: string;
  totalCodes: number;
  successfulCodes: number;
  failedCodes: number;
  codes: QRCodeData[];
  errors: string[];
  downloadUrl?: string;
  expiresAt: string;
}

export interface QRCodeScanResult {
  code: string;
  plotId: string;
  cemeteryId: string;
  valid: boolean;
  scannedAt: string;
  scannerInfo?: ScannerInfo;
  metadata?: Record<string, unknown>;
  error?: string;
}

export interface ScannerInfo {
  deviceId?: string;
  deviceType?: string;
  os?: string;
  appVersion?: string;
  location?: GeoPoint;
  timestamp: string;
}

export interface QRCodeValidation {
  code: string;
  valid: boolean;
  plotId?: string;
  cemeteryId?: string;
  expiresAt?: string;
  error?: string;
  warnings?: string[];
}

// Tipos para Relatórios
export interface Report {
  createdAt: string | number | Date;
  id: string;
  type: ReportType;
  title: string;
  description?: string;
  filters: ReportFilters;
  data: unknown;
  format: ReportFormat;
  status: ReportStatus;
  generatedBy: string;
  generatedAt: string;
  expiresAt?: string;
  fileUrl?: string;
  fileSize?: number;
  metadata?: ReportMetadata;
}

export interface ReportFilters {
  dateRange: DateRange;
  cemeteryIds?: string[];
  municipalities?: string[];
  plotTypes?: PlotType[];
  status?: PlotStatus[];
  includeInactive?: boolean;
  includeProjections?: boolean;
  scenario?: GrowthScenarioType;
  groupBy?: GroupByOption;
  metrics?: ReportMetric[];
  customFilters?: Record<string, unknown>;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export type ReportType =
  | "OCCUPANCY"
  | "CAPACITY"
  | "FINANCIAL"
  | "MAINTENANCE"
  | "GROWTH_PROJECTION"
  | "COMPARATIVE"
  | "CUSTOM";

export type ReportFormat = "PDF" | "EXCEL" | "CSV" | "JSON" | "HTML";
export type ReportStatus =
  | "PENDING"
  | "GENERATING"
  | "COMPLETED"
  | "FAILED"
  | "EXPIRED";
export type GroupByOption =
  | "CEMETERY"
  | "MUNICIPALITY"
  | "PLOT_TYPE"
  | "STATUS"
  | "MONTH"
  | "YEAR";
export type GrowthScenarioType = "CONSERVATIVE" | "MODERATE" | "AGGRESSIVE";
export type PlotType = "GROUND" | "MAUSOLEUM" | "NICHE" | "OSSUARY";
export type PlotStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE";

export type ReportMetric =
  | "TOTAL_PLOTS"
  | "OCCUPANCY_RATE"
  | "AVAILABLE_PLOTS"
  | "OCCUPIED_PLOTS"
  | "RESERVED_PLOTS"
  | "MAINTENANCE_PLOTS"
  | "GROWTH_RATE"
  | "CAPACITY_PROJECTION"
  | "REVENUE"
  | "MAINTENANCE_COST"
  | "AVERAGE_PLOT_PRICE"
  | "TURNOVER_RATE";

export interface ReportMetadata {
  generator: string;
  version: string;
  template?: string;
  processingTime?: number;
  recordCount?: number;
  warnings?: string[];
  errors?: string[];
  dataSource?: string;
  refreshInterval?: number;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description?: string;
  type: ReportType;
  format: ReportFormat;
  sections: ReportSection[];
  defaultFilters?: Partial<ReportFilters>;
  customizable: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportSection {
  id: string;
  title: string;
  type: SectionType;
  dataSource: string;
  chartType?: ChartType;
  layout: SectionLayout;
  visible: boolean;
  order: number;
  config?: Record<string, unknown>;
}

export type SectionType =
  | "HEADER"
  | "SUMMARY"
  | "CHART"
  | "TABLE"
  | "TEXT"
  | "IMAGE";
export type ChartType =
  | "LINE"
  | "BAR"
  | "PIE"
  | "DOUGHNUT"
  | "AREA"
  | "SCATTER"
  | "HEATMAP";

export interface SectionLayout {
  width: "FULL" | "HALF" | "THIRD" | "QUARTER";
  height?: number;
  position: "TOP" | "MIDDLE" | "BOTTOM";
}

export interface ReportSchedule {
  id: string;
  templateId: string;
  name: string;
  description?: string;
  frequency: ScheduleFrequency;
  recipients: string[];
  filters?: Partial<ReportFilters>;
  enabled: boolean;
  nextRunAt?: string;
  lastRunAt?: string;
  lastRunStatus?: "SUCCESS" | "FAILED";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type ScheduleFrequency =
  | "DAILY"
  | "WEEKLY"
  | "BIWEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "YEARLY"
  | "CUSTOM";

export interface ReportGenerationRequest {
  templateId?: string;
  type: ReportType;
  format: ReportFormat;
  title: string;
  description?: string;
  filters: ReportFilters;
  sections?: ReportSection[];
  recipients?: string[];
  schedule?: boolean;
  scheduleConfig?: Partial<ReportSchedule>;
}

export interface ReportGenerationResponse {
  reportId: string;
  status: ReportStatus;
  message: string;
  estimatedCompletionTime?: number;
  progress?: number;
  downloadUrl?: string;
  expiresAt?: string;
}
