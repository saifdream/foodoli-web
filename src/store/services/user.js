import {authHeader} from "../../_helpers/auth-header";
import {API, handleResponse} from '../../constant';
import fetch from 'cross-fetch';

export const userService = {
    login,
    logout,
    safeLogout,
};

function login(credential) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(credential)
    };

    return fetch(`${API}login/`, requestOptions).then(handleResponse);
}

function logout() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${API}logout/`, requestOptions)
        .then(handleResponse)
        .then(res => {
            return {}
        });
}

async function safeLogout() {
    await localStorage.removeItem('token');
}
