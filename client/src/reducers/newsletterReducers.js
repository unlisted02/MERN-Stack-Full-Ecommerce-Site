import {
    CLEAR_NEWSLETTER_ERRORS,
    GET_NEWSLETTER_SUBSCRIBERS_FAIL,
    GET_NEWSLETTER_SUBSCRIBERS_REQUEST,
    GET_NEWSLETTER_SUBSCRIBERS_SUCCESS,
} from "../constants/newsletterConstants";

export const newsletterSubscribersReducer = (
    state = { subscribers: [] },
    action
) => {
    switch (action.type) {
        case GET_NEWSLETTER_SUBSCRIBERS_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case GET_NEWSLETTER_SUBSCRIBERS_SUCCESS:
            return {
                ...state,
                loading: false,
                subscribers: action.payload,
            };

        case GET_NEWSLETTER_SUBSCRIBERS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case CLEAR_NEWSLETTER_ERRORS:
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
};

