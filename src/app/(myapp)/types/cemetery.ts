import { z } from "zod";
/**
 * Domain constants: Cemetery
 * Source of truth for cemetery-related status and configuration values.
 */
export const CEMETERY_STATUS = ["ACTIVE", "INACTIVE", "MAINTENANCE"] as const;
export type CemeteryStatus = (typeof CEMETERY_STATUS)[number];

/**
 * Domain constants: Plot types supported in the system.
 */
export const PLOT_TYPE = ["GROUND", "MAUSOLEUM", "NICHE", "OSSUARY"] as const;
export type PlotType = (typeof PLOT_TYPE)[number];

/**
 * Domain constants: Plot occupation statuses.
 */
export const PLOT_STATUS = [
  "AVAILABLE",
  "OCCUPIED",
  "RESERVED",
  "MAINTENANCE",
] as const;
export type PlotStatus = (typeof PLOT_STATUS)[number];

/**
 * Domain constants: Growth scenario options used for projections.
 */
export const GROWTH_SCENARIO = [
  "CONSERVATIVE",
  "MODERATE",
  "AGGRESSIVE",
] as const;
export type GrowthScenario = (typeof GROWTH_SCENARIO)[number];
// Tipos principais para Cemitérios
// Tipos principais para Cemitérios (alinhados com Backend DTOs)
export interface Cemetery {
  id: string;
  municipalityId: string;
  municipalityName: string;
  name: string;
  address: string;
  geoPoint?: GeoPoint;
  totalArea: number;
  maxCapacity: number;
  status: string;
  statusDesc: string;
  currentOccupancy: number;
  occupancyRate: number;
}

export interface CemeteryFormData {
  municipalityId: string;
  name: string;
  address: string;
  geoPoint?: GeoPoint;
  totalArea: number;
  maxCapacity: number;
  status: string;
}

/**
 * CemeteryFormSchema
 * Shared validation schema for cemetery create/edit payload.
 */
export const CemeteryFormSchema = z.object({
  municipalityId: z.string().min(1, "Municipality ID is required"),
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  geoPoint: z.object({
    latitude: z
      .number({ message: "Latitude must be a number" })
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90"),
    longitude: z
      .number({ message: "Longitude must be a number" })
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180"),
  }), // GeoPoint é obrigatório no backend
  totalArea: z
    .number({ message: "Total area must be a number" })
    .gt(0, "Total area must be greater than 0"),
  maxCapacity: z
    .number({ message: "Max capacity must be a number" })
    .gt(0, "Max capacity must be greater than 0"),
  status: z.enum(CEMETERY_STATUS),
});

export interface CemeteryStructure {
  id: string;
  municipalityId: string;
  municipalityName: string;
  name: string;
  address: string;
  geoPoint?: GeoPoint;
  totalArea: number;
  maxCapacity: number;
  status: string;
  statusDesc: string;
  currentOccupancy: number;
  occupancyRate: number;
  availablePlots: number;
  blocksCount: number;
  sectionsCount: number;
  plotsCount: number;
  plots: CemeteryPlot[];
  sections: CemeterySection[];
  blocks: CemeteryBlock[];
}

export interface CemeteryBlock {
  id: string;
  cemeteryId: string;
  cemeteryName: string;
  name: string;
  description?: string;
  maxCapacity: number;
  geoPolygon?: Record<string, any>;
  currentOccupancy: number;
  occupancyRate: number;
}

export interface CemeterySection {
  id: string;
  name: string;
  description?: string;
  geoPolygnon?: Record<string, any>; // Typo no backend mantido para compatibilidade
  maxCapacity: number;
  blockId: string;
  blockName: string;
  cemeteryId: string;
  cemeteryName: string;
  code?: string;
  plotType?: PlotType;
  totalPlots?: number;
}

export interface CemeteryPlot {
  id: string;
  cemeteryId: string;
  cemeteryName: string;
  blockId: string;
  blockName: string;
  sectionId: string;
  sectionName: string;
  plotNumber: string;
  plotType: string;
  geoPoint?: GeoPoint;
  qrCode?: string;
  dimensions?: PlotDimensions;
  notes?: string;
  occupationStatus: string;
  occupationStatusDesc: string;
}

export interface CemeteryStatistics {
  cemeteryId: string;
  totalPlots: number;
  occupiedPlots: number;
  availablePlots: number;
  reservedPlots: number;
  maintenancePlots: number;
  occupancyRate: number;
  monthlyOccupancyGrowth: number;
  yearlyOccupancyGrowth: number;
  capacityProjection: CapacityProjection;
  lastUpdated: string;
}

export interface CapacityProjection {
  currentDate: string;
  projectionDate: string;
  monthsRemaining: number;
  projectedOccupancyRate: number;
  confidenceLevel: number;
  scenario: GrowthScenario;
}

export interface CemeteryFilters {
  municipalityId?: string;
  status?: CemeteryStatus[];
  occupancyRateMin?: number;
  occupancyRateMax?: number;
  search?: string;
  sortBy?: "name" | "occupancyRate" | "createdDate";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface CemeterySearchParams {
  query: string;
  filters?: CemeteryFilters;
  includeInactive?: boolean;
}

// Tipos auxiliares
export interface GeoPoint {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface GeoBounds {
  northEast: GeoPoint;
  southWest: GeoPoint;
}

export interface PlotDimensions {
  width: number;
  length: number;
  depth?: number;
  unit: "meters" | "feet";
}

// Respostas da API
export interface CemeteryApiResponse {
  data: Cemetery[];
  pagination: PaginationInfo;
  metadata: ResponseMetadata;
}

export interface CemeteryApiSingleResponse {
  data: Cemetery;
  metadata: ResponseMetadata;
}

export interface CemeteryStructureApiResponse {
  data: CemeteryStructure;
  metadata: ResponseMetadata;
}

export interface CemeteryStatisticsApiResponse {
  data: CemeteryStatistics;
  metadata: ResponseMetadata;
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
