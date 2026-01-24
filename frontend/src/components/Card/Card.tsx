import styles from "./Card.module.scss";

interface CardProps {
  title: string;
  image: string;
  link: string;
  date?: string;
}

const Card: React.FC<CardProps> = ({ title, image, link, date }) => {
  const handleClick = () => {
    if (!link) return;
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={styles.cardWrapper} onClick={handleClick} role="button">
      <div className={styles.card}>
        <div className={styles.imageWrap}>
          <img src={image} alt={title} />
        </div>

        <div className={styles.content}>
          <h3>{title}</h3>
          {date && <p className={styles.date}>{date}</p>}
        </div>
      </div>
    </div>
  );
};

export default Card;
