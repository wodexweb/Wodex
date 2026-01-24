import React from "react";
import "./BankDetails.scss";
import { AiFillHome } from "react-icons/ai";
import {
  FaUniversity,
  FaHashtag,
  FaRegCreditCard,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const BankDetails: React.FC = () => {
  return (
    <div className="bank-details">
      {/* HERO */}
      <section className="hero">
        <h1>Bank Details</h1>

        <p className="breadcrumb">
          <Link to="/" className="home">
            <AiFillHome className="home-icon" />
            <span>Home</span>
          </Link>
          <span className="separator">{">"}</span>
          <span className="current">Bank Details</span>
        </p>
      </section>

      {/* CONTENT */}
      <section className="content">
        <h2>
          Bank Details For Gujarat Pediatric <br />
          Intensive Care Chapter
        </h2>

        <div className="details-wrapper">
          {/* LEFT ORANGE BOX */}
          <div className="bank-card">
            <div className="info-item">
              <FaUniversity className="icon" />
              <div>
                <h4>Bank Account Name</h4>
                <p>Gujarat Pediatric Intensive Care Chapter</p>
              </div>
            </div>

            <div className="info-item">
              <FaHashtag className="icon" />
              <div>
                <h4>IFSC Code</h4>
                <p>ICIC0000856</p>
              </div>
            </div>

            <div className="info-item">
              <FaRegCreditCard className="icon" />
              <div>
                <h4>Account Number</h4>
                <p>085605002186</p>
              </div>
            </div>

            <div className="info-item">
              <FaMapMarkerAlt className="icon" />
              <div>
                <h4>Branch</h4>
                <p>Chala, Vapi</p>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="image-card">
            <img
              src="https://images.unsplash.com/photo-1607746882042-944635dfe10e"
              alt="Little Lives Matter"
            />
            <div className="overlay">
              <h3>Little Lives Matter</h3>
              <p>Help Them Grow</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BankDetails;
