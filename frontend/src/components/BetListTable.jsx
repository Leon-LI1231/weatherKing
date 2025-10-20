import React from "react";
import { Table, Button, Badge } from "react-bootstrap";

/**
 * =======================================================
 *                    BET LIST TABLE COMPONENT
 * =======================================================
 *
 * This component displays a list of bets for a given city in a table format.
 * Each row represents a single bet, including its title, type, entry fee,
 * total pool amount, number of entries, and start time.
 *
 * The table is scrollable and has a sticky header for easy navigation.
 * It receives all data from the LandingPage via props.
 *
 * Props:
 *   - bets: Array of bet objects [{ id, title, bet_type, entry_fee, total_amount_bet, entries, bet_start, description }]
 */

function BetListTable({ bets }) {
  return (
    <div
      style={{
        maxHeight: "500px",
        overflowY: "auto",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <Table striped hover responsive style={{ margin: 0 }}>
        <thead
          style={{
            backgroundColor: "#f8f9fa",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <tr>
            <th>Contest</th>
            <th>Type</th>
            <th>Entry Fee</th>
            <th>Total Pool</th>
            <th>Entries</th>
            <th>Start</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {bets.map((bet) => (
            <tr key={bet.id}>
              <td>
                <strong>{bet.title}</strong>
                <br />
                <small className="text-muted">{bet.description}</small>
              </td>
              <td>
                <Badge bg="secondary">{bet.bet_type.toUpperCase()}</Badge>
              </td>
              <td>${bet.entry_fee.toFixed(2)}</td>
              <td className="text-success fw-bold">
                ${bet.total_amount_bet.toLocaleString()}
              </td>
              <td>{bet.entries}</td>
              <td>{bet.bet_start}</td>
              <td>
                <Button variant="success" size="sm">
                  ENTER
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default BetListTable;
