import {authHeader} from "../../_helpers/auth-header";
import {API, handleResponse} from "../../constant";
import fetch from 'cross-fetch';

export const reservationService = {
    getReservation,
    getReservationList,
    getPaginatedReservationList,
    addReservation,
    updateReservation,
    cancelReservation,
    confirmReservation,
};

function getReservation(restId, slug) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${API}reservation_show/${restId}/${slug}`, requestOptions).then(handleResponse);
}

function getReservationList(userId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${API}special/user_reservation_list/${userId}`, requestOptions).then(handleResponse);
}

function getPaginatedReservationList(url) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };
    //`special/user_reservation_list/${userId}/${from}/${to}`
    return fetch(`${url}`, requestOptions).then(handleResponse);
}

function addReservation(reservation) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(reservation),
    };

    return fetch(`${API}reservation/`, requestOptions).then(handleResponse);
}

function updateReservation(reservation, reservationId) {
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(reservation)
    };

    return fetch(`${API}reservations/${reservationId}/`, requestOptions).then(handleResponse);
}

function cancelReservation(orderId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${API}special/reservation_cancel/${orderId}`, requestOptions).then(handleResponse);
}

function confirmReservation(orderId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${API}special/reservation_confirm/${orderId}`, requestOptions).then(handleResponse);
}
