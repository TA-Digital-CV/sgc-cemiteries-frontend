import React from "react";
import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import "@testing-library/jest-dom"; // Import matchers
import { BlockFields } from "../BlockFields";

// Mock Design System
vi.mock("@igrp/igrp-framework-react-design-system", () => ({
  IGRPInputText: ({ label, name }: any) => (
    <div>
      <label>{label}</label>
      <input name={name} data-testid={`input-${name}`} />
    </div>
  ),
  IGRPInputNumber: ({ label, name }: any) => (
    <div>
      <label>{label}</label>
      <input type="number" name={name} data-testid={`input-${name}`} />
    </div>
  ),
  IGRPTextarea: ({ label, name }: any) => (
    <div>
      <label>{label}</label>
      <textarea name={name} data-testid={`textarea-${name}`} />
    </div>
  ),
}));

describe("BlockFields", () => {
  it("renders all fields including geoPolygon", () => {
    render(<BlockFields showDescription={true} />);

    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByTestId("input-name")).toBeInTheDocument();

    expect(screen.getByText("Capacidade Máxima")).toBeInTheDocument();
    expect(screen.getByTestId("input-maxCapacity")).toBeInTheDocument();

    expect(screen.getByText("Descrição")).toBeInTheDocument();
    expect(screen.getByTestId("input-description")).toBeInTheDocument();

    expect(screen.getByText("Geolocalização (JSON)")).toBeInTheDocument();
    expect(screen.getByTestId("textarea-geoPolygon")).toBeInTheDocument();
  });

  it("hides description when showDescription is false", () => {
    render(<BlockFields showDescription={false} />);

    expect(screen.queryByText("Descrição")).not.toBeInTheDocument();
    expect(screen.queryByTestId("input-description")).not.toBeInTheDocument();
  });
});
