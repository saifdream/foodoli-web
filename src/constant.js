export const APP_NAME = "Foodoli";

export const BASE_URL = "https://www.newfoodoli.foodoli.com/";
export const API = `${BASE_URL}public/api/`;
export const IMAGE_URL = `${BASE_URL}public/images/`;

export const config = {
    name: 'Foodoli',
};

export const getHttpErrorMessage = (response, e=null) => {
    switch (response.status) {
        case 400:
            return "Bad Request.";
        case 401:
            return "Unauthorised access!";
        case 402:
            return "Payment Required!";
        case 403:
            return "Request Forbidden!"; //return "CSRF verification failed. Request aborted.";
        case 404:
            return "Not Found!";
        case 405:
            return "Method Not Allowed!";
        case 408:
            return "Request Timeout!";
        case 415:
            return "Unsupported Media Type!";
        case 444:
            return "No Response!";
        case 500:
            return "Internal Server Error!";
        case 502:
            return "Bad Gateway!";
        case 503:
            return "Service Unavailable!";
        case 504:
            return "Gateway Timeout!";
        default:
            return e?.message || "Something went wrong!";
    }
};

export const handleResponse = (response) => {
    //console.log(response);
    return response.text().then(res => {
        let data = "";
        try {
            data = res && JSON.parse(res);
        } catch (e) {
            return Promise.reject(getHttpErrorMessage(response, e));
            //return Promise.reject("Our apologies, the data has errors.");
        }
        if (!response.ok) {
            if (response.status === 401) {
                return Promise.reject(getHttpErrorMessage(response));
            }

            const error = (data && data?.detail) || response.statusText || res;
            //console.log(error);
            return Promise.reject(error);
        }

        if (data.hasOwnProperty("error")) return Promise.reject(data.error);
        //console.log(data)
        return data;
    });
};

export const getToken = () => {
    try {
        return localStorage.getItem('token');
    } catch (e) {
        console.log(e)
        return null;
    }
};

export const getInitials = textString => {
    if (!textString) return "";

    const text = textString.trim();
    const textSplit = text.split(" ");

    if (textSplit.length <= 1) return text.charAt(0);

    return textSplit[0].charAt(0) + textSplit[textSplit.length - 1].charAt(0);
};

export const appendLeadingZeroes = (n) => {
    if (n <= 9) {
        return "0" + n;
    }
    return n
};

export const getFormattedDate = (date) => {
    const received_date = new Date(date);
    return appendLeadingZeroes(received_date.getDate()) + "-" + appendLeadingZeroes(received_date.getMonth() + 1) + "-" + received_date.getFullYear();
};

export const getFormattedDay = (date) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const today = new Date();
    const dateReceived = new Date(date);

    const day = days[dateReceived.getDay()];

    const Difference_In_Time = today.getTime() - dateReceived.getTime();
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    const todayDate = today.getFullYear() + "-" + appendLeadingZeroes(today.getMonth() + 1) + "-" + appendLeadingZeroes(today.getDate());
    const receivedDate = dateReceived.getFullYear() + "-" + appendLeadingZeroes(dateReceived.getMonth() + 1) + "-" + appendLeadingZeroes(dateReceived.getDate());

    return receivedDate === todayDate ? "Today" : Difference_In_Days > 7 ? receivedDate : day;
};

export const getFormattedTime = (receivedDate) => {
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let d = new Date(receivedDate);
    let day = days[d.getDay()];
    let hr = d.getHours();
    let min = d.getMinutes();
    if (min < 10) {
        min = "0" + min;
    }
    let ampm = "AM";
    if( hr >= 12 ) ampm = "PM";
    if( hr > 12 ) hr -= 12;

    const today = new Date();
    const Difference_In_Time = today.getTime() - d.getTime();
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return `${Difference_In_Days > 7 ? day + ' ' : ''}${hr}:${min} ${ampm}`;
};
