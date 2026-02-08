import React from "react";
import "./About.scss";
import { motion } from "framer-motion";
import PageHeaderArea from "../../../components/PageHeaderArea/PageHeaderArea";

type FocusItem = {
  title: string;
  description: string;
};

const focusData: FocusItem[] = [
  {
    title: "Practical Training",
    description:
      "Simulation-based learning, hands-on workshops, and case discussions tailored to rural realities.",
  },
  {
    title: "Evidence-Based Practice",
    description:
      "Developing protocol-based management strategies for resource optimization.",
  },
  {
    title: "Research and Education",
    description:
      "Fostering collaborations and advancing the science of pediatric intensive care.",
  },
  {
    title: "Ongoing Education",
    description:
      "Regular monthly webinars that connect medical and nursing staff across Gujarat.",
  },
  {
    title: "Nursing Education",
    description:
      "Specialized training and upskilling for nursing staff in intensive care.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const AboutGPICC: React.FC = () => {
  return (
    <div className="about-gpicc">
      <PageHeaderArea title="About" current="About" />

      <section className="content">
        <h2>Empowering sick kids care, Everywhere!</h2>

        <motion.p
          className="intro"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          The Gujarat Pediatric Intensive Care Chapter was established in 2018
          at Karamsad, rooted in a deep commitment to advancing pediatric
          intensive care across Gujarat.
        </motion.p>

        <div className="card-grid">
          <motion.div
            className="card"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3>Our Mission</h3>
            <p>We are dedicated to providing continuous education...</p>
          </motion.div>

          <motion.div
            className="card"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3>Our Vision</h3>
            <p>We envision a future where every child in Gujarat...</p>
          </motion.div>
        </div>

        <motion.div
          className="card full"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3>Our Focus</h3>
          <ul className="focus-list">
            {focusData.map((item, index) => (
              <li key={index}>
                <strong>{item.title}:</strong> {item.description}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="card full"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3>Our Reach and Impact</h3>
          <p>
            Since 2018, IAP has evolved into a respected platform...
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutGPICC;
