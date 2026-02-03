import React from "react";
import { Container, Nav } from "react-bootstrap";
import styles from "./TopAuthNavbar.module.scss";

const TopAuthNavbar: React.FC = () => {
  return (
    <div className={styles.topBar}>
      <Container className={styles.inner}>
        <Nav className={styles.nav}>
          <Nav.Link href="/login" className={styles.link}>
            Login
          </Nav.Link>
          <Nav.Link href="/membership" className={styles.link}>
            Apply for Membership
          </Nav.Link>
        </Nav>
      </Container>
    </div>
  );
};

export default TopAuthNavbar;
