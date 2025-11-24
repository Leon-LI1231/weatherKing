// Drawer component for the application
import React from "react";
import { Offcanvas, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * =======================================================
 *                     DRAWER COMPONENT
 * ======================================================
 *
 * This component provides a side navigation drawer that can be toggled
 * open or closed. It contains navigation links to different sections of the app.
 * The sections will include the landing page, user page, a page for each city, and
 * a logout option. The drawer will indicate the currently actiive page.
 *
 * Props:
 *   - show: boolean to control visibility of the drawer
 *   - onClose: function to handle closing the drawer
 *   - currentPage: string indicating the currently active page.
 *   - onNavigate: function to handle navigation to different pages
 */

function Drawer({ show, onClose, currentPage, onNavigate }) {
  return (
    <Offcanvas show={show} onHide={onClose}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Navigation</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Nav defaultActiveKey={currentPage} className="flex-column">
          <Nav.Link eventKey="landing" onClick={() => onNavigate && onNavigate("landing")}>
            Landing Page
          </Nav.Link>
          <Nav.Link eventKey="user" onClick={() => onNavigate && onNavigate("user")}>
            User Page
          </Nav.Link>
          <Nav.Link eventKey="Madison" onClick={() => onNavigate && onNavigate("Madison")}>
            Madison
          </Nav.Link>
          <Nav.Link eventKey="Los Angeles" onClick={() => onNavigate && onNavigate("Los Angeles")}>
            Los Angeles
          </Nav.Link>
          <Nav.Link
            eventKey="New York City"
            onClick={() => onNavigate && onNavigate("New York City")}
          >
            New York City
          </Nav.Link>
          <Nav.Link
            eventKey="logout"
            onClick={() => onNavigate && onNavigate("logout")}
            style={{ color: "#dc3545", fontWeight: "500" }}
          >
            Logout
          </Nav.Link>
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default Drawer;
