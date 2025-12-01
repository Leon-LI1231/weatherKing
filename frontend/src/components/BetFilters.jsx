import React from "react";
import { Form, Button } from "react-bootstrap";
import { formatBetType } from "../utils/betTypeFormatter";

/**
 * =======================================================
 *                    BET FILTERS COMPONENT
 * =======================================================
 *
 * This component provides search and filtering controls for the list of bets.
 * It allows users to:
 *   - Search bets by contest title
 *   - Filter by contest type (dynamically based on available types)
 *   - Filter by entry fee range (Free, 1, 2, 3, 5, 10, 20, 40, 60, 100)
 *
 * All filters are handled client-side for responsiveness and simplicity.
 * In the future, backend-side filtering can be implemented if the dataset grows large.
 *
 * Props:
 *   - search: current search text
 *   - setSearch: function to update search input
 *   - selectedType: currently selected contest type
 *   - setSelectedType: function to update contest type
 *   - minFee: minimum entry fee filter
 *   - setMinFee: function to update minimum fee
 *   - maxFee: maximum entry fee filter
 *   - setMaxFee: function to update maximum fee
 *   - availableBetTypes: array of available bet types for this city
 */

function BetFilters({
  search,
  setSearch,
  selectedType,
  setSelectedType,
  minFee,
  setMinFee,
  maxFee,
  setMaxFee,
  availableBetTypes,
}) {
  const betTypes = availableBetTypes || ["All"];
  // Replace entry fee filtering with odds filtering (American moneyline)
  const oddsOptions = [
    "Any",
    -500,
    -300,
    -200,
    -150,
    -120,
    -110,
    -105,
    -100,
    100,
    120,
    150,
    200,
    300,
    500,
  ];

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        color: "black",
        padding: "15px",
        borderRadius: "10px",
        height: "100%",
      }}
    >
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search Contests"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Odds</Form.Label>
        <div style={{ display: "flex", gap: "10px" }}>
          <Form.Select value={minFee} onChange={(e) => setMinFee(e.target.value)}>
            {oddsOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Form.Select>
          <span style={{ alignSelf: "center" }}>to</span>
          <Form.Select value={maxFee} onChange={(e) => setMaxFee(e.target.value)}>
            {oddsOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Form.Select>
        </div>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Contest Type</Form.Label>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {betTypes.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "warning" : "outline-secondary"}
              onClick={() => setSelectedType(type)}
              size="sm"
              style={{ fontWeight: selectedType === type ? "600" : "400" }}
            >
              {formatBetType(type)}
            </Button>
          ))}
        </div>
      </Form.Group>
    </div>
  );
}

export default BetFilters;
