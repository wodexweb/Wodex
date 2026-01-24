import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import styles from "./EventsPage.module.scss";
import Card from "../../components/Card/Card";
import { EventsAPI, type EventItem } from "./api/events";

const AllEvents: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    EventsAPI.getAll()
      .then(setEvents)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className={styles.header}>
        <h1>All Events</h1>

        <p className={styles.breadcrumb}>
          <Link to="/" className={styles.home}>
            <AiFillHome className={styles.homeIcon} />
            <span>Home</span>
          </Link>
          <span className={styles.separator}>&gt;</span>
          <span className={styles.current}>Events</span>
        </p>
      </section>

      <section className={`${styles.section} section--dark`}>
        <div className={styles.container}>
          {loading ? (
            <p className={styles.empty}>Loading events...</p>
          ) : (
            <div className={styles.grid}>
              {events.map((event) => (
                <Card
                  key={event.id}
                  title={event.title}
                  image={event.photo_url ?? ""}
                  link={event.link} // ✅ FIX
                  date={event.end_date}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default AllEvents;
