// Tipos comuns e utilitários reutilizáveis em todo o sistema

// Tipos básicos de resposta da API
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  metadata?: ResponseMetadata;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
  metadata?: ResponseMetadata;
}

export interface ResponseMetadata {
  timestamp: string;
  version: string;
  requestId: string;
  processingTime?: number;
  server?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  firstPage?: number;
  lastPage?: number;
}

// Tipos de dados geográficos
export interface GeoPoint {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface GeoBounds {
  northEast: GeoPoint;
  southWest: GeoPoint;
}

// Tipos de status e enums compartilhados
export type EntityStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "MAINTENANCE"
  | "DRAFT"
  | "ARCHIVED";
export type RecordStatus = "CREATED" | "UPDATED" | "DELETED" | "RESTORED";
export type SyncStatus =
  | "SYNCED"
  | "SYNCING"
  | "FAILED"
  | "PENDING"
  | "CONFLICT";

// Tipos de plot e cemitério (reutilizáveis)
export type PlotType = "GROUND" | "MAUSOLEUM" | "NICHE" | "OSSUARY";
export type PlotStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE";
export type CemeteryStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE";
export type GrowthScenarioType = "CONSERVATIVE" | "MODERATE" | "AGGRESSIVE";

// Tipos de formulário e validação
export interface FormValidation {
  isValid: boolean;
  errors: ValidationError[];
  warnings?: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

// Tipos de filtros e busca
export interface SearchParams {
  query?: string;
  filters?: Record<string, unknown>;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  includeInactive?: boolean;
  dateRange?: DateRange;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface FilterOption {
  value: string | number | boolean;
  label: string;
  count?: number;
  disabled?: boolean;
}

// Tipos de ordenação
export interface SortOption {
  field: string;
  label: string;
  direction: "asc" | "desc";
  active: boolean;
}

// Tipos de notificações e alertas
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: NotificationAction;
  metadata?: Record<string, unknown>;
}

export type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

export interface NotificationAction {
  label: string;
  action: string;
  params?: Record<string, unknown>;
}

// Tipos de ação e eventos
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  warnings?: string[];
}

export interface AppEvent {
  id: string;
  type: EventType;
  source: string;
  data: unknown;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

export type EventType =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "VIEW"
  | "SEARCH"
  | "FILTER"
  | "SORT"
  | "EXPORT"
  | "IMPORT"
  | "SYNC"
  | "LOGIN"
  | "LOGOUT"
  | "ERROR"
  | "WARNING";

// Tipos de configuração e preferências
export interface UserPreferences {
  theme: "light" | "dark" | "auto";
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  notifications: NotificationPreferences;
  dashboard: DashboardPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  frequency: "IMMEDIATE" | "DAILY" | "WEEKLY";
  types: NotificationType[];
}

export interface DashboardPreferences {
  defaultView: string;
  widgets: string[];
  refreshInterval: number;
  autoRefresh: boolean;
  compactView: boolean;
}

// Tipos de exportação e importação
export interface ExportOptions {
  format: ExportFormat;
  includeHeaders: boolean;
  includeMetadata: boolean;
  filters?: Record<string, unknown>;
  columns?: string[];
  dateFormat?: string;
}

export type ExportFormat = "CSV" | "EXCEL" | "PDF" | "JSON" | "XML";

export interface ImportResult {
  success: boolean;
  totalRecords: number;
  processedRecords: number;
  createdRecords: number;
  updatedRecords: number;
  failedRecords: number;
  errors: ImportError[];
  warnings: ImportWarning[];
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
  value?: unknown;
}

export interface ImportWarning {
  row: number;
  field: string;
  message: string;
  value?: unknown;
}

// Tipos de cache e sincronização
export interface CacheEntry<T> {
  key: string;
  data: T;
  expiresAt: string;
  lastAccessed: string;
  accessCount: number;
}

export interface SyncResult {
  success: boolean;
  recordsSynced: number;
  conflicts: SyncConflict[];
  errors: string[];
  lastSyncDate: string;
}

export interface SyncConflict {
  id: string;
  field: string;
  localValue: unknown;
  remoteValue: unknown;
  resolution?: "LOCAL" | "REMOTE" | "MERGE";
}

// Tipos de permissão e segurança
export interface Permission {
  resource: string;
  actions: PermissionAction[];
  conditions?: Record<string, unknown>;
}

export type PermissionAction =
  | "VIEW"
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "EXPORT"
  | "IMPORT"
  | "ADMIN";

export interface SecurityContext {
  userId: string;
  roles: string[];
  permissions: Permission[];
  sessionId: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

// Tipos de métricas e monitoramento
export interface PerformanceMetrics {
  responseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  errorRate: number;
  throughput: number;
  timestamp: string;
}

export interface UsageMetrics {
  activeUsers: number;
  totalRequests: number;
  apiCalls: number;
  pageViews: number;
  uniqueVisitors: number;
  averageSessionDuration: number;
  bounceRate: number;
  timestamp: string;
}
