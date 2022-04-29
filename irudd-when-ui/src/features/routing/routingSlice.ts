import { AnyAction, createSlice, Dispatch, PayloadAction, Store } from '@reduxjs/toolkit';
import {resetCreate} from "../createEvent/createEventSlice";
import {EventService} from "../../services/EventService";
import {clearCurrentEvent, setCurrentEvent} from "../currentEvent/currentEventSlice";
import { StoreSlices } from '../../store';

export interface RoutingState {
    isNavigating: boolean
    current: RoutingPage
};

export interface RoutingPage {
    pageName: string,
    pageData?: string
}

const initialState : RoutingState = {
    isNavigating: false,
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
        },
        setIsNavigating(state, action: PayloadAction<boolean>) {
            state.isNavigating = action.payload;
        }
    }
});

/*
Intended to parse the output of window.location.pathname which will be something like
- create: /
- event: /event/kj32f42432
*/
export function inferPageFromPathName(pathName: string) : RoutingPage {
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
    return { pageName: 'notfound' };
}

function areSamePages(p1: RoutingPage | null, p2: RoutingPage | null): boolean {
    let n = (x: string | undefined) => x ? x : null;
    return n(p1?.pageName) === n(p2?.pageName) && n(p1?.pageData) === n(p2?.pageData);
}

export class Navigator {
    constructor(private store: Store) {
        this.synchStateWithBrowserUrl = this.synchStateWithBrowserUrl.bind(this);
        this.getRouterPageFromStore = this.getRouterPageFromStore.bind(this);     
    }

    getRouterPageFromStore() : RoutingPage {
        return (this.store.getState() as StoreSlices).routing.current
    }

    navigateToCreate() {
        let routingPage : RoutingPage = { pageName: 'create' };
        window.history.pushState(routingPage, '', '/');
        window.history.forward();
        this.synchStateWithBrowserUrl(window.location.pathname);
    }

    navigateToEvent(id: string) {
        let routingPage : RoutingPage = { pageName: 'event', pageData: id };
        window.history.pushState(routingPage, '', '/');
        window.history.forward();
        this.synchStateWithBrowserUrl(window.location.pathname);
    }

    navigateToNotFound() {
        let routingPage : RoutingPage = { pageName: 'notFound' };
        window.history.pushState(routingPage, '', '/');
        window.history.forward();
        this.synchStateWithBrowserUrl(window.location.pathname);
    }

    synchStateWithBrowserUrl(browserPathName: string) {
        let browserPage = inferPageFromPathName(browserPathName);

        if(areSamePages(browserPage, this.currentRouterPage)) {
            return;
        }
        if(!browserPage) {
            this.store.dispatch(setRoute({ pageName: 'notFound' }))
        } else if(browserPage.pageName === 'create') {
            this.store.dispatch(setRoute({ pageName: 'create' }))
        } else if(browserPage.pageName === 'event') {
            this.store.dispatch(setRoute({ pageName: 'event', pageData: browserPage.pageData }))
        } else {
            this.store.dispatch(setRoute({ pageName: 'notFound' }))
        }
    }
}

export class Router {
    private currentRouterPage: RoutingPage;

    constructor(private store: Store, onPageChangedTo: (page: RoutingPage) => Promise<void>) {
        this.synchStateWithBrowserUrl = this.synchStateWithBrowserUrl.bind(this);
        this.getRouterPageFromStore = this.getRouterPageFromStore.bind(this);
        this.currentRouterPage = this.getRouterPageFromStore();

        store.subscribe(() => {
            let newRouterPage = this.getRouterPageFromStore();
            if(!areSamePages(this.currentRouterPage, newRouterPage)) {
                this.store.dispatch(setIsNavigating(true));
                this.currentRouterPage = newRouterPage;
                onPageChangedTo(newRouterPage).then(() => {
                    this.store.dispatch(setIsNavigating(false));
                });
            }
        });
        window.onpopstate = (_) => {
            this.synchStateWithBrowserUrl(window.location.pathname);
        };        
    }

    private getRouterPageFromStore() : RoutingPage {
        return (this.store.getState() as StoreSlices).routing.current
    }

    navigateToCreate() {
        let routingPage : RoutingPage = { pageName: 'create' };
        window.history.pushState(routingPage, '', '/');
        window.history.forward();
        this.synchStateWithBrowserUrl(window.location.pathname);
    }

    navigateToEvent(id: string) {
        let routingPage : RoutingPage = { pageName: 'event', pageData: id };
        window.history.pushState(routingPage, '', '/');
        window.history.forward();
        this.synchStateWithBrowserUrl(window.location.pathname);
    }

    navigateToNotFound() {
        let routingPage : RoutingPage = { pageName: 'notFound' };
        window.history.pushState(routingPage, '', '/');
        window.history.forward();
        this.synchStateWithBrowserUrl(window.location.pathname);
    }

    synchStateWithBrowserUrl(browserPathName: string) {
        let browserPage = inferPageFromPathName(browserPathName);

        if(areSamePages(browserPage, this.currentRouterPage)) {
            return;
        }
        if(!browserPage) {
            this.store.dispatch(setRoute({ pageName: 'notFound' }))
        } else if(browserPage.pageName === 'create') {
            this.store.dispatch(setRoute({ pageName: 'create' }))
        } else if(browserPage.pageName === 'event') {
            this.store.dispatch(setRoute({ pageName: 'event', pageData: browserPage.pageData }))
        } else {
            this.store.dispatch(setRoute({ pageName: 'notFound' }))
        }
    }
}

export const { setRoute, setIsNavigating } = i18nSlice.actions;
export const routingSliceReducer = i18nSlice.reducer;