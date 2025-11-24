//Login Component
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../components/Login";

/**
 * =======================================================
 *                   LOGIN COMPONENT TESTS
 * =======================================================
 *
 * Test Cases:
 * -----------
 *
 * 1. Branding Tests:
 *    ✓ WeatherKings title and logo are rendered correctly
 *
 * 2. Form Rendering Tests:
 *    ✓ form elements are rendered correctly with enhanced styling
 *
 * 3. Input Interaction Tests:
 *    ✓ input fields accept user input and have proper styling
 *
 * 4. Form Submission Tests:
 *    ✓ successful login redirects to dashboard
 *    ✓ login with incorrect credentials displays error message
 *    ✓ login with empty fields is prevented
 *
 * 5. Navigation Tests:
 *    ✓ clicking "Create Account" redirects to CreateAccount component
 *
 * 6. Layout Tests:
 *    ✓ buttons are arranged side by side properly
 *
 *  Run all tests: npm test
 *  Run Login.test.jsx only: npm test -- Login.test.jsx
 *  Run specific test: npm test -- --testNamePattern="test name"
 * ======================================================
 */

// Mock fetch globally
global.fetch = jest.fn();

// Mock window.location.href
delete window.location;
window.location = { href: "" };

// Mock the logo import
jest.mock("../assets/logo.png", () => "test-logo.png");

describe("Login Component Tests", () => {
  let mockOnNavigateToCreateAccount, mockOnSuccessfulLogin;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    window.location.href = "";

    // Create mock functions for navigation
    mockOnNavigateToCreateAccount = jest.fn();
    mockOnSuccessfulLogin = jest.fn();
  });
  // Branding Tests
  test("WeatherKings title and logo are rendered correctly", () => {
    render(
      <Login
        onNavigateToCreateAccount={mockOnNavigateToCreateAccount}
        onSuccessfulLogin={mockOnSuccessfulLogin}
      />,
    );

    // Check for WeatherKings title
    expect(screen.getByRole("heading", { name: /WeatherKings/i })).toBeInTheDocument();

    // Check for logo image
    const logoImage = screen.getByAltText("WeatherKings Logo");
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("src", "test-logo.png");
  });

  test("form elements are rendered correctly with enhanced styling", () => {
    render(
      <Login
        onNavigateToCreateAccount={mockOnNavigateToCreateAccount}
        onSuccessfulLogin={mockOnSuccessfulLogin}
      />,
    );

    // Check for login heading (h2)
    expect(screen.getByRole("heading", { name: /^Login$/i })).toBeInTheDocument();

    // Check for username input with enhanced styling
    const usernameInput = screen.getByPlaceholderText("Username");
    expect(usernameInput).toBeInTheDocument();
    expect(usernameInput).toHaveStyle({ width: "250px" });

    // Check for password input with enhanced styling
    const passwordInput = screen.getByPlaceholderText("Password");
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveStyle({ width: "250px" });

    // Check for login button
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();

    // Check for create account button
    expect(screen.getByRole("button", { name: /Create Account/i })).toBeInTheDocument();
  });

  test("input fields accept user input and have proper styling", () => {
    render(
      <Login
        onNavigateToCreateAccount={mockOnNavigateToCreateAccount}
        onSuccessfulLogin={mockOnSuccessfulLogin}
      />,
    );

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");

    // Simulate user typing in username
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    expect(usernameInput.value).toBe("testuser");

    // Simulate user typing in password
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    expect(passwordInput.value).toBe("password123");

    // Check enhanced input styling
    expect(usernameInput).toHaveStyle({
      padding: "12px 16px",
      fontSize: "16px",
      width: "250px",
    });
    expect(passwordInput).toHaveStyle({
      padding: "12px 16px",
      fontSize: "16px",
      width: "250px",
    });
  });

  test("successful login redirects to dashboard", async () => {
    // Mock successful API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Login successful." }),
    });
    render(
      <Login
        onNavigateToCreateAccount={mockOnNavigateToCreateAccount}
        onSuccessfulLogin={mockOnSuccessfulLogin}
      />,
    );
    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: /Login/i });
    // Simulate user typing in username and password
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);
    // Wait for successful login callback
    await waitFor(() => {
      expect(mockOnSuccessfulLogin).toHaveBeenCalledWith({ username: "testuser" });
    });
  });

  test("login with incorrect credentials displays error message", async () => {
    // Mock failed API response
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid username or password" }),
    });
    render(
      <Login
        onNavigateToCreateAccount={mockOnNavigateToCreateAccount}
        onSuccessfulLogin={mockOnSuccessfulLogin}
      />,
    );
    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: /Login/i });
    // Simulate user typing in username and password
    fireEvent.change(usernameInput, { target: { value: "wronguser" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(loginButton);
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText("Invalid username or password")).toBeInTheDocument();
    });
  });

  test("login with empty fields is prevented", async () => {
    render(
      <Login
        onNavigateToCreateAccount={mockOnNavigateToCreateAccount}
        onSuccessfulLogin={mockOnSuccessfulLogin}
      />,
    );
    const loginButton = screen.getByRole("button", { name: /Login/i });
    // Click login button without filling in fields
    fireEvent.click(loginButton);
    // Ensure fetch was not called
    expect(fetch).not.toHaveBeenCalled();
  });

  test('clicking "Create Account" redirects to CreateAccount component', () => {
    render(
      <Login
        onNavigateToCreateAccount={mockOnNavigateToCreateAccount}
        onSuccessfulLogin={mockOnSuccessfulLogin}
      />,
    );
    const createAccountButton = screen.getByRole("button", { name: /Create Account/i });
    fireEvent.click(createAccountButton);
    // Check for navigation callback
    expect(mockOnNavigateToCreateAccount).toHaveBeenCalled();
  });

  // Layout Tests
  test("buttons are arranged side by side properly", () => {
    render(
      <Login
        onNavigateToCreateAccount={mockOnNavigateToCreateAccount}
        onSuccessfulLogin={mockOnSuccessfulLogin}
      />,
    );

    const loginButton = screen.getByRole("button", { name: /Login/i });
    const createAccountButton = screen.getByRole("button", { name: /Create Account/i });

    // Check that both buttons exist
    expect(loginButton).toBeInTheDocument();
    expect(createAccountButton).toBeInTheDocument();

    // Check that buttons have proper styling for side-by-side layout
    expect(loginButton).toHaveStyle({
      padding: "10px 20px",
      fontSize: "16px",
    });
    expect(createAccountButton).toHaveStyle({
      padding: "10px 20px",
      fontSize: "16px",
    });

    // Check that the button container has flexbox styling
    const buttonContainer = loginButton.parentElement;
    expect(buttonContainer).toHaveStyle({
      display: "flex",
      justifyContent: "center",
    });
  });
});
