import React, { useState } from "react";
import { Navbar, Container, Nav, Badge, Button } from "react-bootstrap";
import Drawer from "./Drawer";

/**
 * =======================================================
 *                  USER INFO HEADER COMPONENT
 * =======================================================
 *
 * This component renders a top navigation bar that displays:
 *   - The app title ("WeatherKings")
 *   - A hamburger menu button to open the navigation drawer
 *   - The logged-in user's username
 *   - The user's available currency balance
 *
 * It is designed to appear fixed at the top of the screen across all pages
 * after login, providing a consistent user experience and navigation access.
 *
 * Props:
 *   - username: the currently logged-in user's username
 *   - balance: the user's current account balance
 *   - currentPage: the current page for drawer highlighting
 *   - onLogout: function to handle user logout
 *   - onNavigateToCity: function to navigate to city pages
 *   - onNavigateToLanding: function to navigate to landing page
 *   - onRefreshBalance: function to refresh user balance from backend
 */

function UserInfoHeader({
  username,
  balance,
  currentPage,
  onLogout,
  onNavigateToCity,
  onNavigateToLanding,
  onNavigateToUser,
  onRefreshBalance,
}) {
  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Log balance updates to console
  React.useEffect(() => {
    if (username && balance !== undefined) {
      console.log(`💰 UserInfoHeader - Displaying balance for ${username}: $${balance.toFixed(2)}`);
    } else if (username && balance === undefined) {
      console.log(`⚠️ UserInfoHeader - Balance undefined for ${username}`);
    }
  }, [username, balance]);

  // Handle navigation from drawer
  const handleDrawerNavigation = (page) => {
    console.log("Drawer navigation called with page:", page);
    setDrawerOpen(false); // Close drawer after navigation

    try {
      if (page === "logout") {
        console.log("Logging out...");
        onLogout();
      } else if (page === "landing") {
        console.log("Navigating to landing...");
        onNavigateToLanding && onNavigateToLanding();
      } else if (["Madison", "Los Angeles", "New York City"].includes(page)) {
        console.log("Navigating to city:", page);
        onNavigateToCity(page); // Navigate to dedicated city page
      } else if (page === "user") {
        console.log("Navigating to user...");
        onNavigateToUser && onNavigateToUser();
      }
    } catch (error) {
      console.error("Error in drawer navigation:", error);
    }
    // Add more navigation logic as needed for other pages
  };
  return (
    <>
      <Navbar
        bg="light"
        expand="lg"
        className="shadow-sm"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "100%",
          zIndex: 1000,
        }}
      >
        {/* Hamburger Menu Button - Positioned absolutely on the left */}
        <Button
          variant="outline-primary"
          onClick={() => setDrawerOpen(true)}
          style={{
            position: "absolute",
            left: "15px",
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            background: "transparent",
            fontSize: "1.2rem",
            color: "#0d6efd",
            zIndex: 1001,
          }}
        >
          ☰
        </Button>

        {/* WeatherKings Brand - Positioned absolutely next to the hamburger button */}
        <Navbar.Brand
          style={{
            position: "absolute",
            left: "60px",
            top: "50%",
            transform: "translateY(-50%)",
            fontWeight: "600",
            margin: 0,
            zIndex: 1001,
          }}
        >
          WeatherKings
        </Navbar.Brand>

        <Container>
          <Nav className="ms-auto">
            {username && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "1rem",
                }}
              >
                <span>
                  <strong>{username}</strong>
                </span>
                <Badge
                  bg="info"
                  text="dark"
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  ${balance !== undefined && balance !== null ? balance.toFixed(2) : "0.00"}
                  {onRefreshBalance && (
                    <span
                      onClick={() => onRefreshBalance(username)}
                      style={{
                        cursor: "pointer",
                        fontSize: "0.8em",
                        opacity: 0.8,
                        marginLeft: "3px",
                      }}
                      title="Refresh balance"
                    >
                      ↻
                    </span>
                  )}
                </Badge>
              </div>
            )}
          </Nav>
        </Container>
      </Navbar>

      {/* Drawer Component */}
      <Drawer
        show={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        currentPage={currentPage}
        onNavigate={handleDrawerNavigation}
      />
    </>
  );
}

export default UserInfoHeader;
