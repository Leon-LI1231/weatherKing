//Login Component
import React from 'react';

/**
 * =======================================================
 *                  LOGIN COMPONENT
 * ======================================================
 * 
 * This component will be an endpoint for users to log in to their account.
 * The fields will be username and password checking against the backend
 * for existing usernames. Successful login will redirect
 * to the home page. The user will have the option to create an account.
 * If the username or password is incorrect, an error message will be displayed
 * telling the user to try again.
 * 
 */
function Login({ onNavigateToCreateAccount, onSuccessfulLogin }) {
    // State variables for username and password
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [message, setMessage] = React.useState('');

    // Function to handle login
    // Checks with backend if username and password are correct
    const handleLogin = async () => {
        // Validate that username and password are not empty
        if (!username.trim() || !password.trim()) {
            setMessage('Please enter both username and password.');
            return;
        }
        
        try {
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: {  'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const text = await response.text();
            setMessage(text);
            if (text === 'Login successful!') {
                onSuccessfulLogin({ username }); // Navigate to dashboard
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
    };

    // Function to handle navigation to create account page
    const navigateToCreateAccount = () => {
        onNavigateToCreateAccount();
    };
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Login</h2> {/* Heading for the login page */}
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <button onClick={handleLogin}>Login</button>
            </div>
            <div>
                <button onClick={navigateToCreateAccount}>Create Account</button>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Login;