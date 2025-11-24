import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserPage from "../components/UserPage";

/**
 * =======================================================
 *                    USER PAGE COMPONENT TESTS
 * =======================================================
 * Test Cases:
 * -----------
 * 1. Page Rendering Tests:
 *    ✓ page title and subtitle are displayed correctly
 *
 * 2. User Info Tests:
 *    ✓ username and balance are shown properly
 *
 * 3. Component Integration Tests:
 *    ✓ BetHistory component is rendered
 *    ✓ BetHistoryFilter component is rendered
 *
 * 4. Deposit Functionality Tests:
 *    ✓ renders "Deposit Funds" button
 *    ✓ shows DepositCurrency modal when button clicked
 *    ✓ calls onBalanceUpdate when deposit is successful
 *    ✓ hides modal when cancel is clicked
 *
 * Run all tests: npm test
 * Run UserPage.test.jsx only: npm test -- UserPage.test.jsx
 * Run specific test: npm test -- --testNamePattern="test name"
 * =======================================================
 */

// Mock fetch globally
global.fetch = jest.fn();

describe("UserPage", () => {
  const user = { username: "leon", balanceUsd: 152.37 };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock fetch for BetHistory component
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  //Test 1: Check page title and subtitle
  test("renders page title and subtitle", () => {
    render(<UserPage user={user} />);
    expect(screen.getByRole("heading", { name: /leon's Page/i })).toBeInTheDocument();
    expect(screen.getByText(/Your account info and bet history/i)).toBeInTheDocument();
  });

  //Test 2: Check username and balance display
  test("shows username and balance", () => {
    render(<UserPage user={user} />);
    expect(screen.getAllByText(/Username:/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/leon/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/\$152\.37/)).toBeInTheDocument();
  });

  //Test 3: Check BetHistory component is rendered
  test("renders BetHistory component", async () => {
    render(<UserPage user={user} />);

    // Check that "Bet History" heading is present
    expect(screen.getByRole("heading", { name: /Bet History/i })).toBeInTheDocument();

    // Wait for BetHistory to render
    await waitFor(() => {
      expect(screen.getByText(/Loading bet history/i)).toBeInTheDocument();
    });
  });

  //Test 4: Check BetHistoryFilter component is rendered
  test("renders BetHistoryFilter component", () => {
    render(<UserPage user={user} />);

    // Check filter heading is present
    expect(screen.getByText(/Filter Bets/i)).toBeInTheDocument();

    // Check filter tabs are present
    expect(screen.getByRole("tab", { name: /Cities/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Contests/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Outcomes/i })).toBeInTheDocument();
  });

  // Test 5: renders Deposit Funds button
  test("renders Deposit Funds button", () => {
    render(<UserPage user={user} />);
    const depositButton = screen.getByRole("button", { name: /Deposit Funds/i });
    expect(depositButton).toBeInTheDocument();
  });

  // Test 6: shows DepositCurrency modal when button is clicked
  test("shows DepositCurrency modal when Deposit Funds button is clicked", () => {
    render(<UserPage user={user} />);
    const depositButton = screen.getByRole("button", { name: /Deposit Funds/i });

    // Modal should not be visible initially
    expect(screen.queryByPlaceholderText(/Enter amount/i)).not.toBeInTheDocument();

    // Click button to show modal
    fireEvent.click(depositButton);

    // Modal should now be visible
    expect(screen.getByPlaceholderText(/Enter amount/i)).toBeInTheDocument();
  });

  // Test 7: calls onBalanceUpdate when deposit is successful
  test("calls onBalanceUpdate when deposit is successful", async () => {
    const mockOnBalanceUpdate = jest.fn();
    // Mock both BetHistory fetch and deposit fetch
    global.fetch.mockImplementation((url) => {
      if (url.includes("/api/deposit")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ newBalance: 1152.37 }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    });

    render(<UserPage user={user} onBalanceUpdate={mockOnBalanceUpdate} />);

    // Open modal
    const depositButton = screen.getByRole("button", { name: /Deposit Funds/i });
    fireEvent.click(depositButton);

    // Enter valid amount and submit
    const input = screen.getByPlaceholderText(/Enter amount/i);
    fireEvent.change(input, { target: { value: "100.00" } });

    const depositSubmitButton = screen.getByRole("button", { name: /^Deposit$/i });
    fireEvent.click(depositSubmitButton);

    // Wait for API call and callback
    await waitFor(() => {
      expect(mockOnBalanceUpdate).toHaveBeenCalledWith(1152.37);
    });
  });

  // Test 8: hides modal when cancel is clicked
  test("hides modal when cancel button is clicked in DepositCurrency", () => {
    render(<UserPage user={user} />);

    // Open modal
    const depositButton = screen.getByRole("button", { name: /Deposit Funds/i });
    fireEvent.click(depositButton);

    // Modal should be visible
    expect(screen.getByPlaceholderText(/Enter amount/i)).toBeInTheDocument();

    // Click cancel
    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelButton);

    // Modal should be hidden
    expect(screen.queryByPlaceholderText(/Enter amount/i)).not.toBeInTheDocument();
  });
});
