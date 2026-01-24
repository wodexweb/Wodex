import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./BottomNavbar.module.scss";

const BottomNavbar: React.FC = () => {
  return (
    <Navbar expand="lg" className={styles.navbar}>
      <div className="container">
        <Navbar.Toggle aria-controls="top-nav" />
        <Navbar.Collapse id="top-nav">
          <Nav className={`${styles.navLinks} mx-auto`}>
            {/* HOME */}
            <Nav.Link as={Link} to="/" className={styles.navLink}>
              Home
            </Nav.Link>

            {/* ABOUT */}
            <NavDropdown title="About Us" className={styles.dropdown}>
              <NavDropdown.Item as={Link} to="/about-iap">
                About IAP
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/bank-details">
                Bank Details
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/logos">
                IAP Logo
              </NavDropdown.Item>
            </NavDropdown>

            {/* EVENTS */}
            <NavDropdown title="Events" className={styles.dropdown}>
              <NavDropdown.Item as={Link} to="/events">
                All Events
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/events/upcoming">
                Upcoming Events
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/events/recent">
                Recent Events
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/events/past">
                Past Events
              </NavDropdown.Item>
            </NavDropdown>

            {/* OFFICE */}
            <NavDropdown title="Office Bearers" className={styles.dropdown}>
              <NavDropdown.Item as={Link} to="/office-bearers">
                Office Bearers 2026
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link
              className={styles.navLink}
              as={Link}
              to="/members-directory"
            >
              Member’s Directory
            </Nav.Link>

            <Nav.Link className={styles.navLink} as={Link} to="/gallery">
              Gallery
            </Nav.Link>

            <Nav.Link className={styles.navLink} as={Link} to="/contact-us">
              Contact Us
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default BottomNavbar;
