import React from "react";
import styles from "./ImageSlider.module.scss";

const images = [
  "https://picsum.photos/id/1011/800/500",
  "https://picsum.photos/id/1012/800/500",
  "https://picsum.photos/id/1013/800/500",
  "https://picsum.photos/id/1015/800/500",
  "https://picsum.photos/id/1016/800/500",
  "https://picsum.photos/id/1018/800/500",
  "https://picsum.photos/id/1020/800/500",
  "https://picsum.photos/id/1021/800/500",
];

const ImageSlider: React.FC = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>GUJPEDICON 2026</h2>

      <div className={styles.sliderWrapper}>
        {/* TOP ROW */}
        <div className={styles.track}>
          {[...images, ...images].map((img, i) => (
            <div className={styles.slide} key={`top-${i}`}>
              <img src={img} alt="" />
              <div className={styles.preview}>
                <span>Preview</span>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM ROW */}
        <div className={`${styles.track} ${styles.reverse}`}>
          {[...images, ...images].map((img, i) => (
            <div className={styles.slide} key={`bottom-${i}`}>
              <img src={img} alt="" />
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
