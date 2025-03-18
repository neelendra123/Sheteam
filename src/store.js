import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducers";
export const store = configureStore({
    reducer : rootReducer,
    devTools : window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
})