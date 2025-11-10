import React from "react";
import "./Widget.scss";

const Widget = ({ title, icon, link, total, accent = "accent-default" }) => {
    return (
        <div className={`widget ${accent}`}>
            <div className="widget__header">
                <span className="widget__title">{title}</span>
                <span className="widget__icon">{icon}</span>
            </div>
            <span className="widget__counter">{total ?? 0}</span>
            <span className="widget__link">{link}</span>
        </div>
    );
};

export default Widget;
