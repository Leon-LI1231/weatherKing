import React from "react";
import { Row, Col } from "react-bootstrap";
import { CITIES } from "../cities";

/**
 * Grid of city cards. Clicking a card selects that city.
 *
 * Props:
 *   - selectedCity: id of the currently selected city (highlighted)
 *   - onCityChange: callback invoked with the city id when a card is clicked
 */
function CitySelector({ selectedCity, onCityChange }) {
  return (
    <div className="city-selector">
      <Row className="g-4">
        {CITIES.map((city) => (
          <Col xs={12} sm={6} lg={3} key={city.id}>
            <button
              type="button"
              className={`city-card ${selectedCity === city.id ? "selected" : ""}`}
              onClick={() => onCityChange(city.id)}
            >
              <span className="city-icon">{city.icon}</span>
              <span className="city-name">{city.name}</span>
              <span className="city-region">{city.region}</span>
              <span className="city-blurb">{city.blurb}</span>
              <span className="city-cta">View {city.name} Bets</span>
            </button>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default CitySelector;
