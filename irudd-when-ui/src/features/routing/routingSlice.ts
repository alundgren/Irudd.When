import { AnyAction, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import {resetCreate} from "../createEvent/createEventSlice";
import {EventService} from "../../services/EventService";
import {clearCurrentEvent, setCurrentEvent} from "../currentEvent/currentEventSlice";

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
    if(p === '' || p === 'create') {
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
    const gotoCreate = ()  => {
        dispatch(resetCreate());
        dispatch(setRoute({ pageName: 'create' }));
    };
    const gotoEvent = (id: string) => {
        const eventService = new EventService();
        eventService.loadExistingEvent(id).then(x => {
            if(x) {
                dispatch(setCurrentEvent(x));
            } else {
                dispatch(clearCurrentEvent())
            }
            dispatch(setRoute({ pageName: 'event', pageData: id }));
        })
    }    
    if(!window.onpopstate) {
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
            window.history.forward();
            gotoCreate();
        } else if(route.pageName === 'event' && route.pageData) {
            window.history.pushState(route, '', `/event/${route.pageData}`);
            window.history.forward();
            gotoEvent(route.pageData);
        } else {
            window.history.pushState(route, '', `/notfound`);
            window.history.forward();
            dispatch(setRoute({ pageName: 'notfound' }));                        
        }
    };
}

export const { setRoute } = i18nSlice.actions;
export const routingSliceReducer = i18nSlice.reducer;