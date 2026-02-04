import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Gallery.module.scss";
import PageHeaderArea from "../../components/PageHeaderArea/PageHeaderArea";
import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

interface GalleryItem {
  gallery_id: number;
  gallery_title: string;
  event_title: string;
  images: string[];
}

const Gallery: React.FC = () => {
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        // FIX 1: Use the PUBLIC endpoint, not the ADMIN endpoint
        const res: any = await api.get("/api/galleries");

        // FIX 2: Access response.data.data to get the array
        if (res.data && res.data.success) {
          setGalleries(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching gallery:", error);
        setGalleries([]);
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
            <p className="text-center">Loading galleries...</p>
          ) : (
            <div className={styles.grid}>
              {galleries.length > 0 ? (
                galleries.map((item) => (
                  <div key={item.gallery_id} className={styles.card}>
                    {item.images.length > 0 && (
                      <div className={styles.imageWrapper}>
                        <img
                          src={item.images[0]}
                          alt={item.gallery_title}
                          className={styles.coverImage}
                        />
                      </div>
                    )}

                    <div className={styles.cardContent}>
                      <h2>{item.gallery_title}</h2>
                      <p className={styles.eventTag}>{item.event_title}</p>

                      {/* FIX 3: Link to your React Route, NOT the API endpoint */}
                      <Link
                        to={`/gallery/${item.gallery_id}`}
                        className={styles.viewBtn}
                      >
                        View Photos ({item.images.length})
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">No galleries found.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Gallery;
