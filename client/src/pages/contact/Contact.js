import React, { Fragment, useState } from "react";
import { useAlert } from "react-alert";
import { FaFacebook } from "react-icons/fa";
import { BsInstagram, BsYoutube } from "react-icons/bs";
import styles from "./Contact.module.scss";
import { FcBusinessContact } from "react-icons/fc";
import Navbar from "../../components/header/Navbar";
import Footer from "../../components/footer/Footer";
import MetaData from "../../components/MetaData";
import { axiosInstance } from "../../config";
import ButtonLoader from "../../components/loader/ButtonLoader";

const Contact = () => {
    const alert = useAlert();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);

    const { name, email, message } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!name || !email || !message) {
            alert.error("Please fill in all fields");
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
                "/api/v1/contact",
                formData,
                config
            );

            alert.success(data.message || "Your message has been sent successfully!");
            setFormData({
                name: "",
                email: "",
                message: "",
            });
        } catch (error) {
            alert.error(
                error.response?.data?.message || "Failed to send message. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };
    const contacts = [
        {
            icon: <FcBusinessContact size={50} />,
            text1: "Tel: 1234",
            text2: "Email: info@gmail.com",
        },
        {
            icon: <FcBusinessContact size={50} />,
            text1: "Tel: 1234",
            text2: "Email: info@gmail.com",
        },
        {
            icon: <FcBusinessContact size={50} />,
            text1: "Tel: 1234",
            text2: "Email: info@gmail.com",
        },
        {
            icon: <FcBusinessContact size={50} />,
            text1: "Tel: 1234",
            text2: "Email: info@gmail.com",
        },
    ];
    return (
        <Fragment>
            <MetaData title={"Contact"} />
            <Navbar />
            <div className={styles.contact}>
                <div className={styles.contact_title}>
                    <div className="container">
                        <h3>Contact Us</h3>
                    </div>
                </div>
                <div className={styles.contact_info}>
                    <div className="container mt-5">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className={styles.about}>
                                    <h4>Information About Us</h4>
                                    <p className="mt-3">
                                        We built ShopX to connect modern
                                        shoppers with independent creators and
                                        trusted brands. If you have questions
                                        about an order, want to collaborate, or
                                        simply need a recommendation, reach out
                                        using any of the channels below—we reply
                                        within one business day.
                                    </p>
                                    <div>
                                        <span>
                                            <FaFacebook size={40} />
                                        </span>
                                        <span>
                                            <BsInstagram size={40} />
                                        </span>
                                        <span>
                                            <BsYoutube size={40} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className={styles.contact}>
                                    <h4>Contact Way</h4>
                                    <div className="row g-3 mt-2">
                                        {contacts.map((contact, index) => (
                                            <div
                                                className="col-md-6"
                                                key={index}
                                            >
                                                <div className="d-flex align-items-center">
                                                    <div>{contact.icon}</div>
                                                    <div className="ms-3">
                                                        <p>{contact.text1}</p>
                                                        <p>{contact.text2}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.contact_form}>
                    <div className="container">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <h3>Get In Touch</h3>
                                <form className={styles.form} onSubmit={submitHandler}>
                                    <div className={styles.from_group}>
                                        <label htmlFor="name_field">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Enter your name ..."
                                            value={name}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.from_group}>
                                        <label htmlFor="email_field">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Enter your email ..."
                                            value={email}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.from_group}>
                                        <label htmlFor="message_field">
                                            Message
                                        </label>
                                        <textarea
                                            name="message"
                                            placeholder="Enter your message ..."
                                            cols="8"
                                            rows="5"
                                            value={message}
                                            onChange={onChange}
                                            required
                                        ></textarea>
                                    </div>

                                    <div className={styles.from_group}>
                                        <button type="submit" disabled={loading}>
                                            {loading ? <ButtonLoader /> : "Send"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="col-md-6">
                                <div className={styles.contact_img}>
                                    <img
                                        src="https://res.cloudinary.com/mehedi08h/image/upload/v1648703985/shopx/Contact_us-rafiki_efzxlu.svg"
                                        alt=""
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default Contact;
