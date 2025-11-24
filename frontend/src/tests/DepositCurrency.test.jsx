// Test file for DepositCurrency component
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import DepositCurrency from "../components/DepositCurrency";

/**
 * =======================================================
 *                DEPOSIT CURRENCY TESTS
 * =======================================================
 * Test Cases:
 * -----------
 * 1. Rendering Tests:
 *   ✓ renders deposit input field and buttons
 *
 * 2. Validation Tests:
 *  ✓ shows error for non-numeric input
 *  ✓ shows error for negative amounts
 *  ✓ shows error for amounts over $1000
 *  ✓ shows error for invalid decimal places
 *
 * 3. Successful Deposit Tests:
 *  ✓ displays success message on valid deposit
 *  ✓ calls onDeposit with updated balance on successful deposit
 *
 * 4. Cancellation Tests:
 *  ✓ calls onCancel when cancel button is clicked
 *
 * Run all tests: npm test
 * Run DepositCurrency.test.jsx only: npm test -- DepositCurrency.test.jsx
 * Run specific test: npm test -- --testNamePattern="test name"
 * =======================================================
 */

// Mock fetch globally
global.fetch = jest.fn();

describe("DepositCurrency Component", () => {
  const mockOnDeposit = jest.fn();
  const mockOnCancel = jest.fn();
  const initialBalance = 500.0;
  const username = "testuser";

  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <DepositCurrency
        onDeposit={mockOnDeposit}
        onCancel={mockOnCancel}
        userBalance={initialBalance}
        username={username}
      />,
    );
  });

  // Test 1: Rendering Tests
  test("renders deposit input field and buttons", () => {
    expect(screen.getByPlaceholderText(/Enter amount/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Deposit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });

  // Test 2: Validation Tests
  test("shows error for non-numeric input", async () => {
    fireEvent.change(screen.getByPlaceholderText(/Enter amount/i), { target: { value: "abc" } });
    fireEvent.click(screen.getByRole("button", { name: /Deposit/i }));
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid positive number/i)).toBeInTheDocument();
    });
  });

  test("shows error for negative amounts", async () => {
    fireEvent.change(screen.getByPlaceholderText(/Enter amount/i), { target: { value: "-50" } });
    fireEvent.click(screen.getByRole("button", { name: /Deposit/i }));
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid positive number/i)).toBeInTheDocument();
    });
  });

  test("shows error for amounts over $1000", async () => {
    fireEvent.change(screen.getByPlaceholderText(/Enter amount/i), { target: { value: "1500" } });
    fireEvent.click(screen.getByRole("button", { name: /Deposit/i }));
    await waitFor(() => {
      expect(screen.getByText(/cannot exceed \$1000/i)).toBeInTheDocument();
    });
  });

  test("shows error for invalid decimal places", async () => {
    fireEvent.change(screen.getByPlaceholderText(/Enter amount/i), { target: { value: "10.5" } });
    fireEvent.click(screen.getByRole("button", { name: /Deposit/i }));
    await waitFor(() => {
      expect(screen.getByText(/exactly 2 decimal places/i)).toBeInTheDocument();
    });
  });

  // Test 3: Successful Deposit Tests
  test("displays success message on valid deposit", async () => {
    const newBalance = 700.0;
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Deposit successful!", newBalance }),
    });

    fireEvent.change(screen.getByPlaceholderText(/Enter amount/i), { target: { value: "200.00" } });
    fireEvent.click(screen.getByRole("button", { name: /Deposit/i }));
    await waitFor(() => {
      expect(screen.getByText(/Deposit successful!/i)).toBeInTheDocument();
    });
  });

  test("calls onDeposit with updated balance on successful deposit", async () => {
    const depositAmount = 200.0;
    const newBalance = initialBalance + depositAmount;
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Deposit successful!", newBalance }),
    });

    fireEvent.change(screen.getByPlaceholderText(/Enter amount/i), {
      target: { value: depositAmount.toString() },
    });
    fireEvent.click(screen.getByRole("button", { name: /Deposit/i }));
    await waitFor(() => {
      expect(mockOnDeposit).toHaveBeenCalledWith(newBalance);
    });
  });

  // Test 4: Cancellation Tests
  test("calls onCancel when cancel button is clicked", () => {
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
