import {userConstants} from '../actions/ActionTypes';

const initialState = {
    credential: null,
    user: null,
    isLoggedIn: false,
    isLoading: false,
    loginErrorStatus: null,
    logoutErrorStatus: null,
};

const UserReducer = (state = initialState, action) => {
    switch (action.type) {
        case userConstants.LOGIN_REQUEST:
            return {...state, isLoading: true};
        case userConstants.LOGIN_SUCCESS:
            return {...state, credential: action.user, isLoading: false};
        case userConstants.LOGIN_FAILURE:
            return {...state, isLoading: false, loginErrorStatus: action.error};
        case userConstants.LOGOUT_REQUEST:
            return {...state, isLoading: true};
        case userConstants.LOGOUT_SUCCESS:
            return {...state, credential: null, isLoading: false};
        case userConstants.LOGOUT_FAILURE:
            return {...state, isLoading: false, logoutErrorStatus: action.error};
        case userConstants.SAFE_LOGOUT:
            return {...state, credential: null, isLoading: false, loginErrorStatus: null, logoutErrorStatus: null};
        case userConstants.RESET_USER:
            return {
                ...state,
                credential: null,
                isLoggedIn: false,
                isLoading: false,
                user: null,
                loginErrorStatus: null,
                logoutErrorStatus: null
            };
        case userConstants.SET_USER:
            return {
                ...state,
                credential: action.payload?.token,
                user: action.payload?.user,
                isLoggedIn: action.payload?.status,
            };
        default:
            return state;
    }
};

export default UserReducer;
