// BetHistory.jsx - Component to display user's bet history

import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * ===============================
 *        BetHistory Component
 * ===============================
 *
 * This component displays the user's bet history in a tabular format on the UserPage.
 * It fetches the bet data from the backend and populates the table with relevant details.
 * The table includes columns for Contest, City, Type, Odds, Outcome, Date, and Payout.
 * User can see all their past bets together or filtered by specific criteria such as city, contest, or Outcome.
 *
 * Props:
 *  - username: the username of the user whose bet history is to be displayed
 *  - filter: an optional filter object to filter bets by city, contest, or outcome
 *  - onAvailableOptionsChange: callback to pass available filter options to parent
 */

function BetHistory({ username, filter, onAvailableOptionsChange }) {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBetHistory = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/player-bets/history/${username}`);
        if (!response.ok) {
          throw new Error("Failed to fetch bet history");
        }
        const data = await response.json();

        // Transform the backend response to match the component's expected format
        const transformedBets = data.map((playerBet) => ({
          playerBetId: playerBet.playerBetId,
          contest: playerBet.bet.betDescription,
          city: playerBet.bet.cityName,
          type: playerBet.bet.betType,
          odds: playerBet.bet.moneylineOdds,
          outcome:
            playerBet.status === "WON" ? "Hit!" : playerBet.status === "LOST" ? "Miss!" : "Pending",
          date: playerBet.timePlaced,
          payout: playerBet.actualPayout || 0,
          betAmount: playerBet.betAmount,
          potentialPayout: playerBet.potentialPayout,
        }));

        setBets(transformedBets);

        // Extract unique values for filters
        if (onAvailableOptionsChange && transformedBets.length > 0) {
          const uniqueCities = [...new Set(transformedBets.map((bet) => bet.city))].sort();
          const uniqueTypes = [...new Set(transformedBets.map((bet) => bet.type))].sort();
          const uniqueOutcomes = [...new Set(transformedBets.map((bet) => bet.outcome))].sort();

          onAvailableOptionsChange({
            cities: uniqueCities,
            types: uniqueTypes,
            outcomes: uniqueOutcomes,
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBetHistory();
  }, [username, onAvailableOptionsChange]);

  // Apply filtering based on the filter prop (now supports multiple selections)
  const filteredBets = bets.filter((bet) => {
    // Filter by cities (if any cities are selected)
    if (filter.cities && filter.cities.length > 0) {
      if (!filter.cities.includes(bet.city)) {
        return false;
      }
    }
    // Filter by types (if any types are selected)
    if (filter.types && filter.types.length > 0) {
      if (!filter.types.includes(bet.type)) {
        return false;
      }
    }
    // Filter by outcomes (if any outcomes are selected)
    if (filter.outcomes && filter.outcomes.length > 0) {
      if (!filter.outcomes.includes(bet.outcome)) {
        return false;
      }
    }
    return true;
  });

  if (loading) {
    return <div>Loading bet history...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Table
      striped
      bordered
      hover
      style={{ backgroundColor: "#242424", color: "#e6e6e6", borderColor: "#444" }}
    >
      <thead style={{ backgroundColor: "#2c2c2c", color: "#e6e6e6" }}>
        <tr>
          <th>Contest</th>
          <th>City</th>
          <th>Type</th>
          <th>Odds</th>
          <th>Date</th>
          <th>Outcome</th>
          <th>Bet Amount</th>
          <th>Payout</th>
        </tr>
      </thead>
      <tbody>
        {filteredBets.map((bet, index) => (
          <tr key={index}>
            <td>{bet.contest}</td>
            <td>{bet.city}</td>
            <td>{bet.type}</td>
            <td>{bet.odds}</td>
            <td>{new Date(bet.date).toLocaleDateString()}</td>
            <td>
              <span
                style={{
                  backgroundColor:
                    bet.outcome === "Hit!"
                      ? "#28a745"
                      : bet.outcome === "Miss!"
                        ? "#dc3545"
                        : "transparent",
                  color: bet.outcome === "Hit!" || bet.outcome === "Miss!" ? "white" : "inherit",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  display: "inline-block",
                }}
              >
                {bet.outcome}
              </span>
            </td>
            <td>${bet.betAmount.toFixed(2)}</td>
            <td>${bet.payout.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default BetHistory;
