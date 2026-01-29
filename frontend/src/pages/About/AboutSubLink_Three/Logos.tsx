import React, { useRef } from "react";
import "./Logos.scss";
import { Link } from "react-router-dom";
import { AiFillHome, AiOutlineDownload } from "react-icons/ai";
import * as htmlToImage from "html-to-image";
import PageHeaderArea from "../../../components/PageHeaderArea/PageHeaderArea";

import jsPDF from "jspdf";

// images
import gpicc from "./assets/AOPG_LOGO.png";
import aopg from "./assets/IAP_LOGO.jpg";
import iap from "./assets/LOGO.png";

const Logos: React.FC = () => {
  const gpiccRef = useRef<HTMLDivElement | null>(null);

  // PNG DOWNLOAD
  const downloadPNG = async (
    ref: React.RefObject<HTMLDivElement | null>,
    name: string,
  ) => {
    if (!ref.current) return;
    const dataUrl = await htmlToImage.toPng(ref.current);
    const link = document.createElement("a");
    link.download = `${name}.png`;
    link.href = dataUrl;
    link.click();
  };

  // PDF DOWNLOAD
  const downloadPDF = async (
    ref: React.RefObject<HTMLDivElement | null>,
    name: string,
  ) => {
    if (!ref.current) return;
    const dataUrl = await htmlToImage.toPng(ref.current);
    const pdf = new jsPDF("portrait", "px", "a4");
    pdf.addImage(dataUrl, "PNG", 40, 40, 300, 300);
    pdf.save(`${name}.pdf`);
  };

  return (
    <div className="logos-page">
      {/* HERO */}
      <PageHeaderArea title="About Logo" current="About-Logo" />

      {/* CONTENT */}
      <section className="content">
        <div className="logo-grid">
          {/* GPICC */}
          <div className="logo-card">
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
          </div>

          {/* AOPG */}
          <div className="logo-card">
            <div className="logo-box">
              <img src={aopg} alt="AOPG Logo" />
            </div>
            <h3>AOPG Logo</h3>

            <div className="actions">
              <a href={aopg} download>
                PNG <AiOutlineDownload />
              </a>

              <a href="/logos/aopg.cdr" download>
                CDR <AiOutlineDownload />
              </a>
            </div>
          </div>

          {/* IAP */}
          <div className="logo-card">
            <div className="logo-box">
              <img src={iap} alt="IAP Gujarat Logo" />
            </div>
            <h3>IAP Gujarat Logo</h3>

            <div className="actions">
              <a href={iap} download>
                PNG <AiOutlineDownload />
              </a>

              <a href="/logos/iap.cdr" download>
                CDR <AiOutlineDownload />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Logos;
