import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import Footer from "../../../components/footer/Footer";
import Navbar from "../../../components/header/Navbar";
import MetaData from "../../../components/MetaData";
import CheckoutSteps from "../checkoutSteps/CheckoutSteps";
import { createOrder, clearErrors } from "../../../actions/orderActions";
import { clearCart } from "../../../actions/cartActions";
import { CREATE_ORDER_RESET } from "../../../constants/orderConstants";
import { axiosInstance } from "../../../config";

import styles from "./ConfirmOrder.module.scss";

const ConfirmOrder = ({ history }) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const { cartItems, shippingInfo } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const { error, order, loading: orderLoading } = useSelector(
        (state) => state.newOrder
    );
    const [stripeEnabled, setStripeEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orderJustCreated, setOrderJustCreated] = useState(false);

    useEffect(() => {
        dispatch({ type: CREATE_ORDER_RESET });
        setOrderJustCreated(false);
        
        if (!shippingInfo || !shippingInfo.address || !shippingInfo.city || !shippingInfo.phoneNo || !shippingInfo.postalCode || !shippingInfo.country) {
            alert.error("Please complete shipping information");
            history.push("/shipping");
            return;
        }

        if (cartItems.length === 0) {
            alert.error("Your cart is empty");
            history.push("/cart");
            return;
        }
    }, [dispatch, history, alert]);

    useEffect(() => {
        const checkStripe = async () => {
            try {
                const { data } = await axiosInstance.get("/api/v1/stripeapi");
                setStripeEnabled(!!data.stripeApiKey);
            } catch (err) {
                setStripeEnabled(false);
            }
        };
        checkStripe();
    }, []);

    useEffect(() => {
        if (error) {
            console.error("Order creation error:", error);
            alert.error(error);
            dispatch(clearErrors());
            setLoading(false);
            setOrderJustCreated(false);
        }
    }, [dispatch, alert, error]);

    useEffect(() => {
        if (loading) {
            const timeout = setTimeout(() => {
                if (loading && !order && !error) {
                    setLoading(false);
                    alert.error("Request is taking too long. Please try again.");
                }
            }, 30000); // 30 second timeout

            return () => clearTimeout(timeout);
        }
    }, [loading, order, error]);

    useEffect(() => {
        if (!orderLoading && loading) {
            setLoading(false);
        }
    }, [orderLoading, loading]);

    useEffect(() => {
        if (order && order._id && orderJustCreated) {
            setLoading(false);
            
            // Clear cart from Redux state and localStorage
            dispatch(clearCart());
            sessionStorage.removeItem("orderInfo");
            
            // Reset order state
            dispatch({ type: CREATE_ORDER_RESET });
            setOrderJustCreated(false);
            
            alert.success("Order placed successfully!");
            
            // Redirect to home page
            setTimeout(() => {
                history.push("/");
            }, 2000);
        }
    }, [order, orderJustCreated, history, alert, dispatch]);

    // Calculate Order Prices
    const itemsPrice = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    const shippingPrice = itemsPrice > 200 ? 0 : 25;
    const taxPrice = Number((0.05 * itemsPrice).toFixed(2));
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

    const processToPayment = async () => {
        const data = {
            itemsPrice: itemsPrice.toFixed(2),
            shippingPrice,
            taxPrice,
            totalPrice,
        };

        if (stripeEnabled) {
            // Stripe is enabled, proceed to payment
            sessionStorage.setItem("orderInfo", JSON.stringify(data));
            history.push("/payment");
        } else {
            // Stripe is disabled, create order directly without payment
            if (cartItems.length === 0) {
                alert.error("Your cart is empty");
                history.push("/cart");
                return;
            }

            // Validate shipping info
            if (!shippingInfo || !shippingInfo.address || !shippingInfo.city || !shippingInfo.phoneNo || !shippingInfo.postalCode || !shippingInfo.country) {
                alert.error("Please complete shipping information");
                history.push("/shipping");
                return;
            }

            setLoading(true);
            setOrderJustCreated(true); // Mark that we're creating an order
            
            console.log("Creating order with data:", {
                orderItems: cartItems.length,
                shippingInfo: shippingInfo,
                totalPrice: totalPrice
            });
            
            const order = {
                orderItems: cartItems,
                shippingInfo,
                itemsPrice: itemsPrice.toFixed(2),
                shippingPrice,
                taxPrice,
                totalPrice,
                paymentInfo: {
                    id: "manual-order",
                    status: "pending",
                },
            };

            dispatch(createOrder(order));
        }
    };
    return (
        <Fragment>
            <MetaData title={"Confirm Order"} />
            <Navbar />
            <div className={styles.confirm}>
                <div className="container">
                    <CheckoutSteps shipping confirmOrder />

                    <div className="row d-flex justify-content-between">
                        <div className="col-12 col-lg-8 mt-3 order-confirm">
                            <h4 className="mb-3">Shipping Info</h4>
                            <p>
                                <b>Name:</b> {user && user.name}
                            </p>
                            <p>
                                <b>Phone:</b> {shippingInfo.phoneNo}
                            </p>
                            <p className="mb-4">
                                <b>Address:</b>
                                {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}
                            </p>

                            <hr />
                            <h4 className="mt-4">Your Cart Items:</h4>

                            {cartItems.map((item) => (
                                <Fragment>
                                    <hr />
                                    <div
                                        className="cart-item my-1"
                                        key={item.product}
                                    >
                                        <div className="row">
                                            <div className="col-4 col-lg-2">
                                                <img
                                                    src={item.image}
                                                    alt="Laptop"
                                                    height="45"
                                                    width="65"
                                                />
                                            </div>

                                            <div className="col-5 col-lg-6">
                                                <Link
                                                    style={{
                                                        textDecoration: "none",
                                                    }}
                                                    to={`/products/${item.product}`}
                                                >
                                                    {item.name}
                                                </Link>
                                            </div>

                                            <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                                                <p>
                                                    {item.quantity} x $
                                                    {item.price} ={" "}
                                                    <b>
                                                        $
                                                        {(
                                                            item.quantity *
                                                            item.price
                                                        ).toFixed(2)}
                                                    </b>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                </Fragment>
                            ))}
                        </div>

                        <div className="col-12 col-lg-3 my-4">
                            <div className={styles.order_summary}>
                                <h4>Order Summary</h4>
                                <hr />
                                <p>
                                    Subtotal:
                                    <span className="ms-3">${itemsPrice}</span>
                                </p>
                                <p>
                                    Shipping:
                                    <span className="ms-3">
                                        ${shippingPrice}
                                    </span>
                                </p>
                                <p>
                                    Tax:
                                    <span className="ms-3">${taxPrice}</span>
                                </p>

                                <hr />

                                <p>
                                    Total:
                                    <span className="ms-3">${totalPrice}</span>
                                </p>

                                <hr />
                                <button
                                    id="checkout_btn"
                                    onClick={processToPayment}
                                    disabled={loading || orderLoading}
                                >
                                    {loading || orderLoading
                                        ? "Processing..."
                                        : stripeEnabled
                                        ? "Proceed to Payment"
                                        : "Place Order"}
                                </button>
                                {!stripeEnabled && (
                                    <p
                                        style={{
                                            fontSize: "12px",
                                            color: "#888",
                                            marginTop: "10px",
                                            textAlign: "center",
                                        }}
                                    >
                                        Payment processing is temporarily
                                        disabled. Your order will be processed
                                        manually.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default ConfirmOrder;
