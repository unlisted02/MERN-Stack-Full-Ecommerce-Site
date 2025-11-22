import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Processorder.module.scss";
import {
    clearErrors,
    getOrderDetails,
    updateOrder,
} from "../../../../actions/orderActions";
import { UPDATE_ORDER_RESET } from "../../../../constants/orderConstants";
import Loader from "../../../../components/loader/Loader";
import { Link } from "react-router-dom";
import AdminLayout from "../../../../components/admin/layout/AdminLayout";

const ProcessOrder = ({ match }) => {
    const [status, setStatus] = useState("");

    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, order = {} } = useSelector((state) => state.orderDetails);
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        user,
        totalPrice,
        orderStatus,
    } = order;
    const { error, isUpdated } = useSelector((state) => state.order);

    const orderId = match.params.id;

    useEffect(() => {
        dispatch(getOrderDetails(orderId));

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            alert.success("Order updated successfully");
            dispatch({ type: UPDATE_ORDER_RESET });
            dispatch(getOrderDetails(orderId));
        }
    }, [dispatch, alert, error, isUpdated, orderId]);

    useEffect(() => {
        if (orderStatus && !status) {
            setStatus(orderStatus);
        }
    }, [orderStatus, status]);

    const updateOrderHandler = (id) => {
        const formData = new FormData();
        formData.set("status", status);

        dispatch(updateOrder(id, formData));
    };

    const shippingDetails =
        shippingInfo &&
        `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`;
    const isPaid =
        paymentInfo && paymentInfo.status === "succeeded" ? true : false;
    
    const headerSubtitle = order?._id
        ? `Order ID: ${order._id.substring(0, 24)}...`
        : "View and update order details";

    return (
        <AdminLayout
            metaTitle="Process Order"
            title="Order Details"
            subtitle={headerSubtitle}
        >
            {loading ? (
                <div className={styles.loader}>
                    <Loader />
                </div>
            ) : (
                <div className={styles.container}>
                    <div className={styles.grid}>
                        {/* Order Information Card */}
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>Order Information</h3>
                            
                            <div className={styles.infoSection}>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Order ID</span>
                                    <p className={styles.value}>{order._id}</p>
                                </div>
                                
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Total Amount</span>
                                    <p className={styles.value}>${totalPrice}</p>
                                </div>
                                
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Order Status</span>
                                    <span
                                        className={`${styles.statusBadge} ${
                                            orderStatus === "Delivered"
                                                ? styles.delivered
                                                : orderStatus === "Processing"
                                                ? styles.processing
                                                : styles.pending
                                        }`}
                                    >
                                        {orderStatus}
                                    </span>
                                </div>
                                
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Payment Status</span>
                                    <span
                                        className={`${styles.statusBadge} ${
                                            isPaid ? styles.paid : styles.unpaid
                                        }`}
                                    >
                                        {isPaid ? "PAID" : "NOT PAID"}
                                    </span>
                                </div>
                                
                                {paymentInfo?.id && (
                                    <div className={styles.infoItem}>
                                        <span className={styles.label}>Payment ID</span>
                                        <p className={styles.value}>{paymentInfo.id}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Shipping Information Card */}
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>Shipping Information</h3>
                            
                            <div className={styles.infoSection}>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Name</span>
                                    <p className={styles.value}>{user?.name || "N/A"}</p>
                                </div>
                                
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Phone</span>
                                    <p className={styles.value}>
                                        {shippingInfo?.phoneNo || "N/A"}
                                    </p>
                                </div>
                                
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Address</span>
                                    <p className={styles.value}>
                                        {shippingDetails || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Update Status Card */}
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>Update Order Status</h3>
                            
                            <div className={styles.updateSection}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="status" className={styles.label}>
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        className={styles.select}
                                        name="status"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Processing">Processing</option>
                                        <option value="On The Way">On The Way</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </div>

                                <button
                                    className={styles.updateButton}
                                    onClick={() => updateOrderHandler(order._id)}
                                    disabled={!status || status === orderStatus}
                                >
                                    Update Status
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Order Items Card */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Order Items</h3>
                        
                        <div className={styles.orderItems}>
                            {orderItems?.map((item) => (
                                <div key={item.product} className={styles.orderItem}>
                                    <div className={styles.itemImage}>
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                        />
                                    </div>
                                    
                                    <div className={styles.itemDetails}>
                                        <Link
                                            to={`/product/${item.product}`}
                                            className={styles.itemName}
                                        >
                                            {item.name}
                                        </Link>
                                    </div>
                                    
                                    <div className={styles.itemMeta}>
                                        <span className={styles.itemPrice}>
                                            ${item.price}
                                        </span>
                                        <span className={styles.itemQuantity}>
                                            Qty: {item.quantity}
                                        </span>
                                        <span className={styles.itemTotal}>
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default ProcessOrder;
