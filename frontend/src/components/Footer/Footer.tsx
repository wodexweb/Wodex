import React from "react";
import styles from "./Footer.module.scss";
import Logo from "../../assets/logo/Asset 1@2x-8 1.png";
import { Link } from "react-router-dom";
import {
  FaPhoneAlt, FaEnvelope, FaFacebookF, FaTwitter,
  FaYoutube, FaInstagram, FaMapMarkerAlt, FaUniversity,
  FaCreditCard, FaCodeBranch,
} from "react-icons/fa";
import { useContactSettings } from "../../hooks/useFooterSettings";
import { useMenu } from "../../hooks/useMenu";

// ✅ Define MenuItem locally if it's not exported from your hook
interface MenuItem {
  id: number | string;
  title: string;
  url: string;
}

const Footer: React.FC = () => {
  const { data: contactData } = useContactSettings();

  // Fetch dynamic menus
  const { menu: aboutMenuRaw, loading: loadingAbout } = useMenu("footer-about");
  const { menu: quickLinksMenuRaw, loading: loadingQuick } = useMenu("footer-quick-links");
  const { menu: policiesMenuRaw, loading: loadingPolicies } = useMenu("footer-policies");

  // ✅ Safety: Ensure these are always arrays even if the API fails
  const aboutMenu = Array.isArray(aboutMenuRaw) ? aboutMenuRaw : [];
  const quickLinksMenu = Array.isArray(quickLinksMenuRaw) ? quickLinksMenuRaw : [];
  const policiesMenu = Array.isArray(policiesMenuRaw) ? policiesMenuRaw : [];

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item) => (
      <li key={item.id}>
        {item.url?.startsWith("http") ? (
          <a href={item.url} target="_blank" rel="noreferrer" className={styles.linkText}>
            {item.title}
          </a>
        ) : (
          <Link to={item.url || "#"} className={styles.linkText}>
            {item.title}
          </Link>
        )}
      </li>
    ));
  };

  return (
    <div className={styles.footerWrapper}>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.topHeader}>
            <div className={styles.logoBox}>
              <img src={Logo} alt="AOP Logo" />
            </div>
            <h2>ACADEMY OF PEDIATRICS GUJARAT</h2>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.footerGrid}>
            <div className={styles.col}>
              <h4>CONNECT WITH US</h4>
              <div className={styles.contactItem}>
                <FaPhoneAlt className={styles.icon} />
                <span className={styles.linkText}>
                  {contactData?.contact_number ? `+91 ${contactData.contact_number}` : "+91 98795 40888"}
                </span>
              </div>
              <div className={styles.contactItem}>
                <FaEnvelope className={styles.icon} />
                <span className={styles.linkText}>
                  {contactData?.email || "aopgujarat@gmail.com"}
                </span>
              </div>
              <div className={styles.socials}>
                {contactData?.facebook_url && <a href={contactData.facebook_url} target="_blank" rel="noreferrer"><FaFacebookF /></a>}
                {contactData?.x_url && <a href={contactData.x_url} target="_blank" rel="noreferrer"><FaTwitter /></a>}
                {contactData?.youtube_url && <a href={contactData.youtube_url} target="_blank" rel="noreferrer"><FaYoutube /></a>}
                {contactData?.instagram_url && <a href={contactData.instagram_url} target="_blank" rel="noreferrer"><FaInstagram /></a>}
              </div>
            </div>

            {/* Column: About */}
            <div className={styles.col}>
              <h4>ABOUT</h4>
              <ul>
                {aboutMenu.length > 0 ? renderMenuItems(aboutMenu) : (
                  <>
                    <li><Link to="/about" className={styles.linkText}>AOP Gujarat</Link></li>
                    <li><Link to="/executive-body" className={styles.linkText}>Executive Body</Link></li>
                  </>
                )}
              </ul>
            </div>

            {/* Column: Quick Links */}
            <div className={styles.col}>
              <h4>QUICK LINKS</h4>
              <ul>
                {quickLinksMenu.length > 0 ? renderMenuItems(quickLinksMenu) : (
                  <li><Link to="/" className={styles.linkText}>Home</Link></li>
                )}
              </ul>
            </div>

            {/* Column: Policies */}
            <div className={styles.col}>
              <h4>POLICIES</h4>
              <ul>
                {policiesMenu.length > 0 ? renderMenuItems(policiesMenu) : (
                  <li><Link to="/privacy-policy" className={styles.linkText}>Privacy Policy</Link></li>
                )}
              </ul>
            </div>

            <div className={styles.col}>
              <h4>REACH US</h4>
              <div className={styles.contactItem}>
                <FaMapMarkerAlt className={styles.icon} />
                <p className={styles.addressText}>{contactData?.address || "Vadodara, Gujarat"}</p>
              </div>
            </div>
          </div>

          <div className={styles.bankBox}>
            <BankItem icon={<FaUniversity />} label="Bank Account Name" value="Academy of Pediatrics Gujarat" />
            <BankItem icon={<FaCreditCard />} label="Account Number" value="085605002186" />
            <BankItem icon={<FaCodeBranch />} label="IFSC Code" value="ICIC0000856" />
            <BankItem icon={<FaMapMarkerAlt />} label="Branch" value="Chala, Vapi" />
          </div>
        </div>
      </footer>
    </div>
  );
};

const BankItem = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className={styles.bankItem}>
    <span className={styles.bankIcon}>{icon}</span>
    <div>
      <label>{label}</label>
      <p>{value}</p>
    </div>
  </div>
);

export default Footer;