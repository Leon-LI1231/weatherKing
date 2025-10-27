import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import CitySelector from "./CitySelector";
import BetListTable from "./BetListTable";
import "bootstrap/dist/css/bootstrap.min.css";
import UserInfoHeader from "./UserInfoHeader";
import BetFilters from "./BetFilters";

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

  // For filter
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [minFee, setMinFee] = useState("Free");
  const [maxFee, setMaxFee] = useState("100");

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

  const filteredBets = (betsByCity[selectedCity] || [])
    .filter((bet) =>
      bet.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((bet) =>
      selectedType === "All" ? true : bet.bet_type.toUpperCase() === selectedType
    )
    .filter((bet) => {
      const min = minFee === "Free" ? 0 : parseFloat(minFee);
      const max = maxFee === "Free" ? 0 : parseFloat(maxFee);
      return bet.entry_fee >= min && bet.entry_fee <= max;
    });

  

  return (
    <Container style={{ marginTop: "140px", textAlign: "center" }}>
      

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

      {/* ===== Bets Table and Filter ===== */}
      {selectedCity ? (
        <Row>
          {/* Filter */}
          <Col md={3}>
            <BetFilters
              search={search}
              setSearch={setSearch}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              minFee={minFee}
              setMinFee={setMinFee}
              maxFee={maxFee}
              setMaxFee={setMaxFee}
            />
          </Col>

          {/* Bets Table */}
          <Col md={9}>
            <h4 className="mb-3 text-center">
              Bets in {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}
            </h4>
            <BetListTable bets={filteredBets} />
          </Col>
        </Row>
      ) : (
        <Row>
          <Col className="text-center">
            <p className="text-muted">Select a city to view available bets.</p>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default LandingPage;
