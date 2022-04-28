import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RoutingState {
    current: RoutingPage
};

export interface RoutingPage {
    pageName: string,
    pageData?: string
}

const initialState : RoutingState = {
    current: {
        pageName: 'create'
    }
};

const i18nSlice = createSlice({
    name: 'routing',
    initialState,
    reducers: {
        setRoute(state : RoutingState, action: PayloadAction<RoutingPage>) {
            state.current = action.payload;
        }
    }
});

/*
Intended to parse the output of window.location.pathname which will be something like
- create: /
- event: /event/kj32f42432
*/
export function inferPageFromPathName(pathName: string) : RoutingPage | null {
    let p = pathName.trim();
    if(p.endsWith('/')) {
        p = p.substring(0, p.length - 1);
    }
    if(p == '' || p == 'create') {
        return { pageName: 'create' }
    }
    if(p.startsWith('/event/')) {
        return { pageName: 'event', pageData: p.substring(7) }
    }
    return null;
}

export const { setRoute } = i18nSlice.actions;
export const routingSliceReducer = i18nSlice.reducer;