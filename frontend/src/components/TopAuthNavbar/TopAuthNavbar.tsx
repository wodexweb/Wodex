import React from "react";
import { Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./TopAuthNavbar.module.scss";

const TopAuthNavbar: React.FC = () => {
  return (
    <div className={styles.topBar}>
      <Container className={styles.inner}>
        <Nav className={styles.nav}>
          <Nav.Link as={Link} to="/login" className={styles.link}>
            Login
          </Nav.Link>

          {/* CONNECTED */}
          <Nav.Link as={Link} to="/payment" className={styles.link}>
            Apply for Membership
          </Nav.Link>
        </Nav>
      </Container>
    </div>
  );
};

export default TopAuthNavbar;
