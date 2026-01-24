import React, { useEffect, useState } from "react";
import styles from "./AnnouncementSection.module.scss";
import Card from "../Card/Card";
import Modal from "../Card/Modal";
import { AnnouncementAPI, type Announcement } from "./api/announcements";

const AnnouncementSection: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Announcement | null>(null);
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await AnnouncementAPI.getAll();

        // assuming API returns latest first
        setItems(data);
      } catch (err) {
        console.error("Failed to load announcements", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const visibleItems = showAll ? items : items.slice(0, 3);

  return (
    <>
      <section className={`${styles.section} section--dark`}>
        <h2 className={styles.heading}>ANNOUNCEMENT</h2>

        {loading ? (
          <p>Loading announcements...</p>
        ) : items.length === 0 ? (
          <p>No announcements</p>
        ) : (
          <>
            <div className="app-card-grid">
              {visibleItems.map((item) => (
                <Card
                  key={item.id}
                  title={item.title}
                  image={item.photo_url ?? ""}
                  onClick={() => {
                    setActive(item);
                    setOpen(true);
                  }}
                />
              ))}
            </div>

            {items.length > 3 && (
              <div className={styles.viewMoreWrap}>
                <button
                  className={styles.viewMoreBtn}
                  onClick={() => setShowAll((prev) => !prev)}
                >
                  {showAll ? "View Less" : "View More"}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={active?.title || ""}
        image={active?.photo_url || ""}
      />
    </>
  );
};

export default AnnouncementSection;
