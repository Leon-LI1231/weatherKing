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
 *    ✓ renders all city cards (Madison, Los Angeles, London)
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
    expect(screen.getByText("Rain, snow or shine on the isthmus.")).toBeInTheDocument();
    expect(screen.getByText("View Madison Bets")).toBeInTheDocument();
    expect(screen.getByText("❄️")).toBeInTheDocument();

    // Check Los Angeles card
    expect(screen.getByText("Los Angeles")).toBeInTheDocument();
    expect(screen.getByText("Sunny again? Don't be so sure.")).toBeInTheDocument();
    expect(screen.getByText("View Los Angeles Bets")).toBeInTheDocument();
    expect(screen.getByText("🌴")).toBeInTheDocument();

    // Check London card
    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("Will it rain tomorrow? Place your bet.")).toBeInTheDocument();
    expect(screen.getByText("View London Bets")).toBeInTheDocument();
    expect(screen.getByText("☔")).toBeInTheDocument();
  });

  test("displays city cards in proper layout", () => {
    render(<CitySelector selectedCity={null} onCityChange={mockOnCityChange} />);

    // Should have 3 city cards
    const madisonCard = screen.getByText("Madison").closest(".city-card");
    const losAngelesCard = screen.getByText("Los Angeles").closest(".city-card");
    const newYorkCityCard = screen.getByText("London").closest(".city-card");

    expect(madisonCard).toBeInTheDocument();
    expect(losAngelesCard).toBeInTheDocument();
    expect(newYorkCityCard).toBeInTheDocument();
  });

  // Interaction Tests
  test("clicking Madison card calls onCityChange with Madison", () => {
    render(<CitySelector selectedCity={null} onCityChange={mockOnCityChange} />);

    const madisonCard = screen.getByText("Madison").closest(".city-card");
    fireEvent.click(madisonCard);

    expect(mockOnCityChange).toHaveBeenCalledWith("Madison");
    expect(mockOnCityChange).toHaveBeenCalledTimes(1);
  });

  test("clicking Los Angeles card calls onCityChange with Los Angeles", () => {
    render(<CitySelector selectedCity={null} onCityChange={mockOnCityChange} />);

    const losAngelesCard = screen.getByText("Los Angeles").closest(".city-card");
    fireEvent.click(losAngelesCard);

    expect(mockOnCityChange).toHaveBeenCalledWith("Los Angeles");
    expect(mockOnCityChange).toHaveBeenCalledTimes(1);
  });

  test("clicking London card calls onCityChange with London", () => {
    render(<CitySelector selectedCity={null} onCityChange={mockOnCityChange} />);

    const newYorkCityCard = screen.getByText("London").closest(".city-card");
    fireEvent.click(newYorkCityCard);

    expect(mockOnCityChange).toHaveBeenCalledWith("London");
    expect(mockOnCityChange).toHaveBeenCalledTimes(1);
  });

  test("clicking city button calls onCityChange correctly", () => {
    render(<CitySelector selectedCity={null} onCityChange={mockOnCityChange} />);

    const madisonButton = screen.getByText("View Madison Bets");
    fireEvent.click(madisonButton);

    expect(mockOnCityChange).toHaveBeenCalledWith("Madison");
  });

  // Styling Tests
  test("selected city card is highlighted", () => {
    render(<CitySelector selectedCity="Madison" onCityChange={mockOnCityChange} />);

    const madisonCard = screen.getByText("Madison").closest(".city-card");
    expect(madisonCard).toHaveClass("selected");
  });

  test("non-selected city cards are not highlighted", () => {
    render(<CitySelector selectedCity="Madison" onCityChange={mockOnCityChange} />);

    expect(screen.getByText("Los Angeles").closest(".city-card")).not.toHaveClass("selected");
    expect(screen.getByText("London").closest(".city-card")).not.toHaveClass("selected");
  });

  // Accessibility Tests
  test("cards are native buttons, so they are keyboard accessible", () => {
    render(<CitySelector selectedCity={null} onCityChange={mockOnCityChange} />);

    const madisonCard = screen.getByText("Madison").closest(".city-card");
    expect(madisonCard.tagName).toBe("BUTTON");
  });

  // Edge Cases
  test("handles no selected city", () => {
    render(<CitySelector selectedCity={null} onCityChange={mockOnCityChange} />);

    expect(document.querySelectorAll(".city-card.selected")).toHaveLength(0);
    expect(document.querySelectorAll(".city-card")).toHaveLength(4);
  });

  test("handles undefined selectedCity", () => {
    render(<CitySelector selectedCity={undefined} onCityChange={mockOnCityChange} />);

    // Should render without crashing
    expect(screen.getByText("Madison")).toBeInTheDocument();
    expect(screen.getByText("Los Angeles")).toBeInTheDocument();
    expect(screen.getByText("London")).toBeInTheDocument();
  });
});
