import React, { useState, useEffect, useCallback } from "react";
import Login from "./Login";
import CreateAccount from "./CreateAccount";
import LandingPage from "./LandingPage";
import CityPage from "./CityPage";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
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
    const storedState = localStorage.getItem("betAppState");
    return storedState ? JSON.parse(storedState) : null;
  } catch (error) {
    console.error("Error parsing stored state:", error);
    return null;
  }
};

const saveStateToStorage = (state) => {
  try {
    localStorage.setItem("betAppState", JSON.stringify(state));
  } catch (error) {
    console.error("Error saving state to localStorage:", error);
  }
};

function App() {
  // Initialize state from localStorage or defaults
  const storedState = getStoredState();
  const [currentPage, setCurrentPage] = useState(storedState?.currentPage || "login");
  const [user, setUser] = useState(storedState?.user || null);
  const [selectedCity, setSelectedCity] = useState(storedState?.selectedCity || null);
  const [isRestoringState, setIsRestoringState] = useState(!!storedState);

  // Function to refresh user data from backend and update localStorage
  const refreshUserData = useCallback(
    async (username) => {
      if (!username) {
        console.warn("⚠️ No username provided to refreshUserData");
        return null;
      }

      try {
        console.log("🔄 Refreshing user data from backend for:", username);
        const response = await fetch(`http://localhost:8080/api/user/${username}`);
        if (response.ok) {
          const updatedUserData = await response.json();
          console.log("✅ Successfully refreshed user data:", updatedUserData);
          console.log("💰 Updated Balance:", updatedUserData.balanceUsd);

          // Update user state
          setUser(updatedUserData);

          // Explicitly save to localStorage
          const updatedState = {
            currentPage,
            user: updatedUserData,
            selectedCity,
            timestamp: new Date().toISOString(),
          };
          saveStateToStorage(updatedState);
          console.log("✅ Refreshed user data saved to localStorage");

          return updatedUserData;
        } else {
          console.error("❌ Failed to refresh user data:", response.statusText);
          return null;
        }
      } catch (error) {
        console.error("❌ Error refreshing user data:", error);
        return null;
      }
    },
    [currentPage, selectedCity],
  );

  // Save state to localStorage whenever state changes
  useEffect(() => {
    const stateToSave = {
      currentPage,
      user,
      selectedCity,
      timestamp: new Date().toISOString(),
    };
    saveStateToStorage(stateToSave);
  }, [currentPage, user, selectedCity]);

  // Log user data changes to console
  useEffect(() => {
    if (user) {
      console.log("👤 USER STATE UPDATED:", user);
      console.log("📊 User Info Summary:", {
        username: user.username,
        email: user.email || "No email",
        balance:
          user.balanceUsd !== undefined ? `$${user.balanceUsd.toFixed(2)}` : "No balance data",
        uid: user.uid || "No UID",
        createdAt: user.createdAt || "No creation date",
      });
      console.log("💰 Available Balance: $" + (user.balanceUsd || 0).toFixed(2));
    } else {
      console.log("👤 USER STATE CLEARED (logged out)");
    }
  }, [user]);

  // Periodically refresh user data to keep balance current (every 5 minutes)
  useEffect(() => {
    if (user && user.username) {
      const interval = setInterval(
        () => {
          console.log("⏰ Periodic user data refresh triggered");
          refreshUserData(user.username);
        },
        5 * 60 * 1000,
      ); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [user, refreshUserData]);

  // Refresh user data when window regains focus (user returns to tab)
  useEffect(() => {
    const handleFocus = () => {
      if (user && user.username) {
        console.log("👀 Window focus detected - refreshing user data");
        refreshUserData(user.username);
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user, refreshUserData]);

  // Validate and cleanup restored state on mount
  useEffect(() => {
    const storedState = getStoredState();
    if (storedState) {
      // Check if stored state is too old (optional: expire after 24 hours)
      const stateAge = new Date() - new Date(storedState.timestamp);
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if (stateAge > maxAge) {
        console.log("Stored state expired, clearing...");
        localStorage.removeItem("betAppState");
        setCurrentPage("login");
        setUser(null);
        setSelectedCity(null);
        return;
      }

      // Validate state consistency
      if (storedState.currentPage === "city" && !storedState.selectedCity) {
        console.log("Invalid state: city page without selected city, redirecting to landing");
        setCurrentPage(storedState.user ? "landing" : "login");
        setSelectedCity(null);
      }

      if (
        (storedState.currentPage === "landing" ||
          storedState.currentPage === "user" ||
          storedState.currentPage === "city") &&
        !storedState.user
      ) {
        console.log("Invalid state: logged-in page without user, redirecting to login");
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #e9ecef",
              borderTop: "4px solid #007bff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 10px",
            }}
          ></div>
          <p>Restoring your session...</p>
        </div>
      </div>
    );
  }

  // Navigation functions
  const navigateToLogin = () => setCurrentPage("login");
  const navigateToCreateAccount = () => setCurrentPage("createAccount");

  const navigateToLandingPage = async (userData) => {
    console.log("🔍 NavigateToLandingPage called with userData:", userData);
    try {
      // If userData contains just username (from login), fetch full user info
      if (userData && userData.username && !userData.balanceUsd) {
        console.log("📡 Fetching full user data from backend for username:", userData.username);
        const response = await fetch(`http://localhost:8080/api/user/${userData.username}`);
        if (response.ok) {
          const fullUserData = await response.json();
          console.log("✅ Successfully fetched user data from backend:", fullUserData);
          console.log("💰 User Balance:", fullUserData.balanceUsd);
          console.log("👤 User Details:", {
            username: fullUserData.username,
            email: fullUserData.email,
            uid: fullUserData.uid,
            balance: fullUserData.balanceUsd,
            createdAt: fullUserData.createdAt,
          });

          // Update user state (this will trigger the useEffect to save to localStorage)
          setUser(fullUserData);

          // Also explicitly save updated user data to localStorage immediately
          console.log("💾 Saving updated user data to localStorage");
          const updatedState = {
            currentPage: "landing",
            user: fullUserData,
            selectedCity,
            timestamp: new Date().toISOString(),
          };
          saveStateToStorage(updatedState);
          console.log("✅ User data successfully saved to localStorage");
        } else {
          console.error("❌ Failed to fetch user data:", response.statusText);
          console.error("❌ Response status:", response.status);
          // Fallback: use provided userData
          console.log("⚠️ Using fallback userData:", userData);
          setUser(userData);
        }
      } else {
        // Use provided userData if it already contains full user info
        console.log("✅ Using provided userData (already contains full info):", userData);
        if (userData && userData.balanceUsd !== undefined) {
          console.log("💰 User Balance:", userData.balanceUsd);
        }
        setUser(userData);
      }
      setCurrentPage("landing");
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
      // Fallback: use provided userData
      console.log("⚠️ Using fallback userData due to error:", userData);
      setUser(userData);
      setCurrentPage("landing");
    }
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
  const navigateToUserPage = async () => {
    // Refresh user data when navigating to user page to ensure balance is current
    if (user && user.username) {
      console.log("🔄 Refreshing user data before showing user page");
      await refreshUserData(user.username);
    }
    setCurrentPage("user");
  };

  const handleBalanceUpdate = (newBalance) => {
    console.log("💰 Updating balance to:", newBalance);
    setUser((prevUser) => ({
      ...prevUser,
      balanceUsd: newBalance,
    }));
  };
  const logout = () => {
    console.log("🚪 Logging out - clearing user data and localStorage");
    setUser(null);
    setSelectedCity(null);
    setCurrentPage("login");

    // Clear all stored app data on logout
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("betApp")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    // Also explicitly clear the main app state
    localStorage.removeItem("betAppState");
    console.log("✅ LocalStorage cleared on logout");
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
            balance={user?.balanceUsd}
            currentPage="landing"
            onLogout={logout}
            onNavigateToCity={navigateToCityPage}
            onNavigateToLanding={() => navigateToLandingPage(user)}
            onNavigateToUser={navigateToUserPage}
            onRefreshBalance={refreshUserData}
          />
          <LandingPage user={user} onLogout={logout} onNavigateToCity={navigateToCityPage} />
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
            balance={user?.balanceUsd}
            currentPage={selectedCity}
            onLogout={logout}
            onNavigateToCity={navigateToCityPage}
            onNavigateToLanding={() => navigateToLandingPage(user)}
            onNavigateToUser={navigateToUserPage}
            onRefreshBalance={refreshUserData}
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
            balance={user?.balanceUsd}
            currentPage="user"
            onLogout={logout}
            onNavigateToCity={navigateToCityPage}
            onNavigateToLanding={() => navigateToLandingPage(user)}
            onRefreshBalance={refreshUserData}
          />
          <UserPage user={user} onBalanceUpdate={handleBalanceUpdate} />
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

          {/*  HIDDEN TEMPORARY BUTTON FOR TESTS (does not appear in UI) */}
          <button
            onClick={() => {
              setUser({ username: "TestUser" });
              setCurrentPage("landing");
            }}
            style={{ display: "none" }}
          >
            Temporary button to get to landing page
          </button>
        </div>
      );
  }
}

export default App;
