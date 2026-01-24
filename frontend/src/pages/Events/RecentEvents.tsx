import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import styles from "./EventsPage.module.scss";
import Card from "../../components/Card/Card";
import Modal from "../../components/Card/Modal";
import { EventsAPI, type EventItem } from "./api/events";

const RecentEvents: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<EventItem | null>(null);

  useEffect(() => {
    EventsAPI.getRecent()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* HEADER */}
      <section className={styles.header}>
        <h1>Recent Events</h1>

        <p className={styles.breadcrumb}>
          <Link to="/" className={styles.home}>
            <AiFillHome className={styles.homeIcon} />
            <span className={styles.homeText}>Home</span>
          </Link>

          <span className={styles.separator}>&gt;</span>
          <span className={styles.current}>Events</span>

          <span className={styles.separator}>&gt;</span>
          <span className={styles.current}>Recent</span>
        </p>
      </section>

      {/* CONTENT */}
      <section className={`${styles.section} section--dark`}>
        <div className={styles.container}>
          {loading ? (
            <p className={styles.empty}>Loading events...</p>
          ) : events.length === 0 ? (
            <p className={styles.empty}>No recent events</p>
          ) : (
            <div className={styles.grid}>
              {events.map((event) => (
                <Card
                  key={event.id}
                  title={event.title}
                  image={event.photo_url ?? ""}
                  date={event.date}
                  onClick={() => {
                    setActive(event);
                    setOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={active?.title || ""}
        image={active?.photo_url || ""}
        description={active?.description || ""}
      />
    </>
  );
};

export default RecentEvents;
