import {configureStore } from "@reduxjs/toolkit";
import {createEventSliceReducer, CreateEventState} from "./features/createEvent/createEventSlice";
import { i18nSliceReducer, I18nState } from "./features/i18n/i18nSlice";
import {currentEventSliceReducer, CurrentEventState} from "./features/currentEvent/currentEventSlice";

export function createStore() {
    return configureStore({
        reducer: {
            createEvent: createEventSliceReducer,
            i18n: i18nSliceReducer,
            currentEvent: currentEventSliceReducer
        }
    })
}

export interface StoreSlices {
        createEvent: CreateEventState,
        i18n: I18nState,
        currentEvent: CurrentEventState
}