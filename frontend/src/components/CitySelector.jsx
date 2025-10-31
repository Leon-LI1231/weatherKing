import React from "react";
import { Button, ButtonGroup, Card, Row, Col } from "react-bootstrap";

/**
 * =======================================================
 *                    CITY SELECTOR COMPONENT
 * =======================================================
 *
 * This component displays a selection interface for choosing a city.
 * It shows buttons for Madison, Middleton, and Chicago that navigate
 * to their respective city pages when clicked.
 *
 * Props:
 *   - selectedCity: Currently selected city (for styling purposes)
 *   - onCityChange: Callback function when a city is selected
 */

function CitySelector({ selectedCity, onCityChange }) {
  const cities = [
    {
      id: 'Madison',
      name: 'Madison',
      icon: '🏛️',
      description: 'Capital city with university bets and local events'
    },
    {
      id: 'Middleton',
      name: 'Middleton',
      icon: '🏘️',
      description: 'Community events and local school sports'
    },
    {
      id: 'Chicago',
      name: 'Chicago',
      icon: '🏙️',
      description: 'Major sports teams and city-wide events'
    }
  ];

  return (
    <div className="city-selector">
      <Row className="g-4">
        {cities.map((city) => (
          <Col md={4} key={city.id}>
            <Card 
              className={`h-100 city-card ${selectedCity === city.id ? 'border-primary' : ''}`}
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onClick={() => onCityChange(city.id)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Card.Body className="text-center d-flex flex-column">
                <div className="mb-3" style={{ fontSize: '3rem' }}>
                  {city.icon}
                </div>
                <Card.Title className="mb-3">{city.name}</Card.Title>
                <Card.Text className="flex-grow-1 text-muted">
                  {city.description}
                </Card.Text>
                <Button 
                  variant={selectedCity === city.id ? 'primary' : 'outline-primary'}
                  className="mt-auto"
                >
                  View {city.name} Bets
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default CitySelector;
