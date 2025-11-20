// Tipos principais para Sepulturas/Plots
export interface Plot {
  id: string;
  cemeteryId: string;
  blockId?: string;
  sectionId?: string;
  plotNumber: string;
  plotType: PlotType;
  occupationStatus: PlotStatus;
  geoPoint?: GeoPoint;
  qrCode?: string;
  dimensions?: PlotDimensions;
  notes?: string;
  createdDate: string;
  lastModifiedDate: string;
  metadata?: PlotMetadata;
}

export interface PlotFormData {
  cemeteryId: string;
  blockId?: string;
  sectionId?: string;
  plotNumber: string;
  plotType: PlotType;
  occupationStatus?: PlotStatus;
  geoPoint?: GeoPoint;
  dimensions?: PlotDimensions;
  notes?: string;
  metadata?: PlotMetadata;
  qrCode?: string;
}

export interface PlotMetadata {
  burial?: {
    deceasedName?: string;
    burialDate?: string;
    deathDate?: string;
    birthDate?: string;
    causeOfDeath?: string;
    funeralHome?: string;
  };
  concession?: {
    holderName?: string;
    holderDocument?: string;
    concessionDate?: string;
    expirationDate?: string;
    concessionType?: "PERPETUAL" | "TEMPORARY" | "RENTAL";
  };
  maintenance?: {
    lastMaintenanceDate?: string;
    nextMaintenanceDate?: string;
    maintenanceNotes?: string;
    maintenanceStatus?: "GOOD" | "REGULAR" | "POOR" | "CRITICAL";
  };
  photos?: string[];
  documents?: PlotDocument[];
}

export interface PlotDocument {
  id: string;
  name: string;
  type: "CONTRACT" | "DEATH_CERTIFICATE" | "BURIAL_PERMIT" | "OTHER";
  url: string;
  uploadDate: string;
  size: number;
  mimeType: string;
}

export interface PlotFilters {
  cemeteryId?: string;
  blockId?: string;
  sectionId?: string;
  plotType?: PlotType[];
  occupationStatus?: PlotStatus[];
  search?: string;
  hasQRCode?: boolean;
  maintenanceStatus?: ("GOOD" | "REGULAR" | "POOR" | "CRITICAL")[];
  sortBy?: "plotNumber" | "plotType" | "occupationStatus" | "createdDate";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface PlotSearchParams {
  query: string;
  filters?: PlotFilters;
  includeOccupied?: boolean;
  includeReserved?: boolean;
}

export interface PlotStatistics {
  totalPlots: number;
  availablePlots: number;
  occupiedPlots: number;
  reservedPlots: number;
  maintenancePlots: number;
  byType: Record<PlotType, number>;
  byStatus: Record<PlotStatus, number>;
  occupancyRate: number;
  lastUpdated: string;
}

export interface PlotAvailability {
  cemeteryId: string;
  blockId?: string;
  sectionId?: string;
  availablePlots: number;
  nextAvailablePlot?: Plot;
  availabilityRate: number;
  estimatedAvailabilityDate?: string;
}

// Tipos auxiliares (reutilizados de Cemetery.ts)
export type PlotType = "GROUND" | "MAUSOLEUM" | "NICHE" | "OSSUARY";
export type PlotStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE";

export interface GeoPoint {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface PlotDimensions {
  width: number;
  length: number;
  depth?: number;
  unit: "meters" | "feet";
}

// Respostas da API
export interface PlotApiResponse {
  data: Plot[];
  pagination: PaginationInfo;
  metadata: ResponseMetadata;
}

export interface PlotApiSingleResponse {
  data: Plot;
  metadata: ResponseMetadata;
}

export interface PlotStatisticsApiResponse {
  data: PlotStatistics;
  metadata: ResponseMetadata;
}

export interface PlotAvailabilityApiResponse {
  data: PlotAvailability;
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
