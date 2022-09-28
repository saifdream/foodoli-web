import {reservationConstants, restaurantConstants} from '../actions/ActionTypes';

const initialState = {
    addedItems: [],
    reservationList: null,
    count: 0,
    next: null,
    previous: null,
    isLoading: false,
    listErrorStatus: null,
    addSuccessStatus: null,
    addErrorStatus: null,
    updateSuccessStatus: null,
    updateErrorStatus: null,
};

const ReservationReducer = (state = initialState, action) => {
    switch (action.type) {
        case reservationConstants.SPECIAL_ADD_TO_RESERVATION:
            let addedItems = [...state.addedItems];
            const selectedItem = action.payload;
            const index = addedItems && addedItems.findIndex(item => {
                return item?.id === selectedItem?.id && item?.rest_id === selectedItem?.rest_id;
            });

            if (index === -1) {
                addedItems = [...addedItems, selectedItem]
            }

            return {...state, addedItems: addedItems};

        case reservationConstants.SPECIAL_UPDATE_TO_RESERVATION:
            let existingItems = [...state.addedItems];
            const existingItem = action.payload;
            const updatedItems = existingItems && existingItems.map(item => {
                if(item?.id === existingItem?.id)
                    return {...item, qty: item.qty + 1};
                return item;
            });

            return {...state, addedItems: updatedItems};

        case reservationConstants.SPECIAL_DECREASE_FROM_RESERVATION:
            let existingItems2 = [...state.addedItems];
            const existingItem2 = action.payload;
            const updatedItems2 = existingItems2 && existingItems2.map(item => {
                if(item?.id === existingItem2?.id)
                    return {...item, qty: item.qty - 1};
                return item;
            });

            return {...state, addedItems: updatedItems2};

        case reservationConstants.SPECIAL_REMOVE_FROM_BAG:
            let removeAbleItems = [...state.addedItems];
            const removedItemId = action.payload;
            const filteredItems = removeAbleItems.filter(item => {
                return item?.id !== removedItemId;
            });

            return {...state, addedItems: filteredItems};

        case reservationConstants.SPECIAL_CLEAR_FROM_BAG:
            return {...state, addedItems: []};

        case reservationConstants.RESERVATION_DATA_REQUEST_STATUS:
            return {
                ...state,
                isLoading: true,
                addSuccessStatus: null,
                addErrorStatus: null,
                updateSuccessStatus: null,
                updateErrorStatus: null,
                listErrorStatus: null,
            };

        case reservationConstants.RECEIVED_RESERVATION_LIST:
            return {
                ...state,
                reservationList: action.payload.current_page === 1 ? action.payload : {...state.reservationList, ...action.payload},
                next: action.payload.next_page_url,
                previous: action.payload.prev_page_url,
                count: action.payload.total,
                isLoading: false,
            }

        default:
            return state;
    }
};

export default ReservationReducer;
