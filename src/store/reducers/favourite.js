import {favouriteConstants} from '../actions/ActionTypes';

const initialState = {
    favouriteList: [],
    isLoading: false,
};

const FavouriteReducer = (state = initialState, action) => {
    switch (action.type) {
        case favouriteConstants.RECEIVED_FAVOURITE_LIST:
            return {
                ...state,
                favouriteList: action.payload,
                isLoading: false,
            };
        case favouriteConstants.FAVOURITE_LIST_FAILURE:
            return {
                ...state,
                listErrorStatus: action.error,
                isLoading: false,
            };
        case favouriteConstants.FAVOURITE_DATA_REQUEST_STATUS:
            return {
                ...state,
                isLoading: true,
                listErrorStatus: null,
            };
        default:
            return state;
    }
};

export default FavouriteReducer;
