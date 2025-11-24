import { axiosInstance } from "../config";
import {
    CLEAR_NEWSLETTER_ERRORS,
    GET_NEWSLETTER_SUBSCRIBERS_FAIL,
    GET_NEWSLETTER_SUBSCRIBERS_REQUEST,
    GET_NEWSLETTER_SUBSCRIBERS_SUCCESS,
} from "../constants/newsletterConstants";

// Get all newsletter subscribers - ADMIN
export const getNewsletterSubscribers = () => async (dispatch) => {
    try {
        dispatch({ type: GET_NEWSLETTER_SUBSCRIBERS_REQUEST });

        const { data } = await axiosInstance.get("/api/v1/admin/newsletter/subscribers");

        dispatch({
            type: GET_NEWSLETTER_SUBSCRIBERS_SUCCESS,
            payload: data.subscribers,
        });
    } catch (error) {
        dispatch({
            type: GET_NEWSLETTER_SUBSCRIBERS_FAIL,
            payload: error.response?.data?.message || "Failed to fetch subscribers",
        });
    }
};

// Clear errors
export const clearNewsletterErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_NEWSLETTER_ERRORS });
};

