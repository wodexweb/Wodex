import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import styles from "./AnnouncementBar.module.scss";

interface AnnouncementProps {
  text?: string;
  link?: string;
}

const AnnouncementBar: React.FC<AnnouncementProps> = ({
  text = "SPECTRUM 2025-26 VOL-3 | Click to View",
  link = "#",
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => setIsVisible(false);

  if (!isVisible) return null;

  return (
    <div className={styles.announcementBar}>
      <div className={styles.container}>
        <div className={styles.announcementText}>
          <a href={link} className={styles.link}>
            {text}
          </a>
        </div>
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="X"
        >
          <FiX />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
