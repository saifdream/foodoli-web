import {combineReducers} from 'redux';
import UserReducer from './user';
import AuthenticationReducer from './authentication';
import SpecialReducer from "./specials";
import RestaurantReducer from "./restaurant";
import ReservationReducer from "./reservation";
import FavouriteReducer from "./favourite";

const rootReducer = combineReducers({
    authentication: AuthenticationReducer,
    user: UserReducer,
    specials: SpecialReducer,
    restaurants: RestaurantReducer,
    reservations: ReservationReducer,
    favourites: FavouriteReducer,
});

export default rootReducer;
