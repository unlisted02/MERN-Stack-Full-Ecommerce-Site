import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { Table } from "react-bootstrap";
import { AiOutlineDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
    clearErrors,
    deleteReview,
    getProductReviews,
} from "../../../actions/productAction";
import { DELETE_REVIEW_RESET } from "../../../constants/productsConstants";
import AdminLayout from "../../../components/admin/layout/AdminLayout";
import styles from "./ProductReview.module.scss";

const ProductReview = () => {
    const [productId, setProductId] = useState("");

    const alert = useAlert();
    const dispatch = useDispatch();

    const { error, reviews } = useSelector((state) => state.productReviews);
    const { isDeleted, error: deleteError } = useSelector(
        (state) => state.review
    );

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }

        if (productId !== "") {
            dispatch(getProductReviews(productId));
        }

        if (isDeleted) {
            alert.success("Review deleted successfully");
            dispatch({ type: DELETE_REVIEW_RESET });
        }
    }, [dispatch, alert, error, productId, isDeleted, deleteError]);

    const deleteReviewHandler = (id) => {
        dispatch(deleteReview(id, productId));
    };

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(getProductReviews(productId));
    };
    return (
        <AdminLayout
            metaTitle="Product Reviews"
            title="Product feedback"
            subtitle="Look up reviews for a product by ID, moderate comments, and keep your catalog trustworthy."
        >
            <div className={styles.card}>
                <form onSubmit={submitHandler} className={styles.searchForm}>
                    <div className={styles.group}>
                        <label htmlFor="productId_field">Product ID</label>
                        <input
                            type="text"
                            id="productId_field"
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            placeholder="Enter product ID..."
                        />
                    </div>
                    <button
                        id="search_button"
                        type="submit"
                        className={styles.submit}
                    >
                        Search
                    </button>
                </form>

                {reviews && reviews.length > 0 ? (
                    <Table responsive className={styles.table}>
                        <thead>
                            <tr>
                                <th>Review ID</th>
                                <th>Rating</th>
                                <th>Comment</th>
                                <th>Customer</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {reviews?.map((review) => (
                                <tr key={review?._id}>
                                    <td>{review?._id}</td>
                                    <td>{review.rating}</td>
                                    <td>{review.comment}</td>
                                    <td>{review.name}</td>
                                    <td className={styles.actions}>
                                        <button
                                            onClick={() =>
                                                deleteReviewHandler(review._id)
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
                ) : (
                    <p className={styles.empty}>No reviews found.</p>
                )}
            </div>
        </AdminLayout>
    );
};

export default ProductReview;
