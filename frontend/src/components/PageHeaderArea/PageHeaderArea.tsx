import React from "react";
import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import styles from "./PageHeaderArea.module.scss";

interface PageHeaderAreaProps {
  title: string;
  current: string;
}

const PageHeaderArea: React.FC<PageHeaderAreaProps> = ({ title, current }) => {
  return (
    <section className={styles.header}>
      <h1>{title}</h1>

      <p className={styles.breadcrumb}>
        <Link to="/" className={styles.home}>
          <AiFillHome className={styles.homeIcon} />
          <span>Home</span>
        </Link>
        <span className={styles.separator}>&gt;</span>
        <span className={styles.current}>{current}</span>
      </p>
    </section>
  );
};

export default PageHeaderArea;
