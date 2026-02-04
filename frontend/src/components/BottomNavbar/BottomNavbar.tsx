import React, { useState } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./BottomNavbar.module.scss";

// ✅ hook
import { useMenu } from "../../hooks/useMenu";

const BottomNavbar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  const closeMenu = () => setExpanded(false);

  // ✅ correct destructuring
  const { menu, loading } = useMenu("header");

  // ✅ optional: don’t render until menu loads
  if (loading) {
    return (
      <Navbar expand="lg" className={styles.navbar}>
        <div className="container" />
      </Navbar>
    );
  }

  return (
    <Navbar expand="lg" className={styles.navbar} expanded={expanded}>
      <div className="container">
        <Navbar.Toggle
          aria-controls="top-nav"
          onClick={() => setExpanded((prev) => !prev)}
        />

        <Navbar.Collapse id="top-nav">
          <Nav className={`${styles.navLinks} mx-auto`}>
            {/* ================= EXISTING STATIC MENU (UNCHANGED) ================= */}

            <Nav.Link
              as={Link}
              to="/"
              className={styles.navLink}
              onClick={closeMenu}
            >
              Home
            </Nav.Link>

            <NavDropdown title="About Us">
              <NavDropdown.Item as={Link} to="/about-iap" onClick={closeMenu}>
                About IAP
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/bank-details"
                onClick={closeMenu}
              >
                Bank Details
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/logos" onClick={closeMenu}>
                IAP Logo
              </NavDropdown.Item>
            </NavDropdown>

            
            <Nav.Link
              as={Link}
              to="/achievement"
              className={styles.navLink}
              onClick={closeMenu}
            >
              Achievement
            </Nav.Link>

            <NavDropdown title="Events">
              <NavDropdown.Item as={Link} to="/events" onClick={closeMenu}>
                All Events
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/events/upcoming"
                onClick={closeMenu}
              >
                Upcoming Events
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/events/recent"
                onClick={closeMenu}
              >
                Recent Events
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/events/past" onClick={closeMenu}>
                Past Events
              </NavDropdown.Item>
            </NavDropdown>

            

            <NavDropdown title="Office Bearers">
              <NavDropdown.Item
                as={Link}
                to="/office-bearers"
                onClick={closeMenu}
              >
                Office Bearers 2026
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Education">
              <NavDropdown.Item as={Link} to="/pdf-pages" onClick={closeMenu}>
                PDF-Pages
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link
              as={Link}
              to="/members-directory"
              className={styles.navLink}
              onClick={closeMenu}
            >
              Member’s Directory
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/gallery"
              className={styles.navLink}
              onClick={closeMenu}
            >
              Gallery
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/contact-us"
              className={styles.navLink}
              onClick={closeMenu}
            >
              Contact Us  
            </Nav.Link>

             <Nav.Link
              as={Link}
              to="/Notices"
              className={styles.navLink}
              onClick={closeMenu}
            >
              Notices
            </Nav.Link>

            {/* ================= DYNAMIC MENU (ADDED ONLY) ================= */}

            {menu.map((item) =>
              item.children && item.children.length > 0 ? (
                <NavDropdown title={item.title} key={`dyn-${item.id}`}>
                  {item.children.map((child) => (
                    <NavDropdown.Item
                      key={`dyn-child-${child.id}`}
                      as={Link}
                      to={child.url}
                      onClick={closeMenu}
                    >
                      {child.title}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
              ) : (
                <Nav.Link
                  key={`dyn-${item.id}`}
                  as={Link}
                  to={item.url}
                  className={styles.navLink}
                  onClick={closeMenu}
                >
                  {item.title}
                </Nav.Link>
              ),
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default BottomNavbar;
