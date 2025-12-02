// Test file for BetHistoryFilter component

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BetHistoryFilter from "../components/BetHistoryFilter";

/**
 * =======================================================
 *               BET HISTORY FILTER TESTS
 * =======================================================
 * Test Cases:
 * -----------
 * 1. Rendering Tests:
 *   ✓ renders tabs for Cities, Types, and Outcomes
 *
 * 2. Selection Tests:
 *   ✓ allows selecting and deselecting cities
 *   ✓ allows selecting and deselecting types
 *   ✓ allows selecting and deselecting outcomes
 *
 * 3. Clear Functionality Tests:
 *   ✓ clears all selections when "Clear All" button is clicked
 *
 * 4. Callback Tests:
 *   ✓ calls onFilterChange with correct filter object on selection changes
 *
 * Run all tests: npm test
 * Run BetHistoryFilter.test.jsx only: npm test -- BetHistoryFilter.test.jsx
 * Run specific test: npm test -- --testNamePattern="test name"
 * =======================================================
 */

describe("BetHistoryFilter Component", () => {
  const mockOnFilterChange = jest.fn();
  const availableOptions = {
    cities: ["City X", "City Y"],
    types: ["MAX_TEMP_OVER_UNDER", "RAIN_YES_NO"],
    outcomes: ["Won", "Lost"],
  };
  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <BetHistoryFilter onFilterChange={mockOnFilterChange} availableOptions={availableOptions} />,
    );
  });

  // Test 1: Rendering Tests
  test("renders tabs for Cities, Types, and Outcomes", () => {
    expect(screen.getByRole("tab", { name: /Cities/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Types/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Outcomes/i })).toBeInTheDocument();
  });

  // Test 2: Selection Tests
  test("allows selecting and deselecting cities", () => {
    fireEvent.click(screen.getByRole("tab", { name: /Cities/i }));
    const cityBadge = screen.getByText("City X");
    fireEvent.click(cityBadge);
    expect(cityBadge).toHaveClass("bg-primary");
    expect(cityBadge).toHaveStyle({ opacity: "1" });

    fireEvent.click(cityBadge);
    expect(cityBadge).toHaveClass("bg-secondary");
    expect(cityBadge).toHaveStyle({ opacity: "0.6" });
  });

  test("allows selecting and deselecting types", () => {
    fireEvent.click(screen.getByRole("tab", { name: /Types/i }));
    const typeBadge = screen.getByText("MAX_TEMP_OVER_UNDER");
    fireEvent.click(typeBadge);
    expect(typeBadge).toHaveClass("bg-primary");
    expect(typeBadge).toHaveStyle({ opacity: "1" });

    fireEvent.click(typeBadge);
    expect(typeBadge).toHaveClass("bg-secondary");
    expect(typeBadge).toHaveStyle({ opacity: "0.6" });
  });

  test("allows selecting and deselecting outcomes", () => {
    fireEvent.click(screen.getByRole("tab", { name: /Outcomes/i }));
    const outcomeBadge = screen.getByText("Won");
    fireEvent.click(outcomeBadge);
    expect(outcomeBadge).toHaveClass("bg-primary");
    expect(outcomeBadge).toHaveStyle({ opacity: "1" });

    fireEvent.click(outcomeBadge);
    expect(outcomeBadge).toHaveClass("bg-secondary");
    expect(outcomeBadge).toHaveStyle({ opacity: "0.6" });
  });

  // Test 3: Clear Functionality Tests
  test('clears all selections when "Clear All" button is clicked', () => {
    // Select some filters first
    fireEvent.click(screen.getByRole("tab", { name: /Cities/i }));
    fireEvent.click(screen.getByText("City X"));
    fireEvent.click(screen.getByRole("tab", { name: /Types/i }));
    fireEvent.click(screen.getByText("MAX_TEMP_OVER_UNDER"));

    // Click Clear All
    fireEvent.click(screen.getByRole("button", { name: /Clear All/i }));
    expect(screen.getByText("City X")).toHaveClass("bg-secondary");
    expect(screen.getByText("City X")).toHaveStyle({ opacity: "0.6" });
    fireEvent.click(screen.getByRole("tab", { name: /Types/i }));
    expect(screen.getByText("MAX_TEMP_OVER_UNDER")).toHaveClass("bg-secondary");
    expect(screen.getByText("MAX_TEMP_OVER_UNDER")).toHaveStyle({ opacity: "0.6" });
  });

  // Test 4: Callback Tests
  test("calls onFilterChange with correct filter object on selection changes", () => {
    fireEvent.click(screen.getByRole("tab", { name: /Cities/i }));
    fireEvent.click(screen.getByText("City X"));
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      cities: ["City X"],
      types: [],
      outcomes: [],
    });
  });
});
