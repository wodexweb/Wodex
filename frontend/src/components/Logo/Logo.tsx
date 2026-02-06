import { useSettings } from "../../hooks/useSettings";
import styles from "./Logo.module.scss";
import { getStorageUrl } from "../../helpers/api_helper";

const Logo: React.FC = () => {
  const { settings, loading } = useSettings();

  if (loading || !settings) return null;

  return (
    <section className={styles.logoBar}>
      <div className={styles.inner}>
        <img
          className={styles.logo}
          src={getStorageUrl(settings.website_logo)}
          alt={settings.website_title || "Website Logo"}
        />
      </div>
    </section>
  );
};

export default Logo;
