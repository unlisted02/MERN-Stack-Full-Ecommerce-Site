import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../navbar/Navbar";
import MetaData from "../../MetaData";
import styles from "./AdminLayout.module.scss";

const AdminLayout = ({
    metaTitle,
    title,
    subtitle,
    ctaLabel,
    ctaTo,
    ctaComponent,
    headerExtra,
    children,
}) => {
    const renderAction = () => {
        if (headerExtra) return headerExtra;
        if (ctaComponent) return ctaComponent;
        if (ctaLabel && ctaTo) {
            return (
                <Link to={ctaTo} className={styles.primaryAction}>
                    {ctaLabel}
                </Link>
            );
        }
        return null;
    };

    return (
        <div className={styles.root}>
            {metaTitle && <MetaData title={metaTitle} />}
            <div className={styles.frame}>
                <aside className={styles.sidebar}>
                    <Sidebar />
                </aside>
                <main className={styles.main}>
                    <Navbar />
                    {(title || subtitle || ctaLabel || ctaComponent || headerExtra) && (
                        <header className={styles.hero}>
                            <div className={styles.heroText}>
                                {title && <h2>{title}</h2>}
                                {subtitle && <p>{subtitle}</p>}
                            </div>
                            {renderAction() && (
                                <div className={styles.heroActions}>{renderAction()}</div>
                            )}
                        </header>
                    )}
                    <div className={styles.body}>{children}</div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

