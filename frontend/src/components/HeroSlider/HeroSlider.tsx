import React from "react";
import styles from "./HeroSlider.module.scss";

const HeroSlider: React.FC = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroImage}>
        <img
          src="https://cdn.pixabay.com/photo/2022/09/27/19/46/ai-generated-7483596_960_720.jpg"
          alt="Happy children - Academy of Paediatrics"
          className={styles.heroImg}
        />
      </div>

      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <h1 className={styles.mainTitle}>ACADEMY OF PEDIATRICS,</h1>
          <h2 className={styles.subTitle}>GUJARAT</h2>
        </div>
      </div>

      {/* 🔵 Bottom Update Bar */}
      <div className={styles.updateBar}>
        <div className={styles.latestTag}>
          <span className={styles.homeIcon}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3z" />
            </svg>
          </span>
          LATEST UPDATES
        </div>

        {/* RIGHT CONTROLS */}
        {/* <div className={styles.controls}>
          <button className={styles.controlBtn}>‹</button>
          <button className={styles.controlBtn}>‖</button>
          <button className={styles.controlBtn}>›</button>
        </div> */}
      </div>
    </section>
  );
};

export default HeroSlider;
