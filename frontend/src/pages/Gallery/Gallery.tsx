import React from "react";
import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import styles from "./Gallery.module.scss";

interface GalleryItem {
  id: number;
  title: string;
  slug: string;
}

const galleryData: GalleryItem[] = [
  {
    id: 1,
    title: "1st Gujpedicriticon 2025",
    slug: "gujpedicriticon-2025",
  },
  {
    id: 2,
    title: "1st Gujpedicriticon 2025",
    slug: "gujpedicriticon-2025-2",
  },
];

const Gallery: React.FC = () => {
  return (
    <>
      {/* HEADER */}
      <section className={styles.header}>
        <h1>Gallery</h1>

        <p className={styles.breadcrumb}>
          <Link to="/" className={styles.home}>
            <AiFillHome className={styles.homeIcon} />
            <span>Home</span>
          </Link>
          <span className={styles.separator}>&gt;</span>
          <span className={styles.current}>Gallery</span>
        </p>
      </section>

      {/* CONTENT */}
      <section className={styles.page}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {galleryData.map((item) => (
              <div key={item.id} className={styles.card}>
                <h2>{item.title}</h2>

                <Link to={`/gallery/${item.slug}`} className={styles.viewBtn}>
                  View Photos
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Gallery;
