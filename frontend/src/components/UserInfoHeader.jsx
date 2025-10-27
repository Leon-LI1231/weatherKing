import React from "react";
import { Navbar, Container, Nav, Badge } from "react-bootstrap";

/**
 * =======================================================
 *                  USER INFO HEADER COMPONENT
 * =======================================================
 *
 * This component renders a top navigation bar that displays:
 *   - The app title ("WeatherKings")
 *   - The logged-in user's username
 *   - The user's available currency balance
 *
 * It is designed to appear fixed at the top of the screen across all pages
 * after login, providing a consistent user experience.
 *
 * Props:
 *   - username: the currently logged-in user's username
 *   - balance: the user's current account balance
 */


function UserInfoHeader({ username, balance }) {
  return (
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
      <Container>
        <Navbar.Brand style={{ fontWeight: "600" }}>WeatherKings</Navbar.Brand>
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
              <Badge bg="info" text="dark">
                ${balance.toFixed(2)}
              </Badge>
            </div>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default UserInfoHeader;
