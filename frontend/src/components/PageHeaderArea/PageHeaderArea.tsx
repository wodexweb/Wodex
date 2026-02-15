// import React from "react";
// import { Link } from "react-router-dom";
// import { AiFillHome } from "react-icons/ai";
// import styles from "./PageHeaderArea.module.scss";

// interface PageHeaderAreaProps {
//   title: string;
//   current: string;
// }

// const PageHeaderArea: React.FC<PageHeaderAreaProps> = ({ title, current }) => {
//   return (
//     <section className={styles.header}>
//       <h1>{title}</h1>

//       <p className={styles.breadcrumb}>
//         <Link to="/" className={styles.home}>
//           <AiFillHome className={styles.homeIcon} />
//           <span>Home</span>
//         </Link>
//         <span className={styles.separator}>&gt;</span>
//         <span className={styles.current}>{current}</span>
//       </p>
//     </section>
//   );
// };

// export default PageHeaderArea;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import styles from "./PageHeaderArea.module.scss";
import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

interface PageHeaderAreaProps {
  title: string;
  current: string;
  slug: string;
}

const PageHeaderArea: React.FC<PageHeaderAreaProps> = ({ title, current, slug }) => {

  const [headerData, setHeaderData] = useState<any>(null);

  useEffect(() => {
    const loadHeader = async () => {
      try {
        const res: any = await api.get(`api/media-library/${slug}`);

        if (res && res.length > 0) {
          const header = res.find((i: any) => i.section === "header");
          setHeaderData(header || null);
        }
      } catch (e) {
        console.log(e);
      }
    };

    loadHeader();
  }, [slug]);

  const headerStyle =
    headerData?.file_path
      ? {
        backgroundImage: `url(${import.meta.env.VITE_API_URL}/storage/${headerData.file_path})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
      : {};

  return (
    <section className={styles.header} style={headerStyle}>
      <h1>{headerData?.title || title}</h1>

      <p className={styles.breadcrumb}>
        <Link to="/" className={styles.home}>
          <AiFillHome className={styles.homeIcon} />
          <span>Home</span>
        </Link>
        <span className={styles.separator}>&gt;</span>
        <span className={styles.current}>{headerData?.subtitle || current}</span>
      </p>
    </section>
  );
};

export default PageHeaderArea;
