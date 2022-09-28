import {authHeader} from "../../_helpers/auth-header";
import {API, handleResponse} from "../../constant";
import fetch from 'cross-fetch';

export const favouriteService = {
    getFavouriteList,
};

function getFavouriteList() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${API}favourite`, requestOptions).then(handleResponse);
}
