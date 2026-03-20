import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer/Footer";
import Navbar from "../../../components/header/Navbar";
import MetaData from "../../../components/MetaData";
import styles from "./Success.module.scss";

const Success = () => {
    return (
        <Fragment>
            <MetaData title={"Order Successful"} />
            <Navbar />
            <div className={styles.success}>
                <div className={styles.content}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="100"
                        width="100"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                    >
                        <circle
                            className={styles.circle}
                            fill="#5bb543"
                            cx="24"
                            cy="24"
                            r="22"
                        />
                        <path
                            className={styles.tick}
                            fill="none"
                            stroke="#FFF"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeMiterlimit="10"
                            d="M14 27l5.917 4.917L34 17"
                        />
                    </svg>

                    <h2>Order Placed Successfully!</h2>
                    <p>Thank you for your purchase. Your order is being processed.</p>
                    <p>You will receive a confirmation email shortly.</p>

                    <div className={styles.actions}>
                        <Link to="/orders/me" className={styles.primary}>
                            View My Orders
                        </Link>
                        <Link to="/" className={styles.secondary}>
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default Success;
