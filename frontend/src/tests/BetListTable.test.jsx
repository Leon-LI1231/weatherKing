// BetListTable Component Tests
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BetListTable from "../components/BetListTable";

/**
 * =======================================================
 *               BET LIST TABLE COMPONENT TESTS
 * =======================================================
 *
 * Test Cases:
 * -----------
 * 1. Rendering Tests:
 *    ✓ bet list table renders with given bets
 *    ✓ renders all bet information correctly
 *    ✓ renders ENTER button for each bet
 *
 * 2. Interaction Tests:
 *    ✓ clicking ENTER button triggers onEnterBet callback
 *    ✓ passes correct bet data to callback
 *    ✓ handles multiple ENTER button clicks
 *
 * 3. Data Display Tests:
 *    ✓ formats dates correctly
 *    ✓ formats amounts correctly
 *    ✓ displays bet types as badges
 *
 * Run all tests: npm test
 * Run BetListTable.test.jsx only: npm test -- BetListTable.test.jsx
 * Run specific test: npm test -- --testNamePattern="test name"
 * ======================================================
 */

describe("BetListTable Component Tests", () => {
  // Mock data and functions
  const mockBets = [
    {
      betId: 1,
      betDescription: "Rain Prediction",
      betType: "weather",
      setLine: 50,
      moneylineOdds: -110,
      totalAmountBet: 125.5,
      betStart: "2025-11-07T18:00:00.000Z",
      betClose: "2025-11-08T18:00:00.000Z",
    },
    {
      betId: 2,
      betDescription: "Temperature Bet",
      betType: "temp",
      setLine: 75,
      moneylineOdds: 120,
      totalAmountBet: 250.0,
      betStart: "2025-11-07T20:00:00.000Z",
      betClose: "2025-11-08T20:00:00.000Z",
    },
  ];
  const mockOnEnterBet = jest.fn();

  beforeEach(() => {
    mockOnEnterBet.mockClear();
  });

  // Rendering Tests
  test("renders with given bets", () => {
    render(<BetListTable bets={mockBets} onEnterBet={mockOnEnterBet} />);
    expect(screen.getByText("Rain Prediction")).toBeInTheDocument();
    expect(screen.getByText("Temperature Bet")).toBeInTheDocument();
    expect(screen.getByText("weather")).toBeInTheDocument();
    expect(screen.getByText("temp")).toBeInTheDocument();
  });

  test("renders all bet information correctly", () => {
    render(<BetListTable bets={mockBets} onEnterBet={mockOnEnterBet} />);

    // Check descriptions
    expect(screen.getByText("Rain Prediction")).toBeInTheDocument();
    expect(screen.getByText("Temperature Bet")).toBeInTheDocument();

    // Check bet types
    expect(screen.getByText("weather")).toBeInTheDocument();
    expect(screen.getByText("temp")).toBeInTheDocument();

    // Check set lines
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("75")).toBeInTheDocument();

    // Check odds
    expect(screen.getByText("-110")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();
  });

  test("renders ENTER button for each bet", () => {
    render(<BetListTable bets={mockBets} onEnterBet={mockOnEnterBet} />);
    const enterButtons = screen.getAllByText("ENTER");
    expect(enterButtons).toHaveLength(2);
  });

  // Interaction Tests
  test("clicking ENTER button triggers onEnterBet callback", () => {
    render(<BetListTable bets={mockBets} onEnterBet={mockOnEnterBet} />);
    const enterButtons = screen.getAllByText("ENTER");

    fireEvent.click(enterButtons[0]);

    expect(mockOnEnterBet).toHaveBeenCalledTimes(1);
  });

  test("passes correct bet data to callback", () => {
    render(<BetListTable bets={mockBets} onEnterBet={mockOnEnterBet} />);
    const enterButtons = screen.getAllByText("ENTER");

    fireEvent.click(enterButtons[0]);

    expect(mockOnEnterBet).toHaveBeenCalledWith(mockBets[0]);
  });

  test("handles multiple ENTER button clicks", () => {
    render(<BetListTable bets={mockBets} onEnterBet={mockOnEnterBet} />);
    const enterButtons = screen.getAllByText("ENTER");

    fireEvent.click(enterButtons[0]);
    fireEvent.click(enterButtons[1]);

    expect(mockOnEnterBet).toHaveBeenCalledTimes(2);
    expect(mockOnEnterBet).toHaveBeenNthCalledWith(1, mockBets[0]);
    expect(mockOnEnterBet).toHaveBeenNthCalledWith(2, mockBets[1]);
  });

  // Data Display Tests
  test("formats dates correctly", () => {
    render(<BetListTable bets={mockBets} onEnterBet={mockOnEnterBet} />);

    // Check that dates are rendered (format depends on locale)
    const dateElements = screen.getAllByText(/2025/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  test("formats amounts correctly", () => {
    render(<BetListTable bets={mockBets} onEnterBet={mockOnEnterBet} />);

    // Check that total amounts are displayed with $ symbol
    expect(screen.getByText(/\$125.5/)).toBeInTheDocument();
    expect(screen.getByText(/\$250/)).toBeInTheDocument();
  });

  test("displays bet types as badges", () => {
    render(<BetListTable bets={mockBets} onEnterBet={mockOnEnterBet} />);

    const weatherBadge = screen.getByText("weather");
    const tempBadge = screen.getByText("temp");

    // Check that they're rendered (Bootstrap Badge component renders as span with badge class)
    expect(weatherBadge).toBeInTheDocument();
    expect(tempBadge).toBeInTheDocument();
  });

  test("handles empty bet list", () => {
    render(<BetListTable bets={[]} onEnterBet={mockOnEnterBet} />);

    // Table headers should still be present
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Line")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();

    // No ENTER buttons
    expect(screen.queryByText("ENTER")).not.toBeInTheDocument();
  });
});
