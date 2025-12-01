import React, { useState, useEffect } from "react";
import "./PlacingBet.css";
import { formatBetType } from "../utils/betTypeFormatter";

/**
 * =================================================
 *              PLACING BET COMPONENT
 * =================================================
 *
 * This component allows users to place bets on weather outcomes.
 * When a user clicks enter on an available bet, a modal dialog
 * appears prompting them to confirm their bet details including
 * the amount they want to bet and the selected outcome. Users
 * can either confirm or cancel the bet placement. Successful placement
 * of bets triggers a callback to update the user's balance and bet history.
 *
 * Props:
 * - isOpen: boolean to control modal visibility
 * - onClose: function to close the modal
 * - betDetails: object containing details of the bet (betId, betDescription, betType, setLine, moneylineOdds)
 * - onBetPlaced: function to call after a successful bet placement
 * - userBalance: the user's current balance (for validation)
 */

function PlacingBet({ isOpen, onClose, betDetails, onBetPlaced, userBalance = 0 }) {
  const [betAmount, setBetAmount] = useState("");
  const [selectedOutcome, setSelectedOutcome] = useState("");
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setBetAmount("");
      setSelectedOutcome("");
      setErrorMessage("");
    }
  }, [isOpen]);

  /**
   * Returns the available outcome options based on bet type
   */
  const getOutcomeOptions = (betType) => {
    switch (betType) {
      case "MAX_TEMP_OVER_UNDER":
        return ["Over", "Under"];
      case "RAIN_YES_NO":
        return ["Yes", "No"];
      case "CONDITION_MATCH":
        return ["Match", "Not Match"];
      default:
        return ["Yes", "No"]; // Default fallback
    }
  };

  const outcomeOptions = betDetails?.betType ? getOutcomeOptions(betDetails.betType) : [];

  /**
   * Validates the bet amount input
   * Returns an error message if invalid, or null if valid
   */
  const validateBetAmount = (amount) => {
    // Check if empty
    if (!amount || amount.trim() === "") {
      return "Please enter a bet amount";
    }

    // Convert to number
    const numAmount = parseFloat(amount);

    // Check if it's a valid number
    if (isNaN(numAmount)) {
      return "Please enter a valid number";
    }

    // Check if positive
    if (numAmount <= 0) {
      return "Bet amount must be greater than 0";
    }

    // Check decimal places (must be 0 or 2 decimal places)
    const decimalParts = amount.split(".");
    if (decimalParts.length > 2) {
      return "Invalid number format";
    }
    if (decimalParts.length === 2 && decimalParts[1].length !== 2) {
      return "Amount must have no decimal or exactly 2 decimal places";
    }

    // Check if exceeds balance
    if (numAmount > userBalance) {
      return `Insufficient funds. Your balance is $${userBalance.toFixed(2)}`;
    }

    return null;
  };

  const handleBetPlacement = async () => {
    // Validate outcome selection
    if (!selectedOutcome) {
      setErrorMessage("Please select an outcome for your bet");
      return;
    }

    // Validate bet amount before placing
    const validationError = validateBetAmount(betAmount);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsPlacingBet(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/place-bet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          betId: betDetails.betId,
          amount: parseFloat(betAmount),
          outcome: selectedOutcome,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to place bet");
      }

      const result = await response.json();
      onBetPlaced(result);

      // Reset form
      setBetAmount("");
      setSelectedOutcome("");
      onClose();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsPlacingBet(false);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setBetAmount(value);

    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Place Your Bet</h2>

        {/* Bet Details Section */}
        <div className="bet-details-section">
          <div className="bet-info">
            <h4>Bet Description</h4>
            <p>{betDetails?.betDescription || "No description available"}</p>
          </div>

          <div className="bet-line-info">
            <div className="info-row">
              <span className="label">Type:</span>
              <span className="value">
                {betDetails?.betType ? formatBetType(betDetails.betType) : "—"}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Line:</span>
              <span className="value">
                {betDetails?.setLine !== null && betDetails?.setLine !== undefined
                  ? betDetails.setLine
                  : "—"}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Odds:</span>
              <span className="value">
                {betDetails?.moneylineOdds !== null && betDetails?.moneylineOdds !== undefined
                  ? betDetails.moneylineOdds >= 0
                    ? `+${betDetails.moneylineOdds}`
                    : betDetails.moneylineOdds
                  : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Balance Display */}
        <div className="balance-display">
          <span className="label">Your Balance:</span>
          <span className="balance-value">${userBalance.toFixed(2)}</span>
        </div>

        {/* Outcome Selection */}
        <div className="form-group">
          <label htmlFor="outcome-select">Select Outcome:</label>
          <select
            id="outcome-select"
            value={selectedOutcome}
            onChange={(e) => {
              setSelectedOutcome(e.target.value);
              if (errorMessage && errorMessage.includes("outcome")) {
                setErrorMessage("");
              }
            }}
            className="outcome-select"
          >
            <option value="">-- Choose Outcome --</option>
            {outcomeOptions.map((outcome) => (
              <option key={outcome} value={outcome}>
                {outcome}
              </option>
            ))}
          </select>
        </div>

        {/* Bet Amount Input */}
        <div className="form-group">
          <label htmlFor="bet-amount">Bet Amount:</label>
          <input
            id="bet-amount"
            type="text"
            value={betAmount}
            onChange={handleAmountChange}
            placeholder="Enter bet amount (e.g., 10 or 10.00)"
            className="amount-input"
          />
        </div>

        {/* Error Message */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Action Buttons */}
        <div className="button-group">
          <button onClick={handleBetPlacement} disabled={isPlacingBet} className="btn-place-bet">
            {isPlacingBet ? "Placing Bet..." : "Place Bet"}
          </button>
          <button onClick={onClose} disabled={isPlacingBet} className="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlacingBet;
