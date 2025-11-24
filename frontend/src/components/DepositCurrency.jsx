// DepositCurrency.jsx
import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * ===============================
 *    DepositCurrency Component
 * ===============================
 *
 * This component allows users to deposit a specified amount of currency on the UserPage.
 * Successful deposits will update the user's balance accordingly updating all fields where the balance is displayed.
 *
 * Validation Rules:
 *  - Must be a positive number
 *  - Maximum deposit amount is $1000.00
 *  - Must have either 0 decimal places (e.g., 100) or exactly 2 decimal places (e.g., 10.50)
 *  - Numbers with 1 or more than 2 decimal places are invalid
 *
 * It includes:
 *  - An input field for entering the deposit amount
 *  - A button to confirm the deposit
 *  - Validation to ensure deposit meets all requirements
 *  - Feedback messages for successful deposits or errors
 * Props:
 *  - onDeposit: function to handle the deposit action, receives newBalance as parameter
 *  - onCancel: function to handle cancellation of the deposit action
 *  - userBalance: current balance of the user to display
 *  - username: username of the user making the deposit
 */

const DepositCurrency = ({ onDeposit, onCancel, username }) => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(""); // 'success' or 'danger'
  const [isLoading, setIsLoading] = useState(false);

  const handleDeposit = async () => {
    const depositAmount = parseFloat(amount);

    // Check if it's a valid positive number
    if (isNaN(depositAmount) || depositAmount <= 0) {
      setMessage("Please enter a valid positive number.");
      setMessageType("danger");
      return;
    }

    // Check if amount exceeds $1000
    if (depositAmount > 1000) {
      setMessage("Deposit amount cannot exceed $1000.00");
      setMessageType("danger");
      return;
    }

    // Validate decimal places - must be 0 or 2 decimal places only
    const amountStr = amount.trim();
    const decimalMatch = amountStr.match(/\.(\d+)$/);

    if (decimalMatch) {
      const decimalPlaces = decimalMatch[1].length;
      if (decimalPlaces !== 2) {
        setMessage(
          "Please enter an amount with exactly 2 decimal places (e.g., 10.50) or no decimal places.",
        );
        setMessageType("danger");
        return;
      }
    }

    // Call backend API to deposit
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, amount: depositAmount }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("Deposit successful!");
        setMessageType("success");
        setAmount("");
        // Call parent handler to update balance in App
        onDeposit(data.newBalance);

        // Auto-close modal after success
        setTimeout(() => {
          onCancel();
        }, 1500);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Deposit failed. Please try again.");
        setMessageType("danger");
      }
    } catch (error) {
      console.error("Error depositing funds:", error);
      setMessage("Unable to connect to server. Please try again.");
      setMessageType("danger");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setAmount("");
    setMessage(null);
    onCancel();
  };
  return (
    <Modal show onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Deposit Currency</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Form.Group>
          {message && <Alert variant={messageType}>{message}</Alert>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleDeposit} disabled={isLoading}>
          {isLoading ? "Processing..." : "Deposit"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DepositCurrency;
