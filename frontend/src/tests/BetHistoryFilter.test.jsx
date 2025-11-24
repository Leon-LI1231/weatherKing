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
 *   ✓ renders tabs for Cities, Contests, and Outcomes
 *
 * 2. Selection Tests:
 *   ✓ allows selecting and deselecting cities
 *   ✓ allows selecting and deselecting contests
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
    contests: ["Contest A", "Contest B"],
    outcomes: ["Won", "Lost"],
  };
  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <BetHistoryFilter onFilterChange={mockOnFilterChange} availableOptions={availableOptions} />,
    );
  });

  // Test 1: Rendering Tests
  test("renders tabs for Cities, Contests, and Outcomes", () => {
    expect(screen.getByRole("tab", { name: /Cities/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Contests/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Outcomes/i })).toBeInTheDocument();
  });

  // Test 2: Selection Tests
  test("allows selecting and deselecting cities", () => {
    fireEvent.click(screen.getByRole("tab", { name: /Cities/i }));
    const cityBadge = screen.getByText("City X");
    fireEvent.click(cityBadge);
    expect(cityBadge).toHaveStyle({ backgroundColor: "rgb(13, 110, 253)" }); // #0d6efd

    fireEvent.click(cityBadge);
    expect(cityBadge).toHaveStyle({ backgroundColor: "rgb(108, 155, 214)" }); // #6c9bd6
  });

  test("allows selecting and deselecting contests", () => {
    fireEvent.click(screen.getByRole("tab", { name: /Contests/i }));
    const contestBadge = screen.getByText("Contest A");
    fireEvent.click(contestBadge);
    expect(contestBadge).toHaveStyle({ backgroundColor: "rgb(13, 110, 253)" }); // #0d6efd

    fireEvent.click(contestBadge);
    expect(contestBadge).toHaveStyle({ backgroundColor: "rgb(108, 155, 214)" }); // #6c9bd6
  });

  test("allows selecting and deselecting outcomes", () => {
    fireEvent.click(screen.getByRole("tab", { name: /Outcomes/i }));
    const outcomeBadge = screen.getByText("Won");
    fireEvent.click(outcomeBadge);
    expect(outcomeBadge).toHaveStyle({ backgroundColor: "rgb(13, 110, 253)" }); // #0d6efd

    fireEvent.click(outcomeBadge);
    expect(outcomeBadge).toHaveStyle({ backgroundColor: "rgb(108, 155, 214)" }); // #6c9bd6
  });

  // Test 3: Clear Functionality Tests
  test('clears all selections when "Clear All" button is clicked', () => {
    // Select some filters first
    fireEvent.click(screen.getByRole("tab", { name: /Cities/i }));
    fireEvent.click(screen.getByText("City X"));
    fireEvent.click(screen.getByRole("tab", { name: /Contests/i }));
    fireEvent.click(screen.getByText("Contest A"));

    // Click Clear All
    fireEvent.click(screen.getByRole("button", { name: /Clear All/i }));
    expect(screen.getByText("City X")).toHaveStyle({ backgroundColor: "rgb(108, 155, 214)" }); // #6c9bd6
    fireEvent.click(screen.getByRole("tab", { name: /Contests/i }));
    expect(screen.getByText("Contest A")).toHaveStyle({ backgroundColor: "rgb(108, 155, 214)" }); // #6c9bd6
  });

  // Test 4: Callback Tests
  test("calls onFilterChange with correct filter object on selection changes", () => {
    fireEvent.click(screen.getByRole("tab", { name: /Cities/i }));
    fireEvent.click(screen.getByText("City X"));
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      cities: ["City X"],
      contests: [],
      outcomes: [],
    });
  });
});
