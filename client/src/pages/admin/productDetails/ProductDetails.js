import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getProductDetails } from "../../../actions/productAction";

import styles from "./ProductDetails.module.scss";
import { useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import AdminLayout from "../../../components/admin/layout/AdminLayout";

const ProductDetails = () => {
    const [preview, setPreview] = useState(0);

    const dispatch = useDispatch();
    const alert = useAlert();

    let { id } = useParams();

    const { loading, error, product } = useSelector(
        (state) => state.productDetails
    );

    useEffect(() => {
        dispatch(getProductDetails(id));

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, alert, error, id]);

    const headerSubtitle = product
        ? `SKU: ${product._id} · ${product.category}`
        : "Review product inventory and content.";

    return (
        <AdminLayout
            metaTitle="Product Details"
            title={product?.name || "Product details"}
            subtitle={headerSubtitle}
        >
            {loading ? (
                <div className={styles.loader}>
                    <Spinner animation="border" />
                </div>
            ) : (
                <div className={styles.grid}>
                    <div className={styles.media}>
                        {product?.images && product.images.length > 0 ? (
                            <>
                                <div className={styles.preview}>
                                    <img
                                        src={product.images[preview].url}
                                        alt={product?.name}
                                    />
                                </div>
                                <div className={styles.thumbs}>
                                    {product.images.map((image, index) => (
                                        <button
                                            type="button"
                                            key={image._id}
                                            className={`${styles.thumb} ${
                                                index === preview
                                                    ? styles.activeThumb
                                                    : ""
                                            }`}
                                            onClick={() => setPreview(index)}
                                        >
                                            <img src={image.url} alt={product?.name} />
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className={styles.emptyImage}>
                                No image available
                            </div>
                        )}
                    </div>
                    <div className={styles.info}>
                        <div className={styles.pricing}>
                            <span className={styles.price}>
                                ${Number(product?.price).toFixed(2)}
                            </span>
                            <div className={styles.rating}>
                                <div className="rating-outer">
                                    <div
                                        className="rating-inner"
                                        style={{
                                            width: `${
                                                ((product?.ratings ?? 0) / 5) *
                                                100
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                                <span>
                                    ({product?.numOfReviews || 0} Reviews)
                                </span>
                            </div>
                        </div>
                        <p className={styles.description}>
                            {product?.description || "No description provided."}
                        </p>
                        <div className={styles.meta}>
                            <div>
                                <span>Status</span>
                                <strong
                                    className={
                                        product?.stock > 0
                                            ? styles.success
                                            : styles.danger
                                    }
                                >
                                    {product?.stock > 0
                                        ? "In Stock"
                                        : "Out of Stock"}
                                </strong>
                            </div>
                            <div>
                                <span>Stock</span>
                                <strong>{product?.stock}</strong>
                            </div>
                            <div>
                                <span>Seller</span>
                                <strong>{product?.seller}</strong>
                            </div>
                            <div>
                                <span>Collection</span>
                                <strong>{product?.type || "—"}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default ProductDetails;
