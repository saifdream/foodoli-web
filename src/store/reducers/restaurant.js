import {restaurantConstants} from '../actions/ActionTypes';

const initialState = {
    count: 0,
    next: null,
    previous: null,
    restaurantList: [],
    todaysReservationList: [],
    pendingReservationList: [],
    totalPendingPages: 0,
    confirmedReservationList: [],
    totalConfirmedPages: 0,
    cancelledReservationList: [],
    totalCancelledPages: 0,
    reportReservationList: [],
    totalReportPages: 0,
    specials: [],
    menus: [],
    reviews: [],
    reviewImages: [],
    restaurant: null,
    isLoading: false,
    activeRestaurant: null,
    listErrorStatus: null,
    addSuccessStatus: null,
    addErrorStatus: null,
    updateSuccessStatus: null,
    updateErrorStatus: null,
};

const RestaurantReducer = (state = initialState, action) => {
    switch (action.type) {
        case restaurantConstants.RECEIVED_RESTAURANT_DETAILS:
            return {
                ...state,
                restaurant: action.payload.restaurant,
                specials: action.payload.special,
                isLoading: false,
            };
        case restaurantConstants.RECEIVED_RESTAURANT_LIST:
            return {
                ...state,
                restaurantList: action.payload.current_page === 1 ? action.payload.data : [...state.restaurantList, ...action.payload.data],
                next: action.payload.next_page_url,
                previous: action.payload.prev_page_url,
                count: action.payload.total,
                isLoading: false,
            };
        case restaurantConstants.RECEIVED_TODAYS_RESERVATION_LIST:
            return {
                ...state,
                todaysReservationList: action.payload,
                isLoading: false,
            };
        case restaurantConstants.RECEIVED_PENDING_RESERVATION_LIST:
            return {
                ...state,
                pendingReservationList: action.payload.reservation,
                totalPendingPages: action.payload.total_pages,
                isLoading: false,
            };
        case restaurantConstants.RECEIVED_CONFIRMED_RESERVATION_LIST:
            return {
                ...state,
                confirmedReservationList: action.payload.reservation,
                totalConfirmedPages: action.payload.total_pages,
                isLoading: false,
            };
        case restaurantConstants.RECEIVED_CANCELLED_RESERVATION_LIST:
            return {
                ...state,
                cancelledReservationList: action.payload.reservation,
                totalCancelledPages: action.payload.total_pages,
                isLoading: false,
            };
        case restaurantConstants.RECEIVED_REPORT_RESERVATION_LIST:
            return {
                ...state,
                reportReservationList: action.payload,
                isLoading: false,
            };
        case restaurantConstants.RECEIVED_RESTAURANT_MENU_LIST:
            return {
                ...state,
                menus: action.payload,
                isLoading: false,
            };
        case restaurantConstants.RECEIVED_RESTAURANT_REVIEW_LIST:
            return {
                ...state,
                reviews: action.payload.reviews,
                isLoading: false,
            };
        case restaurantConstants.RECEIVED_RESTAURANT_REVIEW_IMAGE_LIST:
            return {
                ...state,
                reviewImages: action.payload.review_images,
                isLoading: false,
            };
        case restaurantConstants.RESTAURANT_LIST_FAILURE:
            return {...state, listErrorStatus: action.error, isLoading: false, count: 0, next: null, previous: null};
        case restaurantConstants.RESTAURANT_DETAILS_FAILURE:
            return {...state, listErrorStatus: action.error, isLoading: false};
        case restaurantConstants.RESTAURANT_SELECTED:
            return {
                ...state,
                activeRestaurant: action.payload,
                addSuccessStatus: null,
                addErrorStatus: null,
                updateSuccessStatus: null,
                updateErrorStatus: null,
                listErrorStatus: null,
            };
        case restaurantConstants.RESTAURANT_DATA_REQUEST_STATUS:
            return {
                ...state,
                isLoading: true,
                addSuccessStatus: null,
                addErrorStatus: null,
                updateSuccessStatus: null,
                updateErrorStatus: null,
                listErrorStatus: null,
            };
        case restaurantConstants.RESTAURANT_ADD_SUCCESS:
            return {...state, restaurant: action.payload, isLoading: false, addSuccessStatus: 'Successfully Added'};
        case restaurantConstants.RESTAURANT_ADD_FAILURE:
            return {...state, addErrorStatus: action.error, isLoading: false,};
        case restaurantConstants.RESTAURANT_UPDATE_SUCCESS:
            return {...state, restaurant: action.payload, isLoading: false, updateSuccessStatus: 'Successfully Updated'};
        case restaurantConstants.RESTAURANT_UPDATE_FAILURE:
            return {...state, updateErrorStatus: action.error, isLoading: false,};
        default:
            return state;
    }
};

export default RestaurantReducer;
