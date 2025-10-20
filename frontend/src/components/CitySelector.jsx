import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";

/**
 * =======================================================
 *                    CITY SELECTOR COMPONENT
 * =======================================================
 *
 * This component renders a group of city selection buttons.
 * When a user selects a city, it triggers the callback provided
 * by the parent (LandingPage) to update the currently selected city.
 *
 * Props:
 *   - cities: Array of city objects [{ id, name }]
 *   - onSelect: Callback function to handle city selection
 *   - selectedCity: ID of the currently selected city
 */

function CitySelector({ cities, onSelect, selectedCity }) {
  return (
    <ButtonGroup>
      {cities.map((city) => (
        <Button
          key={city.id}
          variant={selectedCity === city.id ? "primary" : "outline-primary"}
          onClick={() => onSelect(city.id)}
        >
          {city.name}
        </Button>
      ))}
    </ButtonGroup>
  );
}

export default CitySelector;
