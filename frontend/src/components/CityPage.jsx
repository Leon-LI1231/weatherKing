import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import BetListTable from "./BetListTable";
import BetFilters from "./BetFilters";
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * =======================================================
 *                    CITY PAGE COMPONENT
 * =======================================================
 *
 * This component creates a dedicated page for each city (Madison, Middleton, Chicago).
 * It displays:
 *   - The city name as a header
 *   - A list of available bets for that city
 *   - Filter functionality for the bets
 *   - Navigation drawer access
 *   - Back navigation to landing page
 *
 * Props:
 *   - cityName: String name of the city (e.g., "Madison", "Middleton", "Chicago")
 *   - user: User object containing user information
 *   - onNavigateBack: Function to navigate back to landing page
 *   - onLogout: Function to handle user logout
 */

function CityPage({ cityName, user, onNavigateBack, onLogout }) {
  // Helper functions for filter state persistence
  const getStoredFilters = (city) => {
    try {
      const key = `betAppFilters_${city.toLowerCase()}`;
      const storedFilters = localStorage.getItem(key);
      return storedFilters ? JSON.parse(storedFilters) : null;
    } catch (error) {
      console.error('Error parsing stored filters:', error);
      return null;
    }
  };

  const saveFiltersToStorage = (city, filters) => {
    try {
      const key = `betAppFilters_${city.toLowerCase()}`;
      localStorage.setItem(key, JSON.stringify(filters));
    } catch (error) {
      console.error('Error saving filters to localStorage:', error);
    }
  };

  // Initialize filter states from localStorage or defaults
  const storedFilters = getStoredFilters(cityName);
  const [search, setSearch] = useState(storedFilters?.search || "");
  const [selectedType, setSelectedType] = useState(storedFilters?.selectedType || "All");
  const [minFee, setMinFee] = useState(storedFilters?.minFee || "Free");
  const [maxFee, setMaxFee] = useState(storedFilters?.maxFee || "100");

  // Bets for this city
  const [bets, setBets] = useState([]);

  // Dynamic bet types based on available bets
  const availableBetTypes = ['All', ...new Set(bets.map(bet => bet.bet_type))];

  // Mock data for bets - TODO: Replace with API call
  useEffect(() => {
    const mockBetsByCity = {
      madison: [
        {
          id: 1,
          title: "Madison Weather Tomorrow",
          description: "Will it rain in Madison tomorrow?",
          bet_type: "weather",
          entry_fee: 5.0,
          total_amount_bet: 150.0,
          entries: "30/500",
          bet_start: "Today 6:30p",
        },
        {
          id: 2,
          title: "UW Madison Basketball Game",
          description: "Will UW Madison win their next basketball game?",
          bet_type: "sports",
          entry_fee: 10.0,
          total_amount_bet: 500.0,
          entries: "50/750",
          bet_start: "Nov 1 7:00p",
        },
        {
          id: 3,
          title: "Capitol Construction",
          description: "Will the Capitol construction finish on time?",
          bet_type: "politics",
          entry_fee: 0.0,
          total_amount_bet: 0.0,
          entries: "25/100",
          bet_start: "Dec 15 9:00a",
        },
      ],
      middleton: [
        {
          id: 4,
          title: "Middleton Farmers Market",
          description: "Will the farmers market have more than 20 vendors this Saturday?",
          bet_type: "local",
          entry_fee: 2.0,
          total_amount_bet: 80.0,
          entries: "40/200",
          bet_start: "Oct 30 8:00a",
        },
        {
          id: 5,
          title: "Middleton High School Football",
          description: "Will Middleton High win their homecoming game?",
          bet_type: "sports",
          entry_fee: 5.0,
          total_amount_bet: 200.0,
          entries: "40/300",
          bet_start: "Nov 5 7:00p",
        },
      ],
      chicago: [
        {
          id: 6,
          title: "Chicago Bulls Next Game",
          description: "Will the Chicago Bulls win their next game?",
          bet_type: "sports",
          entry_fee: 15.0,
          total_amount_bet: 1200.0,
          entries: "80/500",
          bet_start: "Nov 2 8:00p",
        },
        {
          id: 7,
          title: "Chicago Weather This Week",
          description: "Will Chicago have snow this week?",
          bet_type: "weather",
          entry_fee: 3.0,
          total_amount_bet: 300.0,
          entries: "100/1000",
          bet_start: "Nov 1 6:00a",
        },
        {
          id: 8,
          title: "Chicago Marathon Attendance",
          description: "Will the Chicago Marathon have over 40,000 participants?",
          bet_type: "local",
          entry_fee: 0.0,
          total_amount_bet: 0.0,
          entries: "60/200",
          bet_start: "Nov 10 7:00a",
        },
      ],
    };

    setBets(mockBetsByCity[cityName.toLowerCase()] || []);
  }, [cityName]);

  // Reset selected type if it's not available in current bet types
  useEffect(() => {
    if (selectedType !== "All" && !availableBetTypes.includes(selectedType)) {
      setSelectedType("All");
    }
  }, [availableBetTypes, selectedType, setSelectedType]);

  // Save filter states to localStorage when they change
  useEffect(() => {
    const filters = {
      search,
      selectedType,
      minFee,
      maxFee,
      timestamp: new Date().toISOString()
    };
    saveFiltersToStorage(cityName, filters);
  }, [search, selectedType, minFee, maxFee, cityName]);

  // Reset filters when city changes, but try to restore from storage first
  useEffect(() => {
    const storedFilters = getStoredFilters(cityName);
    if (storedFilters) {
      setSearch(storedFilters.search || "");
      setSelectedType(storedFilters.selectedType || "All");
      setMinFee(storedFilters.minFee || "Free");
      setMaxFee(storedFilters.maxFee || "100");
    } else {
      // Reset to defaults if no stored filters
      setSearch("");
      setSelectedType("All");
      setMinFee("Free");
      setMaxFee("100");
    }
  }, [cityName]);

  // Filter bets based on search and filters
  const filteredBets = bets
    .filter((bet) =>
      bet.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((bet) =>
      selectedType === "All" ? true : bet.bet_type === selectedType
    )
    .filter((bet) => {
      const min = minFee === "Free" ? 0 : parseFloat(minFee);
      const max = maxFee === "Free" ? 0 : parseFloat(maxFee);
      return bet.entry_fee >= min && bet.entry_fee <= max;
    });

  return (

      <Container style={{ marginTop: "140px", textAlign: "center" }}>
        {/* Back to Landing Page Button */}
        <Row className="mb-3">
          <Col>
            <Button
              variant="outline-secondary"
              onClick={onNavigateBack}
              className="mb-3"
            >
              ← Back to Landing Page
            </Button>
          </Col>
        </Row>

        {/* City Header */}
        <Row className="mb-4">
          <Col>
            <h2 className="text-center">
              {cityName.charAt(0).toUpperCase() + cityName.slice(1)} Bets
            </h2>
            <p className="text-muted">
              {filteredBets.length} bet{filteredBets.length !== 1 ? 's' : ''} available
            </p>
          </Col>
        </Row>

        {/* Bets Table and Filter */}
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
              availableBetTypes={availableBetTypes}
            />
          </Col>

          {/* Bets Table */}
          <Col md={9}>
            {filteredBets.length > 0 ? (
              <BetListTable bets={filteredBets} />
            ) : (
              <div className="text-center text-muted">
                <h5>No bets found</h5>
                <p>Try adjusting your filters or check back later for new bets.</p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
  );
}

export default CityPage;