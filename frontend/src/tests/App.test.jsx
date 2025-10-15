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
 * 1. Button Existence & Interaction:
 *    ✓ button exists and is rendered correctly
 *    ✓ button can be clicked without errors
 * 
 * 2. Successful API Response Tests:
 *    ✓ successful button press displays backend response
 * 
 * 3. Error Handling Tests:
 *    ✓ failed button press displays error message when API returns error
 *    ✓ network error displays appropriate error message
 * 
 * 4. Advanced Functionality Tests:
 *    ✓ multiple button presses work correctly
 *    ✓ button remains clickable during and after API call
 * 
 *  Run all tests: npm test
 *  Run specific test: npm test -- --testNamePattern="test name"
 * ======================================================
 */

// Mock fetch globally
global.fetch = jest.fn();

describe('App Component Button Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    fetch.mockClear();
  });

  test('button exists and is rendered correctly', () => {
    render(<App />);
    
    // Check that the button exists with correct text
    const button = screen.getByRole('button', { name: /get backend data/i });
    expect(button).toBeInTheDocument();
    
    // Check that the button has the expected styling attributes
    expect(button).toHaveStyle({
      cursor: 'pointer'
    });
  });

  test('button can be clicked without errors', () => {
    // Mock successful API response
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => 'Test response',
    });

    render(<App />);
    
    const button = screen.getByRole('button', { name: /get backend data/i });
    
    // Should not throw an error when clicked
    expect(() => fireEvent.click(button)).not.toThrow();
    
    // Verify fetch was called after click
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('successful button press displays backend response', async () => {
    const mockResponse = 'Hello from backend!';
    
    // Mock successful API response
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => mockResponse,
    });

    render(<App />);
    
    const button = screen.getByRole('button', { name: /get backend data/i });
    
    // Initially no message should be displayed
    expect(screen.queryByText(mockResponse)).not.toBeInTheDocument();
    
    // Click the button
    fireEvent.click(button);

    // Wait for and verify the successful response message appears
    await waitFor(() => {
      expect(screen.getByText(mockResponse)).toBeInTheDocument();
    });

    // Verify the message has the expected styling
    const messageElement = screen.getByText(mockResponse);
    expect(messageElement).toHaveStyle({
      color: 'blue'
    });

    // Verify fetch was called with correct parameters
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/dummies');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('failed button press displays error message when API returns error', async () => {
    // Mock failed API response (network request succeeds but API returns error status)
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<App />);
    
    const button = screen.getByRole('button', { name: /get backend data/i });
    
    // Click the button
    fireEvent.click(button);

    // Wait for and verify the error message appears
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch data from backend')).toBeInTheDocument();
    });

    // Verify the error message has the expected styling
    const errorElement = screen.getByText('Failed to fetch data from backend');
    expect(errorElement).toHaveStyle({
      color: 'blue'
    });
  });

  test('network error displays appropriate error message', async () => {
    // Mock network error (request completely fails)
    const networkError = new Error('Network connection failed');
    fetch.mockRejectedValueOnce(networkError);

    render(<App />);
    
    const button = screen.getByRole('button', { name: /get backend data/i });
    
    // Click the button
    fireEvent.click(button);

    // Wait for and verify the error message appears
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch data from backend')).toBeInTheDocument();
    });
  });

  test('multiple button presses work correctly', async () => {
    const firstResponse = 'First response';
    const secondResponse = 'Second response';
    
    // Mock multiple API responses
    fetch
      .mockResolvedValueOnce({
        ok: true,
        text: async () => firstResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        text: async () => secondResponse,
      });

    render(<App />);
    
    const button = screen.getByRole('button', { name: /get backend data/i });
    
    // First button press
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText(firstResponse)).toBeInTheDocument();
    });

    // Second button press
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText(secondResponse)).toBeInTheDocument();
    });

    // Verify fetch was called twice
    expect(fetch).toHaveBeenCalledTimes(2);
    
    // Verify only the latest message is shown (second response should replace first)
    expect(screen.queryByText(firstResponse)).not.toBeInTheDocument();
    expect(screen.getByText(secondResponse)).toBeInTheDocument();
  });

  test('button remains clickable during and after API call', async () => {
    // Mock API response with delay
    fetch.mockImplementationOnce(
      () => new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          text: async () => 'Delayed response',
        }), 100)
      )
    );

    render(<App />);
    
    const button = screen.getByRole('button', { name: /get backend data/i });
    
    // Button should be enabled initially
    expect(button).not.toBeDisabled();
    
    // Click the button
    fireEvent.click(button);
    
    // Button should still be enabled during API call (component doesn't disable it)
    expect(button).not.toBeDisabled();
    
    // Wait for response
    await waitFor(() => {
      expect(screen.getByText('Delayed response')).toBeInTheDocument();
    });
    
    // Button should still be enabled after API call completes
    expect(button).not.toBeDisabled();
  });
});
