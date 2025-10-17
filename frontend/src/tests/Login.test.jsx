//Login Component
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../components/Login';

/**
 * =======================================================
 *                   LOGIN COMPONENT TESTS
 * =======================================================
 * 
 * Test Cases:
 * -----------
 * 
 * 1. Form Rendering Tests:
 *    ✓ form elements are rendered correctly
 * 
 * 2. Input Interaction Tests:
 *    ✓ input fields accept user input
 * 
 * 3. Form Submission Tests:
 *    ✓ successful login redirects to dashboard
 *    ✓ login with incorrect credentials displays error message
 *    ✓ login with empty fields is prevented
 * 
 * 4. Navigation Tests:
 *    ✓ clicking "Create Account" redirects to CreateAccount component
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
window.location = { href: '' };

describe('Login Component Tests', () => {
    let mockOnNavigateToCreateAccount, mockOnSuccessfulLogin;

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        window.location.href = '';
        
        // Create mock functions for navigation
        mockOnNavigateToCreateAccount = jest.fn();
        mockOnSuccessfulLogin = jest.fn();
    });
    test('form elements are rendered correctly', () => {
        render(<Login onNavigateToCreateAccount={mockOnNavigateToCreateAccount} onSuccessfulLogin={mockOnSuccessfulLogin} />);
        // Check for heading
        expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
        // Check for username input
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        // Check for password input
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        // Check for login button
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
        // Check for create account button
        expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
    });

    test('input fields accept user input', () => {
        render(<Login onNavigateToCreateAccount={mockOnNavigateToCreateAccount} onSuccessfulLogin={mockOnSuccessfulLogin} />);
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        // Simulate user typing in username
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        expect(usernameInput.value).toBe('testuser');
        // Simulate user typing in password
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        expect(passwordInput.value).toBe('password123');
    });

    test('successful login redirects to dashboard', async () => {
        // Mock successful API response
        fetch.mockResolvedValueOnce({
            ok: true,
            text: async () => 'Login successful!',
        });
        render(<Login onNavigateToCreateAccount={mockOnNavigateToCreateAccount} onSuccessfulLogin={mockOnSuccessfulLogin} />);
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByRole('button', { name: /Login/i });
        // Simulate user typing in username and password
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(loginButton);
        // Wait for successful login callback
        await waitFor(() => {
            expect(mockOnSuccessfulLogin).toHaveBeenCalledWith({ username: 'testuser' });
        });
    });

    test('login with incorrect credentials displays error message', async () => {
        // Mock failed API response
        fetch.mockResolvedValueOnce({
            ok: true,
            text: async () => 'Invalid username or password',
        });
        render(<Login onNavigateToCreateAccount={mockOnNavigateToCreateAccount} onSuccessfulLogin={mockOnSuccessfulLogin} />);
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByRole('button', { name: /Login/i });
        // Simulate user typing in username and password
        fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
        fireEvent.click(loginButton);
        // Wait for error message
        await waitFor(() => {
            expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
        });
    });

    test('login with empty fields is prevented', async () => {
        render(<Login onNavigateToCreateAccount={mockOnNavigateToCreateAccount} onSuccessfulLogin={mockOnSuccessfulLogin} />);
        const loginButton = screen.getByRole('button', { name: /Login/i });
        // Click login button without filling in fields
        fireEvent.click(loginButton);
        // Ensure fetch was not called
        expect(fetch).not.toHaveBeenCalled();
    });

    test('clicking "Create Account" redirects to CreateAccount component', () => {
        render(<Login onNavigateToCreateAccount={mockOnNavigateToCreateAccount} onSuccessfulLogin={mockOnSuccessfulLogin} />);
        const createAccountButton = screen.getByRole('button', { name: /Create Account/i });
        fireEvent.click(createAccountButton);
        // Check for navigation callback
        expect(mockOnNavigateToCreateAccount).toHaveBeenCalled();
    });
});
