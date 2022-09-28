import {userConstants} from './ActionTypes';
import {userService} from '../services/user';

export const userActions = {
    login,
    logout,
    safeLogout,
    setUser,
    resetUser,
};

function login(credential) {
    return dispatch => {
        dispatch(request());
        userService.login(credential)
            .then(
                user => {dispatch(success(user));},
                error => {
                    console.log(error);
                    dispatch(failure(error.toString()));
                },
            );
    };

    function request() {
        return {type: userConstants.LOGIN_REQUEST, payload: true};
    }

    function success(user) {
        return {type: userConstants.LOGIN_SUCCESS, user};
    }

    function failure(error) {
        return {type: userConstants.LOGIN_FAILURE, error};
    }
}

function logout() {
    return dispatch => {
        dispatch(request());
        userService.logout()
            .then(
                res => {dispatch(success());},
                error => {dispatch(failure(error.toString()));},
            );
    };

    function request() {
        return {type: userConstants.LOGOUT_REQUEST};
    }

    function success() {
        return {type: userConstants.LOGOUT_SUCCESS};
    }

    function failure(error) {
        return {type: userConstants.LOGIN_FAILURE, error};
    }
}

function safeLogout() {
    return dispatch => {
        dispatch(request());
        userService.safeLogout()
            .then(
                res => {
                    dispatch(success());
                },
                error => {
                    dispatch(failure(error.toString()));
                },
            );
    };

    function request() {
        return {type: userConstants.LOGOUT_REQUEST};
    }

    function success() {
        return {type: userConstants.SAFE_LOGOUT};
    }

    function failure(error) {
        return {type: userConstants.LOGIN_FAILURE, error};
    }
}

function setUser(user) {
    return dispatch => {dispatch({type: userConstants.SET_USER, payload: user});};
}

function resetUser() {
    return dispatch => {dispatch({type: userConstants.RESET_USER});};
}
