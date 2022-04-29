import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from "react-redux";
import reportWebVitals from './reportWebVitals';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import {createStore} from "./store";
import { inferPageFromPathName, Router, setRoute } from './features/routing/routingSlice';
import { resetCreate } from './features/createEvent/createEventSlice';
import { EventService } from './services/EventService';
import { setCurrentEvent } from './features/currentEvent/currentEventSlice';

const store = createStore();

const eventService = new EventService();
let router = new Router(store, newPage => {
    if(newPage.pageName === 'create') {
        store.dispatch(resetCreate());
        return new Promise<void>(resolve => { resolve(); });
    } else if(newPage.pageName === 'event') {
        return eventService.loadExistingEvent(newPage.pageData ?? '').then(x => {
            store.dispatch(setCurrentEvent(x));
        })
    } else {
        return new Promise<void>(resolve => { resolve(); });
    }
});
let initialPage = inferPageFromPathName(window.location.pathname) ?? {
    pageName: 'noSuchPage'
};
store.dispatch(setRoute(initialPage));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <Provider store={store}>
        <React.StrictMode>
            <App />
        </React.StrictMode>        
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
