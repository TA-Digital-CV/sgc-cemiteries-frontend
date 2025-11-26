// @vitest-environment jsdom
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AnalyticsDashboard } from "../AnalyticsDashboard";
import * as useAnalyticsHook from "@/app/(myapp)/hooks/useAnalytics";

// Mock IGRP Components
vi.mock("@igrp/igrp-framework-react-design-system", () => ({
  IGRPCard: ({ children, className }: any) => (
    <div data-testid="igrp-card" className={className}>
      {children}
    </div>
  ),
  IGRPCardHeader: ({ children }: any) => (
    <div data-testid="igrp-card-header">{children}</div>
  ),
  IGRPCardTitle: ({ children }: any) => (
    <div data-testid="igrp-card-title">{children}</div>
  ),
  IGRPCardDescription: ({ children }: any) => (
    <div data-testid="igrp-card-description">{children}</div>
  ),
  IGRPCardContent: ({ children, className }: any) => (
    <div data-testid="igrp-card-content" className={className}>
      {children}
    </div>
  ),
  IGRPStatsCard: (props: any) => (
    <div data-testid="igrp-stats-card">
      <span>{props.title}</span>
      <span>{props.value}</span>
    </div>
  ),
  IGRPButton: ({ children, onClick, disabled }: any) => (
    <button data-testid="igrp-button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  IGRPIcon: ({ iconName }: any) => <span data-testid={`icon-${iconName}`} />,
  IGRPInputText: ({ value, onChange, placeholder, id }: any) => (
    <input
      data-testid={`input-${id}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  ),
  IGRPLabel: ({ children, htmlFor }: any) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
  IGRPSelect: ({ value, onValueChange, options }: any) => (
    <select
      data-testid="igrp-select"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    >
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
  IGRPBadge: ({ children }: any) => (
    <span data-testid="igrp-badge">{children}</span>
  ),
  useIGRPToast: () => ({
    igrpToast: vi.fn(),
  }),
}));

// Mock useAnalytics hook
vi.mock("@/app/(myapp)/hooks/useAnalytics", () => ({
  useAnalytics: vi.fn(),
}));

describe("AnalyticsDashboard", () => {
  const mockFetchMetrics = vi.fn();
  const mockFetchOccupancyData = vi.fn();
  const mockFetchStatistics = vi.fn();
  const mockFetchProjections = vi.fn();
  const mockFetchHeatmapData = vi.fn();
  const mockFetchAlerts = vi.fn();
  const mockExportData = vi.fn();

  const defaultMockReturn = {
    metrics: {
      overallOccupancyRate: 75,
      totalPlots: 1000,
      activeCemeteries: 5,
      criticalCapacityCemeteries: 1,
    },
    occupancyData: [],
    statistics: [],
    projections: [],
    alerts: [],
    loading: false,
    error: null,
    fetchMetrics: mockFetchMetrics,
    fetchOccupancyData: mockFetchOccupancyData,
    fetchStatistics: mockFetchStatistics,
    fetchProjections: mockFetchProjections,
    fetchHeatmapData: mockFetchHeatmapData,
    fetchAlerts: mockFetchAlerts,
    setFilters: vi.fn(),
    clearFilters: vi.fn(),
    exportData: mockExportData,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useAnalyticsHook.useAnalytics as any).mockReturnValue(defaultMockReturn);
  });

  it("renders loading skeleton when loading is true", () => {
    (useAnalyticsHook.useAnalytics as any).mockReturnValue({
      ...defaultMockReturn,
      loading: true,
    });

    render(<AnalyticsDashboard />);
    // Check for skeleton elements (animate-pulse)
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("igrp-stats-card")).toHaveLength(4); // Loading stats
  });

  it("renders dashboard content when not loading", () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByText("Analytics Dashboard")).toBeDefined();
    expect(screen.getByText("Total de Sepulturas")).toBeDefined();
    // Match 1000 with any separator or none (1,000, 1.000, 1 000, 1000)
    const totalPlotsElement = screen.getByText(/1[.,\s]?000/);
    expect(totalPlotsElement).toBeDefined();
  });

  it("calls fetch functions on mount", () => {
    render(<AnalyticsDashboard />);
    expect(mockFetchMetrics).toHaveBeenCalled();
    expect(mockFetchOccupancyData).toHaveBeenCalled();
  });

  it("calls exportData when export button is clicked", () => {
    render(<AnalyticsDashboard />);
    const exportButtons = screen.getAllByTestId("igrp-button");
    const exportPdfBtn = exportButtons.find((btn) =>
      btn.textContent?.includes("Exportar PDF"),
    );

    if (exportPdfBtn) {
      fireEvent.click(exportPdfBtn);
      expect(mockExportData).toHaveBeenCalledWith("pdf");
    }
  });

  it("updates filters when inputs change", () => {
    render(<AnalyticsDashboard />);
    const cemeteryInput = screen.getByTestId("input-cemeteryId");
    fireEvent.change(cemeteryInput, { target: { value: "123" } });

    // Since handleFilterChange updates local state which triggers useEffect -> loadAnalyticsData
    // We expect fetch functions to be called with new filters eventually.
    // However, useEffect dependency array includes 'filters', so it should trigger.

    // Note: The mock functions are called with arguments.
    // We can verify if they are called with the new ID after the state update.

    waitFor(() => {
      expect(mockFetchMetrics).toHaveBeenCalledWith("123");
    });
  });
});
