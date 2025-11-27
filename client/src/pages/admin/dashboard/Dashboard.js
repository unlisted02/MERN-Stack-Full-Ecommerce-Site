import React, { useEffect } from "react";
import Widget from "../../../components/widget/Widget";
import {
    AiOutlineShoppingCart,
    AiOutlineUser,
    AiOutlineAppstore,
} from "react-icons/ai";
import { MdOutlineInventory2 } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Dashboard.module.scss";
import Loader from "../../../components/loader/Loader";
import { getAdminProducts } from "../../../actions/productAction";
import { allUsers } from "../../../actions/userActions";
import { allOrders } from "../../../actions/orderActions";
import AdminLayout from "../../../components/admin/layout/AdminLayout";

const Dashboard = () => {
    const dispatch = useDispatch();

    const { orders } = useSelector((state) => state.allOrders);
    const { users } = useSelector((state) => state.allUsers);
    const { loading, products } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(getAdminProducts());
    }, [dispatch]);
    useEffect(() => {
        dispatch(allOrders());
    }, [dispatch]);
    useEffect(() => {
        dispatch(allUsers());
    }, [dispatch]);

    const LOW_STOCK_THRESHOLD = 15;
    const stockout = products?.filter((item) => item.stock <= LOW_STOCK_THRESHOLD) ?? [];

    const stats = [
        {
            title: "Total Users",
            total: users?.length ?? 0,
            link: <Link to="/admin/users">Manage users</Link>,
            icon: <AiOutlineUser size={26} />,
            accent: "accent-users",
        },
        {
            title: "Orders",
            total: orders?.length ?? 0,
            link: <Link to="/admin/orders">Review orders</Link>,
            icon: <AiOutlineShoppingCart size={26} />,
            accent: "accent-orders",
        },
        {
            title: "Products",
            total: products?.length ?? 0,
            link: <Link to="/admin/products">Browse catalog</Link>,
            icon: <AiOutlineAppstore size={26} />,
            accent: "accent-products",
        },
        {
            title: "Low on Stock",
            total: stockout.length,
            link: <Link to="/admin/products">View inventory</Link>,
            icon: <MdOutlineInventory2 size={26} />,
            accent: "accent-inventory",
        },
    ];

    return (
        <AdminLayout
            metaTitle="Dashboard"
            title="Welcome back, Admin"
            subtitle="Track store performance, manage orders, and keep products up to date from this unified workspace."
            ctaLabel="Add product"
            ctaTo="/admin/products/new"
        >
            {loading ? (
                <div className={styles.loader}>
                    <Loader />
                </div>
            ) : (
                <section className={styles.widgets}>
                    {stats.map((stat) => (
                        <Widget key={stat.title} {...stat} />
                    ))}
                </section>
            )}
        </AdminLayout>
    );
};

export default Dashboard;
