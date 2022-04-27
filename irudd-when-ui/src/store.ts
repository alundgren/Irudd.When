import {configureStore} from "@reduxjs/toolkit";
import {createEventSliceReducer} from "./features/createEvent/createEventSlice";
import { i18nSliceReducer } from "./features/i18n/i18nSlice";

export function createStore() {
    return configureStore({
        reducer: {
            createEvent: createEventSliceReducer,
            i18n: i18nSliceReducer
        }
    })
}