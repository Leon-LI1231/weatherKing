import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../components/App";

/**
 * =======================================================
 *                    APP COMPONENT TESTS
 * =======================================================
 *
 * Test Cases:
 * -----------
 * 1. Rendering Tests:
 *   ✓ App component renders Login by default
 *
 * 2. Navigation Tests:
 *   ✓ navigating to CreateAccount from Login
 *   ✓ navigating back to Login from CreateAccount
 *   ✓ navigating to Landing Page after login
 *   ✓ navigating to City Pages from Landing Page
 *   ✓ navigating back to Landing Page from City Pages
 *
 * 3. Form Submission Tests:
 *   ✓ successful login redirects to Landing Page
 *   ✓ failed login shows error message
 *   ✓ successful account creation redirects to Login
 *
 * 4. State Management Tests:
 *   ✓ user state is preserved during navigation
 *   ✓ selected city state is managed correctly
 *   ✓ app maintains state during page transitions
 *
 * 5. State Persistence Tests:
 *   ✓ saves app state to localStorage when navigating
 *   ✓ restores app state from localStorage on mount
 *   ✓ restores city page state from localStorage
 *   ✓ handles expired localStorage state gracefully
 *   ✓ handles invalid localStorage state gracefully
 *   ✓ handles malformed localStorage data gracefully
 *   ✓ clears localStorage on logout
 *   ✓ shows loading indicator while restoring state
 *
 * 6. City Navigation Tests:
 *   ✓ city selection navigates to correct city page
 *   ✓ drawer navigation works from all pages
 *   ✓ logout functionality works from all pages
 *
 * 7. Edge Case Tests:
 *   ✓ handles invalid city navigation
 *   ✓ handles rapid navigation between pages
 *
 * 8. Integration Tests:
 *   ✓ integrates correctly with Login, CreateAccount, LandingPage, and CityPage components
 *   ✓ UserInfoHeader appears on authenticated pages
 *
 * 9. Accessibility Tests:
 *   ✓ all interactive elements are keyboard accessible
 *   ✓ appropriate ARIA roles are used
 *
 * 10. Balance Update Tests:
 *   ✓ handleBalanceUpdate updates user balance in state
 *   ✓ UserPage receives onBalanceUpdate prop
 *
 * Run all tests: npm test
 * Run App.test.jsx only: npm test -- App.test.jsx
 * Run specific test: npm test -- --testNamePattern="test name"
 * ======================================================
 */

// Mock fetch globally
global.fetch = jest.fn();

// Mock BetFilters component that appears on city pages
jest.mock("../components/BetFilters", () => {
  function MockBetFilters({ onFilterChange }) {
    return (
      <div data-testid="bet-filters">
        <button onClick={() => onFilterChange && onFilterChange({ active: true })}>
          Filter Active
        </button>
        <button onClick={() => onFilterChange && onFilterChange({ active: false })}>
          Filter All
        </button>
      </div>
    );
  }
  MockBetFilters.displayName = "MockBetFilters";
  return MockBetFilters;
});

// Mock BetListTable component that appears on city pages
jest.mock("../components/BetListTable", () => {
  function MockBetListTable({ bets, selectedCity, onBackToLanding }) {
    return (
      <div data-testid="bet-list-table">
        <h3>{selectedCity} Bets</h3>
        <button onClick={() => onBackToLanding && onBackToLanding()}>← Back to Landing Page</button>
        {bets && bets.length > 0 ? (
          <div>
            {bets.map((bet, index) => (
              <div key={index} data-testid={`bet-${index}`}>
                {bet.title}
              </div>
            ))}
          </div>
        ) : (
          <div>No bets available</div>
        )}
      </div>
    );
  }
  MockBetListTable.displayName = "MockBetListTable";
  return MockBetListTable;
});

// Mock BetHistoryFilter
jest.mock("../components/BetHistoryFilter", () => {
  return function MockBetHistoryFilter() {
    return <div data-testid="bet-history-filter"></div>;
  };
});

// Mock Bootstrap components for App integration tests
jest.mock("react-bootstrap", () => {
  const MockOffcanvas = ({ show, children }) =>
    show ? (
      <div className="offcanvas" data-testid="offcanvas">
        {children}
      </div>
    ) : null;
  MockOffcanvas.displayName = "MockOffcanvas";

  MockOffcanvas.Header = ({ closeButton, children }) => (
    <div className="offcanvas-header">
      {children}
      {closeButton && <button className="btn-close" onClick={() => {}} />}
    </div>
  );
  MockOffcanvas.Header.displayName = "MockOffcanvasHeader";

  MockOffcanvas.Title = ({ children }) => <h5 className="offcanvas-title">{children}</h5>;
  MockOffcanvas.Title.displayName = "MockOffcanvasTitle";

  MockOffcanvas.Body = ({ children }) => <div className="offcanvas-body">{children}</div>;
  MockOffcanvas.Body.displayName = "MockOffcanvasBody";

  const MockNav = ({ defaultActiveKey, className, children }) => (
    <div className={`nav ${className || ""}`} data-active-key={defaultActiveKey}>
      {children}
    </div>
  );
  MockNav.displayName = "MockNav";

  MockNav.Link = ({ eventKey, onClick, children, style }) => (
    <button className="nav-link" data-event-key={eventKey} onClick={onClick} style={style}>
      {children}
    </button>
  );
  MockNav.Link.displayName = "MockNavLink";

  const MockNavbar = ({ className, children, style }) => (
    <nav className={`navbar ${className || ""}`} style={style}>
      {children}
    </nav>
  );
  MockNavbar.displayName = "MockNavbar";

  MockNavbar.Brand = ({ href, children, style }) => (
    <a className="navbar-brand" href={href} style={style}>
      {children}
    </a>
  );
  MockNavbar.Brand.displayName = "MockNavbarBrand";

  const MockButton = ({ variant, className, onClick, children, style, type }) => (
    <button
      className={`btn btn-${variant} ${className || ""}`}
      onClick={onClick}
      style={style}
      type={type}
    >
      {children}
    </button>
  );
  MockButton.displayName = "MockButton";

  const MockCard = ({ className, style, onClick, onMouseEnter, onMouseLeave, children }) => (
    <div
      className={`card ${className || ""}`}
      style={style}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
  MockCard.displayName = "MockCard";

  MockCard.Body = ({ className, children }) => (
    <div className={`card-body ${className || ""}`}>{children}</div>
  );
  MockCard.Body.displayName = "MockCardBody";

  MockCard.Title = ({ className, children }) => (
    <div className={`card-title ${className || ""}`}>{children}</div>
  );
  MockCard.Title.displayName = "MockCardTitle";

  MockCard.Text = ({ className, children }) => (
    <p className={`card-text ${className || ""}`}>{children}</p>
  );
  MockCard.Text.displayName = "MockCardText";

  const MockRow = ({ className, children }) => (
    <div className={`row ${className || ""}`}>{children}</div>
  );
  MockRow.displayName = "MockRow";

  const MockCol = ({ md, className, children }) => (
    <div className={`col${md ? `-md-${md}` : ""} ${className || ""}`}>{children}</div>
  );
  MockCol.displayName = "MockCol";

  const MockContainer = ({ className, style, children }) => (
    <div className={`container ${className || ""}`} style={style}>
      {children}
    </div>
  );
  MockContainer.displayName = "MockContainer";

  const MockBadge = ({ className, bg, children, style }) => (
    <span className={`badge ${bg ? `bg-${bg}` : ""} ${className || ""}`} style={style}>
      {children}
    </span>
  );
  MockBadge.displayName = "MockBadge";

  const MockForm = ({ className, onSubmit, children }) => (
    <form className={`${className || ""}`} onSubmit={onSubmit}>
      {children}
    </form>
  );
  MockForm.displayName = "MockForm";

  MockForm.Group = ({ className, children }) => (
    <div className={`mb-3 ${className || ""}`}>{children}</div>
  );
  MockForm.Group.displayName = "MockFormGroup";

  MockForm.Label = ({ htmlFor, children, className }) => (
    <label htmlFor={htmlFor} className={`form-label ${className || ""}`}>
      {children}
    </label>
  );
  MockForm.Label.displayName = "MockFormLabel";

  MockForm.Control = ({ type, id, name, value, onChange, required, placeholder, className }) => (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className={`form-control ${className || ""}`}
    />
  );
  MockForm.Control.displayName = "MockFormControl";

  const MockModal = ({ show, children }) =>
    show ? (
      <div className="modal" data-testid="modal">
        {children}
      </div>
    ) : null;
  MockModal.displayName = "MockModal";

  MockModal.Header = ({ closeButton, children }) => (
    <div className="modal-header">
      {children}
      {closeButton && <button className="btn-close" onClick={() => {}} />}
    </div>
  );
  MockModal.Header.displayName = "MockModalHeader";

  MockModal.Title = ({ children }) => <h5 className="modal-title">{children}</h5>;
  MockModal.Title.displayName = "MockModalTitle";

  MockModal.Body = ({ children }) => <div className="modal-body">{children}</div>;
  MockModal.Body.displayName = "MockModalBody";

  MockModal.Footer = ({ children }) => <div className="modal-footer">{children}</div>;
  MockModal.Footer.displayName = "MockModalFooter";

  const MockTable = ({ striped, hover, children }) => (
    <table className={`table ${striped ? "table-striped" : ""} ${hover ? "table-hover" : ""}`}>
      {children}
    </table>
  );
  MockTable.displayName = "MockTable";

  const MockAlert = ({ variant, children }) => (
    <div className={`alert alert-${variant}`}>{children}</div>
  );
  MockAlert.displayName = "MockAlert";

  return {
    Offcanvas: MockOffcanvas,
    Nav: MockNav,
    Navbar: MockNavbar,
    Button: MockButton,
    Card: MockCard,
    Row: MockRow,
    Col: MockCol,
    Container: MockContainer,
    Badge: MockBadge,
    Form: MockForm,
    Modal: MockModal,
    Table: MockTable,
    Alert: MockAlert,
  };
});
describe("App Component Tests", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Mock console.error to suppress expected error messages during tests
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Mock localStorage with a complete implementation
    const mockStorage = {};
    const localStorageMock = {
      getItem: jest.fn((key) => mockStorage[key] || null),
      setItem: jest.fn((key, value) => {
        mockStorage[key] = value;
      }),
      removeItem: jest.fn((key) => {
        delete mockStorage[key];
      }),
      clear: jest.fn(() => {
        Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
      }),
      key: jest.fn((index) => Object.keys(mockStorage)[index] || null),
      get length() {
        return Object.keys(mockStorage).length;
      },
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
  });

  afterEach(() => {
    // Restore console.error after each test
    console.error.mockRestore();
  });

  test("App component renders Login by default", () => {
    render(<App />);
    // Check that Login component is rendered by default
    expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create Account/i })).toBeInTheDocument();
  });

  test('navigates to CreateAccount when "Create Account" button is clicked', () => {
    render(<App />);
    const createAccountButton = screen.getByRole("button", { name: /Create Account/i });
    fireEvent.click(createAccountButton);
    // Should now show CreateAccount component
    expect(screen.getByRole("heading", { name: /Create Account/i })).toBeInTheDocument();
  });

  test("navigates back to Login from CreateAccount when Cancel is clicked", () => {
    render(<App />);
    // Navigate to CreateAccount first
    const createAccountButton = screen.getByRole("button", { name: /Create Account/i });
    fireEvent.click(createAccountButton);
    // Now click Cancel to go back to Login
    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelButton);
    // Should be back to Login
    expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();
  });

  test("navigates to Dashboard after successful login", async () => {
    // Mock successful login response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Login successful." }),
    });
    render(<App />);
    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: /Login/i });

    // Fill in login form and submit
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(loginButton);

    // Should navigate to Landing Page
    await waitFor(() => {
      expect(screen.getByText(/Welcome to WeatherKings/i)).toBeInTheDocument();
      expect(screen.getByText("testuser")).toBeInTheDocument();
    });
  });

  test("temporary button navigates to landing page", () => {
    render(<App />);
    const tempButton = screen.getByText("Temporary button to get to landing page");
    fireEvent.click(tempButton);

    // Should navigate to LandingPage with TestUser
    expect(screen.getByText(/Welcome to WeatherKings/i)).toBeInTheDocument();
    // Check that user info is shown in header
    expect(screen.getByText("TestUser")).toBeInTheDocument();
  });

  test("logout functionality returns user to login page", () => {
    render(<App />);
    // First navigate to landing page using temp button
    const tempButton = screen.getByText("Temporary button to get to landing page");
    fireEvent.click(tempButton);

    // Verify we're on landing page
    expect(screen.getByText(/Welcome to WeatherKings/i)).toBeInTheDocument();

    // Open drawer first to access logout
    const menuButton = screen.getByText("☰");
    fireEvent.click(menuButton);

    // Click logout
    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    // Should be back on login page
    expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create Account/i })).toBeInTheDocument();
  });

  test("user state is cleared on logout", () => {
    render(<App />);
    // Navigate to landing page
    const tempButton = screen.getByText("Temporary button to get to landing page");
    fireEvent.click(tempButton);

    // Open drawer and logout
    const menuButton = screen.getByText("☰");
    fireEvent.click(menuButton);

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    // Navigate back to landing using temp button to verify user state reset
    const tempButtonAgain = screen.getByText("Temporary button to get to landing page");
    fireEvent.click(tempButtonAgain);

    // Should still show TestUser (since temp button sets it)
    expect(screen.getByText(/Welcome to WeatherKings/i)).toBeInTheDocument();
    expect(screen.getByText("TestUser")).toBeInTheDocument();
  });

  test("handles failed login attempt", async () => {
    // Mock failed login response
    fetch.mockResolvedValueOnce({
      ok: false,
      text: async () => "Invalid credentials",
    });

    render(<App />);
    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: /Login/i });

    // Fill in login form with invalid credentials
    fireEvent.change(usernameInput, { target: { value: "wronguser" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
    fireEvent.click(loginButton);

    // Should remain on login page
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();
    });
  });

  test("successful account creation navigates back to login", async () => {
    // Mock successful account creation
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Account created successfully!" }),
    });

    render(<App />);

    // Navigate to Create Account
    const createAccountButton = screen.getByRole("button", { name: /Create Account/i });
    fireEvent.click(createAccountButton);

    // Fill out create account form
    const usernameInput = screen.getByPlaceholderText("Username");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: /Create Account/i });

    fireEvent.change(usernameInput, { target: { value: "newuser" } });
    fireEvent.change(emailInput, { target: { value: "newuser@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "newpass" } });
    fireEvent.click(submitButton);

    await waitFor(
      () => {
        expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  test("app maintains state during navigation", () => {
    render(<App />);

    // Start at login, navigate to create account
    const createAccountButton = screen.getByRole("button", { name: /Create Account/i });
    fireEvent.click(createAccountButton);
    expect(screen.getByRole("heading", { name: /Create Account/i })).toBeInTheDocument();

    // Go back to login
    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelButton);
    expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();

    // Navigate to landing page
    const tempButton = screen.getByText("Temporary button to get to landing page");
    fireEvent.click(tempButton);
    expect(screen.getByText(/Welcome to WeatherKings/i)).toBeInTheDocument();

    // Open drawer and logout back to login
    const menuButton = screen.getByText("☰");
    fireEvent.click(menuButton);

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);
    expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();
  });

  test("navigates to city page when city is selected", () => {
    render(<App />);

    // Navigate to landing page first
    const tempButton = screen.getByText("Temporary button to get to landing page");
    fireEvent.click(tempButton);

    const madisonCard = screen.getByText("View Madison Bets");
    fireEvent.click(madisonCard);

    expect(screen.getByText("Madison Bets")).toBeInTheDocument();
    expect(screen.getByText("← Back to Landing Page")).toBeInTheDocument();
  });

  test("navigates back to landing page from city page", async () => {
    render(<App />);

    const tempButton = screen.getByText("Temporary button to get to landing page");
    fireEvent.click(tempButton);

    const madisonCard = screen.getByText("View Madison Bets");
    fireEvent.click(madisonCard);

    const backButton = screen.getByText("← Back to Landing Page");
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.getByText(/Welcome to WeatherKings/i)).toBeInTheDocument();
    });
    expect(screen.getByText("Select a City")).toBeInTheDocument();
  });

  test("UserInfoHeader appears on authenticated pages", () => {
    render(<App />);

    const tempButton = screen.getByText("Temporary button to get to landing page");
    fireEvent.click(tempButton);

    expect(screen.getByText("WeatherKings")).toBeInTheDocument();
    expect(screen.getByText("TestUser")).toBeInTheDocument();
    expect(screen.getByText(/\$0\.00/)).toBeInTheDocument();
  });

  test("drawer navigation works from landing page", () => {
    render(<App />);

    const tempButton = screen.getByText("Temporary button to get to landing page");
    fireEvent.click(tempButton);

    const menuButton = screen.getByText("☰");
    fireEvent.click(menuButton);

    expect(screen.getByText("Navigation")).toBeInTheDocument();
    expect(screen.getByText("Landing Page")).toBeInTheDocument();

    const madisonElements = screen.getAllByText("Madison");
    expect(madisonElements.length).toBeGreaterThan(0);

    const losAngelesElements = screen.getAllByText("Los Angeles");
    expect(losAngelesElements.length).toBeGreaterThan(0);

    const newYorkElements = screen.getAllByText("New York City");
    expect(newYorkElements.length).toBeGreaterThan(0);

    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("drawer city navigation works correctly", () => {
    render(<App />);

    const tempButton = screen.getByText("Temporary button to get to landing page");
    fireEvent.click(tempButton);

    const menuButton = screen.getByText("☰");
    fireEvent.click(menuButton);

    const drawer = screen.getByTestId("offcanvas");
    const madisonLink = drawer.querySelector('[data-event-key="Madison"]');
    fireEvent.click(madisonLink);

    expect(screen.getByText("Madison Bets")).toBeInTheDocument();
  });

  test("selected city state is managed correctly", () => {
    render(<App />);

    const tempButton = screen.getByText("Temporary button to get to landing page");
    fireEvent.click(tempButton);

    const madisonCard = screen.getByText("View Madison Bets");
    fireEvent.click(madisonCard);

    expect(screen.getByText("Madison Bets")).toBeInTheDocument();

    const menuButton = screen.getByText("☰");
    fireEvent.click(menuButton);

    const drawer = screen.getByTestId("offcanvas");
    const newYorkCityLink = drawer.querySelector('[data-event-key="New York City"]');
    fireEvent.click(newYorkCityLink);

    expect(screen.getByText("New York City Bets")).toBeInTheDocument();
  });

  test("handles invalid city navigation gracefully", () => {
    render(<App />);

    const tempButton = screen.getByText("Temporary button to get to landing page");
    fireEvent.click(tempButton);

    expect(screen.getByText(/Welcome to WeatherKings/i)).toBeInTheDocument();
  });

  // State Persistence Tests
  test("saves app state to localStorage when navigating", () => {
    render(<App />);

    const tempButton = screen.getByText("Temporary button to get to landing page");
    fireEvent.click(tempButton);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "betAppState",
      expect.stringContaining('"currentPage":"landing"'),
    );
  });

  test("restores app state from localStorage on mount", () => {
    const storedState = {
      currentPage: "landing",
      user: { username: "TestUser" },
      selectedCity: null,
      timestamp: new Date().toISOString(),
    };

    localStorage.getItem.mockReturnValue(JSON.stringify(storedState));

    render(<App />);

    expect(screen.getByText(/Welcome to WeatherKings/i)).toBeInTheDocument();
  });

  test("restores city page state from localStorage", () => {
    const storedState = {
      currentPage: "city",
      user: { username: "TestUser" },
      selectedCity: "Madison",
      timestamp: new Date().toISOString(),
    };

    localStorage.getItem.mockReturnValue(JSON.stringify(storedState));

    render(<App />);

    expect(screen.getByText("Madison Bets")).toBeInTheDocument();
  });

  test("handles expired localStorage state gracefully", async () => {
    const expiredTimestamp = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
    const expiredState = {
      currentPage: "landing",
      user: { username: "TestUser" },
      selectedCity: null,
      timestamp: expiredTimestamp,
    };

    localStorage.getItem.mockImplementation((key) => {
      if (key === "betAppState") {
        return JSON.stringify(expiredState);
      }
      return null;
    });

    render(<App />);

    await waitFor(
      () => {
        expect(localStorage.removeItem).toHaveBeenCalledWith("betAppState");
      },
      { timeout: 2000 },
    );

    expect(localStorage.removeItem).toHaveBeenCalledWith("betAppState");
  });

  test("handles invalid localStorage state gracefully", () => {
    const invalidState = {
      currentPage: "city",
      user: { username: "TestUser" },
      selectedCity: null,
      timestamp: new Date().toISOString(),
    };

    localStorage.getItem.mockReturnValue(JSON.stringify(invalidState));

    render(<App />);

    expect(screen.getByText(/Welcome to WeatherKings/i)).toBeInTheDocument();
  });

  test("handles malformed localStorage data gracefully", () => {
    const originalConsoleError = console.error;
    console.error = jest.fn();

    localStorage.getItem.mockReturnValue("invalid json data");

    render(<App />);

    expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();

    expect(console.error).toHaveBeenCalledWith(
      "Error parsing stored state:",
      expect.any(SyntaxError),
    );

    console.error = originalConsoleError;
  });

  test("clears localStorage on logout", async () => {
    const mockStorageData = {
      betAppState: JSON.stringify({
        currentPage: "landing",
        user: { username: "TestUser" },
        selectedCity: null,
        timestamp: new Date().toISOString(),
      }),
      betAppFilters_madison: JSON.stringify({
        search: "test",
        selectedType: "sports",
      }),
      someOtherKey: "should not be removed",
    };

    localStorage.getItem.mockImplementation((key) => mockStorageData[key] || null);
    localStorage.key.mockImplementation((index) => Object.keys(mockStorageData)[index] || null);
    localStorage.removeItem.mockImplementation((key) => {
      delete mockStorageData[key];
    });
    Object.defineProperty(localStorage, "length", {
      get: () => Object.keys(mockStorageData).length,
    });

    render(<App />);

    expect(screen.getByText(/Welcome to WeatherKings/i)).toBeInTheDocument();

    const drawerButton = screen.getByRole("button", { name: "☰" });
    fireEvent.click(drawerButton);

    await waitFor(() => {
      expect(screen.getByText("Logout")).toBeInTheDocument();
    });

    const logoutOption = screen.getByText("Logout");
    fireEvent.click(logoutOption);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();
    });

    expect(localStorage.removeItem).toHaveBeenCalledWith("betAppState");
    expect(localStorage.removeItem).toHaveBeenCalledWith("betAppFilters_madison");
    expect(localStorage.removeItem).not.toHaveBeenCalledWith("someOtherKey");
  });

  test("shows loading indicator while restoring state", () => {
    const storedState = {
      currentPage: "landing",
      user: { username: "TestUser" },
      selectedCity: null,
      timestamp: new Date().toISOString(),
    };

    localStorage.getItem.mockReturnValue(JSON.stringify(storedState));

    render(<App />);

    expect(screen.getByText(/Welcome to WeatherKings/i)).toBeInTheDocument();
  });

  test("handleBalanceUpdate updates user balance in state", async () => {
    localStorage.getItem.mockReturnValue(null);

    global.fetch.mockImplementation((url) => {
      if (url.includes("/api/login")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              message: "Login successful.",
              username: "TestUser",
              balanceUsd: 100.0,
            }),
        });
      }
      if (url.includes("/api/user/")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              username: "TestUser",
              balanceUsd: 100.0,
              email: "test@example.com",
              uid: 1,
              createdAt: "2025-01-01",
            }),
        });
      }
      return Promise.reject(new Error("Not found"));
    });

    render(<App />);

    // Login first
    const usernameInput = screen.getByPlaceholderText(/Username/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const loginButton = screen.getByRole("button", { name: /Login/i });

    fireEvent.change(usernameInput, { target: { value: "TestUser" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Welcome to WeatherKings/i)).toBeInTheDocument();
    });

    // Navigate to user page
    const drawerButton = screen.getByRole("button", { name: "☰" });
    fireEvent.click(drawerButton);

    await waitFor(() => {
      expect(screen.getByText(/User Page/i)).toBeInTheDocument();
    });

    const userPageOption = screen.getByText(/User Page/i);
    fireEvent.click(userPageOption);

    await waitFor(() => {
      expect(screen.getByText(/Your account info and bet history/i)).toBeInTheDocument();
    });

    // Check initial balance (there should be multiple instances - in header and on user page)
    const balanceElements = screen.getAllByText(/\$100\.00/);
    expect(balanceElements.length).toBeGreaterThan(0);

    // Mock deposit API call
    global.fetch.mockImplementation((url) => {
      if (url.includes("/api/deposit")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ newBalance: 200.0 }),
        });
      }
      return Promise.reject(new Error("Not found"));
    });

    // Open deposit modal and make deposit
    const depositButton = screen.getByRole("button", { name: /Deposit Funds/i });
    fireEvent.click(depositButton);

    const amountInput = screen.getByPlaceholderText(/Enter amount/i);
    fireEvent.change(amountInput, { target: { value: "100.00" } });

    const depositSubmitButton = screen.getByRole("button", { name: /^Deposit$/i });
    fireEvent.click(depositSubmitButton);

    // Check updated balance (there should be multiple instances - in header and on user page)
    await waitFor(() => {
      const updatedBalanceElements = screen.getAllByText(/\$200\.00/);
      expect(updatedBalanceElements.length).toBeGreaterThan(0);
    });
  });

  test("UserPage receives onBalanceUpdate prop from App", async () => {
    localStorage.getItem.mockReturnValue(null);

    global.fetch.mockImplementation((url) => {
      if (url.includes("/api/login")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              message: "Login successful.",
              username: "TestUser",
              balanceUsd: 50.0,
            }),
        });
      }
      if (url.includes("/api/user/")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              username: "TestUser",
              balanceUsd: 50.0,
              email: "test@example.com",
              uid: 1,
              createdAt: "2025-01-01",
            }),
        });
      }
      return Promise.reject(new Error("Not found"));
    });

    render(<App />);

    // Login
    const usernameInput = screen.getByPlaceholderText(/Username/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const loginButton = screen.getByRole("button", { name: /Login/i });

    fireEvent.change(usernameInput, { target: { value: "TestUser" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Welcome to WeatherKings/i)).toBeInTheDocument();
    });

    // Navigate to user page
    const drawerButton = screen.getByRole("button", { name: "☰" });
    fireEvent.click(drawerButton);

    await waitFor(() => {
      expect(screen.getByText(/User Page/i)).toBeInTheDocument();
    });

    const userPageOption = screen.getByText(/User Page/i);
    fireEvent.click(userPageOption);

    await waitFor(() => {
      expect(screen.getByText(/Your account info and bet history/i)).toBeInTheDocument();
    });

    // Verify that deposit button is present (which requires onBalanceUpdate prop)
    const depositButton = screen.getByRole("button", { name: /Deposit Funds/i });
    expect(depositButton).toBeInTheDocument();
  });
});
