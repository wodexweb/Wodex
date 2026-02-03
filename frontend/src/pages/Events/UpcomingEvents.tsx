import React, { useEffect, useState } from "react";
import styles from "./EventsPage.module.scss";
import PageHeaderArea from "../../components/PageHeaderArea/PageHeaderArea";
import Card from "../../components/Card/Card";
import { EventsAPI, type EventItem } from "../api/Details";

const UpcomingEvents: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    EventsAPI.getUpcoming()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeaderArea title="Upcoming Events" current="Upcoming" />

      <section className={`${styles.section} section--dark`}>
        <div className={styles.container}>
          {loading ? (
            <p className={styles.empty}>Loading events...</p>
          ) : events.length === 0 ? (
            <p className={styles.empty}>No upcoming events</p>
          ) : (
            <div className={styles.grid}>
              {events.map((event) => (
                <Card
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  image={event.photo_url ?? ""}
                  date={event.date ?? event.end_date}
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
