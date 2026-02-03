import React from "react";
import styles from "./Footer.module.scss";
import Logo from "../../assets/logo/Asset 1@2x-8 1.png";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaMapMarkerAlt,
  FaUniversity,
  FaCreditCard,
  FaCodeBranch,
} from "react-icons/fa";
import { useContactSettings } from "../../hooks/useFooterSettings";

const Footer: React.FC = () => {
  const { data } = useContactSettings();

  return (
    <div className={styles.footerWrapper}>
      <footer className={styles.footer}>
        <div className={styles.container}>
          {/* LOGO & TITLE SECTION */}
          <div className={styles.topHeader}>
            <div className={styles.logoBox}>
              <img src={Logo} alt="AOP Logo" />
            </div>
            <h2>ACADEMY OF PEDIATRICS GUJARAT</h2>
          </div>

          <div className={styles.divider}></div>

          {/* MAIN GRID LINKS */}
          <div className={styles.footerGrid}>
            <div className={styles.col}>
              <h4>CONNECT WITH US</h4>
              <div className={styles.contactItem}>
                <FaPhoneAlt className={styles.icon} />
                <span className={styles.linkText}>
                  {data?.contact_number
                    ? `+91 ${data.contact_number}`
                    : "+91 98795 40888"}
                </span>
              </div>
              <div className={styles.contactItem}>
                <FaEnvelope className={styles.icon} />
                <span className={styles.linkText}>
                  {data?.email || "aopgujarat@gmail.com"}
                </span>
              </div>
              <div className={styles.socials}>
                {data?.facebook_url && (
                  <a href={data.facebook_url} target="_blank">
                    <FaFacebookF />
                  </a>
                )}
                {data?.x_url && (
                  <a href={data.x_url} target="_blank">
                    <FaTwitter />
                  </a>
                )}
                {data?.youtube_url && (
                  <a href={data.youtube_url} target="_blank">
                    <FaYoutube />
                  </a>
                )}
                {data?.instagram_url && (
                  <a href={data.instagram_url} target="_blank">
                    <FaInstagram />
                  </a>
                )}
              </div>
            </div>

            <div className={styles.col}>
              <h4>ABOUT</h4>
              <ul>
                <li>
                  <span className={styles.linkText}>AOP Gujarat</span>
                </li>
                <li>
                  <span className={styles.linkText}>Our Mission</span>
                </li>
                <li>
                  <span className={styles.linkText}>Executive Body</span>
                </li>
                <li>
                  <span className={styles.linkText}>Constitution</span>
                </li>
              </ul>
            </div>

            <div className={styles.col}>
              <h4>QUICK LINKS</h4>
              <ul>
                <li>
                  <span className={styles.linkText}>Home</span>
                </li>
                <li>
                  <span className={styles.linkText}>About Us</span>
                </li>
                <li>
                  <span className={styles.linkText}>Gallery</span>
                </li>
                <li>
                  <span className={styles.linkText}>Member's Directory</span>
                </li>
              </ul>
            </div>

            <div className={styles.col}>
              <h4>POLICIES</h4>
              <ul>
                <li>
                  <span className={styles.linkText}>Terms & Conditions</span>
                </li>
                <li>
                  <span className={styles.linkText}>Privacy Policy</span>
                </li>
                <li>
                  <span className={styles.linkText}>Refund Policy</span>
                </li>
              </ul>
            </div>

            <div className={styles.col}>
              <h4>REACH US</h4>
              <div className={styles.contactItem}>
                <FaMapMarkerAlt className={styles.icon} />
                <p className={styles.addressText}>
                  {data?.address || "Vadodara, Gujarat"}
                </p>
              </div>
            </div>
          </div>

          {/* BANK DETAILS BOX */}
          <div className={styles.bankBox}>
            <div className={styles.bankItem}>
              <FaUniversity className={styles.bankIcon} />
              <div>
                <label>Bank Account Name</label>
                <p>Academy of Pediatrics Gujarat</p>
              </div>
            </div>
            <div className={styles.bankItem}>
              <FaCreditCard className={styles.bankIcon} />
              <div>
                <label>Account Number</label>
                <p>085605002186</p>
              </div>
            </div>
            <div className={styles.bankItem}>
              <FaCodeBranch className={styles.bankIcon} />
              <div>
                <label>IFSC Code</label>
                <p>ICIC0000856</p>
              </div>
            </div>
            <div className={styles.bankItem}>
              <FaMapMarkerAlt className={styles.bankIcon} />
              <div>
                <label>Branch</label>
                <p>Chala, Vapi</p>
              </div>
            </div>
          </div>
        </div>

        {/* COPYRIGHT (Ab ye bottom me fix rahega) */}
      </footer>
    </div>
  );
};

export default Footer;
