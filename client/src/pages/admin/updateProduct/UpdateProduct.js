import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
    clearErrors,
    getProductDetails,
    updateProduct,
} from "../../../actions/productAction";
import ButtonLoader from "../../../components/loader/ButtonLoader";
import { UPDATE_PRODUCT_RESET } from "../../../constants/productsConstants";

import styles from "./UpdateProduct.module.scss";
import AdminLayout from "../../../components/admin/layout/AdminLayout";

const UpdateProduct = ({ history }) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [seller, setSeller] = useState("");
    const [type, setType] = useState("");
    const [images, setImages] = useState([]);

    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    const categories = [
        "Eid Collection",
        "New Collection",
        "Featured",
        "Footwear",
        "Accessories",
        "Clothing",
        "Beauty/Health",
        "Sports",
        "Outdoor",
        "Other",
    ];
    const types = ["Men", "Women", "Kids"];

    const alert = useAlert();
    const dispatch = useDispatch();
    let { id } = useParams();

    const { error, product } = useSelector((state) => state.productDetails);
    const {
        loading,
        error: updateError,
        isUpdated,
    } = useSelector((state) => state.product);

    useEffect(() => {
        dispatch(getProductDetails(id));

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (updateError) {
            alert.error(updateError);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            history.push("/admin/products");
            alert.success("Product updated successfully");
            dispatch({ type: UPDATE_PRODUCT_RESET });
        }
    }, [dispatch, alert, error, isUpdated, history, updateError, id]);
    
    useEffect(() => {
        if (product && product._id === id) {
            setName(product.name);
            setPrice(product.price);
            setDescription(product.description);
            setCategory(product.category);
            setSeller(product.seller);
            setStock(product.stock);
            setType(product.type);
            setOldImages(product.images);
        }
    }, [product, id]);

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set("name", name);
        formData.set("price", price);
        formData.set("description", description);
        formData.set("category", category);
        formData.set("stock", stock);
        formData.set("seller", seller);
        formData.set("type", type);

        images.forEach((image) => {
            formData.append("images", image);
        });

        dispatch(updateProduct(product._id, formData));
    };

    const onChange = (e) => {
        const files = Array.from(e.target.files);

        setImagesPreview([]);
        setImages([]);
        setOldImages([]);

        files.forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((oldArray) => [
                        ...oldArray,
                        reader.result,
                    ]);
                    setImages((oldArray) => [...oldArray, reader.result]);
                }
            };

            reader.readAsDataURL(file);
        });
    };
    const isDirty = imagesPreview.length > 0;

    return (
        <AdminLayout
            metaTitle="Update Product"
            title={`Edit ${product?.name || "product"}`}
            subtitle="Adjust listing details, pricing, inventory, and imagery."
        >
            <div className={styles.card}>
                <form onSubmit={submitHandler} className={styles.form}>
                    <div className={styles.split}>
                        <div className={styles.group}>
                            <label htmlFor="name_field">Name</label>
                            <input
                                type="text"
                                id="name_field"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Product name"
                            />
                        </div>
                        <div className={styles.group}>
                            <label htmlFor="price_field">Price</label>
                            <input
                                type="number"
                                id="price_field"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className={styles.group}>
                        <label htmlFor="description_field">Description</label>
                        <textarea
                            id="description_field"
                            rows="6"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the product..."
                        ></textarea>
                    </div>

                    <div className={styles.split}>
                        <div className={styles.group}>
                            <label htmlFor="category_field">Category</label>
                            <select
                                id="category_field"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.group}>
                            <label htmlFor="type_field">Collection</label>
                            <select
                                id="type_field"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                {types.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.split}>
                        <div className={styles.group}>
                            <label htmlFor="stock_field">Stock units</label>
                            <input
                                type="number"
                                id="stock_field"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                placeholder="e.g. 50"
                            />
                        </div>
                        <div className={styles.group}>
                            <label htmlFor="seller_field">Supplier / Seller</label>
                            <input
                                type="text"
                                id="seller_field"
                                value={seller}
                                onChange={(e) => setSeller(e.target.value)}
                                placeholder="Vendor name"
                            />
                        </div>
                    </div>

                    <div className={styles.group}>
                        <label>Images</label>
                        <div className={styles.upload}>
                            <input
                                type="file"
                                name="product_images"
                                id="customFile"
                                onChange={onChange}
                                multiple
                            />
                            <AiOutlineCloudUpload size={22} />
                            <span>
                                {isDirty
                                    ? "Replace selected images"
                                    : "Drag & drop or browse"}
                            </span>
                        </div>
                        <div className={styles.previewGrid}>
                            {oldImages &&
                                oldImages.map((img) => (
                                    <div
                                        className={`${styles.preview} ${styles.existing}`}
                                        key={img.public_id}
                                    >
                                        <img src={img.url} alt={img.public_id} />
                                        <span>Current</span>
                                    </div>
                                ))}
                            {imagesPreview.map((img) => (
                                <div className={styles.preview} key={img}>
                                    <img src={img} alt="Preview" />
                                    <span>New</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button type="submit" className={styles.submit}>
                            {loading ? <ButtonLoader /> : "Update product"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default UpdateProduct;
