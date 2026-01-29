import React, { useEffect, useState } from "react";
import styles from "./EventsPage.module.scss";
import Card from "../../components/Card/Card";
import { EventsAPI, type EventItem } from "./api/events";
import PageHeaderArea from "../../components/PageHeaderArea/PageHeaderArea";

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
      {/* 🔴 Dynamic Header Area */}
      <PageHeaderArea title="All Events" current="Events" />

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
                  link={event.link}
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
