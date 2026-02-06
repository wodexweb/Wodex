import React, { useState, useEffect } from "react";
import styles from "./Achievement.module.scss";
import PageHeaderArea from "../../components/PageHeaderArea/PageHeaderArea";
import { Trophy } from "lucide-react";
import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

/* ================= CARD ================= */

const AchievementCard = ({
  title,
  description,
  image_url,
  created_at,
  status,
}: any) => {
  const isLocked = status !== "active";

  const date = created_at
    ? new Date(created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div className={`${styles.card} ${isLocked ? styles.isLocked : ""}`}>
      <div className={styles.iconWrapper}>
        {image_url ? (
          <img src={image_url} alt={title} className={styles.cardImage} />
        ) : (
          <Trophy size={28} />
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3>{title || "Untitled Achievement"}</h3>
          {!isLocked && <span className={styles.date}>{date}</span>}
        </div>

        {description ? (
          <p className={styles.description}>{description}</p>
        ) : (
          <p
            className={styles.description}
            style={{ fontStyle: "italic", opacity: 0.5 }}
          >
            No description provided.
          </p>
        )}
      </div>

      {isLocked && <div className={styles.lockedBadge}>Locked</div>}
    </div>
  );
};

/* ================= PAGE ================= */

const AchievementPage: React.FC = () => {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/achievements")
      .then((data: any) => {
        // APIClient already returns response.data
        setAchievements(data.data ?? data);
      })
      .catch((err) => {
        console.error("Failed to load achievements:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeaderArea title="Achievements" current="Achievements" />

      <section className={styles.page}>
        <div className={styles.container}>
          <div className={styles.contentHeader}>
            <h2>Our Milestones</h2>
            <p>Tracking the growth and success of GPICC.</p>
          </div>

          <div className={styles.grid}>
            {!loading &&
              achievements.map((item) => (
                <AchievementCard key={item.id} {...item} />
              ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AchievementPage;
