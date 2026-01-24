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
} from "react-icons/fa";
import Copyright from "./Copyright";

const Footer: React.FC = () => {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.topStrip}>
          <div className={styles.logoBox}>
            <img src={Logo} alt="AOP Gujarat Logo" />
          </div>
          <h2>Academy of Pediatrics Gujarat</h2>
        </div>

        <div className={styles.footerGrid}>
          <div>
            <h4>CONNECT WITH US</h4>
            <p>
              <span className={styles.linkText}>
                <FaPhoneAlt /> +91 98795 40888
              </span>
            </p>
            <p>
              <span className={styles.linkText}>
                <FaEnvelope /> aopgujarat@gmail.com
              </span>
            </p>

            <div className={styles.socials}>
              <FaFacebookF />
              <FaTwitter />
              <FaYoutube />
              <FaInstagram />
            </div>
          </div>

          <div>
            <h4>QUICK LINKS</h4>
            <ul>
              <li>
                <span className={styles.linkText}>Home</span>
              </li>
              <li>
                <span className={styles.linkText}>About Us</span>
              </li>
              <li>
                <span className={styles.linkText}>Office Bearers</span>
              </li>
              <li>
                <span className={styles.linkText}>Member&apos;s Directory</span>
              </li>
              <li>
                <span className={styles.linkText}>Photo</span>
              </li>
              <li>
                <span className={styles.linkText}>Video</span>
              </li>
              <li>
                <span className={styles.linkText}>Contact Us</span>
              </li>
            </ul>
          </div>

          <div>
            <h4>QUICK LINKS</h4>
            <ul>
              <li>
                <span className={styles.linkText}>Terms & Conditions</span>
              </li>
              <li>
                <span className={styles.linkText}>Privacy Policy</span>
              </li>
            </ul>
          </div>

          <div>
            <h4>EVENTS</h4>
            <ul>
              <li>
                <span className={styles.linkText}>Upcoming Events</span>
              </li>
              <li>
                <span className={styles.linkText}>Recent Events</span>
              </li>
              <li>
                <span className={styles.linkText}>Past Events</span>
              </li>
              <li>
                <span className={styles.linkText}>
                  Presidential Action Plan 2024–25
                </span>
              </li>
              <li>
                <span className={styles.linkText}>
                  Presidential Action Plan 2023
                </span>
              </li>
            </ul>
          </div>

          <div className={styles.reach}>
            <h4>REACH US</h4>
            <p>
              <span className={styles.linkText}>
                Samir Hospital, Lakdipul,
                <br />
                Dandiabazar Main Road,
                <br />
                Vadodara – 390001
              </span>
            </p>
          </div>
        </div>
      </footer>
      <Copyright />
    </>
  );
};

export default Footer;
// import React from "react";
// import styles from "./Footer.module.scss";
// import Logo from "../../assets/logo/Asset 1@2x-8 1.png";
// import {
//   FaPhoneAlt,
//   FaEnvelope,
//   FaFacebookF,
//   FaTwitter,
//   FaYoutube,
//   FaInstagram,
// } from "react-icons/fa";

// const Footer: React.FC = () => {
//   return (
//     <footer className={styles.footer}>
//       {/* TOP STRIP */}
//       <div className={styles.topStrip}>
//         <div className={styles.logoBox}>
//           <img src={Logo} alt="AOP Gujarat Logo" />
//         </div>
//         <h2>Academy of Pediatrics Gujarat</h2>
//       </div>

//       {/* MAIN GRID */}
//       <div className={styles.footerGrid}>
//         <div>
//           <h4>CONNECT WITH US</h4>
//           <p>
//             <FaPhoneAlt /> +91 98795 40888
//           </p>
//           <p>
//             <FaEnvelope /> aopgujarat@gmail.com
//           </p>

//           <div className={styles.socials}>
//             <FaFacebookF />
//             <FaTwitter />
//             <FaYoutube />
//             <FaInstagram />
//           </div>
//         </div>

//         <div>
//           <h4>QUICK LINKS</h4>
//           <ul>
//             <li>Home</li>
//             <li>About Us</li>
//             <li>Office Bearers</li>
//             <li>Member’s Directory</li>
//             <li>Photo</li>
//             <li>Video</li>
//             <li>Contact Us</li>
//           </ul>
//         </div>

//         <div>
//           <h4>POLICIES</h4>
//           <ul>
//             <li>Terms & Conditions</li>
//             <li>Privacy Policy</li>
//           </ul>
//         </div>

//         <div>
//           <h4>EVENTS</h4>
//           <ul>
//             <li>Upcoming Events</li>
//             <li>Recent Events</li>
//             <li>Past Events</li>
//             <li>Action Plan 2024–25</li>
//             <li>Action Plan 2023</li>
//           </ul>
//         </div>

//         <div>
//           <h4>REACH US</h4>
//           <p>
//             Samir Hospital, Lakdipul,
//             <br />
//             Dandiabazar Main Road,
//             <br />
//             Vadodara – 390001
//           </p>
//         </div>
//       </div>

//       {/* COPYRIGHT (INSIDE FOOTER – FIXED) */}
//       <div className={styles.copyright}>
//         <span>© 2026 AOP GUJARAT | All Rights Reserved.</span>
//         <span>
//           Website Developed By : <b>Wodex Web</b>
//         </span>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
