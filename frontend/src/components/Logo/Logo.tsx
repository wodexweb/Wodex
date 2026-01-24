import React from "react";
import logo from "../../assets/logo/GPAC logo 2.png";
import styles from "./Logo.module.scss";

const Logo: React.FC = () => {
  return (
    <section className={styles.logoBar}>
      <div className={styles.inner}>
        <img
          src={logo}
          alt="Academy of Paediatrics, Gujarat"
          className={styles.logo}
        />
      </div>
    </section>
  );
};

export default Logo;
