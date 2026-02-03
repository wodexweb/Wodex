import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import styles from "./DetailPage.module.scss";
import { EventsAPI, type EventItem } from "../api/Details";
import PageHeaderArea from "../../components/PageHeaderArea/PageHeaderArea";

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    EventsAPI.getById(id)
      .then(setEvent)
      .finally(() => setLoading(false));
  }, [id]);

  const handleDriveClick = () => {
    if (!event?.link) return;
    window.open(event.link, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* HEADER */}
      <PageHeaderArea title="DetailPage" current="DetailPage" />

      {/* PAGE */}
      <section className={styles.detailsPage}>
        {loading ? (
          <p className={styles.empty}>Loading...</p>
        ) : !event ? (
          <p className={styles.empty}>Event not found</p>
        ) : (
          <div className={styles.detailsLayout}>
            {/* LEFT : IMAGE */}
            <div className={styles.detailsMain}>
              <img
                src={event.photo_url ?? ""}
                alt={event.title}
                className={styles.poster}
              />
            </div>

            {/* RIGHT : CONTENT */}
            <div className={styles.detailsContent}>
              <div className={styles.eventMeta}>
                {event.date || event.end_date}
              </div>

              <h2 className={styles.eventTitle}>{event.title}</h2>

              <p className={styles.description}>{event.description}</p>

              <button className={styles.driveButton} onClick={handleDriveClick}>
                📁 Open in Google Drive
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default DetailPage;
