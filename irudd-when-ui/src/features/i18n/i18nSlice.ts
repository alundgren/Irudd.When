import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface I18nState {
    locale: string
};

const initialState : I18nState = {
    locale: 'sv-SE'
};

const i18nSlice = createSlice({
    name: 'i18n',
    initialState,
    reducers: {
        setLocale(state, action: PayloadAction<string>) {
            state.locale = action.payload
        }
    }
});

export const { setLocale } = i18nSlice.actions;
export const i18nSliceReducer = i18nSlice.reducer;