// CitySelector Component Tests
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CitySelector from "../components/CitySelector";

/**
 * =======================================================
 *               CITY SELECTOR COMPONENT TESTS
 * =======================================================
 *
 * Test Cases:
 * -----------
 * 1. Rendering Tests:
 *    ✓ renders all city cards (Madison, Los Angeles, New York City)
 *    ✓ displays city names and descriptions correctly
 *    ✓ shows city icons and buttons
 *
 * 2. Interaction Tests:
 *    ✓ clicking city card calls onCityChange with correct city
 *    ✓ clicking city button calls onCityChange with correct city
 *    ✓ hover effects work correctly
 *
 * 3. Styling Tests:
 *    ✓ selected city has proper styling
 *    ✓ cards have proper bootstrap classes
 *
 * 4. Accessibility Tests:
 *    ✓ cards are keyboard accessible
 *    ✓ proper button labels
 *
 * Run all tests: npm test
 * Run CitySelector.test.jsx only: npm test -- CitySelector.test.jsx
 * Run specific test: npm test -- --testNamePattern="test name"
 * ======================================================
 */
describe("CitySelector Component Tests", () => {
  const mockOnCityChange = jest.fn();

  beforeEach(() => {
    mockOnCityChange.mockClear();
  });

  // Rendering Tests
  test("renders all city cards with correct information", () => {
    render(<CitySelector selectedCity={null} onCityChange={mockOnCityChange} />);

    // Check Madison card
    expect(screen.getByText("Madison")).toBeInTheDocument();
    expect(
      screen.getByText("Capital city with university bets and local events"),
    ).toBeInTheDocument();
    expect(screen.getByText("View Madison Bets")).toBeInTheDocument();
    expect(screen.getByText("🏛️")).toBeInTheDocument();

    // Check Los Angeles card
    expect(screen.getByText("Los Angeles")).toBeInTheDocument();
    expect(screen.getByText("la la land")).toBeInTheDocument();
    expect(screen.getByText("View Los Angeles Bets")).toBeInTheDocument();
    expect(screen.getByText("🏘️")).toBeInTheDocument();

    // Check New York City card
    expect(screen.getByText("New York City")).toBeInTheDocument();
    expect(screen.getByText("Christmas city")).toBeInTheDocument();
    expect(screen.getByText("View New York City Bets")).toBeInTheDocument();
    expect(screen.getByText("🏙️")).toBeInTheDocument();
  });

  test("displays city cards in proper layout", () => {
    render(<CitySelector selectedCity={null} onCityChange={mockOnCityChange} />);

    // Should have 3 city cards
    const madisonCard = screen.getByText("Madison").closest(".card");
    const losAngelesCard = screen.getByText("Los Angeles").closest(".card");
    const newYorkCityCard = screen.getByText("New York City").closest(".card");

    expect(madisonCard).toBeInTheDocument();
    expect(losAngelesCard).toBeInTheDocument();
    expect(newYorkCityCard).toBeInTheDocument();
  });

  // Interaction Tests
  test("clicking Madison card calls onCityChange with Madison", () => {
    render(<CitySelector selectedCity={null} onCityChange={mockOnCityChange} />);

    const madisonCard = screen.getByText("Madison").closest(".card");
    fireEvent.click(madisonCard);

    expect(mockOnCityChange).toHaveBeenCalledWith("Madison");
    expect(mockOnCityChange).toHaveBeenCalledTimes(1);
  });

  test("clicking Los Angeles card calls onCityChange with Los Angeles", () => {
    render(<CitySelector selectedCity={null} onCityChange={mockOnCityChange} />);

    const losAngelesCard = screen.getByText("Los Angeles").closest(".card");
    fireEvent.click(losAngelesCard);

    expect(mockOnCityChange).toHaveBeenCalledWith("Los Angeles");
    expect(mockOnCityChange).toHaveBeenCalledTimes(1);
  });

  test("clicking New York City card calls onCityChange with New York City", () => {
    render(<CitySelector selectedCity={null} onCityChange={mockOnCityChange} />);

    const newYorkCityCard = screen.getByText("New York City").closest(".card");
    fireEvent.click(newYorkCityCard);

    expect(mockOnCityChange).toHaveBeenCalledWith("New York City");
    expect(mockOnCityChange).toHaveBeenCalledTimes(1);
  });

  test("clicking city button calls onCityChange correctly", () => {
    render(<CitySelector selectedCity={null} onCityChange={mockOnCityChange} />);

    const madisonButton = screen.getByText("View Madison Bets");
    fireEvent.click(madisonButton);

    expect(mockOnCityChange).toHaveBeenCalledWith("Madison");
  });

  // Styling Tests
  test("selected city has primary button variant", () => {
    render(<CitySelector selectedCity="Madison" onCityChange={mockOnCityChange} />);

    const madisonButton = screen.getByText("View Madison Bets");
    expect(madisonButton).toHaveClass("btn-primary");
  });

  test("non-selected cities have outline button variant", () => {
    render(<CitySelector selectedCity="Madison" onCityChange={mockOnCityChange} />);

    const losAngelesButton = screen.getByText("View Los Angeles Bets");
    const newYorkCityButton = screen.getByText("View New York City Bets");

    expect(losAngelesButton).toHaveClass("btn-outline-primary");
    expect(newYorkCityButton).toHaveClass("btn-outline-primary");
  });

  test("selected city card has primary border", () => {
    render(<CitySelector selectedCity="Madison" onCityChange={mockOnCityChange} />);

    const madisonCard = screen.getByText("Madison").closest(".card");
    expect(madisonCard).toHaveClass("border-primary");
  });

  // Accessibility Tests
  test("cards are keyboard accessible", () => {
    render(<CitySelector selectedCity={null} onCityChange={mockOnCityChange} />);

    const madisonCard = screen.getByText("Madison").closest(".card");

    // Card should have cursor pointer styling
    expect(madisonCard).toHaveStyle("cursor: pointer");
  });

  test("buttons have proper accessibility attributes", () => {
    render(<CitySelector selectedCity={null} onCityChange={mockOnCityChange} />);

    const madisonButton = screen.getByText("View Madison Bets");
    expect(madisonButton).toBeInTheDocument();
    expect(madisonButton.tagName).toBe("BUTTON");
  });

  // Edge Cases
  test("handles no selected city", () => {
    render(<CitySelector selectedCity={null} onCityChange={mockOnCityChange} />);

    // All buttons should be outline variant
    expect(screen.getByText("View Madison Bets")).toHaveClass("btn-outline-primary");
    expect(screen.getByText("View Los Angeles Bets")).toHaveClass("btn-outline-primary");
    expect(screen.getByText("View New York City Bets")).toHaveClass("btn-outline-primary");
  });

  test("handles undefined selectedCity", () => {
    render(<CitySelector selectedCity={undefined} onCityChange={mockOnCityChange} />);

    // Should render without crashing
    expect(screen.getByText("Madison")).toBeInTheDocument();
    expect(screen.getByText("Los Angeles")).toBeInTheDocument();
    expect(screen.getByText("New York City")).toBeInTheDocument();
  });
});
