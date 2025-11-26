// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { OccupancyChart } from "../OccupancyChart";

// Mock the IGRP design system
vi.mock("@igrp/igrp-framework-react-design-system", () => ({
  IGRPCard: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="igrp-card" className={className}>
      {children}
    </div>
  ),
  IGRPCardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="igrp-card-header">{children}</div>
  ),
  IGRPCardTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="igrp-card-title">{children}</div>
  ),
  IGRPCardDescription: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="igrp-card-description">{children}</div>
  ),
  IGRPCardContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="igrp-card-content" className={className}>
      {children}
    </div>
  ),
}));

// Mock Recharts
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie">{children}</div>
  ),
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

describe("OccupancyChart", () => {
  const mockData = {
    occupied: 50,
    available: 30,
    reserved: 10,
    maintenance: 10,
  };

  it("renders loading skeleton when isLoading is true", () => {
    render(<OccupancyChart data={mockData} isLoading={true} />);
    expect(screen.getByTestId("igrp-card")).toBeDefined();
    // Check for the skeleton div class (partial match)
    const skeleton = screen.getByTestId("igrp-card-content").firstChild;
    expect(skeleton).toHaveProperty("className");
    expect((skeleton as HTMLElement).className).toContain("animate-pulse");
  });

  it("renders chart when data is provided and not loading", () => {
    render(<OccupancyChart data={mockData} />);
    expect(screen.getByTestId("igrp-card-title").textContent).toContain(
      "Distribuição de Ocupação",
    );
    expect(screen.getByTestId("pie-chart")).toBeDefined();
  });

  it("renders 'Sem dados' message when all values are zero", () => {
    const emptyData = {
      occupied: 0,
      available: 0,
      reserved: 0,
      maintenance: 0,
    };
    render(<OccupancyChart data={emptyData} />);
    expect(screen.getByText("Sem dados para exibir")).toBeDefined();
  });
});
