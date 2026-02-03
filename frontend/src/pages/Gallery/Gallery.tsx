import React from "react";
import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import styles from "./Gallery.module.scss";
import PageHeaderArea from "../../components/PageHeaderArea/PageHeaderArea";

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
      <PageHeaderArea title="Gallery" current="Gallery" />

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
