import React from "react";
import styles from "./Copyright.module.scss";

const Copyright: React.FC = () => {
  return (
    <div className={styles.copyrightContainer}>
      <div className={styles.copyrightBox}>
        <span>© 2026 AOP GUJARAT | All Rights Reserved.</span>
        <span>
          Website Developed By : <b>TEAMS</b>
        </span>
      </div>
    </div>
  );
};

export default Copyright;
