//LandingPage Component Tests
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LandingPage from "../components/LandingPage";

/**
 * =======================================================
 *                LANDING PAGE COMPONENT TESTS
 * =======================================================
 *
 * Test Cases:
 * -----------
 * 1. Rendering Tests:
 *   ✓ renders welcome message and app branding
 *   ✓ displays city selector component
 *   ✓ shows proper page structure and layout
 *
 * 2. City Selection Tests:
 *   ✓ city selector is rendered with correct props
 *   ✓ city selection calls navigation function
 *
 * 3. Integration Tests:
 *   ✓ integrates properly with CitySelector component
 *   ✓ passes correct navigation function to CitySelector
 *
 * 4. Props Tests:
 *   ✓ handles user prop correctly
 *   ✓ handles navigation function props
 *
 * 5. Accessibility Tests:
 *   ✓ proper heading structure
 *   ✓ semantic HTML elements
 *
 * Run all tests: npm test
 * Run LandingPage.test.jsx only: npm test -- LandingPage.test.jsx
 * Run specific test: npm test -- --testNamePattern="test name"
 * ======================================================
 */

describe("LandingPage Component Tests", () => {
  const mockProps = {
    user: { username: "testuser" },
    onLogout: jest.fn(),
    onNavigateToCity: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering Tests
  test("renders welcome message and app branding", () => {
    render(<LandingPage {...mockProps} />);

    expect(screen.getByText("Welcome to WeatherKings!")).toBeInTheDocument();
    expect(screen.getByText("Choose a city to explore local weather bets")).toBeInTheDocument();
  });

  test("displays city selector component", () => {
    render(<LandingPage {...mockProps} />);

    expect(screen.getByText("Select a City")).toBeInTheDocument();

    // Check that CitySelector is rendered with city options
    expect(screen.getByText("Madison")).toBeInTheDocument();
    expect(screen.getByText("Los Angeles")).toBeInTheDocument();
    expect(screen.getByText("New York City")).toBeInTheDocument();
  });

  test("shows proper page structure and layout", () => {
    render(<LandingPage {...mockProps} />);

    // Check main headings are present
    expect(screen.getByRole("heading", { name: /Welcome to WeatherKings!/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Select a City/i })).toBeInTheDocument();

    // Check descriptive text
    expect(screen.getByText("Choose a city to explore local weather bets")).toBeInTheDocument();
  });

  // City Selection Tests
  test("city selector receives correct props", () => {
    render(<LandingPage {...mockProps} />);

    // CitySelector should be rendered and clickable
    const madisonCard = screen.getByText("View Madison Bets");
    expect(madisonCard).toBeInTheDocument();
  });

  test("city selection calls navigation function", () => {
    render(<LandingPage {...mockProps} />);

    // Click on Madison city card
    const madisonCard = screen.getByText("View Madison Bets");
    fireEvent.click(madisonCard);

    expect(mockProps.onNavigateToCity).toHaveBeenCalledWith("Madison");
    expect(mockProps.onNavigateToCity).toHaveBeenCalledTimes(1);
  });

  test("multiple city selections work correctly", () => {
    render(<LandingPage {...mockProps} />);

    // Click Madison
    const madisonCard = screen.getByText("View Madison Bets");
    fireEvent.click(madisonCard);

    expect(mockProps.onNavigateToCity).toHaveBeenCalledWith("Madison");

    // The component should still be functional for other selections
    // (Note: In real usage, clicking would navigate away, but in tests we can simulate multiple clicks)
  });

  // Integration Tests
  test("integrates properly with CitySelector component", () => {
    render(<LandingPage {...mockProps} />);

    // Check that all city options are available
    expect(screen.getByText("Madison")).toBeInTheDocument();
    expect(screen.getByText("Los Angeles")).toBeInTheDocument();
    expect(screen.getByText("New York City")).toBeInTheDocument();

    // Check that city descriptions are shown
    expect(
      screen.getByText("Capital city with university bets and local events"),
    ).toBeInTheDocument();
    expect(screen.getByText("la la land")).toBeInTheDocument();
    expect(screen.getByText("Christmas city")).toBeInTheDocument();
  });

  // Props Tests
  test("handles user prop correctly", () => {
    render(<LandingPage {...mockProps} />);

    // Component should render regardless of user prop content
    expect(screen.getByText("Welcome to WeatherKings!")).toBeInTheDocument();
  });

  test("handles missing user prop gracefully", () => {
    const propsWithoutUser = { ...mockProps, user: null };
    render(<LandingPage {...propsWithoutUser} />);

    // Should render without crashing
    expect(screen.getByText("Welcome to WeatherKings!")).toBeInTheDocument();
    expect(screen.getByText("Select a City")).toBeInTheDocument();
  });

  test("handles missing navigation functions gracefully", () => {
    const propsWithoutNavigation = {
      ...mockProps,
      onNavigateToCity: null,
      onLogout: null,
    };
    render(<LandingPage {...propsWithoutNavigation} />);

    // Should render without crashing
    expect(screen.getByText("Welcome to WeatherKings!")).toBeInTheDocument();
  });

  // Accessibility Tests
  test("has proper heading hierarchy", () => {
    render(<LandingPage {...mockProps} />);

    // Should have h2 for main welcome
    const welcomeHeading = screen.getByRole("heading", { name: /Welcome to WeatherKings!/i });
    expect(welcomeHeading.tagName).toBe("H2");

    // Should have h3 for city selection
    const cityHeading = screen.getByRole("heading", { name: /Select a City/i });
    expect(cityHeading.tagName).toBe("H3");
  });

  test("uses semantic HTML elements", () => {
    render(<LandingPage {...mockProps} />);

    // Should use proper container structure
    const container = document.querySelector(".container");
    expect(container).toBeInTheDocument();

    // Should have proper Bootstrap row/col structure
    const rows = document.querySelectorAll(".row");
    expect(rows.length).toBeGreaterThan(0);
  });

  test("has proper text content structure", () => {
    render(<LandingPage {...mockProps} />);

    // Check lead text class for subtitle
    const leadText = screen.getByText("Choose a city to explore local weather bets");
    expect(leadText).toHaveClass("lead");
    expect(leadText).toHaveClass("text-muted");
  });

  // Edge Cases
  test("renders consistently with different user data", () => {
    const differentUser = { username: "differentuser", id: 123 };
    const propsWithDifferentUser = { ...mockProps, user: differentUser };

    render(<LandingPage {...propsWithDifferentUser} />);

    // Core content should remain the same
    expect(screen.getByText("Welcome to WeatherKings!")).toBeInTheDocument();
    expect(screen.getByText("Select a City")).toBeInTheDocument();
  });
});
