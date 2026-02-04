import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // or use your APIClient

import styles from "./Gallery.module.scss";
import PageHeaderArea from "../../components/PageHeaderArea/PageHeaderArea";

// Match the structure returned by your backend index() method
interface GalleryItem {
  gallery_id: number;
  gallery_title: string;
  event_title: string;
  images: string[]; // These are full URLs from asset('storage/...')
}

const Gallery: React.FC = () => {
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your actual API URL
    const fetchGalleries = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/admin/gallery");
        setGalleries(response.data);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  return (
    <>
      <PageHeaderArea title="Gallery" current="Gallery" />

      <section className={styles.page}>
        <div className={styles.container}>
          {loading ? (
            <p>Loading galleries...</p>
          ) : (
            <div className={styles.grid}>
              {galleries.length > 0 ? (
                galleries.map((item) => (
                  <div key={item.gallery_id} className={styles.card}>
                    {/* Display the first image as a cover if available */}
                    {item.images.length > 0 && (
                      <div className={styles.imageWrapper}>
                        <img 
                          src={item.images[0]} 
                          alt={item.gallery_title} 
                          className={styles.coverImage} 
                        />
                      </div>
                    )}
                    
                    <h2>{item.gallery_title}</h2>
                    <p>{item.event_title}</p>

                    {/* Linking to the detail page using ID */}
                    <Link to={`/api/gallery/${item.gallery_id}`} className={styles.viewBtn}>
                      View Photos ({item.images.length})
                    </Link>
                  </div>
                ))
              ) : (
                <p>No galleries found.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Gallery;