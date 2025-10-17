// src/App.jsx
import React, { useState } from "react";
import Login from "./Login";
import CreateAccount from "./CreateAccount";
import './App.css';

/**
 * =======================================================
 *                    APP COMPONENT
 * =======================================================
 * 
 * This component manages navigation between different pages of the app.
 * It shows the Login component by default and handles navigation between
 * Login, CreateAccount, and Dashboard pages.
 * 
 */
function App() {
  const [currentPage, setCurrentPage] = useState("login"); // Default to login page
  const [user, setUser] = useState(null); // Store logged-in user info

  // Navigation functions
  const navigateToLogin = () => setCurrentPage("login");
  const navigateToCreateAccount = () => setCurrentPage("createAccount");
  const navigateToDashboard = (userData) => {
    setUser(userData);
    setCurrentPage("dashboard");
  };
  const logout = () => {
    setUser(null);
    setCurrentPage("login");
  };

  // Dashboard component (simple for now)
  const Dashboard = () => {
    const [message, setMessage] = useState(""); // state to hold backend message
    const [loading, setLoading] = useState(false); // state to indicate loading status

    // Function called on button click
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/hello");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const text = await response.text();
        setMessage(text);
      } catch (error) {
        setMessage("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Welcome{user ? `, ${user.username}` : ''}!</h2>
        <button onClick={logout} style={{ marginBottom: "20px", padding: "10px 20px" }}>
          Logout
        </button>
        <br />
        <button onClick={fetchData} disabled={loading}>
          {loading ? "Loading..." : "Fetch Data"}
        </button>
        {message && <p>{message}</p>}
      </div>
    );
  };

  // Render different components based on current page
  switch (currentPage) {
    case "createAccount":
      return <CreateAccount onNavigateToLogin={navigateToLogin} />;
    case "dashboard":
      return <Dashboard />;
    case "login":
    default:
      return (
        <Login 
          onNavigateToCreateAccount={navigateToCreateAccount}
          onSuccessfulLogin={navigateToDashboard}
        />
      );
  }
}

export default App;
