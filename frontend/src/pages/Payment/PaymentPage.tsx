import React, { useState } from "react";
import styles from "./MembershipPage.module.scss";
import { APIClient } from "../../helpers/api_helper";
import { Mail, Phone, Lock } from "lucide-react";

const api = new APIClient();

const MembershipPage: React.FC = () => {

    const [paymentDone, setPaymentDone] = useState(false);

    const [formData, setFormData] = useState<any>({
        mobile: "",
        surname: "",
        name: "",
        dob: "",
        gender: "Male",
        email: "",
        confirm_email: "",
        password: "",
        address: "",
        state: "",
        city: "",
        pincode: "",
        ciap: ""
    });

    const [strength, setStrength] = useState("Very Weak");
    const [level, setLevel] = useState(1);

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        // phone only 10 digit
        if (name === "mobile" && value.length > 10) return;

        setFormData({ ...formData, [name]: value });

        // password strength
        if (name === "password") {
            if (value.length > 10) {
                setStrength("Strong");
                setLevel(4);
            } else if (value.length > 7) {
                setStrength("Medium");
                setLevel(3);
            } else if (value.length > 4) {
                setStrength("Weak");
                setLevel(2);
            } else {
                setStrength("Very Weak");
                setLevel(1);
            }
        }
    };

    const handlePayment = async () => {

        if (formData.email !== formData.confirm_email) {
            alert("Email not matched");
            return;
        }

        const orderRes: any = await api.post("/api/create-order");

        const options = {
            key: "rzp_test_S5id1SbCLP8Tfu",
            amount: 2000 * 100,
            currency: "INR",
            name: "Life Membership",
            order_id: orderRes.order_id,

            handler: async function (response: any) {

                await api.post("/api/submit-form", {
                    ...formData,
                    payment_id: response.razorpay_payment_id,
                    order_id: response.razorpay_order_id,
                    signature: response.razorpay_signature
                });

                setPaymentDone(true);
                alert("Registration Successful");
            }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    };

    return (
        <div className={styles.wrapper}>

            <div className={styles.planBar}>
                <span>Life Membership</span>
                <span>₹2,000</span>
            </div>

            <div className={`${styles.card} ${paymentDone ? styles.formLocked : ""}`}>

                <h2>BECOME A MEMBER – FOR PEDIATRICIANS ONLY</h2>

                <h3>REGISTRATION FORM</h3>

                <div className={styles.inputBox}>
                    <Phone size={18} />
                    <input name="mobile" value={formData.mobile} disabled={paymentDone}
                        placeholder="Mobile Number" onChange={handleChange} />
                </div>

                <input name="surname" disabled={paymentDone} onChange={handleChange} placeholder="Surname" />
                <input name="name" disabled={paymentDone} onChange={handleChange} placeholder="Name" />
                <input type="date" name="dob" disabled={paymentDone} onChange={handleChange} />

                <div className={styles.gender}>
                    <label><input type="radio" name="gender" value="Male" disabled={paymentDone} defaultChecked onChange={handleChange} /> Male</label>
                    <label><input type="radio" name="gender" value="Female" disabled={paymentDone} onChange={handleChange} /> Female</label>
                </div>

                <div className={styles.inputBox}>
                    <Mail size={18} />
                    <input name="email" disabled={paymentDone} onChange={handleChange} placeholder="Email Address" />
                </div>

                <div className={styles.inputBox}>
                    <Mail size={18} />
                    <input name="confirm_email" disabled={paymentDone} onChange={handleChange} placeholder="Confirm Email Address" />
                </div>

                <div className={styles.inputBox}>
                    <Lock size={18} />
                    <input type="password" name="password" disabled={paymentDone} onChange={handleChange} placeholder="Password" />
                </div>

                <div className={styles.passwordRow}>
                    <div className={styles.segmentBar}>
                        <span className={level >= 1 ? styles.active1 : ""}></span>
                        <span className={level >= 2 ? styles.active2 : ""}></span>
                        <span className={level >= 3 ? styles.active3 : ""}></span>
                        <span className={level >= 4 ? styles.active4 : ""}></span>
                    </div>
                    <div className={styles.strengthText}>Strength: {strength}</div>
                </div>

                <textarea name="address" disabled={paymentDone} onChange={handleChange} placeholder="Address" />
                <input name="state" disabled={paymentDone} onChange={handleChange} placeholder="State" />
                <input name="city" disabled={paymentDone} onChange={handleChange} placeholder="City" />
                <input name="pincode" disabled={paymentDone} onChange={handleChange} placeholder="Pincode" />
                <input name="ciap" disabled={paymentDone} onChange={handleChange} placeholder="CIAP Number" />

                <div className={styles.gatewayTitle}>Select Your Payment Gateway</div>
                <div className={styles.gatewayBox}>✔ Razorpay</div>

                <button className={styles.payBtn} disabled={paymentDone} onClick={handlePayment}>
                    {paymentDone ? "Payment Completed" : "PAY NOW"}
                </button>

            </div>
        </div>
    );
};

export default MembershipPage;
