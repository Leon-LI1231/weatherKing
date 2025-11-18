import React from "react";
import { render, screen, within, waitFor, fireEvent } from "@testing-library/react";
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
 * 3. Table Structure Tests:
 *    ✓ table headers are rendered correctly
 *
 * 4. Data Population Tests:
 *    ✓ mock bet data is populated via useEffect
 *
 * 5. Deposit Functionality Tests:
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

describe("UserPage", () => {
  const user = { username: "leon", balanceUsd: 152.37 };

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

  //Test 3: Check table headers
  test("renders table headers", () => {
    render(<UserPage user={user} />);
    const table = screen.getByRole("table");
    const header = within(table).getAllByRole("row")[0];
    const headers = within(header).getAllByRole("columnheader").map((th) => th.textContent);
    expect(headers).toEqual(["Contest", "City", "Type", "Amount", "Outcome", "Date"]);
  });

  //Test 4: Check table rows populated by mock data
  test("populates bet rows from mock effect", async () => {
    render(<UserPage user={user} />);
    const table = screen.getByRole("table");

    // Wait for useEffect to load mock data
    await waitFor(() => {
      const rows = within(table).getAllByRole("row");
      expect(rows.length).toBe(4); // 1 header + 3 data rows
    });

    // Verify content of mock data
    expect(screen.getAllByText(/Will be done in split 3/i).length).toBe(3);
    expect(screen.getAllByText(/Madison/i).length).toBe(3);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
    expect(screen.getAllByText("$1.00").length).toBe(3);
    expect(screen.getAllByText(/Pending/i).length).toBe(3);
  });

  // Test 5: Checks that each bet row has correct number of columns
test("each bet row contains exactly 6 columns", async () => {
  render(<UserPage user={user} />);
  const table = screen.getByRole("table");

  await waitFor(() => {
    const rows = within(table).getAllByRole("row").slice(1); // skip header
    rows.forEach((row) => {
      const cells = within(row).getAllByRole("cell");
      expect(cells.length).toBe(6);
    });
  });
  });

  // Test 6: Verifies sticky header style is applied to table header
  test("table header has sticky style", () => {
    render(<UserPage user={user} />);
    const header = screen.getByRole("columnheader", { name: "Contest" });
    expect(header.closest("thead")).toHaveStyle("position: sticky");
  });

  // Test 7: verifies each bet type A/B/C appears once
  test("renders bet types A, B, and C each exactly once", async () => {
    render(<UserPage user={user} />);

    await waitFor(() => {
      expect(screen.getAllByText("A").length).toBe(1);
      expect(screen.getAllByText("B").length).toBe(1);
      expect(screen.getAllByText("C").length).toBe(1);
    });
  });

  // Test 8: renders Deposit Funds button
  test("renders Deposit Funds button", () => {
    render(<UserPage user={user} />);
    const depositButton = screen.getByRole("button", { name: /Deposit Funds/i });
    expect(depositButton).toBeInTheDocument();
  });

  // Test 9: shows DepositCurrency modal when button is clicked
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

  // Test 10: calls onBalanceUpdate when deposit is successful
  test("calls onBalanceUpdate when deposit is successful", async () => {
    const mockOnBalanceUpdate = jest.fn();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ newBalance: 1152.37 }),
      })
    );

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

    global.fetch.mockRestore();
  });

  // Test 11: hides modal when cancel is clicked
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

