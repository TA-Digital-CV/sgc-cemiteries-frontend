// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { OperationsChart } from "../OperationsChart";

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
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar">{children}</div>
  ),
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Cell: () => <div data-testid="cell" />,
}));

describe("OperationsChart", () => {
  const mockData = {
    burials: 10,
    exhumations: 5,
    transfers: 2,
  };

  it("renders loading skeleton when isLoading is true", () => {
    render(<OperationsChart data={mockData} isLoading={true} />);
    expect(screen.getByTestId("igrp-card")).toBeDefined();
    const skeleton = screen.getByTestId("igrp-card-content").firstChild;
    expect((skeleton as HTMLElement).className).toContain("animate-pulse");
  });

  it("renders chart when data is provided and not loading", () => {
    render(<OperationsChart data={mockData} />);
    expect(screen.getByTestId("igrp-card-title").textContent).toContain(
      "Operações Recentes",
    );
    expect(screen.getByTestId("bar-chart")).toBeDefined();
  });

  it("renders 'Sem dados' message when all values are zero", () => {
    const emptyData = {
      burials: 0,
      exhumations: 0,
      transfers: 0,
    };
    render(<OperationsChart data={emptyData} />);
    expect(screen.getByText("Sem dados de operações")).toBeDefined();
  });
});
