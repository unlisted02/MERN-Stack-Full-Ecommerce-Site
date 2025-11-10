import React from "react";
import { AiOutlineHome } from "react-icons/ai";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.scss";

const Navbar = () => {
    return (
        <div className={styles.navbar}>
            <div className={styles.titleBlock}>
                <h3>Admin Control Center</h3>
                <p>Monitor performance and keep your storefront running</p>
            </div>
            <Link to="/" className={styles.viewStore}>
                <AiOutlineHome size={18} />
                <span>View storefront</span>
            </Link>
        </div>
    );
};

export default Navbar;
