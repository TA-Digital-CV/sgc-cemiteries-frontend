import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import CemeteryDetailPage from "../page";
import maplibregl from "maplibre-gl";

// Mock dependencies
vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "123" }),
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock hooks
const mockCenterOnLocation = vi.fn();
const mockFetchMapData = vi.fn();
const mockSelectCemetery = vi.fn();
const mockFetchCemeteryStructures = vi.fn();

vi.mock("@/app/(myapp)/hooks/useMap", () => ({
  useMap: () => ({
    mapData: { style: { url: "http://style.url" } },
    fetchMapData: mockFetchMapData,
    viewport: { center: { latitude: 0, longitude: 0 }, zoom: 10 },
    centerOnLocation: mockCenterOnLocation,
  }),
}));

vi.mock("@/app/(myapp)/hooks/useCemetery", () => ({
  useCemetery: () => ({
    selectCemetery: mockSelectCemetery,
    deleteCemetery: vi.fn(),
    isLoading: false,
    error: null,
    selectedCemetery: {
      id: "123",
      name: "Test Cemetery",
      address: "Test Address",
      geoPoint: { latitude: 10, longitude: 20 },
      maxCapacity: 1000,
      totalArea: 5000,
      currentOccupancy: 500,
      occupancyRate: 50,
    },
    fetchCemeteryStructures: mockFetchCemeteryStructures,
    blocks: [
      { id: "b1", occupancyRate: 0 },
      { id: "b2", occupancyRate: 100 },
    ],
    sections: [{ id: "s1" }],
    getStatusBadgeColor: () => "green",
    getStatusLabel: () => "Active",
  }),
}));

// Mock Design System to avoid ESM issues
vi.mock("@igrp/igrp-framework-react-design-system", () => ({
  IGRPCard: ({ children }: any) => (
    <div data-testid="igrp-card">{children}</div>
  ),
  IGRPCardHeader: ({ children }: any) => (
    <div data-testid="igrp-card-header">{children}</div>
  ),
  IGRPCardDescription: ({ children }: any) => (
    <div data-testid="igrp-card-description">{children}</div>
  ),
  IGRPCardTitle: ({ children }: any) => (
    <div data-testid="igrp-card-title">{children}</div>
  ),
  IGRPCardContent: ({ children }: any) => (
    <div data-testid="igrp-card-content">{children}</div>
  ),
  IGRPButton: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
  IGRPBadge: ({ children }: any) => <span>{children}</span>,
  IGRPLabel: ({ children }: any) => <label>{children}</label>,
  IGRPIcon: () => <span>Icon</span>,
  IGRPPageHeader: ({ title, children }: any) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
  IGRPDataTable: () => <div>DataTable</div>,
  IGRPDataTableHeaderSortToggle: () => <div>SortToggle</div>,
  IGRPStatsCard: () => <div>StatsCard</div>,
}));

// Mock MapLibre GL
const mockFlyTo = vi.fn();
const mockSetLngLat = vi.fn().mockReturnThis();
const mockAddTo = vi.fn();

const mockMapInstance = {
  addControl: vi.fn(),
  remove: vi.fn(),
  flyTo: mockFlyTo,
  on: vi.fn(),
};

vi.mock("maplibre-gl", () => {
  return {
    default: {
      Map: vi.fn(function () {
        return mockMapInstance;
      }),
      Marker: vi.fn(function () {
        return {
          setLngLat: mockSetLngLat,
          addTo: mockAddTo,
        };
      }),
      NavigationControl: vi.fn(),
    },
  };
});

vi.mock("@/components/dashboard/DashboardStats", () => ({
  DashboardStats: () => <div data-testid="dashboard-stats">Stats</div>,
}));

describe("CemeteryMap Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes map with correct coordinates and marker", () => {
    render(<CemeteryDetailPage />);

    // Check map initialization
    expect(maplibregl.Map).toHaveBeenCalledWith(
      expect.objectContaining({
        center: [20, 10], // Longitude, Latitude from selectedCemetery
        zoom: 16,
      }),
    );

    // Check marker initialization
    expect(maplibregl.Marker).toHaveBeenCalled();
    expect(mockSetLngLat).toHaveBeenCalledWith([20, 10]);
    expect(mockAddTo).toHaveBeenCalledWith(mockMapInstance);
  });

  it('synchronizes "Ver no mapa" button click with map flyTo', () => {
    render(<CemeteryDetailPage />);

    const button = screen.getByText("Ver no mapa");
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    // Verify flyTo is called on the map instance
    expect(mockFlyTo).toHaveBeenCalledWith(
      expect.objectContaining({
        center: [20, 10],
        zoom: 16,
        essential: true,
      }),
    );
  });
});
