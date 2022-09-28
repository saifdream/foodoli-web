import * as types from './ActionTypes';
import {favouriteService} from '../services/favourite';

export const getMyFavouriteList = () => {
    return dispatch => {
        dispatch({type: types.favouriteConstants.FAVOURITE_DATA_REQUEST_STATUS, payload: true});
        favouriteService.getFavouriteList()
            .then(
                favourite => {
                    dispatch({type: types.favouriteConstants.RECEIVED_FAVOURITE_LIST, payload: favourite});
                },
                error => {
                    dispatch({type: types.favouriteConstants.FAVOURITE_LIST_FAILURE, error: error});
                },
            );
    };
};
