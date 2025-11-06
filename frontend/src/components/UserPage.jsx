import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * =======================================================
 *                    USER PAGE COMPONENT
 * =======================================================
 *
 * This page displays:
 *   - User account information (username, balance, etc.)
 *   - A list of the user’s past and active bets (mocked for now)
 * 
 * Props:
 *   - user: the logged-in user object
 */

function UserPage({ user }) {
  const [userBets, setUserBets] = useState([]);

  // Mock data for user bets
  useEffect(() => {
    const mockUserBets = [
      {
        id: 1,
        title: "Will be done in split 3",
        city: "Madison",
        bet_type: "A",
        amount: 1.0,
        outcome: "Pending",
        date: "1/1/2025",
      },
      {
        id: 2,
        title: "Will be done in split 3",
        city: "Madison",
        bet_type: "B",
        amount: 1.0,
        outcome: "Pending",
        date: "1/2/2025",
      },
      {
        id: 3,
        title: "Will be done in split 3",
        city: "Madison",
        bet_type: "C",
        amount: 1.0,
        outcome: "Pending",
        date: "1/3/2025",
      },
    ];
    setUserBets(mockUserBets);
  }, []);

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
          <h5>Username: <strong>{user?.username}</strong></h5>
          <h5>Balance: <Badge bg="info" text="dark">${user?.balanceUsd !== undefined ? user.balanceUsd.toFixed(2) : '0.00'}</Badge></h5>
        </Col>
      </Row>

      {/* Bet History Table */}
      <Row>
        <Col>
          <h4 className="mb-3">Bet History</h4>
          <div style={{ maxHeight: "500px", overflowY: "auto", borderRadius: "10px" }}>
            <Table striped hover responsive>
              <thead style={{ backgroundColor: "#f8f9fa", position: "sticky", top: 0 }}>
                <tr>
                  <th>Contest</th>
                  <th>City</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Outcome</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {userBets.map((bet) => (
                  <tr key={bet.id}>
                    <td><strong>{bet.title}</strong></td>
                    <td>{bet.city}</td>
                    <td><Badge bg="secondary">{bet.bet_type.toUpperCase()}</Badge></td>
                    <td>${bet.amount.toFixed(2)}</td>
                    <td>{bet.outcome}</td>
                    <td>{bet.date}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default UserPage;
