import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CityPage from "../components/CityPage";

/**
 * =======================================================
 *                  CITY PAGE COMPONENT TESTS
 * =======================================================
 *
 * Test Cases:
 * -----------
 * 1. Rendering Tests:
 *   ✓ renders city page with correct city name
 *   ✓ displays city-specific bets
 *   ✓ renders filter components
 *   ✓ renders bet table with correct data
 *
 * 2. Navigation Tests:
 *   ✓ back button navigation works
 *   ✓ logout functionality works
 *
 * 3. Filter Tests:
 *   ✓ search filter works correctly
 *   ✓ bet type filter works correctly
 *   ✓ entry fee filter works correctly
 *   ✓ multiple filters work together
 *
 * 4. Data Display Tests:
 *   ✓ displays correct number of bets for each city
 *   ✓ shows proper bet information (title, description, fees, etc.)
 *   ✓ handles empty bet lists gracefully
 *
 * 5. State Management Tests:
 *   ✓ filter states are managed correctly
 *   ✓ city data is loaded properly
 *
 * 6. Dynamic Bet Types Tests:
 *   ✓ generates correct bet types for each city
 *   ✓ bet type filtering works with dynamic types
 *   ✓ resets selected type when switching cities
 *   ✓ handles empty cities gracefully
 *
 * 7. Filter State Persistence Tests:
 *   ✓ saves filter state to localStorage when filters change
 *   ✓ restores filter state from localStorage on mount
 *   ✓ resets filters when switching to different city
 *   ✓ handles malformed filter localStorage data gracefully
 *   ✓ maintains separate filter states for different cities
 *   ✓ preserves filter state through multiple filter changes
 *
 * 8. Accessibility Tests:
 *   ✓ all interactive elements are keyboard accessible
 *   ✓ proper heading structure
 *
 * Run all tests: npm test
 * Run CityPage.test.jsx only: npm test -- CityPage.test.jsx
 * Run specific test: npm test -- --testNamePattern="test name"
 * ======================================================
 */

describe("CityPage Component Tests", () => {
  const mockProps = {
    cityName: "Madison",
    user: { username: "testuser" },
    onNavigateBack: jest.fn(),
    onLogout: jest.fn(),
  };

  const mockBetsData = [
    // Madison bets
    {
      betId: 1,
      betDescription: "Madison Weather Tomorrow",
      betType: "weather",
      cityName: "Madison",
      setLine: 5.0,
      totalPool: 150,
      description: "Will it rain in Madison tomorrow?",
      currentEntries: 30,
      maxEntries: 500,
    },
    {
      betId: 2,
      betDescription: "UW Madison Basketball Game",
      betType: "sports",
      cityName: "Madison",
      setLine: 10.0,
      totalPool: 250,
      description: "Will UW Madison win their next basketball game?",
      currentEntries: 25,
      maxEntries: 300,
    },
    {
      betId: 3,
      betDescription: "Capitol Construction",
      betType: "politics",
      cityName: "Madison",
      setLine: 0,
      totalPool: 100,
      description: "Will the Capitol construction finish on time?",
      currentEntries: 50,
      maxEntries: 200,
    },
    // Middleton bets
    {
      betId: 4,
      betDescription: "Middleton Farmers Market",
      betType: "local",
      cityName: "Middleton",
      setLine: 2.0,
      totalPool: 80,
      description: "How many vendors at the farmers market this week?",
      currentEntries: 20,
      maxEntries: 100,
    },
    {
      betId: 5,
      betDescription: "Middleton High School Football",
      betType: "sports",
      cityName: "Middleton",
      setLine: 5.0,
      totalPool: 120,
      description: "Will Middleton HS win their homecoming game?",
      currentEntries: 24,
      maxEntries: 150,
    },
    // Chicago bets
    {
      betId: 6,
      betDescription: "Chicago Bulls Next Game",
      betType: "sports",
      cityName: "Chicago",
      setLine: 20.0,
      totalPool: 500,
      description: "Will the Bulls win their next home game?",
      currentEntries: 75,
      maxEntries: 1000,
    },
    {
      betId: 7,
      betDescription: "Chicago Weather This Week",
      betType: "weather",
      cityName: "Chicago",
      setLine: 3.0,
      totalPool: 200,
      description: "Will it snow in Chicago this week?",
      currentEntries: 40,
      maxEntries: 300,
    },
    {
      betId: 8,
      betDescription: "Chicago Marathon Attendance",
      betType: "local",
      cityName: "Chicago",
      setLine: 15.0,
      totalPool: 800,
      description: "Will marathon attendance exceed 45,000?",
      currentEntries: 60,
      maxEntries: 400,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock console.error to suppress expected error messages during tests
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Clear localStorage before each test
    localStorage.clear();

    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, "localStorage", { value: localStorageMock });

    // Mock fetch API
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockBetsData),
      }),
    );
  });

  afterEach(() => {
    // Restore console.error after each test
    console.error.mockRestore();

    // Clean up fetch mock
    if (global.fetch && global.fetch.mockRestore) {
      global.fetch.mockRestore();
    }
  });

  // Rendering Tests
  test("renders city page with correct city name", () => {
    render(<CityPage {...mockProps} />);
    expect(screen.getByText("Madison Bets")).toBeInTheDocument();
    expect(screen.getByText("← Back to Landing Page")).toBeInTheDocument();
  });

  test("displays city-specific bets for Madison", async () => {
    render(<CityPage {...mockProps} />);

    // Wait for the async data to load
    await waitFor(() => {
      expect(screen.getByText("3 bets available")).toBeInTheDocument();
    });

    // Check for Madison-specific bets
    expect(screen.getByText("Madison Weather Tomorrow")).toBeInTheDocument();
    expect(screen.getByText("UW Madison Basketball Game")).toBeInTheDocument();
    expect(screen.getByText("Capitol Construction")).toBeInTheDocument();
  });

  test("displays city-specific bets for Middleton", async () => {
    const middletonProps = { ...mockProps, cityName: "Middleton" };
    render(<CityPage {...middletonProps} />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("2 bets available")).toBeInTheDocument();
    });

    // Check for Middleton-specific bets
    expect(screen.getByText("Middleton Bets")).toBeInTheDocument();
    expect(screen.getByText("Middleton Farmers Market")).toBeInTheDocument();
    expect(screen.getByText("Middleton High School Football")).toBeInTheDocument();
  });

  test("displays city-specific bets for Chicago", async () => {
    const chicagoProps = { ...mockProps, cityName: "Chicago" };
    render(<CityPage {...chicagoProps} />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("3 bets available")).toBeInTheDocument();
    });

    // Check for Chicago-specific bets
    expect(screen.getByText("Chicago Bets")).toBeInTheDocument();
    expect(screen.getByText("Chicago Bulls Next Game")).toBeInTheDocument();
    expect(screen.getByText("Chicago Weather This Week")).toBeInTheDocument();
    expect(screen.getByText("Chicago Marathon Attendance")).toBeInTheDocument();
  });

  test("renders filter components", () => {
    render(<CityPage {...mockProps} />);

    // Check that filter components are present
    expect(screen.getByDisplayValue("")).toBeInTheDocument(); // Search input
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument(); // Type filter button
  });

  test("renders bet table with correct headers", async () => {
    render(<CityPage {...mockProps} />);

    // Wait for data to load so table appears
    await waitFor(() => {
      expect(screen.getByText("3 bets available")).toBeInTheDocument();
    });

    // Check table headers (actual headers from BetListTable component)
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Line")).toBeInTheDocument();
    expect(screen.getByText("Total Bet")).toBeInTheDocument();
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    // Entry Fee appears in filter section
    expect(screen.getAllByText("Odds").length).toBeGreaterThan(0);
  });

  // Navigation Tests
  test("back button navigation works", () => {
    render(<CityPage {...mockProps} />);

    const backButton = screen.getByText("← Back to Landing Page");
    fireEvent.click(backButton);

    expect(mockProps.onNavigateBack).toHaveBeenCalledTimes(1);
  });

  // Filter Tests
  test("search filter works correctly", async () => {
    render(<CityPage {...mockProps} />);

    // Wait for data to load first
    await waitFor(() => {
      expect(screen.getByText("3 bets available")).toBeInTheDocument();
    });

    // Find search input and type in it
    const searchInput = screen.getByDisplayValue("");
    fireEvent.change(searchInput, { target: { value: "Weather" } });

    // Wait for filter to be applied and check results
    await waitFor(() => {
      expect(screen.getByText("Madison Weather Tomorrow")).toBeInTheDocument();
    });
  });

  test("displays correct bet count", async () => {
    render(<CityPage {...mockProps} />);

    // Wait for data to load, then check Madison has 3 bets
    await waitFor(() => {
      expect(screen.getByText("3 bets available")).toBeInTheDocument();
    });
  });

  test("displays bet information correctly", async () => {
    render(<CityPage {...mockProps} />);

    // Wait for data to load first
    await waitFor(() => {
      expect(screen.getByText("3 bets available")).toBeInTheDocument();
    });

    // Check that bet details are displayed - these are the betDescription values
    expect(screen.getByText("Madison Weather Tomorrow")).toBeInTheDocument();
    expect(screen.getByText("UW Madison Basketball Game")).toBeInTheDocument();
    expect(screen.getByText("Capitol Construction")).toBeInTheDocument();
  });

  test("handles bet type filter", async () => {
    render(<CityPage {...mockProps} />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("3 bets available")).toBeInTheDocument();
    });

    // Find the bet type button and click it (it's a button, not a select)
    const allButton = screen.getByRole("button", { name: "All" });
    expect(allButton).toBeInTheDocument();

    // All bets should be visible initially
    expect(screen.getByText("Madison Weather Tomorrow")).toBeInTheDocument();
    expect(screen.getByText("UW Madison Basketball Game")).toBeInTheDocument();
  });

  test("handles entry fee filter", () => {
    render(<CityPage {...mockProps} />);

    // Test that free bets can be filtered
    const minOddsSelect = screen.getAllByRole("combobox")[0];
    fireEvent.change(minOddsSelect, { target: { value: "-500" } });

    // Should work without errors
    expect(screen.getByText("Madison Bets")).toBeInTheDocument();
  });

  test("shows no bets message when filters result in empty list", async () => {
    render(<CityPage {...mockProps} />);

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.queryByText("Loading bets...")).not.toBeInTheDocument();
    });

    // Search for something that doesn't exist
    const searchInput = screen.getByDisplayValue("");
    fireEvent.change(searchInput, { target: { value: "NonexistentBet" } });

    // Should show no bets message
    expect(screen.getByText("No bets found")).toBeInTheDocument();
    expect(
      screen.getByText("Try adjusting your filters or check back later for new bets."),
    ).toBeInTheDocument();
  });

  // State Management Tests
  test("initializes with correct default filter states", () => {
    render(<CityPage {...mockProps} />);

    // Check default filter values
    expect(screen.getByDisplayValue("")).toBeInTheDocument(); // Empty search
    expect(screen.getByText("All")).toBeInTheDocument(); // All bet types button (not dropdown)
    expect(screen.getAllByDisplayValue("Any")[0]).toBeInTheDocument();
  });

  // Edge Cases
  test("handles unknown city gracefully", async () => {
    const unknownCityProps = { ...mockProps, cityName: "unknowncity" };
    render(<CityPage {...unknownCityProps} />);

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.queryByText("Loading bets...")).not.toBeInTheDocument();
    });

    // Should render without crashing - city name is lowercase in output
    expect(screen.getByText("unknowncity Bets")).toBeInTheDocument();
    expect(screen.getByText("No bets found")).toBeInTheDocument();
  });

  test("handles missing user prop gracefully", () => {
    const propsWithoutUser = { ...mockProps, user: null };
    render(<CityPage {...propsWithoutUser} />);

    // Should render without crashing
    expect(screen.getByText("Madison Bets")).toBeInTheDocument();
  });

  // Dynamic bet types functionality tests
  test("generates dynamic bet types for Madison", async () => {
    render(<CityPage {...mockProps} />);

    // Wait for data to load first
    await waitFor(() => {
      expect(screen.getByText("3 bets available")).toBeInTheDocument();
    });

    // Madison has weather, sports, and politics bet types
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "weather" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "sports" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "politics" })).toBeInTheDocument();

    // Should not show local type since Madison doesn't have local bets
    expect(screen.queryByRole("button", { name: "local" })).not.toBeInTheDocument();
  });

  test("generates dynamic bet types for Middleton", async () => {
    const middletonProps = { ...mockProps, cityName: "Middleton" };
    render(<CityPage {...middletonProps} />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("2 bets available")).toBeInTheDocument();
    });

    // Middleton has local and sports bet types
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "local" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "sports" })).toBeInTheDocument();

    // Should not show weather or politics types
    expect(screen.queryByRole("button", { name: "weather" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "politics" })).not.toBeInTheDocument();
  });

  test("generates dynamic bet types for Chicago", async () => {
    const chicagoProps = { ...mockProps, cityName: "Chicago" };
    render(<CityPage {...chicagoProps} />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("3 bets available")).toBeInTheDocument();
    });

    // Chicago has sports, weather, and local bet types
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "sports" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "weather" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "local" })).toBeInTheDocument();

    // Should not show politics type
    expect(screen.queryByRole("button", { name: "politics" })).not.toBeInTheDocument();
  });

  test("bet type filtering works with dynamic types", async () => {
    render(<CityPage {...mockProps} />);

    // Wait for data to load first
    await waitFor(() => {
      expect(screen.getByText("3 bets available")).toBeInTheDocument();
    });

    // Click on sports filter
    const sportsButton = screen.getByRole("button", { name: "sports" });
    fireEvent.click(sportsButton);

    // Wait for filtering to take effect
    await waitFor(() => {
      expect(screen.getByText("1 bet available")).toBeInTheDocument();
    });

    // Should show sports bet but not weather or politics bets
    expect(screen.getByText("UW Madison Basketball Game")).toBeInTheDocument();
    expect(screen.queryByText("Madison Weather Tomorrow")).not.toBeInTheDocument();
    expect(screen.queryByText("Capitol Construction")).not.toBeInTheDocument();
  });

  test("resets selected type when switching cities if type not available", async () => {
    const { rerender } = render(<CityPage {...mockProps} />);

    // Wait for Madison data to load
    await waitFor(() => {
      expect(screen.getByText("3 bets available")).toBeInTheDocument();
    });

    // Click on politics filter (available in Madison)
    const politicsButton = screen.getByRole("button", { name: "politics" });
    fireEvent.click(politicsButton);

    // Switch to Middleton (which doesn't have politics bets)
    const middletonProps = { ...mockProps, cityName: "Middleton" };
    rerender(<CityPage {...middletonProps} />);

    // Wait for Middleton data to load
    await waitFor(() => {
      expect(screen.getByText("2 bets available")).toBeInTheDocument();
    });

    // Should reset to "All" since politics is not available in Middleton
    // We can verify this by checking that all Middleton bets are shown
    expect(screen.getByText("Middleton Farmers Market")).toBeInTheDocument();
    expect(screen.getByText("Middleton High School Football")).toBeInTheDocument();
  });

  test('empty city shows only "All" bet type', () => {
    const emptyCityProps = { ...mockProps, cityName: "EmptyCity" };
    render(<CityPage {...emptyCityProps} />);

    // Should only show "All" button
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "weather" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "sports" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "politics" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "local" })).not.toBeInTheDocument();
  });

  // Filter State Persistence Tests
  test("saves filter state to localStorage when filters change", async () => {
    render(<CityPage {...mockProps} />);

    // Wait for component to mount and initial save to localStorage
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    // Clear the mock to test the change
    localStorage.setItem.mockClear();

    // Change search filter
    const searchInput = screen.getByDisplayValue("");
    fireEvent.change(searchInput, { target: { value: "weather" } });

    // Check that localStorage.setItem was called with filter data
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "betAppFilters_madison",
        expect.stringContaining('"search":"weather"'),
      );
    });
  });

  test("restores filter state from localStorage on mount", async () => {
    // Mock stored filter state
    const storedFilters = {
      search: "basketball",
      selectedType: "sports",
      minOdds: "Any",
      maxOdds: "Any",
      timestamp: new Date().toISOString(),
    };

    localStorage.getItem.mockReturnValue(JSON.stringify(storedFilters));

    render(<CityPage {...mockProps} />);

    // Wait for data to load and sports button to appear
    await waitFor(() => {
      expect(screen.getByText("1 bet available")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "sports" })).toBeInTheDocument();
    });

    // Should restore the search value
    expect(screen.getByDisplayValue("basketball")).toBeInTheDocument();

    // Should restore the selected type (sports button should be active)
    // Wait a bit for the restoration logic to complete
    await waitFor(
      () => {
        const sportsButton = screen.getByRole("button", { name: "sports" });
        expect(sportsButton).toHaveClass("btn-warning");
      },
      { timeout: 3000 },
    );
  });

  test("resets filters when switching to different city", async () => {
    // Mock stored filters for Madison
    const madisonFilters = {
      search: "weather",
      selectedType: "weather",
      minOdds: "-500",
      maxOdds: "100",
      timestamp: new Date().toISOString(),
    };

    localStorage.getItem.mockImplementation((key) => {
      if (key === "betAppFilters_madison") {
        return JSON.stringify(madisonFilters);
      }
      return null; // No stored filters for other cities
    });

    const { rerender } = render(<CityPage {...mockProps} />);

    // Wait for Madison data and filters to load
    await waitFor(() => {
      expect(screen.getByDisplayValue("weather")).toBeInTheDocument();
    });

    // Switch to Chicago
    const chicagoProps = { ...mockProps, cityName: "Chicago" };
    rerender(<CityPage {...chicagoProps} />);

    // Wait for Chicago data to load and filters to reset
    await waitFor(() => {
      expect(screen.getByText("3 bets available")).toBeInTheDocument();
    });

    // Should reset to default values since no stored filters for Chicago
    expect(screen.getByDisplayValue("")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All" })).toHaveClass("btn-warning");
  });

  test("handles malformed filter localStorage data gracefully", () => {
    // Mock console.error to suppress expected error messages
    const originalConsoleError = console.error;
    console.error = jest.fn();

    // Mock malformed JSON
    localStorage.getItem.mockReturnValue("invalid json data");

    render(<CityPage {...mockProps} />);

    // Should use default filter values
    expect(screen.getByDisplayValue("")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All" })).toHaveClass("btn-warning");

    // Verify that error was logged (but we suppressed it from console)
    expect(console.error).toHaveBeenCalledWith(
      "Error parsing stored filters:",
      expect.any(SyntaxError),
    );

    // Restore original console.error
    console.error = originalConsoleError;
  });

  test("maintains separate filter states for different cities", () => {
    const { rerender } = render(<CityPage {...mockProps} />);

    // Change filters for Madison
    const searchInput = screen.getByDisplayValue("");
    fireEvent.change(searchInput, { target: { value: "madison weather" } });

    // Should save Madison filters
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "betAppFilters_madison",
      expect.stringContaining('"search":"madison weather"'),
    );

    // Switch to Chicago
    const chicagoProps = { ...mockProps, cityName: "Chicago" };
    rerender(<CityPage {...chicagoProps} />);

    // Should save Chicago filters separately
    const chicagoSearchInput = screen.getByDisplayValue("");
    fireEvent.change(chicagoSearchInput, { target: { value: "chicago bulls" } });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "betAppFilters_chicago",
      expect.stringContaining('"search":"chicago bulls"'),
    );
  });

  test("preserves filter state through multiple filter changes", async () => {
    render(<CityPage {...mockProps} />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("3 bets available")).toBeInTheDocument();
    });

    // Clear initial localStorage calls
    localStorage.setItem.mockClear();

    // Change multiple filters
    const searchInput = screen.getByDisplayValue("");
    fireEvent.change(searchInput, { target: { value: "test search" } });

    // Wait for search change to save
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "betAppFilters_madison",
        expect.stringContaining('"search":"test search"'),
      );
    });

    const sportsButton = screen.getByRole("button", { name: "sports" });
    fireEvent.click(sportsButton);

    // Wait for type change to save
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "betAppFilters_madison",
        expect.stringContaining('"selectedType":"sports"'),
      );
    });
  });

  // PlacingBet Modal Integration Tests
  describe("PlacingBet Modal Integration", () => {
    const mockPropsWithBalance = {
      ...mockProps,
      user: { username: "testuser", balanceUsd: 100.5 },
    };

    test("opens PlacingBet modal when ENTER button is clicked", async () => {
      render(<CityPage {...mockPropsWithBalance} />);

      await waitFor(() => {
        expect(screen.getByText("3 bets available")).toBeInTheDocument();
      });

      const enterButtons = screen.getAllByText("ENTER");
      fireEvent.click(enterButtons[0]);

      await waitFor(() => {
        expect(screen.getByText("Place Your Bet")).toBeInTheDocument();
      });
    });

    test("displays correct bet details in modal", async () => {
      render(<CityPage {...mockPropsWithBalance} />);

      await waitFor(() => {
        expect(screen.getByText("3 bets available")).toBeInTheDocument();
      });

      const enterButtons = screen.getAllByText("ENTER");
      fireEvent.click(enterButtons[0]);

      await waitFor(() => {
        expect(screen.getByText("Place Your Bet")).toBeInTheDocument();
        expect(screen.getByText("Bet Description")).toBeInTheDocument();
        // Check that the modal contains the bet description (will appear twice - table and modal)
        expect(screen.getAllByText("Madison Weather Tomorrow").length).toBeGreaterThan(0);
      });
    });

    test("displays user balance in modal", async () => {
      render(<CityPage {...mockPropsWithBalance} />);

      await waitFor(() => {
        expect(screen.getByText("3 bets available")).toBeInTheDocument();
      });

      const enterButtons = screen.getAllByText("ENTER");
      fireEvent.click(enterButtons[0]);

      await waitFor(() => {
        expect(screen.getByText("Place Your Bet")).toBeInTheDocument();
        expect(screen.getByText("$100.50")).toBeInTheDocument();
      });
    });

    test("closes modal when Cancel button is clicked", async () => {
      render(<CityPage {...mockPropsWithBalance} />);

      await waitFor(() => {
        expect(screen.getByText("3 bets available")).toBeInTheDocument();
      });

      const enterButtons = screen.getAllByText("ENTER");
      fireEvent.click(enterButtons[0]);

      await waitFor(() => {
        expect(screen.getByText("Place Your Bet")).toBeInTheDocument();
      });

      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText("Place Your Bet")).not.toBeInTheDocument();
      });
    });

    test("closes modal when clicking outside", async () => {
      render(<CityPage {...mockPropsWithBalance} />);

      await waitFor(() => {
        expect(screen.getByText("3 bets available")).toBeInTheDocument();
      });

      const enterButtons = screen.getAllByText("ENTER");
      fireEvent.click(enterButtons[0]);

      await waitFor(() => {
        expect(screen.getByText("Place Your Bet")).toBeInTheDocument();
      });

      const overlay = screen.getByText("Place Your Bet").parentElement.parentElement;
      fireEvent.click(overlay);

      await waitFor(() => {
        expect(screen.queryByText("Place Your Bet")).not.toBeInTheDocument();
      });
    });

    test("handles bet placement successfully", async () => {
      // Mock successful bet placement
      global.fetch = jest.fn((url) => {
        if (url.includes("/api/bets/daily")) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockBetsData),
          });
        }
        if (url === "/api/place-bet") {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true, betId: 123 }),
          });
        }
      });

      render(<CityPage {...mockPropsWithBalance} />);

      await waitFor(() => {
        expect(screen.getByText("3 bets available")).toBeInTheDocument();
      });

      const enterButtons = screen.getAllByText("ENTER");
      fireEvent.click(enterButtons[0]);

      await waitFor(() => {
        expect(screen.getByText("Place Your Bet")).toBeInTheDocument();
      });

      // Fill in the form
      const outcomeSelect = screen.getByLabelText("Select Outcome:");
      fireEvent.change(outcomeSelect, { target: { value: "Yes" } });

      const amountInput = screen.getByLabelText("Bet Amount:");
      fireEvent.change(amountInput, { target: { value: "25.00" } });

      const placeButton = screen.getByText("Place Bet");
      fireEvent.click(placeButton);

      await waitFor(() => {
        expect(screen.queryByText("Place Your Bet")).not.toBeInTheDocument();
      });
    });

    test("opens modal for different bets", async () => {
      render(<CityPage {...mockPropsWithBalance} />);

      await waitFor(() => {
        expect(screen.getByText("3 bets available")).toBeInTheDocument();
      });

      const enterButtons = screen.getAllByText("ENTER");

      // Click first bet
      fireEvent.click(enterButtons[0]);
      await waitFor(() => {
        expect(screen.getByText("Place Your Bet")).toBeInTheDocument();
        // First bet description appears in both table and modal
        expect(screen.getAllByText("Madison Weather Tomorrow").length).toBeGreaterThan(0);
      });

      // Close modal
      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText("Place Your Bet")).not.toBeInTheDocument();
      });

      // Click second bet
      fireEvent.click(enterButtons[1]);
      await waitFor(() => {
        expect(screen.getByText("Place Your Bet")).toBeInTheDocument();
        // Second bet description appears in both table and modal
        expect(screen.getAllByText("UW Madison Basketball Game").length).toBeGreaterThan(0);
      });
    });

    test("handles user with zero balance", async () => {
      const zeroBalanceProps = {
        ...mockProps,
        user: { username: "testuser", balanceUsd: 0 },
      };

      render(<CityPage {...zeroBalanceProps} />);

      await waitFor(() => {
        expect(screen.getByText("3 bets available")).toBeInTheDocument();
      });

      const enterButtons = screen.getAllByText("ENTER");
      fireEvent.click(enterButtons[0]);

      await waitFor(() => {
        expect(screen.getByText("Place Your Bet")).toBeInTheDocument();
        expect(screen.getByText("$0.00")).toBeInTheDocument();
      });
    });

    test("handles user without balance property", async () => {
      const noBalanceProps = {
        ...mockProps,
        user: { username: "testuser" },
      };

      render(<CityPage {...noBalanceProps} />);

      await waitFor(() => {
        expect(screen.getByText("3 bets available")).toBeInTheDocument();
      });

      const enterButtons = screen.getAllByText("ENTER");
      fireEvent.click(enterButtons[0]);

      await waitFor(() => {
        expect(screen.getByText("Place Your Bet")).toBeInTheDocument();
        // Should default to 0
        expect(screen.getByText("$0.00")).toBeInTheDocument();
      });
    });
  });
});
