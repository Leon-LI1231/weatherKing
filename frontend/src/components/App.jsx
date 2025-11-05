import React, { useState, useEffect } from "react";
import Login from "./Login";
import CreateAccount from "./CreateAccount";
import LandingPage from "./LandingPage";
import CityPage from "./CityPage";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserInfoHeader from "./UserInfoHeader";
import UserPage from "./UserPage";

/**
 * =======================================================
 *                    APP COMPONENT
 * =======================================================
 * 
 * This component manages navigation between different pages of the app.
 * It shows the Login component by default and handles navigation between
 * Login, CreateAccount, and Dashboard pages.
 * 
 * State persistence:
 * - Saves app state to localStorage on state changes
 * - Restores state from localStorage on app refresh
 * - Maintains current page, user info, and selected city
 */

// Helper functions for localStorage
const getStoredState = () => {
  try {
    const storedState = localStorage.getItem('betAppState');
    return storedState ? JSON.parse(storedState) : null;
  } catch (error) {
    console.error('Error parsing stored state:', error);
    return null;
  }
};

const saveStateToStorage = (state) => {
  try {
    localStorage.setItem('betAppState', JSON.stringify(state));
  } catch (error) {
    console.error('Error saving state to localStorage:', error);
  }
};

function App() {
  // Initialize state from localStorage or defaults
  const storedState = getStoredState();
  const [currentPage, setCurrentPage] = useState(storedState?.currentPage || "login");
  const [user, setUser] = useState(storedState?.user || null);
  const [selectedCity, setSelectedCity] = useState(storedState?.selectedCity || null);
  const [isRestoringState, setIsRestoringState] = useState(!!storedState);

  // Save state to localStorage whenever state changes
  useEffect(() => {
    const stateToSave = {
      currentPage,
      user,
      selectedCity,
      timestamp: new Date().toISOString()
    };
    saveStateToStorage(stateToSave);
  }, [currentPage, user, selectedCity]);

  // Validate and cleanup restored state on mount
  useEffect(() => {
    const storedState = getStoredState();
    if (storedState) {
      // Check if stored state is too old (optional: expire after 24 hours)
      const stateAge = new Date() - new Date(storedState.timestamp);
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      if (stateAge > maxAge) {
        console.log('Stored state expired, clearing...');
        localStorage.removeItem('betAppState');
        setCurrentPage("login");
        setUser(null);
        setSelectedCity(null);
        return;
      }

      // Validate state consistency
      if (storedState.currentPage === "city" && !storedState.selectedCity) {
        console.log('Invalid state: city page without selected city, redirecting to landing');
        setCurrentPage(storedState.user ? "landing" : "login");
        setSelectedCity(null);
      }

      if ((storedState.currentPage === "landing" || storedState.currentPage === "user" || storedState.currentPage === "city") && !storedState.user) {
        console.log('Invalid state: logged-in page without user, redirecting to login');
        setCurrentPage("login");
        setUser(null);
        setSelectedCity(null);
      }
    }
    
    // State restoration is complete
    setIsRestoringState(false);
  }, []); // Run only on mount

  // Show loading indicator while restoring state
  if (isRestoringState) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e9ecef',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 10px'
          }}></div>
          <p>Restoring your session...</p>
        </div>
      </div>
    );
  }

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
  const navigateToUserPage = () => setCurrentPage("user");
  const logout = () => {
    setUser(null);
    setSelectedCity(null);
    setCurrentPage("login");
    // Clear all stored app data on logout
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('betApp'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
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
            onNavigateToUser={navigateToUserPage}
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
            onNavigateToUser={navigateToUserPage}
          />
          <CityPage
            cityName={selectedCity}
            user={user}
            onNavigateBack={() => navigateToLandingPage(user)}
            onLogout={logout}
          />
        </>
      );
      case "user":
        return (
          <>
            <UserInfoHeader
              username={user?.username}
              balance={152.37}
              currentPage="user"
              onLogout={logout}
              onNavigateToCity={navigateToCityPage}
              onNavigateToLanding={() => navigateToLandingPage(user)}
            />
            <UserPage user={user} />
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
