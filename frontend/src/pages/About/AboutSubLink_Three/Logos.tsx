import React, { useRef } from "react";
import "./Logos.scss";
import { motion } from "framer-motion";
import { AiOutlineDownload } from "react-icons/ai";
import * as htmlToImage from "html-to-image";
import PageHeaderArea from "../../../components/PageHeaderArea/PageHeaderArea";
import jsPDF from "jspdf";

import gpicc from "./assets/AOPG_LOGO.png";
import aopg from "./assets/IAP_LOGO.jpg";
import iap from "./assets/LOGO.png";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const Logos: React.FC = () => {
  const gpiccRef = useRef<HTMLDivElement | null>(null);

  const downloadPNG = async (
    ref: React.RefObject<HTMLDivElement | null>,
    name: string
  ) => {
    if (!ref.current) return;
    const dataUrl = await htmlToImage.toPng(ref.current);
    const link = document.createElement("a");
    link.download = `${name}.png`;
    link.href = dataUrl;
    link.click();
  };

  const downloadPDF = async (
    ref: React.RefObject<HTMLDivElement | null>,
    name: string
  ) => {
    if (!ref.current) return;
    const dataUrl = await htmlToImage.toPng(ref.current);
    const pdf = new jsPDF("portrait", "px", "a4");
    pdf.addImage(dataUrl, "PNG", 40, 40, 300, 300);
    pdf.save(`${name}.pdf`);
  };

  return (
    <div className="logos-page">
      <PageHeaderArea title="About Logo" current="About-Logo" />

      <section className="content">
        <div className="logo-grid">

          <motion.div
            className="logo-card"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="logo-box" ref={gpiccRef}>
              <img src={gpicc} alt="GPICC Logo" />
            </div>
            <h3>GPICC Logo</h3>

            <div className="actions">
              <button onClick={() => downloadPNG(gpiccRef, "GPICC-Logo")}>
                PNG <AiOutlineDownload />
              </button>

              <button onClick={() => downloadPDF(gpiccRef, "GPICC-Logo")}>
                PDF <AiOutlineDownload />
              </button>
            </div>
          </motion.div>

          <motion.div
            className="logo-card"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="logo-box">
              <img src={aopg} alt="AOPG Logo" />
            </div>
            <h3>AOPG Logo</h3>
          </motion.div>

          <motion.div
            className="logo-card"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="logo-box">
              <img src={iap} alt="IAP Gujarat Logo" />
            </div>
            <h3>IAP Gujarat Logo</h3>
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default Logos;
