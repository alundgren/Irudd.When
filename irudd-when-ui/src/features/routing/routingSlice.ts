import { AnyAction, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';

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

//TODO: Switch to some known and tested standard solution after learning a bit about the history api
//TODO: How to mock in tests?
export function useNavigate(dispatch: Dispatch<AnyAction>) : (route: RoutingPage) => void {
    if(!window.onpopstate) {
        const gotoCreate = ()  => {
            //Reset create
            //dispatch route event
        };
        const gotoEvent = (id: string) => {
            //new EventService()
            //load event
            //dispatch events to current event and route
        }
        window.onpopstate = (event) => {
            let page = inferPageFromPathName(window.location.pathname);
            if(page) {
                dispatch(setRoute(page));
            } else {
                dispatch(setRoute({ pageName: 'notfound' }));
            }            
        };
    }
    return route => {
        if(route.pageName === 'create') {
            window.history.pushState(route, '', '/');
            dispatch(setRoute(route));
            window.history.forward();
        } else if(route.pageName === 'event') {
            window.history.pushState(route, '', `/event/${route.pageData}`);
            dispatch(setRoute(route));
            window.history.forward();
        } else {
            window.history.pushState(route, '', `/notfound`);
            dispatch(setRoute({ pageName: 'notfound' }));
            window.history.forward();
        }
    };
}

export const { setRoute } = i18nSlice.actions;
export const routingSliceReducer = i18nSlice.reducer;