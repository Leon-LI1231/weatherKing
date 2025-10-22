//LandingPage Component Tests
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LandingPage from '../components/LandingPage';

/**
 * =======================================================
 *                LANDING PAGE COMPONENT TESTS
 * =======================================================
 * 
 * Test Cases:
 * -----------
 * 1. Rendering Tests:
 *    ✓ landing page renders correctly
 * 
 * 2. Navigation Tests:
 *   ✓ clicking "Logout" button navigates to Login component
 * 
 * Run all tests: npm test
 * Run LandingPage.test.jsx only: npm test -- LandingPage.test.jsx
 * Run specific test: npm test -- --testNamePattern="test name"
 * ======================================================
 */

describe('LandingPage', () => {
  // Mock data and functions
  const mockOnLogout = jest.fn();
  
  beforeEach(() => {
    mockOnLogout.mockClear();
  });
  
  // Rendering Tests
  test('renders landing page correctly', () => {
    render(<LandingPage onLogout={mockOnLogout} />);
    expect(screen.getByText('Welcome!')).toBeInTheDocument();
    expect(screen.getByText(/Balance: \$152\.37/)).toBeInTheDocument();
    expect(screen.getByText('Select a city to view available bets.')).toBeInTheDocument();
  });

  // Navigation Tests
  test('navigates to login page on button click', () => {
    render(<LandingPage onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    expect(mockOnLogout).toHaveBeenCalled();
  });
});
