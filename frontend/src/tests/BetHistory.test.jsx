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
  const mockBackendResponse = [
    {
      playerBetId: 1,
      bet: {
        betDescription: "Contest A",
        cityName: "City X",
        betType: "MAX_TEMP_OVER_UNDER",
        moneylineOdds: 100,
      },
      betAmount: 50,
      potentialPayout: 50,
      actualPayout: 100,
      status: "WON",
      timePlaced: "2024-01-01T12:00:00",
    },
    {
      playerBetId: 2,
      bet: {
        betDescription: "Contest B",
        cityName: "City Y",
        betType: "RAIN_YES_NO",
        moneylineOdds: -110,
      },
      betAmount: 30,
      potentialPayout: 27.27,
      actualPayout: 0,
      status: "LOST",
      timePlaced: "2024-01-02T14:30:00",
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
        filter={{ cities: [], types: [], outcomes: [] }}
      />,
    );
    expect(screen.getByText(/Loading bet history.../i)).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(`http://localhost:8080/api/player-bets/history/${username}`);
  });

  // Test 2: Error state
  test("displays error message on fetch failure", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));
    render(
      <BetHistory
        username={username}
        onAvailableOptionsChange={mockOnAvailableOptionsChange}
        filter={{ cities: [], types: [], outcomes: [] }}
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
      json: async () => mockBackendResponse,
    });
    render(
      <BetHistory
        username={username}
        onAvailableOptionsChange={mockOnAvailableOptionsChange}
        filter={{ cities: [], types: [], outcomes: [] }}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText("Contest")).toBeInTheDocument();
      expect(screen.getByText("City")).toBeInTheDocument();
      expect(screen.getByText("Type")).toBeInTheDocument();
      expect(screen.getByText("Odds")).toBeInTheDocument();
      expect(screen.getByText("Date")).toBeInTheDocument();
      expect(screen.getByText("Outcome")).toBeInTheDocument();
      expect(screen.getByText("Bet Amount")).toBeInTheDocument();
      expect(screen.getByText("Payout")).toBeInTheDocument();
    });
  });

  // Test 4: Data population in table
  test("populates table with mock bet data", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBackendResponse,
    });
    render(
      <BetHistory
        username={username}
        onAvailableOptionsChange={mockOnAvailableOptionsChange}
        filter={{ cities: [], types: [], outcomes: [] }}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText("Contest A")).toBeInTheDocument();
      expect(screen.getByText("City X")).toBeInTheDocument();
      expect(screen.getByText("Contest B")).toBeInTheDocument();
      expect(screen.getByText("City Y")).toBeInTheDocument();
      expect(screen.getByText("$50.00")).toBeInTheDocument(); // Bet amount for Contest A
      expect(screen.getByText("$30.00")).toBeInTheDocument(); // Bet amount for Contest B
      expect(screen.getByText("$100.00")).toBeInTheDocument(); // Payout for Contest A (won)
    });
  });

  // Test 5: onAvailableOptionsChange called with correct options
  test("calls onAvailableOptionsChange with correct filter options", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBackendResponse,
    });
    render(
      <BetHistory
        username={username}
        onAvailableOptionsChange={mockOnAvailableOptionsChange}
        filter={{ cities: [], types: [], outcomes: [] }}
      />,
    );
    await waitFor(() => {
      expect(mockOnAvailableOptionsChange).toHaveBeenCalledWith({
        types: ["MAX_TEMP_OVER_UNDER", "RAIN_YES_NO"],
        cities: ["City X", "City Y"],
        outcomes: ["Hit!", "Miss!"],
      });
    });
  });
});
