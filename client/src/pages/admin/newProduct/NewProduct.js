import React, { useEffect, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";

import styles from "./NewProduct.module.scss";
import { clearErrors, newProduct } from "../../../actions/productAction";
import { NEW_PRODUCT_RESET } from "../../../constants/productsConstants";
import ButtonLoader from "../../../components/loader/ButtonLoader";
import AdminLayout from "../../../components/admin/layout/AdminLayout";

const PRODUCT_CATEGORIES = [
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

const PRODUCT_TYPES = ["Men", "Women", "Kids"];

const NewProduct = ({ history }) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState(PRODUCT_CATEGORIES[0]);
    const [stock, setStock] = useState(0);
    const [seller, setSeller] = useState("");
    const [type, setType] = useState(PRODUCT_TYPES[0]);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, success } = useSelector(
        (state) => state.newProduct
    );

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (success) {
            history.push("/admin/products");
            alert.success("Product created successfully");
            dispatch({ type: NEW_PRODUCT_RESET });
        }
    }, [dispatch, alert, error, success, history]);

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

        dispatch(newProduct(formData));
    };

    const onChange = (e) => {
        const files = Array.from(e.target.files);

        setImagesPreview([]);
        setImages([]);

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
    return (
        <AdminLayout
            metaTitle="Add Product"
            title="Create a new product"
            subtitle="Upload product information, manage inventory, and publish to your storefront."
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
                            placeholder="Tell customers about the product..."
                        ></textarea>
                    </div>

                    <div className={styles.split}>
                        <div className={styles.group}>
                            <label htmlFor="category_field">Category</label>
                            <select
                                id="category_field"
                                value={category}
                                onChange={(e) =>
                                    setCategory(e.target.value)
                                }
                            >
                                {PRODUCT_CATEGORIES.map((category) => (
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
                                {PRODUCT_TYPES.map((productType) => (
                                    <option key={productType} value={productType}>
                                        {productType}
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
                                placeholder="e.g. 25"
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
                            <span>Drag & drop or browse</span>
                        </div>
                        <div className={styles.preview}>
                            {imagesPreview.map((img) => (
                                <img
                                    src={img}
                                    key={img}
                                    alt="Preview"
                                />
                            ))}
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button type="submit" className={styles.submit}>
                            {loading ? <ButtonLoader /> : "Save product"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default NewProduct;
