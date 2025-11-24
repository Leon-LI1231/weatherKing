// Test file for BetHistory component

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import BetHistory from "../components/BetHistory";

/**
 * =======================================================
 *                  BET HISTORY TESTS
 * =======================================================
 * Test Cases:
 * -----------
 * 1. Rendering Tests:
 *   ✓ displays loading state initially
 *   ✓ displays error message on fetch failure
 *   ✓ displays bet history table on successful fetch
 *
 * 2. Data Population Tests:
 *   ✓ populates table with mock bet data
 *   ✓ calls onAvailableOptionsChange with correct filter options
 *
 * Run all tests: npm test
 * Run BetHistory.test.jsx only: npm test -- BetHistory.test.jsx
 * Run specific test: npm test -- --testNamePattern="test name"
 * =======================================================
 */

// Mock fetch globally
global.fetch = jest.fn();

describe("BetHistory Component", () => {
  const mockOnAvailableOptionsChange = jest.fn();
  const username = "testuser";
  const mockBets = [
    {
      contest: "Contest A",
      city: "City X",
      type: "Win",
      amount: 50,
      outcome: "Hit!",
      date: "2024-01-01",
      payout: 100,
    },
    {
      contest: "Contest B",
      city: "City Y",
      type: "Place",
      amount: 30,
      outcome: "Miss!",
      date: "2024-01-02",
      payout: 0,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Loading state
  test("displays loading state initially", () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });
    render(
      <BetHistory
        username={username}
        onAvailableOptionsChange={mockOnAvailableOptionsChange}
        filter={{ cities: [], contests: [], outcomes: [] }}
      />,
    );
    expect(screen.getByText(/Loading bet history.../i)).toBeInTheDocument();
  });

  // Test 2: Error state
  test("displays error message on fetch failure", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));
    render(
      <BetHistory
        username={username}
        onAvailableOptionsChange={mockOnAvailableOptionsChange}
        filter={{ cities: [], contests: [], outcomes: [] }}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  // Test 3: Successful data fetch and table display
  test("displays bet history table on successful fetch", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBets,
    });
    render(
      <BetHistory
        username={username}
        onAvailableOptionsChange={mockOnAvailableOptionsChange}
        filter={{ cities: [], contests: [], outcomes: [] }}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText(/Bet History/i)).toBeInTheDocument();
    });
  });

  // Test 4: Data population in table
  test("populates table with mock bet data", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBets,
    });
    render(
      <BetHistory
        username={username}
        onAvailableOptionsChange={mockOnAvailableOptionsChange}
        filter={{ cities: [], contests: [], outcomes: [] }}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText("Contest A")).toBeInTheDocument();
      expect(screen.getByText("City X")).toBeInTheDocument();
      expect(screen.getByText("Contest B")).toBeInTheDocument();
      expect(screen.getByText("City Y")).toBeInTheDocument();
    });
  });

  // Test 5: onAvailableOptionsChange called with correct options
  test("calls onAvailableOptionsChange with correct filter options", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBets,
    });
    render(
      <BetHistory
        username={username}
        onAvailableOptionsChange={mockOnAvailableOptionsChange}
        filter={{ cities: [], contests: [], outcomes: [] }}
      />,
    );
    await waitFor(() => {
      expect(mockOnAvailableOptionsChange).toHaveBeenCalledWith({
        contests: ["Contest A", "Contest B"],
        cities: ["City X", "City Y"],
        outcomes: ["Hit!", "Miss!"],
      });
    });
  });
});
