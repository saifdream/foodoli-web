export const getToken = () => localStorage.getItem("token");

export const setToken = token => localStorage.setItem("token", token);

export const removeToken = () => localStorage.removeItem("token");

export const removeState = () => localStorage.removeItem("state_foodoli");

export const getFoodoli = () => JSON.parse(localStorage.getItem("foodoli"));

export const setFoodoli = data => localStorage.setItem("foodoli", JSON.stringify(data));

export const removeFoodoli = () => localStorage.removeItem("foodoli");
