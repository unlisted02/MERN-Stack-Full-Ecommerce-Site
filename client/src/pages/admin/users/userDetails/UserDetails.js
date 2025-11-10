import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import ButtonLoader from "../../../../components/loader/ButtonLoader";
import {
    clearErrors,
    getUserDetails,
    updateUser,
} from "../../../../actions/userActions";
import { UPDATE_USER_RESET } from "../../../../constants/userConstants";
import AdminLayout from "../../../../components/admin/layout/AdminLayout";

import styles from "./UserDetails.module.scss";

const UserDetails = ({ history, match }) => {
    const [show, setShow] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");

    const alert = useAlert();
    const dispatch = useDispatch();

    const { error, isUpdated, loading } = useSelector((state) => state.user);
    const { user } = useSelector((state) => state.userDetails);
    const userId = match.params.id;

    useEffect(() => {
        if (user && user._id !== userId) {
            dispatch(getUserDetails(userId));
        } else {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            alert.success("User updated successfully");
            dispatch({
                type: UPDATE_USER_RESET,
            });

            history.push(`/admin/user/details/${user._id}`);
            setShow(false);
        }
    }, [dispatch, alert, error, history, isUpdated, userId, user]);

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set("name", name);
        formData.set("email", email);
        formData.set("role", role);

        dispatch(updateUser(user._id, formData));
    };

    const headerSubtitle = user
        ? `${user.email || "No email"} · Joined ${
              user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "—"
          }`
        : "Review profile details and update roles.";

    return (
        <AdminLayout
            metaTitle="User Details"
            title={user?.name || "User details"}
            subtitle={headerSubtitle}
            ctaComponent={
                <button
                    className={styles.editTrigger}
                    onClick={() => setShow((prev) => !prev)}
                >
                    {show ? "Close editor" : "Edit user"}
                </button>
            }
        >
            <div className={styles.grid}>
                <section className={styles.profileCard}>
                    <div className={styles.avatarWrap}>
                        {user?.avatar?.url ? (
                            <img src={user.avatar.url} alt={user?.name} />
                        ) : (
                            <div className={styles.avatarFallback}>
                                {user?.name?.charAt(0) ?? "?"}
                            </div>
                        )}
                    </div>
                    <div className={styles.profileMeta}>
                        <div>
                            <span className={styles.label}>Full name</span>
                            <p>{user?.name || "—"}</p>
                        </div>
                        <div>
                            <span className={styles.label}>Email</span>
                            <p>{user?.email || "—"}</p>
                        </div>
                        <div>
                            <span className={styles.label}>Role</span>
                            <p className={styles.roleBadge}>{user?.role}</p>
                        </div>
                        <div>
                            <span className={styles.label}>Phone</span>
                            <p>{user?.phone || "Not provided"}</p>
                        </div>
                        <div>
                            <span className={styles.label}>Address</span>
                            <p>{user?.address || "Not provided"}</p>
                        </div>
                    </div>
                </section>

                <section className={styles.activityCard}>
                    <h4>Account activity</h4>
                    <ul>
                        <li>
                            <span>Orders placed</span>
                            <strong>{user?.ordersCount ?? 0}</strong>
                        </li>
                        <li>
                            <span>Last active</span>
                            <strong>
                                {user?.updatedAt
                                    ? new Date(user.updatedAt).toLocaleString()
                                    : "—"}
                            </strong>
                        </li>
                        <li>
                            <span>User ID</span>
                            <code>{user?._id}</code>
                        </li>
                    </ul>
                </section>
            </div>

            {show && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h4>Update user information</h4>
                        <form onSubmit={submitHandler} className={styles.form}>
                            <div className={styles.field}>
                                <label htmlFor="name_field">Name</label>
                                <input
                                    type="text"
                                    id="name_field"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="email_field">Email</label>
                                <input
                                    type="email"
                                    id="email_field"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="role_field">Role</label>

                                <select
                                    id="role_field"
                                    name="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className={styles.actions}>
                                <button
                                    type="button"
                                    className={styles.secondary}
                                    onClick={() => setShow(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className={styles.primary}>
                                    {loading ? <ButtonLoader /> : "Save changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default UserDetails;
