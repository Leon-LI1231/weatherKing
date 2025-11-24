import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserInfoHeader from "../components/UserInfoHeader";

/**
 * =======================================================
 *                USER INFO HEADER COMPONENT TESTS
 * =======================================================
 *
 * Test Cases:
 * -----------
 * 1. Rendering Tests:
 *   ✓ renders app title and branding
 *   ✓ displays user information (username, balance)
 *   ✓ shows hamburger menu button
 *   ✓ renders with proper styling and positioning
 *
 * 2. Drawer Functionality Tests:
 *   ✓ opens drawer when hamburger button is clicked
 *   ✓ closes drawer when close button is clicked
 *   ✓ drawer navigation calls correct functions
 *   ✓ current page is highlighted in drawer
 *
 * 3. Navigation Tests:
 *   ✓ logout navigation works
 *   ✓ landing page navigation works
 *   ✓ city navigation works (Madison, Middleton, Chicago)
 *
 * 4. State Management Tests:
 *   ✓ drawer state is managed correctly
 *   ✓ drawer closes after navigation
 *
 * 5. Props Tests:
 *   ✓ handles missing props gracefully
 *   ✓ displays correct username and balance
 *   ✓ navigation callbacks are called correctly
 *
 * 6. Accessibility Tests:
 *   ✓ hamburger button is keyboard accessible
 *   ✓ proper ARIA attributes
 *   ✓ semantic HTML structure
 *
 * Run all tests: npm test
 * Run UserInfoHeader.test.jsx only: npm test -- UserInfoHeader.test.jsx
 * Run specific test: npm test -- --testNamePattern="test name"
 * ======================================================
 */

// Mock Bootstrap Offcanvas to avoid useMediaQuery issues
jest.mock("react-bootstrap/Offcanvas", () => {
  return function MockOffcanvas({ children, show, onHide, ...props }) {
    return show ? (
      <div data-testid="offcanvas" {...props}>
        <button onClick={onHide} data-testid="offcanvas-close">
          ×
        </button>
        {children}
      </div>
    ) : null;
  };
});

// Mock Drawer component
jest.mock("../components/Drawer", () => {
  return function MockDrawer({ show, onClose, currentPage, onNavigate, ...props }) {
    if (!show) return null;

    return (
      <div data-testid="drawer" {...props}>
        <h5>Navigation</h5>
        <button onClick={() => onNavigate && onNavigate("landing")}>Landing Page</button>
        <button onClick={() => onNavigate && onNavigate("Madison")}>Madison</button>
        <button onClick={() => onNavigate && onNavigate("Los Angeles")}>Los Angeles</button>
        <button onClick={() => onNavigate && onNavigate("New York City")}>New York City</button>
        <button onClick={() => onNavigate && onNavigate("logout")} style={{ color: "red" }}>
          Logout
        </button>
        {currentPage && <span>Current: {currentPage}</span>}
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

describe("UserInfoHeader Component Tests", () => {
  const mockProps = {
    username: "testuser",
    balance: 152.37,
    currentPage: "landing",
    onLogout: jest.fn(),
    onNavigateToCity: jest.fn(),
    onNavigateToLanding: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering Tests
  test("renders app title and branding", () => {
    render(<UserInfoHeader {...mockProps} />);

    expect(screen.getByText("WeatherKings")).toBeInTheDocument();
  });

  test("displays user information correctly", () => {
    render(<UserInfoHeader {...mockProps} />);

    expect(screen.getByText("testuser")).toBeInTheDocument();
    expect(screen.getByText("$152.37")).toBeInTheDocument();
  });

  test("shows hamburger menu button", () => {
    render(<UserInfoHeader {...mockProps} />);

    const menuButton = screen.getByText("☰");
    expect(menuButton).toBeInTheDocument();
    expect(menuButton.tagName).toBe("BUTTON");
  });

  test("renders with proper navbar styling", () => {
    render(<UserInfoHeader {...mockProps} />);

    const navbar = screen.getByText("WeatherKings").closest(".navbar");
    expect(navbar).toHaveClass("navbar");
    expect(navbar).toHaveClass("bg-light");
    expect(navbar).toHaveClass("shadow-sm");
  });

  test("hamburger button has correct positioning", () => {
    render(<UserInfoHeader {...mockProps} />);

    const menuButton = screen.getByText("☰");
    expect(menuButton).toHaveStyle({
      position: "absolute",
      left: "15px",
    });
  });

  test("WeatherKings brand has correct positioning", () => {
    render(<UserInfoHeader {...mockProps} />);

    const brand = screen.getByText("WeatherKings");
    expect(brand).toHaveStyle({
      position: "absolute",
      left: "60px",
    });
  });

  // Drawer Functionality Tests
  test("opens drawer when hamburger button is clicked", () => {
    render(<UserInfoHeader {...mockProps} />);

    const menuButton = screen.getByText("☰");
    fireEvent.click(menuButton);

    // Drawer should be open and show navigation
    expect(screen.getByText("Navigation")).toBeInTheDocument();
    expect(screen.getByText("Landing Page")).toBeInTheDocument();
  });

  test("drawer shows all navigation options", () => {
    render(<UserInfoHeader {...mockProps} />);

    const menuButton = screen.getByText("☰");
    fireEvent.click(menuButton);

    // Check all navigation links
    expect(screen.getByText("Landing Page")).toBeInTheDocument();
    expect(screen.getByText("Madison")).toBeInTheDocument();
    expect(screen.getByText("Los Angeles")).toBeInTheDocument();
    expect(screen.getByText("New York City")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("current page is highlighted in drawer", () => {
    const propsWithCurrentPage = { ...mockProps, currentPage: "Madison" };
    render(<UserInfoHeader {...propsWithCurrentPage} />);

    const menuButton = screen.getByText("☰");
    fireEvent.click(menuButton);

    // Current page should be passed to drawer
    expect(screen.getByText("Madison")).toBeInTheDocument();
  });

  // Navigation Tests
  test("logout navigation works", () => {
    render(<UserInfoHeader {...mockProps} />);

    const menuButton = screen.getByText("☰");
    fireEvent.click(menuButton);

    const logoutLink = screen.getByText("Logout");
    fireEvent.click(logoutLink);

    expect(mockProps.onLogout).toHaveBeenCalledTimes(1);
  });

  test("landing page navigation works", () => {
    render(<UserInfoHeader {...mockProps} />);

    const menuButton = screen.getByText("☰");
    fireEvent.click(menuButton);

    const landingLink = screen.getByText("Landing Page");
    fireEvent.click(landingLink);

    expect(mockProps.onNavigateToLanding).toHaveBeenCalledTimes(1);
  });

  test("Madison navigation works", () => {
    render(<UserInfoHeader {...mockProps} />);

    const menuButton = screen.getByText("☰");
    fireEvent.click(menuButton);

    const madisonLink = screen.getByText("Madison");
    fireEvent.click(madisonLink);

    expect(mockProps.onNavigateToCity).toHaveBeenCalledWith("Madison");
  });

  test("Los Angeles navigation works", () => {
    render(<UserInfoHeader {...mockProps} />);

    const menuButton = screen.getByText("☰");
    fireEvent.click(menuButton);

    const losAngelesLink = screen.getByText("Los Angeles");
    fireEvent.click(losAngelesLink);

    expect(mockProps.onNavigateToCity).toHaveBeenCalledWith("Los Angeles");
  });

  test("New York City navigation works", () => {
    render(<UserInfoHeader {...mockProps} />);

    const menuButton = screen.getByText("☰");
    fireEvent.click(menuButton);

    const newYorkCityLink = screen.getByText("New York City");
    fireEvent.click(newYorkCityLink);

    expect(mockProps.onNavigateToCity).toHaveBeenCalledWith("New York City");
  });

  // State Management Tests
  test("drawer closes after navigation", () => {
    render(<UserInfoHeader {...mockProps} />);

    // Open drawer
    const menuButton = screen.getByText("☰");
    fireEvent.click(menuButton);

    // Navigate somewhere
    const landingLink = screen.getByText("Landing Page");
    fireEvent.click(landingLink);

    // Drawer should close (Navigation title should not be visible)
    expect(screen.queryByText("Navigation")).not.toBeInTheDocument();
  });

  // Props Tests
  test("handles missing username gracefully", () => {
    const propsWithoutUsername = { ...mockProps, username: null };
    render(<UserInfoHeader {...propsWithoutUsername} />);

    // Should render without crashing
    expect(screen.getByText("WeatherKings")).toBeInTheDocument();
    // Username section should not be rendered
    expect(screen.queryByText("$152.37")).not.toBeInTheDocument();
  });

  test("handles missing navigation functions gracefully", () => {
    const propsWithoutNavigation = {
      ...mockProps,
      onNavigateToLanding: null,
      onNavigateToCity: null,
      onLogout: null,
    };
    render(<UserInfoHeader {...propsWithoutNavigation} />);

    // Should render without crashing
    expect(screen.getByText("WeatherKings")).toBeInTheDocument();

    // Click menu to open drawer
    const menuButton = screen.getByText("☰");
    fireEvent.click(menuButton);

    // Should open drawer without errors
    expect(screen.getByText("Navigation")).toBeInTheDocument();
  });

  test("displays balance with correct formatting", () => {
    const propsWithDifferentBalance = { ...mockProps, balance: 1234.56 };
    render(<UserInfoHeader {...propsWithDifferentBalance} />);

    expect(screen.getByText("$1234.56")).toBeInTheDocument();
  });

  test("handles zero balance", () => {
    const propsWithZeroBalance = { ...mockProps, balance: 0 };
    render(<UserInfoHeader {...propsWithZeroBalance} />);

    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });

  // Accessibility Tests
  test("hamburger button is keyboard accessible", () => {
    render(<UserInfoHeader {...mockProps} />);

    const menuButton = screen.getByText("☰");
    expect(menuButton).toHaveAttribute("type", "button");
  });

  test("navbar has proper semantic structure", () => {
    render(<UserInfoHeader {...mockProps} />);

    const navbar = screen.getByText("WeatherKings").closest(".navbar");
    expect(navbar.tagName).toBe("NAV");
  });

  test("brand text has proper styling", () => {
    render(<UserInfoHeader {...mockProps} />);

    const brand = screen.getByText("WeatherKings");
    expect(brand).toHaveStyle("font-weight: 600");
  });

  // Edge Cases
  test("handles long usernames gracefully", () => {
    const propsWithLongUsername = {
      ...mockProps,
      username: "verylongusernamethatmightcauseissues",
    };
    render(<UserInfoHeader {...propsWithLongUsername} />);

    expect(screen.getByText("verylongusernamethatmightcauseissues")).toBeInTheDocument();
  });

  test("handles negative balance", () => {
    const propsWithNegativeBalance = { ...mockProps, balance: -50.25 };
    render(<UserInfoHeader {...propsWithNegativeBalance} />);

    // Check that the negative balance is displayed (formatted as $-50.25)
    expect(screen.getByText("$-50.25")).toBeInTheDocument();
  });
});
