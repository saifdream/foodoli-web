import * as types from './ActionTypes';
import {specialService} from '../services/specials';

export const addSpecial = (special) => {
    return dispatch => {
        dispatch({type: types.specialsConstants.SPECIAL_DATA_REQUEST_STATUS, payload: true});
        specialService.addSpecial(special)
            .then(
                data => {
                    dispatch({type: types.specialsConstants.SPECIAL_ADD_SUCCESS, payload: data});
                },
                error => {
                    dispatch({type: types.specialsConstants.SPECIAL_ADD_FAILURE, error: error});
                },
            );
    };
};

export const updateSpecial = (special, specialId) => {
    return dispatch => {
        dispatch({type: types.specialsConstants.SPECIAL_DATA_REQUEST_STATUS, payload: true});
        specialService.updateSpecial(special, specialId)
            .then(
                data => {
                    dispatch({type: types.specialsConstants.SPECIAL_UPDATE_SUCCESS, payload: data});
                },
                error => {
                    dispatch({type: types.specialsConstants.SPECIAL_UPDATE_FAILURE, error: error});
                },
            );
    };
};

export const updateSpecialClick = (restId, specialId) => {
    return dispatch => {
        dispatch({type: types.specialsConstants.SPECIAL_DATA_REQUEST_STATUS, payload: true});
        specialService.updateSpecialClick(restId, specialId)
            .then(
                data => {
                    dispatch({type: types.specialsConstants.SPECIAL_CLICK_UPDATE_SUCCESS, payload: data});
                },
                error => {
                    dispatch({type: types.specialsConstants.SPECIAL_UPDATE_FAILURE, error: error});
                },
            );
    };
};

export const handleSpecialSearch = (what, where) => {
    return dispatch => {
        dispatch({type: types.specialsConstants.SPECIAL_DATA_REQUEST_STATUS, payload: true});
        specialService.getFoundSpecialList(what, where)
            .then(
                special => {
                    dispatch({type: types.specialsConstants.RECEIVED_SPECIAL_LIST, payload: special});
                },
                error => {
                    dispatch({type: types.specialsConstants.SPECIAL_LIST_FAILURE, error: error});
                },
            );
    };
};

export const getSpecialList = () => {
    return dispatch => {
        dispatch({type: types.specialsConstants.SPECIAL_DATA_REQUEST_STATUS, payload: true});
        specialService.getSpecialList()
            .then(
                special => {
                    dispatch({type: types.specialsConstants.RECEIVED_SPECIAL_LIST, payload: special});
                },
                error => {
                    dispatch({type: types.specialsConstants.SPECIAL_LIST_FAILURE, error: error});
                },
            );
    };
};

export const getPaginatedSpecialList = (url) => {
    return dispatch => {
        dispatch({type: types.specialsConstants.SPECIAL_DATA_REQUEST_STATUS, payload: true});
        specialService.getPaginatedSpecialList(url)
            .then(
                special => {
                    dispatch({type: types.specialsConstants.RECEIVED_SPECIAL_LIST, payload: special});
                },
                error => {
                    dispatch({type: types.specialsConstants.SPECIAL_LIST_FAILURE, error: error});
                },
            );
    };
};

export const specialSelected = (special) => dispatch => {
    dispatch({type: types.specialsConstants.SPECIAL_SELECTED, payload: special});
};
