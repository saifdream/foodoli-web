import {createStore, applyMiddleware, compose} from 'redux';
import { persistStore } from "redux-persist";
import throttle from 'lodash.throttle';
// middlewares
import thunkMiddleware from 'redux-thunk';
import logger, {createLogger} from 'redux-logger';

// Import custom components
import rootReducer from './reducers';


function saveToLocalStorage(state) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state_foodoli', serializedState)
    } catch (e) {
        console.log(e);
    }
}

function loadFromLocalStorage() {
    try {
        const serializedState = localStorage.getItem('state_foodoli');
        // console.log('serializedState')
        if (serializedState === null) return undefined;
        // console.log(JSON.parse(serializedState))
        return JSON.parse(serializedState)
    } catch (e) {
        console.log(e)
        return undefined
    }
}

const persistedState = loadFromLocalStorage();

/**
 * Create a Redux store that holds the app state.
 */
const loggerMiddleware = createLogger();
const store = createStore(rootReducer, persistedState, compose(
    applyMiddleware(thunkMiddleware),  //loggerMiddleware

    //For working redux dev tools in chrome (https://github.com/zalmoxisus/redux-devtools-extension)
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : function (f) {
        return f;
    }
));

/*export const unsubscribe = store.subscribe(() => {
    const state = store.getState();
    saveToLocalStorage(state);
});*/

export const unsubscribe = store.subscribe(throttle(() => {
    const state = store.getState();
    saveToLocalStorage(state);
}, 1000));

export const persistor = persistStore(store);

export default store;
