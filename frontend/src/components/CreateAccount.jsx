//Create Account Component
import React from 'react';

/**
 * =======================================================
 *                  CREATE ACCOUNT COMPONENT
 * ======================================================
 * 
 * This component will be an endpoint for users to create a new account.
 * The fields will be username and password checking against the backend
 * for existing usernames. Successful account creation will redirect
 * to the login page and the username and password will be stored
 * in the database. The user will have the option to cancel account creation.
 * 
 */
function CreateAccount({ onNavigateToLogin }) {
    // State variables for username and password
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [message, setMessage] = React.useState('');

    // Function to handle account creation
    // Checks with backend if username already exists
    // If not, creates account and redirects to login page
    const handleCreateAccount = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/create-account', {
                method: 'POST',
                headers: {  'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const text = await response.text();
            setMessage(text);
            
            // Redirect to login page on successful account creation
            if (text === 'Account created successfully!') {
                onNavigateToLogin();
            }
        } catch (error) {
            console.error('Error creating account:', error);
            setMessage('Failed to create account. Please try again.');
        }
    };

    // Function to handle cancel action and return to login page
    const handleCancel = () => {
        onNavigateToLogin(); // Navigate back to login page
    };



    // Ensure that the username and password are not empty when trying to create an account
    const isFormValid = username.trim() !== '' && password.trim() !== '';

    // Ensure that the username is not already taken by checking the message from the backend
    const isUsernameTaken = message === 'Username already exists';
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Create Account</h2> {/* Heading for the create account page */}
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ padding: '10px', fontSize: '16px', width: '200px' }}
                />
            </div> {/* Input field for username */}
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ padding: '10px', fontSize: '16px', width: '200px' }}
                />
            </div> {/* Input field for password */} 
            <div>
                <button
                    onClick={handleCreateAccount}
                    disabled={!isFormValid || isUsernameTaken}
                    style={{
                        margin: '10px',
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: !isFormValid || isUsernameTaken ? 'not-allowed' : 'pointer',
                    }}>Create Account
                </button>
                <button
                    onClick={handleCancel}
                    style={{
                        margin: '10px',
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                    }}>Cancel
                </button>
            </div> {/* Buttons for creating account and canceling */}
            {message && (
                <p style={{ marginTop: '20px', fontSize: '18px', color: isUsernameTaken ? 'red' : 'green' }}>
                    {message}
                </p>
            )} {/* Display message from backend */}
        </div>
    );
}

export default CreateAccount;