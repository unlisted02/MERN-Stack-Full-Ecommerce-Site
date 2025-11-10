import React, { useEffect } from "react";
import { Table } from "react-bootstrap";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye } from "react-icons/ai";

import styles from "./ProductsList.module.scss";
import {
    clearErrors,
    deleteProduct,
    getAdminProducts,
} from "../../../actions/productAction";
import Loader from "../../../components/loader/Loader";
import { DELETE_PRODUCT_RESET } from "../../../constants/productsConstants";
import AdminLayout from "../../../components/admin/layout/AdminLayout";

const ProductsList = ({ history }) => {
    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, products } = useSelector((state) => state.products);
    const { error: deleteError, isDeleted } = useSelector(
        (state) => state.product
    );

    useEffect(() => {
        dispatch(getAdminProducts());

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }

        if (isDeleted) {
            alert.success("Product deleted successfully");
            history.push("/admin/products");
            dispatch({ type: DELETE_PRODUCT_RESET });
        }
    }, [dispatch, alert, error, deleteError, isDeleted, history]);

    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id));
    };
    return (
        <AdminLayout
            metaTitle="All Products"
            title="Product catalog"
            subtitle="Review inventory, edit listings, and keep your catalog fresh."
            ctaLabel="Add product"
            ctaTo="/admin/products/new"
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
                                <th>ID</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products?.map((product) => (
                                <tr key={product?._id}>
                                    <td>{product?._id}</td>
                                    <td>
                                        <img
                                            className={styles.thumb}
                                            src={product?.images[0].url}
                                            alt={product?.name}
                                        />
                                    </td>
                                    <td>{product?.name}</td>
                                    <td>${Number(product?.price).toFixed(2)}</td>
                                    <td>{product?.stock}</td>
                                    <td className={styles.actions}>
                                        <Link
                                            to={`/admin/product/details/${product._id}`}
                                        >
                                            <AiOutlineEye size={18} />
                                            <span>View</span>
                                        </Link>
                                        <Link
                                            to={`/admin/product/${product._id}`}
                                        >
                                            <AiOutlineEdit size={18} />
                                            <span>Edit</span>
                                        </Link>
                                        <button
                                            onClick={() =>
                                                deleteProductHandler(
                                                    product._id
                                                )
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

export default ProductsList;
