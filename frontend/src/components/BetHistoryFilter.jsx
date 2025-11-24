// BetHistoryFilter.jsx - Component to filter bet history

import React, { useState } from "react";
import { Tab, Tabs, Badge, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * =============================================
 *        BetHistoryFilter Component
 * =============================================
 *
 * This component provides a filter interface for the BetHistory component.
 * It allows users to filter their bet history by city, contest, or outcome
 * using tabs and multi-select badges that dynamically populate based on available data.
 * Users can select multiple filters within each category and across categories.
 *
 * Props:
 *  - onFilterChange: a callback function that is called when the filter changes
 *  - initialFilter: an optional initial filter object with arrays of selected values
 *  - availableOptions: object containing arrays of available cities, contests, and outcomes
 */

function BetHistoryFilter({ onFilterChange, initialFilter = {}, availableOptions = {} }) {
  const [selectedCities, setSelectedCities] = useState(initialFilter.cities || []);
  const [selectedContests, setSelectedContests] = useState(initialFilter.contests || []);
  const [selectedOutcomes, setSelectedOutcomes] = useState(initialFilter.outcomes || []);

  const { cities = [], contests = [], outcomes = [] } = availableOptions;

  React.useEffect(() => {
    onFilterChange({
      cities: selectedCities,
      contests: selectedContests,
      outcomes: selectedOutcomes,
    });
  }, [selectedCities, selectedContests, selectedOutcomes, onFilterChange]);

  const toggleSelection = (item, selectedArray, setSelectedArray) => {
    if (selectedArray.includes(item)) {
      setSelectedArray(selectedArray.filter((i) => i !== item));
    } else {
      setSelectedArray([...selectedArray, item]);
    }
  };

  const clearAll = () => {
    setSelectedCities([]);
    setSelectedContests([]);
    setSelectedOutcomes([]);
  };

  const hasActiveFilters =
    selectedCities.length > 0 || selectedContests.length > 0 || selectedOutcomes.length > 0;

  return (
    <div
      className="bet-history-filter"
      style={{ padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}
    >
      <style>
        {`
                    .bet-history-filter .nav-tabs {
                        display: flex !important;
                        justify-content: center !important;
                        border-bottom: none !important;
                    }
                    .bet-history-filter .nav-tabs .nav-item {
                        width: 150px !important;
                        margin: 0 10px !important;
                    }
                    .bet-history-filter .nav-tabs .nav-link {
                        background-color: #6c757d !important;
                        border: 1px solid #6c757d !important;
                        text-align: center !important;
                        width: 100% !important;
                        border-radius: 0.25rem !important;
                        color: white !important;
                    }
                    .bet-history-filter .nav-tabs .nav-link:hover {
                        background-color: #5cb85c !important;
                        border-color: #5cb85c !important;
                        color: white !important;
                    }
                    .bet-history-filter .nav-tabs .nav-link.active {
                        background-color: #28a745 !important;
                        border-color: #28a745 !important;
                        color: white !important;
                        font-weight: 600 !important;
                    }
                `}
      </style>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Filter Bets</h5>
        {hasActiveFilters && (
          <Button variant="outline-secondary" size="sm" onClick={clearAll}>
            Clear All
          </Button>
        )}
      </div>

      <Tabs
        defaultActiveKey="cities"
        className="mb-3"
        style={{
          "--bs-nav-link-color": "#495057",
          "--bs-nav-link-hover-color": "#0d6efd",
        }}
      >
        <Tab
          eventKey="cities"
          title={`Cities ${selectedCities.length > 0 ? `(${selectedCities.length})` : ""}`}
          tabClassName="custom-tab"
        >
          <div style={{ padding: "10px 0" }}>
            {cities.length === 0 ? (
              <p className="text-muted text-center">No cities available</p>
            ) : (
              <div
                style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}
              >
                {cities.map((city, index) => (
                  <Badge
                    key={index}
                    style={{
                      cursor: "pointer",
                      padding: "10px 16px",
                      fontSize: "0.9rem",
                      backgroundColor: selectedCities.includes(city) ? "#0d6efd" : "#6c9bd6",
                      border: "none",
                      minWidth: "100px",
                      textAlign: "center",
                      color: "white",
                    }}
                    onClick={() => toggleSelection(city, selectedCities, setSelectedCities)}
                  >
                    {city}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Tab>

        <Tab
          eventKey="contests"
          title={`Contests ${selectedContests.length > 0 ? `(${selectedContests.length})` : ""}`}
          tabClassName="custom-tab"
        >
          <div style={{ padding: "10px 0" }}>
            {contests.length === 0 ? (
              <p className="text-muted text-center">No contests available</p>
            ) : (
              <div
                style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}
              >
                {contests.map((contest, index) => (
                  <Badge
                    key={index}
                    style={{
                      cursor: "pointer",
                      padding: "10px 16px",
                      fontSize: "0.9rem",
                      backgroundColor: selectedContests.includes(contest) ? "#0d6efd" : "#6c9bd6",
                      border: "none",
                      minWidth: "100px",
                      textAlign: "center",
                      color: "white",
                    }}
                    onClick={() => toggleSelection(contest, selectedContests, setSelectedContests)}
                  >
                    {contest}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Tab>

        <Tab
          eventKey="outcomes"
          title={`Outcomes ${selectedOutcomes.length > 0 ? `(${selectedOutcomes.length})` : ""}`}
          tabClassName="custom-tab"
        >
          <div style={{ padding: "10px 0" }}>
            {outcomes.length === 0 ? (
              <p className="text-muted text-center">No outcomes available</p>
            ) : (
              <div
                style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}
              >
                {outcomes.map((outcome, index) => (
                  <Badge
                    key={index}
                    style={{
                      cursor: "pointer",
                      padding: "10px 16px",
                      fontSize: "0.9rem",
                      backgroundColor: selectedOutcomes.includes(outcome) ? "#0d6efd" : "#6c9bd6",
                      border: "none",
                      minWidth: "100px",
                      textAlign: "center",
                      color: "white",
                    }}
                    onClick={() => toggleSelection(outcome, selectedOutcomes, setSelectedOutcomes)}
                  >
                    {outcome}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default BetHistoryFilter;
