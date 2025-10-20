import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import CitySelector from "./CitySelector";
import BetListTable from "./BetListTable";
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * =======================================================
 *                    LANDING PAGE COMPONENT
 * =======================================================
 *
 * This component serves as the main dashboard for the app after user login.
 * It displays:
 *   - The user's username and account balance
 *   - A city selector to choose between different available bet markets
 *   - A dynamic bet list for the selected city
 *
 * The component manages all data fetching and state (mock data for now),
 * and passes down the relevant bet data to the BetListTable component.
 *
 * Future updates:
 *   - Replace mock data with live backend data (via /api/bets)
 *   - Add bet placement modal triggered by "ENTER" button
 */

function LandingPage({ user, onLogout }) {
  // Selected city
  const [selectedCity, setSelectedCity] = useState(null);

  // User balance
  const [userBalance, setUserBalance] = useState(0);

  // Bets fetched or mocked
  const [betsByCity, setBetsByCity] = useState({});

  // TODO: Replace with API call to fetch user balance
  useEffect(() => {
    setUserBalance(152.37);
  }, []);

  // TODO: Replace this mock with API call to fetch bets by city
  useEffect(() => {
    const mockData = {
      madison: [
        {
          id: 1,
          title: "Rain Prediction",
          bet_type: "a",
          set_line: null,
          entry_fee: 5.0,
          total_amount_bet: 340.5,
          entries: "33/500",
          bet_start: "Today 6:30p",
          description: "Will it rain today?",
        },
        {
          id: 2,
          title: "Temperature Max",
          bet_type: "b",
          set_line: 28.5,
          entry_fee: 10.0,
          total_amount_bet: 570.75,
          entries: "15/750",
          bet_start: "Today 7:00p",
          description: "Bet on today's highest temperature.",
        },
      ],
      middleton: [
        {
          id: 3,
          title: "Temperature Max",
          bet_type: "b",
          set_line: 27.0,
          entry_fee: 10.0,
          total_amount_bet: 210.0,
          entries: "42/600",
          bet_start: "Today 7:00p",
          description: "Bet on today's highest recorded temperature.",
        },
      ],
      chicago: [
        {
          id: 4,
          title: "Wind Prediction",
          bet_type: "c",
          set_line: 22.0,
          entry_fee: 8.0,
          total_amount_bet: 960.3,
          entries: "77/1200",
          bet_start: "Today 8:00p",
          description: "Guess the max wind speed for today.",
        },
      ],
    };
    setBetsByCity(mockData);
  }, []);

  return (
    <Container style={{ marginTop: "40px", textAlign: "center" }}>
      {/* ===== User Info Section ===== */}
      <Row className="mb-4">
        <Col>
          <h2>Welcome{user ? `, ${user.username}` : ""}!</h2>
          <p>
            <Badge bg="info" text="dark" style={{ fontSize: "1rem" }}>
               Balance: ${userBalance.toFixed(2)}
            </Badge>
          </p>
          <Button variant="outline-danger" onClick={onLogout}>
            Logout
          </Button>
        </Col>
      </Row>

      {/* ===== City Selector ===== */}
      <Row className="mb-4">
        <Col>
          <CitySelector
            cities={[
              { id: "madison", name: "Madison" },
              { id: "middleton", name: "Middleton" },
              { id: "chicago", name: "Chicago" },
            ]}
            onSelect={(cityId) => setSelectedCity(cityId)}
            selectedCity={selectedCity}
          />
        </Col>
      </Row>

      {/* ===== Bets Table ===== */}
      {selectedCity ? (
        <Row>
          <Col>
            <h4 className="mb-3">
              Bets in {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}
            </h4>
            <BetListTable bets={betsByCity[selectedCity] || []} />
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <p className="text-muted">Select a city to view available bets.</p>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default LandingPage;
