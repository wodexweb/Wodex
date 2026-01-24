import React from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.scss";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  image: string;
  description?: string;
}

const Modal: React.FC<Props> = ({
  open,
  onClose,
  title,
  image,
  description,
}) => {
  if (!open) return null;

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* IMAGE */}
        <div className={styles.imageWrap}>
          <img src={image} alt={title} />
        </div>

        {/* CONTENT */}
        <div className={styles.content}>
          <h3>{title}</h3>
          <p>
            {description ||
              "Full announcement description will appear here. Backend connect hone ke baad ye content dynamic ho jayega."}
          </p>

          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>,
    document.body // 🔥 THIS IS THE FIX
  );
};

export default Modal;
