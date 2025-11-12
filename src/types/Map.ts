// Tipos para Mapas e Georreferenciamento
export interface MapData {
  id: string;
  cemeteryId: string;
  name: string;
  center: GeoPoint;
  zoom: number;
  bounds: GeoBounds;
  layers: MapLayer[];
  markers: MapMarker[];
  controls: MapControls;
  style: MapStyle;
  lastUpdated: string;
}

export interface MapLayer {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  opacity: number;
  zIndex: number;
  data: LayerData;
  style: LayerStyle;
  minZoom?: number;
  maxZoom?: number;
  attribution?: string;
}

export type LayerType =
  | "TILE"
  | "MARKER"
  | "HEATMAP"
  | "POLYGON"
  | "POLYLINE"
  | "CIRCLE"
  | "RECTANGLE"
  | "GEOJSON";

export interface LayerData {
  url?: string;
  // Minimal FeatureCollection shape to avoid external type dependency
  geoJson?: {
    type: string;
    features: unknown[];
  };
  points?: GeoPoint[];
  markers?: MapMarker[];
  heatmapData?: HeatmapPoint[];
}

export interface LayerStyle {
  fillColor?: string;
  fillOpacity?: number;
  strokeColor?: string;
  strokeOpacity?: number;
  strokeWidth?: number;
  icon?: string;
  iconSize?: number;
  label?: string;
  labelStyle?: LabelStyle;
}

export interface LabelStyle {
  color: string;
  fontSize: number;
  fontWeight: "normal" | "bold";
  backgroundColor?: string;
  padding?: number;
  borderRadius?: number;
}

export interface MapMarker {
  id: string;
  cemeteryId: string;
  position: GeoPoint;
  type: MarkerType;
  status: MarkerStatus;
  title: string;
  description?: string;
  popupContent?: string;
  icon?: string;
  color: string;
  size: "SMALL" | "MEDIUM" | "LARGE";
  draggable?: boolean;
  clickable?: boolean;
  metadata?: Record<string, unknown>;
}

export type MarkerType =
  | "CEMETERY"
  | "BLOCK"
  | "SECTION"
  | "PLOT"
  | "FACILITY"
  | "ENTRANCE"
  | "PARKING"
  | "OFFICE"
  | "CHAPEL"
  | "WATER"
  | "ELECTRICITY"
  | "OTHER";

export type MarkerStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "MAINTENANCE"
  | "CONSTRUCTION";

export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
  weight?: number;
  radius?: number;
}

export interface MapControls {
  zoom: boolean;
  pan: boolean;
  rotate: boolean;
  scale: boolean;
  fullscreen: boolean;
  search: boolean;
  layers: boolean;
  measure: boolean;
  draw: boolean;
  print: boolean;
  share: boolean;
}

export interface MapStyle {
  name: string;
  url: string;
  attribution: string;
  maxZoom: number;
  minZoom: number;
  tileSize: number;
}

export interface MapFilter {
  id: string;
  name: string;
  type: FilterType;
  field: string;
  operator: FilterOperator;
  value: unknown;
  enabled: boolean;
}

export type FilterType =
  | "SELECT"
  | "MULTISELECT"
  | "RANGE"
  | "DATE"
  | "TEXT"
  | "BOOLEAN";
export type FilterOperator =
  | "EQUALS"
  | "NOT_EQUALS"
  | "GREATER_THAN"
  | "LESS_THAN"
  | "GREATER_THAN_OR_EQUAL"
  | "LESS_THAN_OR_EQUAL"
  | "CONTAINS"
  | "NOT_CONTAINS"
  | "IN"
  | "NOT_IN"
  | "BETWEEN"
  | "IS_NULL"
  | "IS_NOT_NULL";

export interface MapSearchResult {
  id: string;
  type: "CEMETERY" | "BLOCK" | "SECTION" | "PLOT" | "FACILITY";
  name: string;
  description: string;
  position: GeoPoint;
  bounds?: GeoBounds;
  relevance: number;
  data: unknown;
}

export interface MapEvent {
  type: MapEventType;
  position: GeoPoint;
  target?: MapMarker | MapLayer;
  data?: unknown;
  timestamp: string;
}

export type MapEventType =
  | "CLICK"
  | "DOUBLE_CLICK"
  | "RIGHT_CLICK"
  | "MOUSE_OVER"
  | "MOUSE_OUT"
  | "DRAG_START"
  | "DRAG_END"
  | "ZOOM_CHANGED"
  | "BOUNDS_CHANGED"
  | "LAYER_TOGGLED"
  | "MARKER_CLICKED";

export interface MapViewport {
  center: GeoPoint;
  zoom: number;
  bounds: GeoBounds;
  bearing: number;
  pitch: number;
}

export interface GeoBounds {
  northEast: GeoPoint;
  southWest: GeoPoint;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface MapPrintOptions {
  format: "PDF" | "PNG" | "JPG";
  size: "A4" | "A3" | "A2" | "A1" | "A0" | "LETTER" | "LEGAL";
  orientation: "portrait" | "landscape";
  scale: number;
  includeLegend: boolean;
  includeAttribution: boolean;
  title?: string;
  subtitle?: string;
}

export interface MapShareOptions {
  type: "LINK" | "EMBED" | "SOCIAL";
  permissions: "VIEW" | "EDIT" | "ADMIN";
  expiration?: string;
  password?: string;
  allowDownload?: boolean;
}

export interface MapAnalytics {
  totalMarkers: number;
  visibleMarkers: number;
  clickedMarkers: number;
  averageZoomLevel: number;
  mapInteractions: number;
  searchQueries: number;
  popularSearches: string[];
  userSessions: number;
  averageSessionDuration: number;
  lastUpdated: string;
}

export interface MapConfiguration {
  id: string;
  cemeteryId: string;
  name: string;
  description?: string;
  defaultViewport: MapViewport;
  defaultLayers: string[];
  availableLayers: MapLayer[];
  controls: MapControls;
  style: MapStyle;
  filters: MapFilter[];
  searchEnabled: boolean;
  printEnabled: boolean;
  shareEnabled: boolean;
  analyticsEnabled: boolean;
  isDefault: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
