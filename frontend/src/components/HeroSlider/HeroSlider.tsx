// import React from "react";
// import styles from "./HeroSlider.module.scss";

// const HeroSlider: React.FC = () => {
//   return (
//     <section className={styles.heroSection}>
//       <div className={styles.heroImage}>
//         <img
//           src="https://cdn.pixabay.com/photo/2022/09/27/19/46/ai-generated-7483596_960_720.jpg"
//           alt="Happy children - Academy of Paediatrics"
//           className={styles.heroImg}
//         />
//       </div>

//       <div className={styles.heroContent}>
//         <div className={styles.heroText}>
//           <h1 className={styles.mainTitle}>ACADEMY OF PEDIATRICS,</h1>
//           <h2 className={styles.subTitle}>GUJARAT</h2>
//         </div>
//       </div>

//       {/* 🔵 Bottom Update Bar */}
//       <div className={styles.updateBar}>
//         <div className={styles.latestTag}>
//           <span className={styles.homeIcon}>
//             <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
//               <path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3z" />
//             </svg>
//           </span>
//           LATEST UPDATES
//         </div>

//         {/* RIGHT CONTROLS */}
//         {/* <div className={styles.controls}>
//           <button className={styles.controlBtn}>‹</button>
//           <button className={styles.controlBtn}>‖</button>
//           <button className={styles.controlBtn}>›</button>
//         </div> */}
//       </div>
//     </section>
//   );
// };

// export default HeroSlider;

import React, { useEffect, useState } from "react";
import styles from "./HeroSlider.module.scss";
import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

const HeroSlider: React.FC = () => {

  const [hero, setHero] = useState<any>(null);

  useEffect(() => {
    const loadHero = async () => {
      try {
        const res: any = await api.get("api/media-library/home");

        const item = res.find((i: any) => i.section === "hero");

        setHero(item);
      } catch (e) {
        console.log(e);
      }
    };

    loadHero();
  }, []);

  if (!hero) return null;

  return (
    <section className={styles.heroSection}>

      <div className={styles.heroImage}>
        <img
          src={`${import.meta.env.VITE_API_URL}/storage/${hero.file_path}`}
          alt="Hero"
          className={styles.heroImg}
        />

      </div>

      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <h1 className={styles.mainTitle}>{hero.title}</h1>
          <h2 className={styles.subTitle}>{hero.subtitle}</h2>
        </div>
      </div>

      <div className={styles.updateBar}>
        <div className={styles.latestTag}>
          LATEST UPDATES
        </div>
      </div>

    </section>
  );
};

export default HeroSlider;

