import { useEffect, useState } from "react";
import styles from "./RecentEvents.module.scss";
import Card from "../../Card/Card";
import { EventsAPI, type EventItem } from "../api/events";

const RecentEvents: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await EventsAPI.getRecent();
        setEvents(data);
      } catch (error) {
        console.error("Failed to load recent events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const isEmpty = !loading && events.length === 0;

  return (
    <section
      className={`${styles.section} section--dark ${
        isEmpty ? styles.sectionEmpty : ""
      }`}
    >
      <h2 className={styles.heading}>RECENT EVENTS</h2>

      {loading ? (
        <p className={styles.status}>Loading events...</p>
      ) : isEmpty ? (
        <p className={`${styles.status} ${styles.blink}`}>No recent events</p>
      ) : (
        <div className={styles.cardGrid}>
          {events.map((event) => (
            <Card
              key={event.id}
              id={event.id}
              title={event.title}
              image={event.photo_url ?? ""}
              date={event.end_date}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentEvents;
