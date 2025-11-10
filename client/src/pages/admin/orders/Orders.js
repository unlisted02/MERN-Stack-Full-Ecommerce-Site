import React, { useEffect } from "react";
import {
    allOrders,
    clearErrors,
    deleteOrder,
} from "../../../actions/orderActions";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Orders.module.scss";
import Loader from "../../../components/loader/Loader";
import { Table } from "react-bootstrap";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { DELETE_ORDER_RESET } from "../../../constants/orderConstants";
import AdminLayout from "../../../components/admin/layout/AdminLayout";

const Orders = ({ history }) => {
    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, orders } = useSelector((state) => state.allOrders);
    const { isDeleted } = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(allOrders());

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isDeleted) {
            alert.success("Order deleted successfully");
            history.push("/admin/orders");
            dispatch({ type: DELETE_ORDER_RESET });
        }
    }, [dispatch, alert, error, isDeleted, history]);

    const deleteOrderHandler = (id) => {
        dispatch(deleteOrder(id));
    };

    return (
        <AdminLayout
            metaTitle="Orders"
            title="Orders overview"
            subtitle="Track fulfillment, update statuses, and resolve customer issues quickly."
        >
            <div className={styles.card}>
                {loading ? (
                    <div className={styles.loader}>
                        <Loader />
                    </div>
                ) : (
                    <Table responsive className={styles.table}>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Items</th>
                                <th>Amount</th>
                                <th>City</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders?.map((order) => (
                                <tr key={order?._id}>
                                    <td>{order?._id}</td>
                                    <td>{order.orderItems.length}</td>
                                    <td>${Number(order?.totalPrice).toFixed(2)}</td>
                                    <td>{order?.shippingInfo.city}</td>
                                    <td>
                                        <span
                                            className={`${styles.status} ${
                                                order?.orderStatus === "Delivered"
                                                    ? styles.success
                                                    : order?.orderStatus === "Processing"
                                                    ? styles.processing
                                                    : styles.pending
                                            }`}
                                        >
                                            {order?.orderStatus}
                                        </span>
                                    </td>
                                    <td className={styles.actions}>
                                        <Link to={`/admin/order/${order._id}`}>
                                            <AiOutlineEye size={18} />
                                            <span>Details</span>
                                        </Link>
                                        <button
                                            onClick={() =>
                                                deleteOrderHandler(order._id)
                                            }
                                        >
                                            <AiOutlineDelete size={18} />
                                            <span>Delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>
        </AdminLayout>
    );
};

export default Orders;
