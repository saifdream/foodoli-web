import { getToken } from "../common/localStorage";

export const authHeader = () => {
    try {
        let token = getToken();
        if (token) {
            return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
        } else {
            return { 'Content-Type': 'application/json' };
        }
    } catch (error) {
        console.log('Error retrieving data')
    }
};

export const authFormHeader = () => {
    try {
        let token = getToken();
        if (token) {
            return { 'Authorization': 'Bearer ' + token };
        } else {
            return {};
        }
    } catch (error) {
        console.log('Error retrieving data')
    }
};
