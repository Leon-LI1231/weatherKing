import React, { useState } from "react";
import Login from "./Login";
import CreateAccount from "./CreateAccount";
import LandingPage from "./LandingPage";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserInfoHeader from "./UserInfoHeader";

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
  const navigateToLandingPage = (userData) => {
     setUser(userData);
     setCurrentPage("landing");
  };
  const logout = () => {
    setUser(null);
    setCurrentPage("login");
  };

  // Render different components based on current page
  switch (currentPage) {
    case "createAccount":
      return <CreateAccount onNavigateToLogin={navigateToLogin} />;
      case "landing":
        return (
          <>
            <UserInfoHeader username={user?.username} balance={152.37} />
            <LandingPage user={user} onLogout={logout} />
          </>
        );
    case "login":
    default:
      return (
        <div>
        <Login 
          onNavigateToCreateAccount={navigateToCreateAccount}
          onSuccessfulLogin={navigateToLandingPage}
        />
        <button onClick={() => navigateToLandingPage({ username: "TestUser" })}>
          Temporary button to get to landing page
        </button>
        </div>
        
      );
  }
}

export default App;
