// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import styles from "./Gallery.module.scss";
// import PageHeaderArea from "../../components/PageHeaderArea/PageHeaderArea";
// import { APIClient } from "../../helpers/api_helper"; // Import your helper

// // Initialize the API helper
// const api = new APIClient();

// interface GalleryItem {
//   gallery_id: number;
//   gallery_title: string;
//   event_title: string;
//   images: string[];
// }

// const Gallery: React.FC = () => {
//   const [galleries, setGalleries] = useState<GalleryItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Inside Gallery.tsx
//     const fetchGalleries = async () => {
//       try {
//         // ADDED 'api/' before 'galleries'
//         const response: any = await api.get("api/galleries");

//         if (response && response.success) {
//           setGalleries(response.data);
//         }
//       } catch (error) {
//         console.error("Error fetching gallery:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGalleries();
//   }, []);

//   return (
//     <>
//       <PageHeaderArea title="Gallery" current="Gallery" />

//       <section className={styles.page}>
//         <div className={styles.container}>
//           {loading ? (
//             <p className="text-center py-5">Loading galleries...</p>
//           ) : (
//             <div className={styles.grid}>
//               {galleries.length > 0 ? (
//                 galleries.map((item) => (
//                   <div key={item.gallery_id} className={styles.card}>
//                     {item.images.length > 0 && (
//                       <div className={styles.imageWrapper}>
//                         <img
//                           src={item.images[0]}
//                           alt={item.gallery_title}
//                           className={styles.coverImage}
//                         />
//                       </div>
//                     )}

//                     <div className={styles.cardContent}>
//                       <h2>{item.gallery_title}</h2>
//                       <p className={styles.eventTag}>{item.event_title}</p>

//                       <Link
//                         to={`/gallery/${item.gallery_id}`}
//                         className={styles.viewBtn}
//                       >
//                         View Photos ({item.images.length})
//                       </Link>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-center py-5">No galleries found.</p>
//               )}
//             </div>
//           )}
//         </div>
//       </section>
//     </>
//   );
// };

// export default Gallery;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Gallery.module.scss";
import PageHeaderArea from "../../components/PageHeaderArea/PageHeaderArea";
import { APIClient } from "../../helpers/api_helper";
import { motion } from "framer-motion";

const api = new APIClient();

interface GalleryItem {
  gallery_id: number;
  gallery_title: string;
  event_title: string;
  images: string[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const Gallery: React.FC = () => {
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response: any = await api.get("api/galleries");

        if (response && response.success) {
          setGalleries(response.data);
        }
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
            <p className="text-center py-5">Loading galleries...</p>
          ) : (
            <div className={styles.grid}>
              {galleries.length > 0 ? (
                galleries.map((item, index) => (
                  <motion.div
                    key={item.gallery_id}
                    className={styles.card}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    {item.images.length > 0 && (
                      <div className={styles.imageWrapper}>
                        <img
                          src={item.images[0]}
                          alt={item.gallery_title}
                          className={styles.coverImage}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    )}

                    <div className={styles.cardContent}>
                      <h2>{item.gallery_title}</h2>
                      <p className={styles.eventTag}>{item.event_title}</p>

                      <Link
                        to={`/gallery/${item.gallery_id}`}
                        className={styles.viewBtn}
                      >
                        View Photos ({item.images.length})
                      </Link>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center py-5">No galleries found.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Gallery;
