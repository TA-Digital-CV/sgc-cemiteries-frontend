// Tipos principais para Cemitérios
export interface Cemetery {
  id: string;
  municipalityId: string;
  name: string;
  address: string;
  geoPoint: {
    latitude: number;
    longitude: number;
  };
  totalArea: number;
  maxCapacity: number;
  currentOccupancy: number;
  occupancyRate: number;
  status: CemeteryStatus;
  createdDate: string;
  lastModifiedDate: string;
  metadata?: CemeteryMetadata;
}

export interface CemeteryFormData {
  municipalityId: string;
  name: string;
  address: string;
  geoPoint: {
    latitude: number;
    longitude: number;
  };
  totalArea: number;
  maxCapacity: number;
  metadata?: CemeteryMetadata;
}

export interface CemeteryMetadata {
  contact?: {
    phone?: string;
    email?: string;
    responsible?: string;
  };
  operatingHours?: {
    weekday: string;
    weekend: string;
  };
  facilities?: string[];
  notes?: string;
}

export interface CemeteryStructure {
  cemetery: Cemetery;
  blocks: CemeteryBlock[];
  sections: CemeterySection[];
  plots: CemeteryPlot[];
}

export interface CemeteryBlock {
  id: string;
  cemeteryId: string;
  name: string;
  code: string;
  description?: string;
  totalPlots: number;
  occupiedPlots: number;
  geoBounds?: GeoBounds;
}

export interface CemeterySection {
  id: string;
  blockId: string;
  cemeteryId: string;
  name: string;
  code: string;
  description?: string;
  totalPlots: number;
  occupiedPlots: number;
  plotType: PlotType;
  geoBounds?: GeoBounds;
}

export interface CemeteryPlot {
  id: string;
  sectionId: string;
  blockId: string;
  cemeteryId: string;
  plotNumber: string;
  plotType: PlotType;
  status: PlotStatus;
  dimensions?: PlotDimensions;
  geoPoint?: GeoPoint;
  qrCode?: string;
  notes?: string;
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

// Enums
export type CemeteryStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE";
export type PlotType = "GROUND" | "MAUSOLEUM" | "NICHE" | "OSSUARY";
export type PlotStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE";
export type GrowthScenario = "CONSERVATIVE" | "MODERATE" | "AGGRESSIVE";

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
