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
 * 1. Initial Render Tests:
 *    ✓ App component renders without crashing
 *    ✓ Login component is displayed by default
 * 
 * 2. Navigation Tests:
 *    ✓ clicking "Create Account" button navigates to CreateAccount component
 *    ✓ clicking "Cancel" button in CreateAccount navigates back to Login component
 * 
 *  Run all tests: npm test
 *  Run App.test.jsx only: npm test -- App.test.jsx
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
});