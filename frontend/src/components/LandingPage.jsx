import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import CitySelector from "./CitySelector";
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

function LandingPage({ onNavigateToCity }) {
  return (
    <Container className="landing">
      <Row className="mb-5">
        <Col>
          <h1 className="hero-title">Welcome to WeatherKings!</h1>
          <p className="hero-sub">
            Bet on tomorrow&apos;s weather. Will it rain in London? Will Austin hit a new high? Pick
            a city, place your bet, climb the leaderboard.
          </p>
        </Col>
      </Row>

      <Row>
        <Col>
          <h3 className="section-title">Select a City</h3>
          <CitySelector selectedCity={null} onCityChange={onNavigateToCity} />
        </Col>
      </Row>
    </Container>
  );
}

export default LandingPage;
