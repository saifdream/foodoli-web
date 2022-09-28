import {authFormHeader, authHeader} from "../../_helpers/auth-header";
import {API, handleResponse} from "../../constant";
import fetch from 'cross-fetch';

export const specialService = {
    getFoundSpecialList,
    getSpecialList,
    getPaginatedSpecialList,
    addSpecial,
    updateSpecial,
    updateSpecialClick,
};

function getFoundSpecialList(what, where) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${API}get_discovers?what=${what}&where=${where || ''}`, requestOptions).then(handleResponse);
}

function getSpecialList() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${API}get_discovers`, requestOptions).then(handleResponse);
}

function getPaginatedSpecialList(url) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${url}`, requestOptions).then(handleResponse);
}

function addSpecial(special) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(special),
    };

    return fetch(`${API}specials/`, requestOptions).then(handleResponse);
}

function updateSpecial(special, specialId) {
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(special)
    };

    return fetch(`${API}specials/${specialId}/`, requestOptions).then(handleResponse);
}

function updateSpecialClick(restId, specialId) {
    const requestOptions = {
        method: 'POST',
        headers: authFormHeader(),
    };

    return fetch(`${API}special/add_click/${restId}/${specialId}`, requestOptions).then(handleResponse);
}
