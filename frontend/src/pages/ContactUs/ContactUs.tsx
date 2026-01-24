import React from "react";
import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { FiPhoneCall } from "react-icons/fi";
import { HiLocationMarker } from "react-icons/hi";
import styles from "./ContactUs.module.scss";

/* Random images (change or add more) */
const images = [
  "/images/contact/contact1.png",
  "/images/contact/contact2.png",
  "/images/contact/contact3.png",
];

const randomImage = images[Math.floor(Math.random() * images.length)];

const ContactUs: React.FC = () => {
  return (
    <>
      {/* HEADER */}
      <section className={styles.header}>
        <h1>Contact Us</h1>

        <p className={styles.breadcrumb}>
          <Link to="/" className={styles.home}>
            <AiFillHome className={styles.homeIcon} />
            <span>Home</span>
          </Link>
          <span className={styles.separator}>&gt;</span>
          <span className={styles.current}>Contact Us</span>
        </p>
      </section>

      {/* PAGE */}
      <section className={styles.page}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {/* LEFT CARD */}
            <div className={styles.leftCard}>
              <img
                src={randomImage}
                alt="Support"
                className={styles.illustration}
              />

              <h2>Need Assistance?</h2>
              <h3>Reach Out to Our Support Team</h3>

              <p>
                If you have any queries or suggestions regarding this portal,
                please feel free to reach out to us at
                <br />
                <a href="mailto:secretary@gpicc.co.in">secretary@gpicc.co.in</a>
              </p>
            </div>

            {/* RIGHT COLUMN */}
            <div className={styles.rightCol}>
              {/* PRESIDENT */}
              <div className={styles.infoCard}>
                <img
                  src="/images/office/1.jpg"
                  alt="Dr. Himanshu Tadvi"
                  className={styles.avatar}
                />

                <div>
                  <h4>Dr. Himanshu Tadvi</h4>
                  <span>President</span>

                  <p className={styles.phone}>
                    <FiPhoneCall /> 99138 33122
                  </p>
                </div>
              </div>

              {/* SECRETARY */}
              <div className={styles.infoCard}>
                <img
                  src="/images/office/2.jpg"
                  alt="Dr. Amit Chitalia"
                  className={styles.avatar}
                />

                <div>
                  <h4>Dr. Amit Chitalia</h4>
                  <span>Hon. Secretary</span>

                  <p className={styles.phone}>
                    <FiPhoneCall /> 90999 87400
                  </p>
                </div>
              </div>

              {/* ADDRESS */}
              <div className={styles.infoCard}>
                <div className={styles.iconBox}>
                  <HiLocationMarker />
                </div>

                <div>
                  <h4>Address</h4>
                  <p className={styles.address}>
                    5th Floor, Saachi Hospital, Near Akash Ganga Apartment, Opp.
                    New Civil Hospital, Surat 395002.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
