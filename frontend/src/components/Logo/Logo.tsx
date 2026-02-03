import { useSettings } from "../../hooks/useSettings";
import styles from "./Logo.module.scss";

const Logo: React.FC = () => {
  const { settings, loading } = useSettings();

  if (loading || !settings) return null;

  return (
    <section className={styles.logoBar}>
      <div className={styles.inner}>
        <img
          className={styles.logo}
          src={
            settings.website_logo
              ? `http://localhost:8000/storage/${settings.website_logo}`
              : "/default-logo.png"
          }
          alt={settings.website_title || "Website Logo"}
        />
      </div>
    </section>
  );
};

export default Logo;
