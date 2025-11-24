//Login Component
import React from "react";
import logo from "../assets/logo.png";

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
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [message, setMessage] = React.useState("");

  // Function to handle login
  // Checks with backend if username and password are correct
  const handleLogin = async () => {
    // Validate that username and password are not empty
    if (!username.trim() || !password.trim()) {
      setMessage("Please enter both username and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);

        if (data.message === "Login successful.") {
          console.log("🎉 Login successful for username:", username);
          console.log("🚀 Calling onSuccessfulLogin with userData:", { username });
          onSuccessfulLogin({ username }); // Navigate to dashboard
        }
      } else {
        // Handle HTTP error responses (like 401 Unauthorized)
        const errorData = await response.json();
        setMessage(errorData.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Unable to connect to server. Please try again.");
    }
  };

  // Function to handle navigation to create account page
  const navigateToCreateAccount = () => {
    onNavigateToCreateAccount();
  };
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {/* WeatherKings Branding */}
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
      <h2>Login</h2> {/* Heading for the login page */}
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
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
