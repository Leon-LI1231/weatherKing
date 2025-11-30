import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import BetListTable from "./BetListTable";
import BetFilters from "./BetFilters";
import PlacingBet from "./PlacingBet";
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * =======================================================
 *                    CITY PAGE COMPONENT
 * =======================================================
 *
 * This component creates a dedicated page for each city (Madison, New York, Los Angeles).
 * It displays:
 *   - The city name as a header
 *   - A list of available bets for that city
 *   - Filter functionality for the bets
 *   - Navigation drawer access
 *   - Back navigation to landing page
 *
 * Props:
 *   - cityName: String name of the city (e.g., "Madison", "New York", "Los Angeles")
 *   - user: User object containing user information
 *   - onNavigateBack: Function to navigate back to landing page
 *   - onLogout: Function to handle user logout
 */

function CityPage({ cityName, user, onNavigateBack }) {
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
  const [minFee, setMinFee] = useState("Any");
  const [maxFee, setMaxFee] = useState("Any");
  const [bets, setBets] = useState([]);
  const [filtersInitialized, setFiltersInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBet, setSelectedBet] = useState(null);

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
        timestamp: new Date().toISOString(),
      };
      saveFiltersToStorage(cityName, currentFilters);
    }
  }, [search, selectedType, minFee, maxFee, cityName]);

  useEffect(() => {
    const fetchBets = async () => {
      if (!cityName) return;

      setIsLoading(true);
      try {
        console.log("Fetching daily bets...");
        const response = await fetch("http://localhost:8080/api/bets/daily");
        if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
        const data = await response.json();

        // If no bets are returned, generate daily bets and retry
        if (data.length === 0) {
          console.log("No daily bets found, generating daily bets...");
          try {
            await fetch("http://localhost:8080/api/bets/generate-daily", {
              method: "POST",
            });

            console.log("Daily bets generated successfully, fetching updated bets...");

            // Retry fetching daily bets after generation
            const retryResponse = await fetch("http://localhost:8080/api/bets/daily");
            if (!retryResponse.ok) throw new Error(`HTTP error! ${retryResponse.status}`);
            const retryData = await retryResponse.json();

            console.log("Fetched updated bets:", retryData.length, "total bets");

            const cityBets = retryData.filter(
              (bet) =>
                bet.cityName &&
                cityName &&
                bet.cityName.toLowerCase().includes(cityName.toLowerCase()),
            );

            console.log("Filtered bets for", cityName + ":", cityBets.length, "bets");
            setBets(cityBets);
          } catch (generateError) {
            console.error("Failed to generate or fetch daily bets:", generateError);
            setBets([]); // Set empty array if generation fails
          }
        } else {
          console.log("Found existing daily bets:", data.length, "total bets");
          const cityBets = data.filter(
            (bet) =>
              bet.cityName &&
              cityName &&
              bet.cityName.toLowerCase().includes(cityName.toLowerCase()),
          );
          console.log("Filtered bets for", cityName + ":", cityBets.length, "bets");
          setBets(cityBets);
        }
      } catch (error) {
        console.error("Failed to fetch bets:", error);
        setBets([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (cityName) {
      // Reset filters when city changes and restore from localStorage
      const storedFilters = getStoredFilters(cityName);
      setSearch(storedFilters?.search || "");
      setSelectedType(storedFilters?.selectedType || "All");
      setMinFee(storedFilters?.minFee || "Any");
      setMaxFee(storedFilters?.maxFee || "Any");
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
      const min = minFee === "Any" ? -Infinity : parseFloat(minFee);
      const max = maxFee === "Any" ? Infinity : parseFloat(maxFee);
      const odds = parseFloat(b.moneylineOdds ?? 0);
      return odds >= min && odds <= max;
    });

  // Handle opening the bet modal
  const handleEnterBet = (bet) => {
    setSelectedBet(bet);
    setIsModalOpen(true);
  };

  // Handle closing the bet modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBet(null);
  };

  // Handle successful bet placement
  const handleBetPlaced = (result) => {
    console.log("Bet placed successfully:", result);
    // TODO: Update user balance and refresh bets list
    // You may want to call a callback to parent component to update user balance
  };

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
          {isLoading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading bets...</p>
            </div>
          ) : filteredBets.length > 0 ? (
            <BetListTable bets={filteredBets} onEnterBet={handleEnterBet} />
          ) : (
            <div className="text-center text-muted">
              <h5>No bets found</h5>
              <p>Try adjusting your filters or check back later for new bets.</p>
            </div>
          )}
        </Col>
      </Row>

      {/* PlacingBet Modal */}
      {selectedBet && (
        <PlacingBet
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          betDetails={selectedBet}
          onBetPlaced={handleBetPlaced}
          userBalance={user?.balanceUsd || 0}
        />
      )}
    </Container>
  );
}

export default CityPage;
