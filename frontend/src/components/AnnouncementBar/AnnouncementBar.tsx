import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import styles from "./AnnouncementBar.module.scss";
import { HeaderSettingAPI, type HeaderSetting } from "./api/headerSetting.api";

const AnnouncementBar: React.FC = () => {
  const [data, setData] = useState<HeaderSetting | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    HeaderSettingAPI.get().then(setData);
  }, []);

  if (!isVisible || !data?.header_title) return null;

  return (
    <div
      className={styles.announcementBar}
      style={{ backgroundColor: data.title_color || "#d61f1f" }}
    >
      <div className={styles.container}>
        <div className={styles.announcementText}>
          <span className={styles.text}>{data.header_title}</span>

          {data.drive_link && (
            <a
              href={data.drive_link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.viewButton}
            >
              Click to View
            </a>
          )}
        </div>

        <button
          className={styles.closeButton}
          onClick={() => setIsVisible(false)}
          aria-label="Close"
        >
          <FiX />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
