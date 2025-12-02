// PlacingBet Component Tests
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import PlacingBet from "../components/PlacingBet";

/**
 * =======================================================
 *               PLACING BET COMPONENT TESTS
 * =======================================================
 *
 * Test Cases:
 * -----------
 * 1. Rendering Tests:
 *    ✓ renders modal when isOpen is true
 *    ✓ does not render when isOpen is false
 *    ✓ displays bet details correctly
 *    ✓ displays user balance
 *    ✓ displays outcome options based on bet type
 *
 * 2. Bet Type Outcome Tests:
 *    ✓ shows Over/Under for MAX_TEMP_OVER_UNDER
 *    ✓ shows Yes/No for RAIN_YES_NO
 *    ✓ shows Match/Not Match for CONDITION_MATCH
 *
 * 3. Validation Tests:
 *    ✓ validates empty bet amount
 *    ✓ validates invalid number format
 *    ✓ validates negative amounts
 *    ✓ validates decimal places (must be 0 or 2)
 *    ✓ validates amount exceeds balance
 *    ✓ validates outcome selection
 *
 * 4. Interaction Tests:
 *    ✓ updates bet amount on input change
 *    ✓ updates selected outcome on dropdown change
 *    ✓ clears error message when user types
 *    ✓ closes modal on cancel button click
 *    ✓ closes modal when clicking outside
 *
 * 5. Form Submission Tests:
 *    ✓ submits bet with valid data
 *    ✓ prevents submission with invalid data
 *    ✓ resets form after successful submission
 *    ✓ shows loading state during submission
 *    ✓ handles API errors gracefully
 *
 * Run all tests: npm test
 * Run PlacingBet.test.jsx only: npm test -- PlacingBet.test.jsx
 * Run specific test: npm test -- --testNamePattern="test name"
 * ======================================================
 */

describe("PlacingBet Component Tests", () => {
  const mockBetDetails = {
    betId: 1,
    betDescription: "Madison: Max Temperature Over/Under 45.0°F (Odds for UNDER)",
    betType: "MAX_TEMP_OVER_UNDER",
    setLine: 45.0,
    moneylineOdds: 100,
  };

  const mockOnClose = jest.fn();
  const mockOnBetPlaced = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnBetPlaced.mockClear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Rendering Tests
  test("renders modal when isOpen is true", () => {
    render(
      <PlacingBet
        isOpen={true}
        onClose={mockOnClose}
        betDetails={mockBetDetails}
        onBetPlaced={mockOnBetPlaced}
        userBalance={100}
        username="testuser"
      />,
    );
    expect(screen.getByText("Place Your Bet")).toBeInTheDocument();
  });

  test("does not render when isOpen is false", () => {
    render(
      <PlacingBet
        isOpen={false}
        onClose={mockOnClose}
        betDetails={mockBetDetails}
        onBetPlaced={mockOnBetPlaced}
        userBalance={100}
        username="testuser"
      />,
    );
    expect(screen.queryByText("Place Your Bet")).not.toBeInTheDocument();
  });

  test("displays bet details correctly", () => {
    render(
      <PlacingBet
        isOpen={true}
        onClose={mockOnClose}
        betDetails={mockBetDetails}
        onBetPlaced={mockOnBetPlaced}
        userBalance={100}
        username="testuser"
      />,
    );
    expect(screen.getByText(/Madison: Max Temperature Over\/Under 45.0°F/)).toBeInTheDocument();
    expect(screen.getByText("Max Temp Over/Under")).toBeInTheDocument();
    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("+100")).toBeInTheDocument();
  });

  test("displays user balance", () => {
    render(
      <PlacingBet
        isOpen={true}
        onClose={mockOnClose}
        betDetails={mockBetDetails}
        onBetPlaced={mockOnBetPlaced}
        userBalance={250.75}
        username="testuser"
      />,
    );
    expect(screen.getByText("$250.75")).toBeInTheDocument();
  });

  // Bet Type Outcome Tests
  test("shows Over/Under options for MAX_TEMP_OVER_UNDER", () => {
    render(
      <PlacingBet
        isOpen={true}
        onClose={mockOnClose}
        betDetails={mockBetDetails}
        onBetPlaced={mockOnBetPlaced}
        userBalance={100}
        username="testuser"
      />,
    );
    expect(screen.getByText("Over")).toBeInTheDocument();
    expect(screen.getByText("Under")).toBeInTheDocument();
  });

  test("shows Yes/No options for RAIN_YES_NO", () => {
    const rainBet = { ...mockBetDetails, betType: "RAIN_YES_NO" };
    render(
      <PlacingBet
        isOpen={true}
        onClose={mockOnClose}
        betDetails={rainBet}
        onBetPlaced={mockOnBetPlaced}
        userBalance={100}
        username="testuser"
      />,
    );
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  test("shows Match/Not Match options for CONDITION_MATCH", () => {
    const conditionBet = { ...mockBetDetails, betType: "CONDITION_MATCH" };
    render(
      <PlacingBet
        isOpen={true}
        onClose={mockOnClose}
        betDetails={conditionBet}
        onBetPlaced={mockOnBetPlaced}
        userBalance={100}
        username="testuser"
      />,
    );
    expect(screen.getByText("Match")).toBeInTheDocument();
    expect(screen.getByText("Not Match")).toBeInTheDocument();
  });

  // Validation Tests
  test("validates empty bet amount", () => {
    render(
      <PlacingBet
        isOpen={true}
        onClose={mockOnClose}
        betDetails={mockBetDetails}
        onBetPlaced={mockOnBetPlaced}
        userBalance={100}
        username="testuser"
      />,
    );

    const outcomeSelect = screen.getByLabelText("Select Outcome:");
    fireEvent.change(outcomeSelect, { target: { value: "Over" } });

    const placeButton = screen.getByText("Place Bet");
    fireEvent.click(placeButton);

    expect(screen.getByText("Please enter a bet amount")).toBeInTheDocument();
  });

  test("validates invalid number format", () => {
    render(
      <PlacingBet
        isOpen={true}
        onClose={mockOnClose}
        betDetails={mockBetDetails}
        onBetPlaced={mockOnBetPlaced}
        userBalance={100}
        username="testuser"
      />,
    );

    const outcomeSelect = screen.getByLabelText("Select Outcome:");
    fireEvent.change(outcomeSelect, { target: { value: "Over" } });

    const amountInput = screen.getByLabelText("Bet Amount:");
    fireEvent.change(amountInput, { target: { value: "abc" } });

    const placeButton = screen.getByText("Place Bet");
    fireEvent.click(placeButton);

    expect(screen.getByText("Please enter a valid number")).toBeInTheDocument();
  });

  test("validates negative amounts", () => {
    render(
      <PlacingBet
        isOpen={true}
        onClose={mockOnClose}
        betDetails={mockBetDetails}
        onBetPlaced={mockOnBetPlaced}
        userBalance={100}
        username="testuser"
      />,
    );

    const outcomeSelect = screen.getByLabelText("Select Outcome:");
    fireEvent.change(outcomeSelect, { target: { value: "Over" } });

    const amountInput = screen.getByLabelText("Bet Amount:");
    fireEvent.change(amountInput, { target: { value: "-10" } });

    const placeButton = screen.getByText("Place Bet");
    fireEvent.click(placeButton);

    expect(screen.getByText("Bet amount must be greater than 0")).toBeInTheDocument();
  });

  test("validates decimal places (must be 0 or 2)", () => {
    render(
      <PlacingBet
        isOpen={true}
        onClose={mockOnClose}
        betDetails={mockBetDetails}
        onBetPlaced={mockOnBetPlaced}
        userBalance={100}
        username="testuser"
      />,
    );

    const outcomeSelect = screen.getByLabelText("Select Outcome:");
    fireEvent.change(outcomeSelect, { target: { value: "Over" } });

    const amountInput = screen.getByLabelText("Bet Amount:");
    fireEvent.change(amountInput, { target: { value: "10.5" } });

    const placeButton = screen.getByText("Place Bet");
    fireEvent.click(placeButton);

    expect(
      screen.getByText("Amount must have no decimal or exactly 2 decimal places"),
    ).toBeInTheDocument();
  });

  test("validates amount exceeds balance", () => {
    render(
      <PlacingBet
        isOpen={true}
        onClose={mockOnClose}
        betDetails={mockBetDetails}
        onBetPlaced={mockOnBetPlaced}
        userBalance={50}
        username="testuser"
      />,
    );

    const outcomeSelect = screen.getByLabelText("Select Outcome:");
    fireEvent.change(outcomeSelect, { target: { value: "Over" } });

    const amountInput = screen.getByLabelText("Bet Amount:");
    fireEvent.change(amountInput, { target: { value: "75.00" } });

    const placeButton = screen.getByText("Place Bet");
    fireEvent.click(placeButton);

    expect(screen.getByText(/Insufficient funds/)).toBeInTheDocument();
  });

  test("validates outcome selection", () => {
    render(
      <PlacingBet
        isOpen={true}
        onClose={mockOnClose}
        betDetails={mockBetDetails}
        onBetPlaced={mockOnBetPlaced}
        userBalance={100}
        username="testuser"
      />,
    );

    const amountInput = screen.getByLabelText("Bet Amount:");
    fireEvent.change(amountInput, { target: { value: "25.00" } });

    const placeButton = screen.getByText("Place Bet");
    fireEvent.click(placeButton);

    expect(screen.getByText("Please select an outcome for your bet")).toBeInTheDocument();
  });

  // Interaction Tests
  test("updates bet amount on input change", () => {
    render(
      <PlacingBet
        isOpen={true}
        onClose={mockOnClose}
        betDetails={mockBetDetails}
        onBetPlaced={mockOnBetPlaced}
        userBalance={100}
        username="testuser"
      />,
    );

    const amountInput = screen.getByLabelText("Bet Amount:");
    fireEvent.change(amountInput, { target: { value: "50.00" } });

    expect(amountInput.value).toBe("50.00");
  });

  test("updates selected outcome on dropdown change", () => {
    render(
      <PlacingBet
        isOpen={true}
        onClose={mockOnClose}
        betDetails={mockBetDetails}
        onBetPlaced={mockOnBetPlaced}
        userBalance={100}
        username="testuser"
      />,
    );

    const outcomeSelect = screen.getByLabelText("Select Outcome:");
    fireEvent.change(outcomeSelect, { target: { value: "Over" } });

    expect(outcomeSelect.value).toBe("Over");
  });

  test("clears error message when user types", () => {
    render(
      <PlacingBet
        isOpen={true}
        onClose={mockOnClose}
        betDetails={mockBetDetails}
        onBetPlaced={mockOnBetPlaced}
        userBalance={100}
        username="testuser"
      />,
    );

    const placeButton = screen.getByText("Place Bet");
    fireEvent.click(placeButton);

    expect(screen.getByText("Please select an outcome for your bet")).toBeInTheDocument();

    const amountInput = screen.getByLabelText("Bet Amount:");
    fireEvent.change(amountInput, { target: { value: "10" } });

    expect(screen.queryByText("Please select an outcome for your bet")).not.toBeInTheDocument();
  });

  test("closes modal on cancel button click", () => {
    render(
      <PlacingBet
        isOpen={true}
        onClose={mockOnClose}
        betDetails={mockBetDetails}
        onBetPlaced={mockOnBetPlaced}
        userBalance={100}
        username="testuser"
      />,
    );

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("closes modal when clicking outside", () => {
    render(
      <PlacingBet
        isOpen={true}
        onClose={mockOnClose}
        betDetails={mockBetDetails}
        onBetPlaced={mockOnBetPlaced}
        userBalance={100}
        username="testuser"
      />,
    );

    const overlay = screen.getByText("Place Your Bet").parentElement.parentElement;
    fireEvent.click(overlay);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // Form Submission Tests
  test("submits bet with valid data", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, betId: 123 }),
    });

    render(
      <PlacingBet
        isOpen={true}
        onClose={mockOnClose}
        betDetails={mockBetDetails}
        onBetPlaced={mockOnBetPlaced}
        userBalance={100}
        username="testuser"
      />,
    );

    const outcomeSelect = screen.getByLabelText("Select Outcome:");
    fireEvent.change(outcomeSelect, { target: { value: "Over" } });

    const amountInput = screen.getByLabelText("Bet Amount:");
    fireEvent.change(amountInput, { target: { value: "25.00" } });

    const placeButton = screen.getByText("Place Bet");
    fireEvent.click(placeButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("http://localhost:8080/api/player-bets/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          betId: 1,
          betAmount: 25.0,
          username: "testuser",
        }),
      });
    });

    await waitFor(() => {
      expect(mockOnBetPlaced).toHaveBeenCalledWith({ success: true, betId: 123 });
    });

    // Check success message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Bet placed successfully!/i)).toBeInTheDocument();
    });

    // Modal should close after 2 seconds
    await waitFor(
      () => {
        expect(mockOnClose).toHaveBeenCalled();
      },
      { timeout: 2500 },
    );
  });

  test("prevents submission with invalid data", () => {
    render(
      <PlacingBet
        isOpen={true}
        onClose={mockOnClose}
        betDetails={mockBetDetails}
        onBetPlaced={mockOnBetPlaced}
        userBalance={100}
        username="testuser"
      />,
    );

    const placeButton = screen.getByText("Place Bet");
    fireEvent.click(placeButton);

    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockOnBetPlaced).not.toHaveBeenCalled();
  });

  test("shows loading state during submission", async () => {
    global.fetch.mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({ success: true }),
              }),
            100,
          ),
        ),
    );

    render(
      <PlacingBet
        isOpen={true}
        onClose={mockOnClose}
        betDetails={mockBetDetails}
        onBetPlaced={mockOnBetPlaced}
        userBalance={100}
        username="testuser"
      />,
    );

    const outcomeSelect = screen.getByLabelText("Select Outcome:");
    fireEvent.change(outcomeSelect, { target: { value: "Over" } });

    const amountInput = screen.getByLabelText("Bet Amount:");
    fireEvent.change(amountInput, { target: { value: "25.00" } });

    const placeButton = screen.getByText("Place Bet");
    fireEvent.click(placeButton);

    expect(screen.getByText("Placing Bet...")).toBeInTheDocument();
    expect(placeButton).toBeDisabled();

    await waitFor(() => {
      expect(mockOnBetPlaced).toHaveBeenCalled();
    });
  });

  test("handles API errors gracefully", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: "Failed to place bet" }),
    });

    render(
      <PlacingBet
        isOpen={true}
        onClose={mockOnClose}
        betDetails={mockBetDetails}
        onBetPlaced={mockOnBetPlaced}
        userBalance={100}
        username="testuser"
      />,
    );

    const outcomeSelect = screen.getByLabelText("Select Outcome:");
    fireEvent.change(outcomeSelect, { target: { value: "Over" } });

    const amountInput = screen.getByLabelText("Bet Amount:");
    fireEvent.change(amountInput, { target: { value: "25.00" } });

    const placeButton = screen.getByText("Place Bet");
    fireEvent.click(placeButton);

    await waitFor(() => {
      expect(screen.getByText("Failed to place bet")).toBeInTheDocument();
    });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("resets form after successful submission", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const { rerender } = render(
      <PlacingBet
        isOpen={true}
        onClose={mockOnClose}
        betDetails={mockBetDetails}
        onBetPlaced={mockOnBetPlaced}
        userBalance={100}
        username="testuser"
      />,
    );

    const outcomeSelect = screen.getByLabelText("Select Outcome:");
    fireEvent.change(outcomeSelect, { target: { value: "Over" } });

    const amountInput = screen.getByLabelText("Bet Amount:");
    fireEvent.change(amountInput, { target: { value: "25.00" } });

    const placeButton = screen.getByText("Place Bet");
    fireEvent.click(placeButton);

    // Check success message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Bet placed successfully!/i)).toBeInTheDocument();
    });

    // Modal should close after 2 seconds
    await waitFor(
      () => {
        expect(mockOnClose).toHaveBeenCalled();
      },
      { timeout: 2500 },
    );

    // Reopen modal to check if form is reset
    rerender(
      <PlacingBet
        isOpen={true}
        onClose={mockOnClose}
        betDetails={mockBetDetails}
        onBetPlaced={mockOnBetPlaced}
        userBalance={100}
        username="testuser"
      />,
    );

    const newAmountInput = screen.getByLabelText("Bet Amount:");
    const newOutcomeSelect = screen.getByLabelText("Select Outcome:");

    expect(newAmountInput.value).toBe("");
    expect(newOutcomeSelect.value).toBe("");
  });
});
