import React, { useEffect, useState } from "react";
import styles from "./EventsPage.module.scss";
import Card from "../../components/Card/Card";
import Modal from "../../components/Card/Modal";
import PageHeaderArea from "../../components/PageHeaderArea/PageHeaderArea";
import { EventsAPI, type EventItem } from "./api/events";

const PastEvents: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<EventItem | null>(null);

  useEffect(() => {
    EventsAPI.getPast()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeaderArea title="Past Events" current="Past" />

      <section className={`${styles.section} section--dark`}>
        <div className={styles.container}>
          {loading ? (
            <p className={styles.empty}>Loading events...</p>
          ) : events.length === 0 ? (
            <p className={styles.empty}>No past events</p>
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

export default PastEvents;
