import React, { useEffect, useState } from "react";
import styles from "./RecentEvents.module.scss";
import Card from "../../Card/Card";
import Modal from "../../Card/Modal";
import { EventsAPI, type EventItem } from "../api/events";

const RecentEvents: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<EventItem | null>(null);

  useEffect(() => {
    const fetchRecentEvents = async () => {
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

    fetchRecentEvents();
  }, []);

  const openModal = (event: EventItem) => {
    setActive(event);
    setOpen(true);
  };

  return (
    <>
      <section className={`${styles.section} section--dark`}>
        <h2 className={styles.heading}>RECENT EVENTS</h2>

        {loading ? (
          <p>Loading events...</p>
        ) : events.length === 0 ? (
          <p>No recent events</p>
        ) : (
          <div className={styles.cardGrid}>
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
