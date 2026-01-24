import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import styles from "./EventsPage.module.scss";
import Card from "../../components/Card/Card";
import { EventsAPI } from "./api/events";

type NormalizedEvent = {
  end_date: string | undefined;
  link: string;
  id: number;
  title: string;
  photo_url: string | null;
  date?: string;
};

const UpcomingEvents: React.FC = () => {
  const [events, setEvents] = useState<NormalizedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    EventsAPI.getUpcoming()
      .then((data) => {
        console.log("RAW upcoming events:", data);

        // ✅ NORMALIZATION (THIS FIXES EVERYTHING)
        const normalized = data
          .map((e: any) => ({
            id: e.id ?? e.event_id, // 🔥 FIX
            title: e.title,
            photo_url: e.photo_url,
            date: e.date,
            end_date: e.end_date, // add end_date
            link: e.link ?? `/events/${e.id ?? e.event_id}`, // add link
          }))
          .filter((e) => e.id !== undefined);

        setEvents(normalized);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className={styles.header}>
        <h1>Upcoming Events</h1>

        <p className={styles.breadcrumb}>
          <Link to="/" className={styles.home}>
            <AiFillHome className={styles.homeIcon} />
            <span>Home</span>
          </Link>
          <span className={styles.separator}>&gt;</span>
          <span className={styles.current}>Events</span>
          <span className={styles.separator}>&gt;</span>
          <span className={styles.current}>Upcoming</span>
        </p>
      </section>

      <section className={styles.page}>
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

export default UpcomingEvents;
