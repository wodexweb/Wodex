import React from "react";
import { motion, type Variants } from "framer-motion";
import { FiPhoneCall } from "react-icons/fi";
import { HiLocationMarker } from "react-icons/hi";
import styles from "./ContactUs.module.scss";
import PageHeaderArea from "../../components/PageHeaderArea/PageHeaderArea";

/* Random images */
const images = [
  "/images/contact/contact1.png",
  "/images/contact/contact2.png",
  "/images/contact/contact3.png",
];

const randomImage = images[Math.floor(Math.random() * images.length)];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],   // smooth easeOut curve
    },
  },
};


const ContactUs: React.FC = () => {
  return (
    <>
      <PageHeaderArea title="ContactUs" current="ContactUs" />

      <section className={styles.page}>
        <div className={styles.container}>
          <div className={styles.grid}>

            {/* LEFT CARD */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className={styles.leftCard}
            >
              <img src={randomImage} alt="Support" className={styles.illustration} />

              <h2>Need Assistance?</h2>
              <h3>Reach Out to Our Support Team</h3>

              <p>
                If you have any queries or suggestions regarding this portal,
                please feel free to reach out to us at
                <br />
                <a href="mailto:secretary@gpicc.co.in">
                  secretary@gpicc.co.in
                </a>
              </p>
            </motion.div>

            {/* RIGHT COLUMN */}
            <div className={styles.rightCol}>

              {/* PRESIDENT */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className={styles.infoCard}
              >
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
              </motion.div>

              {/* SECRETARY */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className={styles.infoCard}
              >
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
              </motion.div>

              {/* ADDRESS */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className={styles.infoCard}
              >
                <div className={styles.iconBox}>
                  <HiLocationMarker />
                </div>

                <div>
                  <h4>Address</h4>
                  <p className={styles.address}>
                    5th Floor, Saachi Hospital, Near Akash Ganga Apartment,
                    Opp. New Civil Hospital, Surat 395002.
                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
