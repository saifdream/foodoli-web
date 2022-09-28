import * as types from './ActionTypes';
import {reservationService} from '../services/reservation';

export const addSpecialToBag = special => dispatch => {
    dispatch({type: types.reservationConstants.SPECIAL_ADD_TO_RESERVATION, payload: special});
};

export const updateSpecialToBag = special => dispatch => {
    dispatch({type: types.reservationConstants.SPECIAL_UPDATE_TO_RESERVATION, payload: special});
};

export const decreaseSpecialFromBag = special => dispatch => {
    dispatch({type: types.reservationConstants.SPECIAL_DECREASE_FROM_RESERVATION, payload: special});
};

export const removeSpecialFromBag = id => dispatch => {
    dispatch({type: types.reservationConstants.SPECIAL_REMOVE_FROM_BAG, payload: id});
};

export const clearSpecialFromBag = () => dispatch => {
    dispatch({type: types.reservationConstants.SPECIAL_CLEAR_FROM_BAG});
};

export const getReservationList = (userId) => {
    return dispatch => {
        dispatch({type: types.reservationConstants.RESERVATION_DATA_REQUEST_STATUS, payload: true});
        reservationService.getReservationList(userId)
            .then(
                reservation => {
                    dispatch({type: types.reservationConstants.RECEIVED_RESERVATION_LIST, payload: reservation});
                },
                error => {
                    dispatch({type: types.reservationConstants.RESERVATION_LIST_FAILURE, error: error});
                },
            );
    };
};

export const getPaginatedReservationList = (url) => {
    return dispatch => {
        dispatch({type: types.reservationConstants.RESERVATION_DATA_REQUEST_STATUS, payload: true});
        reservationService.getPaginatedReservationList(url)
            .then(
                reservation => {
                    dispatch({type: types.reservationConstants.RECEIVED_RESERVATION_LIST, payload: reservation});
                },
                error => {
                    dispatch({type: types.reservationConstants.RESERVATION_LIST_FAILURE, error: error});
                },
            );
    };
};