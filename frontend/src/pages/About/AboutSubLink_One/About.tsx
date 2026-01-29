import React from "react";
import "./About.scss";
import { AiFillHome } from "react-icons/ai";
import { Link } from "react-router-dom";
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

const AboutGPICC: React.FC = () => {
  return (
    <div className="about-gpicc">
      {/* HERO */}
      <PageHeaderArea title="About" current="About" />

      {/* CONTENT */}
      <section className="content">
        <h2>Empowering sick kids care, Everywhere!</h2>

        <p className="intro">
          The Gujarat Pediatric Intensive Care Chapter was established in 2018
          at Karamsad, rooted in a deep commitment to advancing pediatric
          intensive care across Gujarat – especially in underserved and
          resource-limited rural areas. Our chapter was born out of a pressing
          need to bridge the gaps in healthcare access, build local capacity,
          and empower medical professionals serving critically ill children,
          regardless of where they practice.
        </p>

        <div className="card-grid">
          <div className="card">
            <h3>Our Mission</h3>
            <p>
              We are dedicated to providing continuous education and hands-on
              training to pediatricians, general practitioners, nurses, and
              other healthcare workers working in resource-constrained settings.
              We firmly believe that with the right training, protocols, and
              support, even basic setups can deliver high-quality intensive care
              for critically ill children.
            </p>
          </div>

          <div className="card">
            <h3>Our Vision</h3>
            <p>
              We envision a future where every child in Gujarat – regardless of
              geography – has access to safe, evidence-based, and compassionate
              intensive care. Through every workshop we host, every webinar we
              conduct, every protocol we create, and every partnership we build,
              we stay true to our core belief: Every child in Gujarat deserves
              the best chance at life.
            </p>
          </div>
        </div>

        <div className="card full">
          <h3>Our Focus</h3>
          <ul className="focus-list">
            {focusData.map((item, index) => (
              <li key={index}>
                <strong>{item.title}:</strong> {item.description}
              </li>
            ))}
          </ul>
        </div>

        <div className="card full">
          <h3>Our Reach and Impact</h3>
          <p>
            Since 2018, IAP has evolved into a respected platform that bridges
            the gap between tertiary care centers and peripheral setups across
            the state. We collaborate with national pediatric forums and
            critical care networks, bringing the latest advances and global best
            practices to Gujarat while addressing its unique local challenges.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutGPICC;
