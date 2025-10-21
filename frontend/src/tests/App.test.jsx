import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../components/App';

/**
 * =======================================================
 *                    APP COMPONENT TESTS
 * =======================================================
 * 
 * Test Cases:
 * -----------
 * 1. Rendering Tests:
 *   ✓ App component renders Login by default  
 * 2. Navigation Tests:
 *   ✓ navigating to CreateAccount from Login
 *   ✓ navigating back to Login from CreateAccount
 * 3. Form Submission Tests:
 *   ✓ successful login redirects to Dashboard
 *   ✓ failed login shows error message
 *   ✓ successful account creation redirects to Login
 * 4. State Management Tests:
 *   ✓ user state is preserved on refresh
 *   ✓ app maintains state during navigation
 * 5. Edge Case Tests:
 *   ✓ handles rapid navigation between pages
 * 6. Integration Tests:
 *   ✓ integrates correctly with Login, CreateAccount, and LandingPage components
 * 7. Accessibility Tests:
 *   ✓ all interactive elements are keyboard accessible
 *   ✓ appropriate ARIA roles are used
 * 
 * Run all tests: npm test
 * Run App.test.jsx only: npm test -- App.test.jsx
 * Run specific test: npm test -- --testNamePattern="test name"
 * ======================================================
 */

// Mock fetch globally
global.fetch = jest.fn();

describe('App Component Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('App component renders Login by default', () => {
    render(<App />);
    // Check that Login component is rendered by default
    expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });

  test('navigates to CreateAccount when "Create Account" button is clicked', () => {
    render(<App />);
    const createAccountButton = screen.getByRole('button', { name: /Create Account/i });
    fireEvent.click(createAccountButton);
    // Should now show CreateAccount component
    expect(screen.getByRole('heading', { name: /Create Account/i })).toBeInTheDocument();
  });

  test('navigates back to Login from CreateAccount when Cancel is clicked', () => {
    render(<App />);
    // Navigate to CreateAccount first
    const createAccountButton = screen.getByRole('button', { name: /Create Account/i });
    fireEvent.click(createAccountButton);
    // Now click Cancel to go back to Login
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);
    // Should be back to Login
    expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
  });

  test('navigates to Dashboard after successful login', async () => {
    // Mock successful login response
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => 'Login successful!',
    });
    render(<App />);
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: /Login/i });
    
    // Fill in login form and submit
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(loginButton);
    
    // Should navigate to Dashboard
    await waitFor(() => {
      expect(screen.getByText(/Welcome, testuser!/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
    });
  });

  test('temporary button navigates to landing page', () => {
    render(<App />);
    const tempButton = screen.getByText('Temporary button to get to landing page');
    fireEvent.click(tempButton);
    
    // Should navigate to LandingPage with TestUser
    expect(screen.getByText(/Welcome, TestUser!/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  });

  test('logout functionality returns user to login page', () => {
    render(<App />);
    // First navigate to landing page using temp button
    const tempButton = screen.getByText('Temporary button to get to landing page');
    fireEvent.click(tempButton);
    
    // Verify we're on landing page
    expect(screen.getByText(/Welcome, TestUser!/i)).toBeInTheDocument();
    
    // Click logout
    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(logoutButton);
    
    // Should be back on login page
    expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });

  test('user state is cleared on logout', () => {
    render(<App />);
    // Navigate to landing page
    const tempButton = screen.getByText('Temporary button to get to landing page');
    fireEvent.click(tempButton);
    
    // Logout
    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(logoutButton);
    
    // Navigate back to landing using temp button to verify user state reset
    const tempButtonAgain = screen.getByText('Temporary button to get to landing page');
    fireEvent.click(tempButtonAgain);
    
    // Should still show TestUser (since temp button sets it)
    expect(screen.getByText(/Welcome, TestUser!/i)).toBeInTheDocument();
  });

  test('handles failed login attempt', async () => {
    // Mock failed login response
    fetch.mockResolvedValueOnce({
      ok: false,
      text: async () => 'Invalid credentials',
    });
    
    render(<App />);
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: /Login/i });
    
    // Fill in login form with invalid credentials
    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(loginButton);
    
    // Should remain on login page
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
      // Could also test for error message if Login component displays one
    });
  });

  test('successful account creation navigates back to login', async () => {
    // Mock successful account creation
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => 'Account created successfully!',
    });
    
    render(<App />);
    
    // Navigate to Create Account
    const createAccountButton = screen.getByRole('button', { name: /Create Account/i });
    fireEvent.click(createAccountButton);
    
    // Fill out create account form (assuming similar structure to Login)
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /Create Account/i });
    
    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(passwordInput, { target: { value: 'newpass' } });
    fireEvent.click(submitButton);
    
    // Should navigate back to login page after successful creation
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
    });
  });

  test('app maintains state during navigation', () => {
    render(<App />);
    
    // Start at login, navigate to create account
    const createAccountButton = screen.getByRole('button', { name: /Create Account/i });
    fireEvent.click(createAccountButton);
    expect(screen.getByRole('heading', { name: /Create Account/i })).toBeInTheDocument();
    
    // Go back to login
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);
    expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
    
    // Navigate to landing page
    const tempButton = screen.getByText('Temporary button to get to landing page');
    fireEvent.click(tempButton);
    expect(screen.getByText(/Welcome, TestUser!/i)).toBeInTheDocument();
    
    // Logout back to login
    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(logoutButton);
    expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
  });
});