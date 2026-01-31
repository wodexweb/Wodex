import { useNavigate } from "react-router-dom";
import styles from "./Card.module.scss";

interface CardProps {
  id: number;
  title: string;
  image: string;
  date?: string;
}

const Card: React.FC<CardProps> = ({ id, title, image, date }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${id}`);
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
