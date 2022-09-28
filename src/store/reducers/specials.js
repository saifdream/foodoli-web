import {specialsConstants} from '../actions/ActionTypes';

const initialState = {
    count: 0,
    next: null,
    previous: null,
    specialList: [],
    special: null,
    isLoading: false,
    activeSpecial: null,
    listErrorStatus: null,
    addSuccessStatus: null,
    addErrorStatus: null,
    updateSuccessStatus: null,
    updateErrorStatus: null,
};

const SpecialReducer = (state = initialState, action) => {
    switch (action.type) {
        case specialsConstants.RECEIVED_SPECIAL_LIST:
            const {current_page, data, next_page_url, prev_page_url, total} = action.payload;
            return {
                ...state,
                specialList: current_page === 1 ? data : [...state.specialList, ...data],
                next: next_page_url,
                previous: prev_page_url,
                count: total,
                isLoading: false,
            };
        case specialsConstants.SPECIAL_LIST_FAILURE:
            return {...state, listErrorStatus: action.error, isLoading: false, count: 0, next: null, previous: null};
        case specialsConstants.SPECIAL_SELECTED:
            return {
                ...state,
                activeSpecial: action.payload,
                addSuccessStatus: null,
                addErrorStatus: null,
                updateSuccessStatus: null,
                updateErrorStatus: null,
                listErrorStatus: null,
            };
        case specialsConstants.SPECIAL_DATA_REQUEST_STATUS:
            return {
                ...state,
                isLoading: true,
                addSuccessStatus: null,
                addErrorStatus: null,
                updateSuccessStatus: null,
                updateErrorStatus: null,
                listErrorStatus: null,
            };
        case specialsConstants.SPECIAL_ADD_SUCCESS:
            return {...state, special: action.payload, isLoading: false, addSuccessStatus: 'Successfully Added'};
        case specialsConstants.SPECIAL_ADD_FAILURE:
            return {...state, addErrorStatus: action.error, isLoading: false,};
        case specialsConstants.SPECIAL_UPDATE_SUCCESS:
            return {...state, special: action.payload, isLoading: false, updateSuccessStatus: 'Successfully Updated'};
        case specialsConstants.SPECIAL_UPDATE_FAILURE:
            return {...state, updateErrorStatus: action.error, isLoading: false,};
        default:
            return state;
    }
};

export default SpecialReducer;
