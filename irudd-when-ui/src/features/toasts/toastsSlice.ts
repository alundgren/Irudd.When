import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DateTime } from "luxon";

export interface ToastsState {
    toasts: {
        id: string,
        text: string,
        hideAfterEpoch: number,
        isHidden: boolean
    }[]   
}

const initialState : ToastsState = {
    toasts: []
};

const toastsSlice = createSlice({
    name: 'toasts',
    initialState,
    reducers: {
        showToast(state, action: PayloadAction<string>) {
            state.toasts.push({
                id: Math.random().toString(36).substring(2, 8),
                text: action.payload,
                hideAfterEpoch: DateTime.now().plus({ milliseconds: 750 }).valueOf(),
                isHidden: false
            })
        },
        hideToast(state, action: PayloadAction<string>) {
            let toast = state.toasts.find(x => x.id === action.payload)
            if(toast) {
                toast.isHidden = true
            }
        }
    }
});

export const { showToast, hideToast } = toastsSlice.actions;
export const toastsSliceReducer = toastsSlice.reducer;