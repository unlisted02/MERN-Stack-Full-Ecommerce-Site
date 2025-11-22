import React from "react";
import { AiOutlineMail } from "react-icons/ai";
import styles from "./Footer.module.scss";

const Footer = () => {
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
                                    <input type="email" />
                                    <button>
                                        <AiOutlineMail />
                                    </button>
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
