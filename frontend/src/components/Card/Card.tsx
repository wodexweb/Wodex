// import { useNavigate } from "react-router-dom";
// import styles from "./Card.module.scss";
// import AnimateIn from "../Animations/AnimateIn";
// interface CardProps {
//   id: number;
//   title: string;
//   image: string;
//   date?: string;
// }

// const Card: React.FC<CardProps> = ({ id, title, image, date }) => {
//   const navigate = useNavigate();

//   const handleClick = () => {
//     navigate(`/events/${id}`);
//   };

//   return (
//     <AnimateIn>
//       <div className={styles.cardWrapper} onClick={handleClick} role="button">
//         <div className={styles.card}>
//           <div className={styles.imageWrap}>
//             <img src={image} alt={title} />
//           </div>

//           <div className={styles.content}>
//             <h3>{title}</h3>
//             {date && <p className={styles.date}>{date}</p>}
//           </div>
//         </div>
//       </div>
//     </AnimateIn>
//   );
// };

// export default Card;
import { useNavigate } from "react-router-dom";
import styles from "./Card.module.scss";
import AnimateIn from "../Animations/AnimateIn";

interface CardProps {
  id: number;
  title: string;
  image: string;
  date?: string;
  onClick?: () => void;   // NEW
}

const Card: React.FC<CardProps> = ({ id, title, image, date, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();                 // modal open
    } else {
      navigate(`/events/${id}`); // default navigation
    }
  };

  return (
    <AnimateIn>
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
    </AnimateIn>
  );
};

export default Card;
