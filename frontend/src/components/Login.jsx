//Login Component
import React from "react";
import logo from "../assets/logo.png";
import { API_BASE } from "../api";

/**
 * =======================================================
 *                        LOGIN COMPONENT
 * =======================================================
 *
 * This component allows users to log into their account.
 *
 * Features:
 * - Collects username and password.
 * - Validates empty fields.
 * - Sends login request to backend (/api/login).
 * - Shows error message if login fails.
 * - Calls onSuccessfulLogin when login succeeds.
 * - Provides a button to navigate to the Create Account page.
 *
 */
function Login({ onNavigateToCreateAccount, onSuccessfulLogin }) {
  // Store username and password input values
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Store status messages (errors or login success)
  const [message, setMessage] = React.useState("");

  // Called when user clicks "Login"
  // Sends POST request to backend and checks credentials
  const handleLogin = async () => {
    // Prevent empty input submission
    if (!username.trim() || !password.trim()) {
      setMessage("Please enter both username and password.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);

        // Backend confirms login success
        if (data.message === "Login successful.") {
          console.log("🎉 Login successful for username:", username);
          console.log("🚀 Calling onSuccessfulLogin with userData:", { username });
          onSuccessfulLogin({ username });
        }
      } else {
        // Backend returned an error (e.g., wrong password)
        const errorData = await response.json();
        setMessage(errorData.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Unable to connect to server. Please try again.");
    }
  };

  // Navigate to Create Account page
  const navigateToCreateAccount = () => {
    onNavigateToCreateAccount();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {/* App logo and title */}
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          color: "#2c3e50",
          marginBottom: "20px",
        }}
      >
        WeatherKings
      </h1>
      <img
        src={logo}
        alt="WeatherKings Logo"
        style={{
          maxWidth: "200px",
          height: "auto",
          marginBottom: "30px",
        }}
      />

      {/* Login Form */}
      <h2>Login</h2>

      {/* Username input */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "12px 16px",
            fontSize: "16px",
            width: "250px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            outline: "none",
          }}
        />
      </div>

      {/* Password input */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "12px 16px",
            fontSize: "16px",
            width: "250px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            outline: "none",
          }}
        />
      </div>

      {/* Login + Create Account Buttons */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        <button
          onClick={handleLogin}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Login
        </button>

        <button
          onClick={navigateToCreateAccount}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Create Account
        </button>
      </div>

      {/* Error or success message */}
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
