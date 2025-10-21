// CitySelector Component Tests
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CitySelector from '../components/CitySelector';

/**
 * =======================================================
 *               CITY SELECTOR COMPONENT TESTS
 * =======================================================
 * 
 * Test Cases:
 * -----------
 * 1. Rendering Tests:
 *    ✓ city selector renders with default cities
 * 
 * 2. Interaction Tests:
 *    ✓ selecting a city updates the selected city state
 * 
 * Run all tests: npm test
 * Run CitySelector.test.jsx only: npm test -- CitySelector.test.jsx
 * Run specific test: npm test -- --testNamePattern="test name"
 * ======================================================
 */
describe('CitySelector Component Tests', () => {
  // Mock data and functions
  const mockCities = [
    { id: 'new-york', name: 'New York' },
    { id: 'los-angeles', name: 'Los Angeles' },
    { id: 'chicago', name: 'Chicago' }
  ];
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  // Rendering Tests
  test('renders with default cities', () => {
    render(<CitySelector cities={mockCities} onSelect={mockOnSelect} selectedCity={null} />);
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('Los Angeles')).toBeInTheDocument();
    expect(screen.getByText('Chicago')).toBeInTheDocument();
  });

  // Interaction Tests
  test('updates selected city on change', () => {
    render(<CitySelector cities={mockCities} onSelect={mockOnSelect} selectedCity="new-york" />);
    fireEvent.click(screen.getByText('Chicago'));
    expect(mockOnSelect).toHaveBeenCalledWith('chicago');
  });
}); 