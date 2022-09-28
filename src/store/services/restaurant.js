import {authFormHeader, authHeader} from "../../_helpers/auth-header";
import {API, handleResponse} from "../../constant";
import fetch from 'cross-fetch';

export const restaurantService = {
    getRestaurant,
    getRestaurantList,
    getTodaysReservation,
    searchTodaysReservation,
    getReservation,
    getReservationReport,
    getRestaurantMenuList,
    getRestaurantReviewList,
    getRestaurantReviewImageList,
    getPaginatedRestaurantList,
    addRestaurant,
    updateRestaurant,
};

function getRestaurant(restId, slug) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${API}restaurant_show/${restId}/${slug}`, requestOptions).then(handleResponse);
}

function getRestaurantList() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${API}get_restaurant`, requestOptions).then(handleResponse);
}

function getTodaysReservation(restId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${API}special/restaurant_reservation_today/${restId}`, requestOptions).then(handleResponse);
}

function getReservation(type, restId, page) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    if(type === 'Pending')
        return fetch(`${API}special/restaurant_reservation_pending/${restId}/${page}`, requestOptions).then(handleResponse);
    else if(type === 'Confirmed')
        return fetch(`${API}special/restaurant_reservation_confirmed/${restId}/${page}`, requestOptions).then(handleResponse);
    else if(type === 'Cancelled')
        return fetch(`${API}special/restaurant_reservation_cancelled/${restId}/${page}`, requestOptions).then(handleResponse);
}

function searchTodaysReservation(restId, clientId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${API}get_client/${restId}/${clientId}`, requestOptions).then(handleResponse);
}

function getReservationReport(data, page) {
    const requestOptions = {
        method: 'POST',
        headers: authFormHeader(),
        body: data
    };

    return fetch(`${API}get_restaurant_report`, requestOptions).then(handleResponse);
}

function getRestaurantMenuList(restId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${API}restaurant_menu/${restId}`, requestOptions).then(handleResponse);
}

function getRestaurantReviewList(restId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${API}special/review_list/${restId}`, requestOptions).then(handleResponse);
}

function getRestaurantReviewImageList(restId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${API}special/review_image_list/${restId}`, requestOptions).then(handleResponse);
}

function getPaginatedRestaurantList(url) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${url}`, requestOptions).then(handleResponse);
}

function addRestaurant(restaurant) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(restaurant),
    };

    return fetch(`${API}restaurants/`, requestOptions).then(handleResponse);
}

function updateRestaurant(restaurant, restaurantId) {
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(restaurant)
    };

    return fetch(`${API}restaurants/${restaurantId}/`, requestOptions).then(handleResponse);
}
