import React, { useEffect, useState } from "react";
import styles from "./ImageSlider.module.scss";
import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

const ImageSlider: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllGalleryImages = async () => {
      try {
        // 1. Fetch all galleries from the backend
        const res: any = await api.get("/api/admin/gallery");
        
        if (res && Array.isArray(res) && res.length > 0) {
          // 2. Combine images from ALL events into one single array
          // .flatMap handles nested arrays: [[img1, img2], [img3, img4]] -> [img1, img2, img3, img4]
          const combinedImages = res.flatMap((event: any) => event.images || []);
          
          // 3. Optional: Shuffle images so the slider looks fresh on every refresh
          const shuffledImages = combinedImages.sort(() => 0.5 - Math.random());
          
          setImages(shuffledImages);
        }
      } catch (err) {
        console.error("Failed to fetch slider images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllGalleryImages();
  }, []);

  // Show nothing if loading or if there are no images to show
  if (loading) return <div className={styles.loader}>Loading...</div>;
  if (images.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>GUJPEDICON 2026</h2>

      <div className={styles.sliderWrapper}>
        {/* TOP ROW: Moving Left */}
        <div className={styles.track}>
          {/* We repeat the images 3 times ([...images, ...images, ...images]).
            This ensures that even if you only have 2-3 photos, 
            the track is long enough to cover the screen width twice, 
            preventing "white gaps" during the animation loop.
          */}
          {[...images, ...images, ...images].map((img, i) => (
            <div className={styles.slide} key={`top-${i}`}>
              <img src={img} alt="Gallery" />
              <div className={styles.preview}>
                <span>Preview</span>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM ROW: Moving Right (Reverse) */}
        <div className={`${styles.track} ${styles.reverse}`}>
          {[...images, ...images, ...images].map((img, i) => (
            <div className={styles.slide} key={`bottom-${i}`}>
              <img src={img} alt="Gallery" />
              <div className={styles.preview}>
                <span>Preview</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className={styles.viewMore}>VIEW MORE</button>
    </section>
  );
};

export default ImageSlider;