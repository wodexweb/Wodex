import React from "react";
import styles from "./Copyright.module.scss";

const Copyright: React.FC = () => {
  return (
    <div className={styles.copyright}>
      <span>© 2026 AOP GUJARAT | All Rights Reserved.</span>
      <span>
        Website Developed By : <b>Wodex Web</b>
      </span>
    </div>
  );
};

export default Copyright;
