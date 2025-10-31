import React, { useState } from "react";
import Login from "./Login";
import CreateAccount from "./CreateAccount";
import LandingPage from "./LandingPage";
import CityPage from "./CityPage";
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
  const [selectedCity, setSelectedCity] = useState(null); // Store selected city for city pages

  // Navigation functions
  const navigateToLogin = () => setCurrentPage("login");
  const navigateToCreateAccount = () => setCurrentPage("createAccount");
  const navigateToLandingPage = (userData) => {
     setUser(userData);
     setCurrentPage("landing");
  };
  const navigateToCityPage = (cityName) => {
    console.log("Navigating to city:", cityName);
    try {
      setSelectedCity(cityName);
      setCurrentPage("city");
    } catch (error) {
      console.error("Error navigating to city page:", error);
    }
  };
  const logout = () => {
    setUser(null);
    setSelectedCity(null);
    setCurrentPage("login");
  };

  // Render different components based on current page
  switch (currentPage) {
    case "createAccount":
      return <CreateAccount onNavigateToLogin={navigateToLogin} />;
    case "landing":
      return (
        <>
          <UserInfoHeader 
            username={user?.username} 
            balance={152.37}
            currentPage="landing"
            onLogout={logout}
            onNavigateToCity={navigateToCityPage}
            onNavigateToLanding={() => navigateToLandingPage(user)}
          />
          <LandingPage 
            user={user} 
            onLogout={logout}
            onNavigateToCity={navigateToCityPage}
          />
        </>
      );
    case "city":
      console.log("Rendering city page for:", selectedCity);
      if (!selectedCity) {
        console.error("No city selected, redirecting to landing");
        setCurrentPage("landing");
        return null;
      }
      return (
        <>
          <UserInfoHeader 
            username={user?.username} 
            balance={152.37}
            currentPage={selectedCity}
            onLogout={logout}
            onNavigateToCity={navigateToCityPage}
            onNavigateToLanding={() => navigateToLandingPage(user)}
          />
          <CityPage
            cityName={selectedCity}
            user={user}
            onNavigateBack={() => navigateToLandingPage(user)}
            onLogout={logout}
          />
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
