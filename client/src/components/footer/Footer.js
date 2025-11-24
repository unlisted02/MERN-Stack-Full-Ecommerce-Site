import React, { useState } from "react";
import { useAlert } from "react-alert";
import { AiOutlineMail } from "react-icons/ai";
import styles from "./Footer.module.scss";
import { axiosInstance } from "../../config";
import ButtonLoader from "../loader/ButtonLoader";

const Footer = () => {
    const alert = useAlert();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!email) {
            alert.error("Please enter your email address");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert.error("Please enter a valid email address");
            return;
        }

        setLoading(true);

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const { data } = await axiosInstance.post(
                "/api/v1/newsletter/subscribe",
                { email },
                config
            );

            alert.success(data.message || "Successfully subscribed to newsletter!");
            setEmail("");
        } catch (error) {
            alert.error(
                error.response?.data?.message || "Failed to subscribe. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.footer}>
            <div className={styles.footer_info}>
                <div className="container">
                    <div className="row g-3">
                        {/* about us  */}
                        <div className="col-md-3">
                            <div className={styles.about_us}>
                                <h5>About Us</h5>
                                <div>
                                    <p>
                                        We built ShopX to connect modern
                                        shoppers with independent creators and
                                        trusted brands. If you have questions
                                        about an order, want to collaborate, or
                                        simply need a recommendation, reach out
                                        using any of the channels below—we reply
                                        within one business day.
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* information  */}
                        <div className="col-md-3">
                            <div className={styles.information}>
                                <h5>Information</h5>
                                <div>
                                    <li>About Us</li>
                                    <li>Contact Us</li>
                                    <li>FAQs</li>
                                    <li>Privacy Policy</li>
                                    <li>Refund policy</li>
                                    <li>Cookie Policy</li>
                                </div>
                            </div>
                        </div>
                        {/* customer service  */}
                        <div className="col-md-3">
                            <div className={styles.information}>
                                <h5>CUSTTOMER SERVICE</h5>
                                <div>
                                    <li>My Account</li>
                                    <li>Support Center</li>
                                    <li>Terms & Conditions</li>
                                    <li>Returns & Exchanges</li>
                                    <li>Shipping & Delivery</li>
                                </div>
                            </div>
                        </div>
                        {/* the optimal newsletter  */}
                        <div className="col-md-3">
                            <div className={styles.newsletter}>
                                <h5>THE OPTIMAL NEWSLETTER</h5>
                                <div>
                                    <p>
                                        Send us your email to get the latest news and updates.
                                    </p>
                                    <form onSubmit={submitHandler}>
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={loading}
                                        />
                                        <button type="submit" disabled={loading}>
                                            {loading ? (
                                                <ButtonLoader />
                                            ) : (
                                                <AiOutlineMail />
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.copyright}>
                <span>© {new Date().getFullYear()} Optimal. All Rights Reserved.</span>
            </div>
        </div>
    );
};

export default Footer;
