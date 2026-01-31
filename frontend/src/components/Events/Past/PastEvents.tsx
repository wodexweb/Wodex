import { useEffect, useState } from "react";
import styles from "./PastEvents.module.scss";
import Card from "../../Card/Card";
import { EventsAPI, type EventItem } from "../api/events";

const PastEvents: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPastEvents = async () => {
      try {
        const data = await EventsAPI.getPast();
        setEvents(data);
      } catch (error) {
        console.error("Failed to load past events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPastEvents();
  }, []);

  const isEmpty = !loading && events.length === 0;

  return (
    <section
      className={`${styles.section} section--light ${
        isEmpty ? styles.sectionEmpty : ""
      }`}
    >
      <h2 className={styles.heading}>PAST EVENTS</h2>

      {loading ? (
        <p className={styles.status}>Loading events...</p>
      ) : isEmpty ? (
        <p className={`${styles.status} ${styles.blink}`}>No past events</p>
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

export default PastEvents;
