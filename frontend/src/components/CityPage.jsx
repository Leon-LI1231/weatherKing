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
  if (!cityName) {
    return (
      <div style={{ marginTop: "200px", textAlign: "center" }}>
        <h3>⚠️ No city selected</h3>
        <Button onClick={onNavigateBack} variant="outline-secondary">
          Back to Landing Page
        </Button>
      </div>
    );
  }

  // safely handle localStorage
  const getStoredFilters = (city) => {
    if (!city) return null;
    try {
      const key = `betAppFilters_${city.toLowerCase()}`;
      const storedFilters = localStorage.getItem(key);
      return storedFilters ? JSON.parse(storedFilters) : null;
    } catch (error) {
      console.error("Error parsing stored filters:", error);
      return null;
    }
  };

  const saveFiltersToStorage = (city, filters) => {
    if (!city) return;
    try {
      const key = `betAppFilters_${city.toLowerCase()}`;
      localStorage.setItem(key, JSON.stringify(filters));
    } catch (error) {
      console.error("Error saving filters:", error);
    }
  };

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [minFee, setMinFee] = useState("Free");
  const [maxFee, setMaxFee] = useState("100");
  const [bets, setBets] = useState([]);
  const [filtersInitialized, setFiltersInitialized] = useState(false);

  // dynamic types
  const availableBetTypes = ["All", ...new Set(bets.map((b) => b.betType))];

  // Save filter changes to localStorage
  useEffect(() => {
    if (cityName) {
      const currentFilters = {
        search,
        selectedType,
        minFee,
        maxFee,
        timestamp: new Date().toISOString()
      };
      saveFiltersToStorage(cityName, currentFilters);
    }
  }, [search, selectedType, minFee, maxFee, cityName]);

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/bets/daily");
        if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
        const data = await response.json();

        const cityBets = data.filter(
          (bet) =>
            bet.cityName &&
            cityName &&
            bet.cityName.toLowerCase().includes(cityName.toLowerCase())
        );
        setBets(cityBets);
      } catch (error) {
        console.error("Failed to fetch bets:", error);
      }
    };

    if (cityName) {
      // Reset filters when city changes and restore from localStorage
      const storedFilters = getStoredFilters(cityName);
      setSearch(storedFilters?.search || "");
      setSelectedType(storedFilters?.selectedType || "All");
      setMinFee(storedFilters?.minFee || "Free");
      setMaxFee(storedFilters?.maxFee || "100");
      setFiltersInitialized(true);
      
      fetchBets();
    }
  }, [cityName]);

  // Reset selected type if it's not available in current city, but only after filters are initialized
  useEffect(() => {
    if (filtersInitialized && bets.length > 0) {
      const availableTypes = ["All", ...new Set(bets.map((b) => b.betType))];
      if (!availableTypes.includes(selectedType)) {
        setSelectedType("All");
      }
    }
  }, [bets, selectedType, filtersInitialized]);

  // filter bets
  const filteredBets = bets
    .filter((b) => b.betDescription?.toLowerCase().includes(search.toLowerCase()))
    .filter((b) => (selectedType === "All" ? true : b.betType === selectedType))
    .filter((b) => {
      const min = minFee === "Free" ? 0 : parseFloat(minFee);
      const max = maxFee === "Free" ? 0 : parseFloat(maxFee);
      const fee = b.setLine ?? 0;
      return fee >= min && fee <= max;
    });

  return (
    <Container style={{ marginTop: "140px", textAlign: "center" }}>
      <Row className="mb-3">
        <Col>
          <Button variant="outline-secondary" onClick={onNavigateBack}>
            ← Back to Landing Page
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <h2>{cityName} Bets</h2>
          <p className="text-muted">
            {filteredBets.length} bet{filteredBets.length !== 1 ? "s" : ""} available
          </p>
        </Col>
      </Row>

      <Row>
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