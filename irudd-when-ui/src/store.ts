import {configureStore} from "@reduxjs/toolkit";
import {createEventSliceReducer} from "./features/createEvent/createEventSlice";

export function createStore() {
    return configureStore({
        reducer: {
            createEvent: createEventSliceReducer
        }
    })
}