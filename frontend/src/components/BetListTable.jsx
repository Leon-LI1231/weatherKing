import React from "react";
import { Table, Button, Badge } from "react-bootstrap";
import { formatBetType } from "../utils/betTypeFormatter";
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
 *   - onEnterBet: Function to call when user clicks ENTER button on a bet
 */

function BetListTable({ bets, onEnterBet }) {
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
            <th>Description</th>
            <th>Type</th>
            <th>Line</th>
            <th>Odds</th>
            <th>Total Bet</th>
            <th>Start</th>
            <th>Close</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {bets.map((bet) => (
            <tr key={bet.betId}>
              <td>{bet.betDescription}</td>
              <td>
                <Badge bg="secondary">{formatBetType(bet.betType)}</Badge>
              </td>
              <td>{bet.setLine ?? "—"}</td>
              <td>{bet.moneylineOdds ?? "—"}</td>
              <td>${bet.totalAmountBet?.toLocaleString() ?? 0}</td>
              <td>{new Date(bet.betStart).toLocaleString()}</td>
              <td>{new Date(bet.betClose).toLocaleString()}</td>
              <td>
                <Button variant="success" size="sm" onClick={() => onEnterBet(bet)}>
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
