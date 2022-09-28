import {userConstants} from "../actions/ActionTypes";

const initialState = {
    credential: JSON.parse(localStorage.getItem('credential')) || {},
    loggedIn: !!(localStorage.getItem('credential') && JSON.parse(localStorage.getItem('credential'))['token']),
    isLoading: false
};

function authenticationReducer(state = initialState, action) {
    switch (action.type) {
        case userConstants.LOGIN_REQUEST:
            return {
                user: action.user,
                isLoading: true,
            };
        case userConstants.LOGIN_SUCCESS:
            return {
                loggedIn: true,
                user: action.user,
                credential: action.user,
                isLoading: false,
            };
        case userConstants.LOGIN_FAILURE:
            return {
                loggedIn: false,
                isLoading: false,
            };
        case userConstants.LOGOUT_REQUEST:
            return {
                loggedIn: false,
                isLoading: true,
            };
        case userConstants.LOGOUT_SUCCESS:
            return {
                loggedIn: false,
                isLoading: false,
            };
        case userConstants.LOGOUT_FAILURE:
            return {
                loggedIn: false,
                isLoading: false,
            };
        default:
            return state
    }
}

export default authenticationReducer;
