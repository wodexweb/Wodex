import React from "react";
import styles from "./MemberCard.module.scss";

interface MemberProps {
  name: string;
  role: string;
  image: string;
}

const MemberCard: React.FC<MemberProps> = ({ name, role, image }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={image} alt={name} />
      </div>

      <h4 className={styles.name}>{name}</h4>
      <p className={styles.role}>{role}</p>
    </div>
  );
};

export default MemberCard;
