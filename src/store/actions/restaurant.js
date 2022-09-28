import * as types from './ActionTypes';
import {restaurantService} from '../services/restaurant';
import fetch from "cross-fetch";
import {API, handleResponse} from "../../constant";

export const addRestaurant = (restaurant) => {
    return dispatch => {
        dispatch({type: types.restaurantConstants.RESTAURANT_DATA_REQUEST_STATUS, payload: true});
        restaurantService.addRestaurant(restaurant)
            .then(
                data => {
                    dispatch({type: types.restaurantConstants.RESTAURANT_ADD_SUCCESS, payload: data});
                },
                error => {
                    dispatch({type: types.restaurantConstants.RESTAURANT_ADD_FAILURE, error: error});
                },
            );
    };
};

export const updateRestaurant = (restaurant, restaurantId) => {
    return dispatch => {
        dispatch({type: types.restaurantConstants.RESTAURANT_DATA_REQUEST_STATUS, payload: true});
        restaurantService.updateRestaurant(restaurant, restaurantId)
            .then(
                data => {
                    dispatch({type: types.restaurantConstants.RESTAURANT_UPDATE_SUCCESS, payload: data});
                },
                error => {
                    dispatch({type: types.restaurantConstants.RESTAURANT_UPDATE_FAILURE, error: error});
                },
            );
    };
};

export const getRestaurant = (restId, slug) => {
    return dispatch => {
        dispatch({type: types.restaurantConstants.RESTAURANT_DATA_REQUEST_STATUS, payload: true});
        restaurantService.getRestaurant(restId, slug)
            .then(
                restaurant => {
                    dispatch({type: types.restaurantConstants.RECEIVED_RESTAURANT_DETAILS, payload: restaurant});
                },
                error => {
                    dispatch({type: types.restaurantConstants.RESTAURANT_DETAILS_FAILURE, error: error});
                },
            );
    };
};

export const getRestaurantList = () => {
    return dispatch => {
        dispatch({type: types.restaurantConstants.RESTAURANT_DATA_REQUEST_STATUS, payload: true});
        restaurantService.getRestaurantList()
            .then(
                restaurant => {
                    dispatch({type: types.restaurantConstants.RECEIVED_RESTAURANT_LIST, payload: restaurant});
                },
                error => {
                    dispatch({type: types.restaurantConstants.RESTAURANT_LIST_FAILURE, error: error});
                },
            );
    };
};

export const getRestaurantMenuList = (restId) => {
    return dispatch => {
        dispatch({type: types.restaurantConstants.RESTAURANT_DATA_REQUEST_STATUS, payload: true});
        restaurantService.getRestaurantMenuList(restId)
            .then(
                menus => {
                    dispatch({type: types.restaurantConstants.RECEIVED_RESTAURANT_MENU_LIST, payload: menus});
                },
                error => {
                    dispatch({type: types.restaurantConstants.RESTAURANT_LIST_FAILURE, error: error});
                },
            );
    };
};

export const getRestaurantReviewList = (restId) => {
    return dispatch => {
        dispatch({type: types.restaurantConstants.RESTAURANT_DATA_REQUEST_STATUS, payload: true});
        restaurantService.getRestaurantReviewList(restId)
            .then(
                reviews => {
                    dispatch({type: types.restaurantConstants.RECEIVED_RESTAURANT_REVIEW_LIST, payload: reviews});
                },
                error => {
                    dispatch({type: types.restaurantConstants.RESTAURANT_LIST_FAILURE, error: error});
                },
            );
    };
};

export const getRestaurantReviewImageList = (restId) => {
    return dispatch => {
        dispatch({type: types.restaurantConstants.RESTAURANT_DATA_REQUEST_STATUS, payload: true});
        restaurantService.getRestaurantReviewImageList(restId)
            .then(
                images => {
                    dispatch({type: types.restaurantConstants.RECEIVED_RESTAURANT_REVIEW_IMAGE_LIST, payload: images});
                },
                error => {
                    dispatch({type: types.restaurantConstants.RESTAURANT_LIST_FAILURE, error: error});
                },
            );
    };
};

export const getPaginatedRestaurantList = (url) => {
    return dispatch => {
        dispatch({type: types.restaurantConstants.RESTAURANT_DATA_REQUEST_STATUS, payload: true});
        restaurantService.getPaginatedRestaurantList(url)
            .then(
                restaurant => {
                    dispatch({type: types.restaurantConstants.RECEIVED_RESTAURANT_LIST, payload: restaurant});
                },
                error => {
                    dispatch({type: types.restaurantConstants.RESTAURANT_LIST_FAILURE, error: error});
                },
            );
    };
};

export const restaurantSelected = (restaurant) => dispatch => {
    dispatch({type: types.restaurantConstants.RESTAURANT_SELECTED, payload: restaurant});
};

export const getTodaysReservation = (restId) => {
    console.log(restId)
    return dispatch => {
        dispatch({type: types.restaurantConstants.RESTAURANT_DATA_REQUEST_STATUS, payload: true});
        restaurantService.getTodaysReservation(restId)
            .then(
                reservation => {
                    dispatch({type: types.restaurantConstants.RECEIVED_TODAYS_RESERVATION_LIST, payload: reservation});
                },
                error => {
                    dispatch({type: types.restaurantConstants.RESERVATION_LIST_FAILURE, error: error});
                },
            );
    };
};

export const searchTodaysReservation = (restId, clientId) => {
    return dispatch => {
        dispatch({type: types.restaurantConstants.RESTAURANT_DATA_REQUEST_STATUS, payload: true});
        restaurantService.searchTodaysReservation(restId, clientId)
            .then(
                reservation => {
                    dispatch({type: types.restaurantConstants.RECEIVED_TODAYS_RESERVATION_LIST, payload: reservation});
                },
                error => {
                    dispatch({type: types.restaurantConstants.RESERVATION_LIST_FAILURE, error: error});
                },
            );
    };
};

export const getReservation = (type, restId, page) => {
    console.log(type, restId, page)
    return dispatch => {
        dispatch({type: types.restaurantConstants.RESTAURANT_DATA_REQUEST_STATUS, payload: true});
        restaurantService.getReservation(type, restId, page)
            .then(
                reservation => {
                    if(type === 'Pending')
                        dispatch({type: types.restaurantConstants.RECEIVED_PENDING_RESERVATION_LIST, payload: reservation});
                    else if(type === 'Confirmed')
                        dispatch({type: types.restaurantConstants.RECEIVED_CONFIRMED_RESERVATION_LIST, payload: reservation});
                    else if(type === 'Cancelled')
                        dispatch({type: types.restaurantConstants.RECEIVED_CANCELLED_RESERVATION_LIST, payload: reservation});
                },
                error => {
                    dispatch({type: types.restaurantConstants.RESERVATION_LIST_FAILURE, error: error});
                },
            );
    };
};

export const getReservationReport = (data, page) => {
    console.log(data, page)
    return dispatch => {
        dispatch({type: types.restaurantConstants.RESTAURANT_DATA_REQUEST_STATUS, payload: true});
        restaurantService.getReservationReport(data, page)
            .then(
                reservation => {
                    dispatch({type: types.restaurantConstants.RECEIVED_REPORT_RESERVATION_LIST, payload: reservation});
                },
                error => {
                    dispatch({type: types.restaurantConstants.RESTAURANT_UPDATE_FAILURE, error: error});
                },
            );
    };
};
