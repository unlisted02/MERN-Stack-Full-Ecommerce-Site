import React, { useEffect } from "react";
import { useAlert } from "react-alert";
import { Table } from "react-bootstrap";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    allUsers,
    clearErrors,
    deleteUser,
} from "../../../actions/userActions";
import Loader from "../../../components/loader/Loader";
import { DELETE_USER_RESET } from "../../../constants/userConstants";
import styles from "./Users.module.scss";
import AdminLayout from "../../../components/admin/layout/AdminLayout";

const Users = ({ history }) => {
    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, users } = useSelector((state) => state.allUsers);
    const { isDeleted } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(allUsers());

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isDeleted) {
            alert.success("User deleted successfully");
            history.push("/admin/users");
            dispatch({ type: DELETE_USER_RESET });
        }
    }, [dispatch, alert, error, isDeleted, history]);

    const deleteUserHandler = (id) => {
        dispatch(deleteUser(id));
    };
    return (
        <AdminLayout
            metaTitle="All Users"
            title="Customer & admin accounts"
            subtitle="Manage roles, review profiles, and keep your user list clean."
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
                                <th>Avatar</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users?.map((user) => (
                                <tr key={user?._id}>
                                    <td>{user?._id}</td>
                                    <td>
                                        <img
                                            className={styles.avatar}
                                            src={user?.avatar.url}
                                            alt={user?.name}
                                        />
                                    </td>
                                    <td>{user?.name}</td>
                                    <td>{user?.email}</td>
                                    <td>
                                        <span
                                            className={`${styles.roleBadge} ${
                                                user?.role === "admin"
                                                    ? styles.admin
                                                    : styles.customer
                                            }`}
                                        >
                                            {user?.role}
                                        </span>
                                    </td>
                                    <td className={styles.actions}>
                                        <Link
                                            to={`/admin/user/details/${user._id}`}
                                        >
                                            <AiOutlineEye size={18} />
                                            <span>View</span>
                                        </Link>
                                        <button
                                            onClick={() =>
                                                deleteUserHandler(user._id)
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

export default Users;
