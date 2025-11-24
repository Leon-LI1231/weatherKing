import React, { useState } from "react";
import { Container, Row, Col, Badge, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import DepositCurrency from "./DepositCurrency";
import BetHistory from "./BetHistory";
import BetHistoryFilter from "./BetHistoryFilter";

/**
 * =======================================================
 *                    USER PAGE COMPONENT
 * =======================================================
 *
 * This page displays:
 *   - User account information (username, balance)
 *   - Deposit currency functionality via modal
 *   - Filterable bet history table showing user's past and active bets
 *   - Filter controls for city, contest, and outcome
 *
 * Props:
 *   - user: the logged-in user object (contains username, balanceUsd, etc.)
 *   - onBalanceUpdate: callback function to update user balance in parent component
 */

function UserPage({ user, onBalanceUpdate }) {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [filter, setFilter] = useState({ cities: [], contests: [], outcomes: [] });
  const [availableOptions, setAvailableOptions] = useState({
    cities: [],
    contests: [],
    outcomes: [],
  });

  const handleDeposit = (newBalance) => {
    // Update balance in parent component
    if (onBalanceUpdate) {
      onBalanceUpdate(newBalance);
    }
  };

  return (
    <Container style={{ marginTop: "140px", textAlign: "center" }}>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h2>{user?.username}&apos;s Page</h2>
          <p className="text-muted">Your account info and bet history</p>
        </Col>
      </Row>

      {/* User Info */}
      <Row className="mb-5">
        <Col>
          <h5>
            Username: <strong>{user?.username}</strong>
          </h5>
          <h5>
            Balance:{" "}
            <Badge bg="info" text="dark">
              ${user?.balanceUsd !== undefined ? user.balanceUsd.toFixed(2) : "0.00"}
            </Badge>
          </h5>
          <Button
            variant="success"
            size="sm"
            className="mt-2"
            onClick={() => setShowDepositModal(true)}
          >
            Deposit Funds
          </Button>
        </Col>
      </Row>

      {/* Bet History Section */}
      <Row>
        <Col>
          <h4 className="mb-3">Bet History</h4>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <BetHistoryFilter
            onFilterChange={setFilter}
            initialFilter={filter}
            availableOptions={availableOptions}
          />
        </Col>
        <Col md={9}>
          <div style={{ maxHeight: "500px", overflowY: "auto", borderRadius: "10px" }}>
            <BetHistory
              username={user?.username}
              filter={filter}
              onAvailableOptionsChange={setAvailableOptions}
            />
          </div>
        </Col>
      </Row>

      {/* Deposit Modal */}
      {showDepositModal && (
        <DepositCurrency
          username={user?.username}
          userBalance={user?.balanceUsd}
          onDeposit={handleDeposit}
          onCancel={() => setShowDepositModal(false)}
        />
      )}
    </Container>
  );
}

export default UserPage;
