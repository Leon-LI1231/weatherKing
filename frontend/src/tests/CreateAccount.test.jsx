import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateAccount from "../components/CreateAccount";

/**
 * =======================================================
 *                CREATE ACCOUNT COMPONENT TESTS
 * =======================================================
 * Test Cases:
 * -----------
 * 1. Form Rendering Tests:
 *    ✓ form elements are rendered correctly
 *
 * 2. Input Interaction Tests:
 *    ✓ input fields accept user input
 *
 * 3. Form Submission Tests:
 *    ✓ successful account creation displays success message and redirects
 *    ✓ account creation with existing username displays error message
 *    ✓ account creation with existing email displays error message
 *    ✓ account creation with empty fields is prevented
 *
 * 4. Error Handling and Recovery Tests:
 *    ✓ create account button is disabled when email already exists
 *    ✓ changing email clears email already exists error
 *    ✓ create account button is disabled when username already exists
 *    ✓ changing username clears username already exists error
 *
 * 5. Cancel Action Tests:
 *    ✓ cancel button redirects to login page
 *
 *  Run all tests: npm test
 *  Run CreateAccount.test.jsx only: npm test -- CreateAccount.test.jsx
 *  Run specific test: npm test -- --testNamePattern="test name"
 * ======================================================
 */

// Mock fetch globally
global.fetch = jest.fn();

describe("CreateAccount Component Tests", () => {
  let mockOnNavigateToLogin;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Mock window.location
    delete window.location;
    window.location = { href: "" };

    // Create mock function for navigation
    mockOnNavigateToLogin = jest.fn();
  });
  test("form elements are rendered correctly", () => {
    render(<CreateAccount onNavigateToLogin={mockOnNavigateToLogin} />);
    // Check for heading
    expect(screen.getByRole("heading", { name: /Create Account/i })).toBeInTheDocument();
    // Check for username input
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    // Check for password input
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    // Check for create account button
    expect(screen.getByRole("button", { name: /Create Account/i })).toBeInTheDocument();
    // Check for cancel button
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });

  test("input fields accept user input", () => {
    render(<CreateAccount onNavigateToLogin={mockOnNavigateToLogin} />);
    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    // Simulate user typing in username
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    expect(usernameInput.value).toBe("testuser");
    // Simulate user typing in password
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    expect(passwordInput.value).toBe("password123");
  });

  test("successful account creation displays success message and redirects", async () => {
    // Mock successful API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Account created successfully!" }),
    });
    render(<CreateAccount onNavigateToLogin={mockOnNavigateToLogin} />);
    const usernameInput = screen.getByPlaceholderText("Username");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const createButton = screen.getByRole("button", { name: /Create Account/i });
    // Fill in form
    fireEvent.change(usernameInput, { target: { value: "newuser" } });
    fireEvent.change(emailInput, { target: { value: "newuser@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "newpassword" } });
    fireEvent.click(createButton);
    // Wait for success message to appear and navigation function to be called
    await waitFor(() => {
      expect(screen.getByText("Account created successfully!")).toBeInTheDocument();
    });
    await waitFor(
      () => {
        expect(mockOnNavigateToLogin).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });

  test("account creation with existing username displays error message", async () => {
    // Mock API response for existing username
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Username already exists" }),
    });
    render(<CreateAccount onNavigateToLogin={mockOnNavigateToLogin} />);
    const usernameInput = screen.getByPlaceholderText("Username");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const createButton = screen.getByRole("button", { name: /Create Account/i });
    // Fill in form with existing username
    fireEvent.change(usernameInput, { target: { value: "existinguser" } });
    fireEvent.change(emailInput, { target: { value: "existing@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "somepassword" } });
    fireEvent.click(createButton);
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText("Username already exists")).toBeInTheDocument();
    });
  });

  test("account creation with empty fields is prevented", () => {
    render(<CreateAccount onNavigateToLogin={mockOnNavigateToLogin} />);
    const createButton = screen.getByRole("button", { name: /Create Account/i });
    // Click create button without filling form
    fireEvent.click(createButton);
    // Ensure fetch was not called
    expect(fetch).not.toHaveBeenCalled();
  });

  test("cancel button redirects to login page", () => {
    render(<CreateAccount onNavigateToLogin={mockOnNavigateToLogin} />);
    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelButton);
    expect(mockOnNavigateToLogin).toHaveBeenCalled();
  });

  test("account creation with existing email displays error message", async () => {
    // Mock API response for existing email
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Email already exists" }),
    });
    render(<CreateAccount onNavigateToLogin={mockOnNavigateToLogin} />);
    const usernameInput = screen.getByPlaceholderText("Username");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const createButton = screen.getByRole("button", { name: /Create Account/i });
    // Fill in form with existing email
    fireEvent.change(usernameInput, { target: { value: "newuser" } });
    fireEvent.change(emailInput, { target: { value: "existing@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "somepassword" } });
    fireEvent.click(createButton);
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText("Email already exists")).toBeInTheDocument();
    });
  });

  test("create account button is disabled when email already exists", async () => {
    // Mock API response for existing email
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Email already exists" }),
    });
    render(<CreateAccount onNavigateToLogin={mockOnNavigateToLogin} />);
    const usernameInput = screen.getByPlaceholderText("Username");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const createButton = screen.getByRole("button", { name: /Create Account/i });
    // Fill in form
    fireEvent.change(usernameInput, { target: { value: "newuser" } });
    fireEvent.change(emailInput, { target: { value: "existing@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "somepassword" } });
    fireEvent.click(createButton);
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText("Email already exists")).toBeInTheDocument();
    });
    // Button should be disabled
    expect(createButton).toBeDisabled();
  });

  test("changing email clears email already exists error", async () => {
    // Mock API response for existing email
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Email already exists" }),
    });
    render(<CreateAccount onNavigateToLogin={mockOnNavigateToLogin} />);
    const usernameInput = screen.getByPlaceholderText("Username");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const createButton = screen.getByRole("button", { name: /Create Account/i });
    // Fill in form
    fireEvent.change(usernameInput, { target: { value: "newuser" } });
    fireEvent.change(emailInput, { target: { value: "existing@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "somepassword" } });
    fireEvent.click(createButton);
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText("Email already exists")).toBeInTheDocument();
    });
    // Change email
    fireEvent.change(emailInput, { target: { value: "newemail@example.com" } });
    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText("Email already exists")).not.toBeInTheDocument();
    });
    // Button should be enabled again
    expect(createButton).not.toBeDisabled();
  });

  test("create account button is disabled when username already exists", async () => {
    // Mock API response for existing username
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Username already exists" }),
    });
    render(<CreateAccount onNavigateToLogin={mockOnNavigateToLogin} />);
    const usernameInput = screen.getByPlaceholderText("Username");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const createButton = screen.getByRole("button", { name: /Create Account/i });
    // Fill in form
    fireEvent.change(usernameInput, { target: { value: "existinguser" } });
    fireEvent.change(emailInput, { target: { value: "new@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "somepassword" } });
    fireEvent.click(createButton);
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText("Username already exists")).toBeInTheDocument();
    });
    // Button should be disabled
    expect(createButton).toBeDisabled();
  });

  test("changing username clears username already exists error", async () => {
    // Mock API response for existing username
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Username already exists" }),
    });
    render(<CreateAccount onNavigateToLogin={mockOnNavigateToLogin} />);
    const usernameInput = screen.getByPlaceholderText("Username");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const createButton = screen.getByRole("button", { name: /Create Account/i });
    // Fill in form
    fireEvent.change(usernameInput, { target: { value: "existinguser" } });
    fireEvent.change(emailInput, { target: { value: "new@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "somepassword" } });
    fireEvent.click(createButton);
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText("Username already exists")).toBeInTheDocument();
    });
    // Change username
    fireEvent.change(usernameInput, { target: { value: "newusername" } });
    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText("Username already exists")).not.toBeInTheDocument();
    });
    // Button should be enabled again
    expect(createButton).not.toBeDisabled();
  });
});
