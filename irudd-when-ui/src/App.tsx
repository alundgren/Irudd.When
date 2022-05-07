import Header from './Header'
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import CreateEvent from "./features/createEvent/CreateEvent";
import {CurrentEvent} from "./features/currentEvent/CurrentEvent";
import './App.css';
import { Toast, ToastContainer } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { StoreSlices } from "./store";
import { DateTime } from "luxon";
import { hideToast } from "./features/toasts/toastsSlice";

function App() {
    let toasts = useSelector((x: StoreSlices) => x.toasts.toasts);
    
    let dispatch = useDispatch();
    
    //TODO: Move toasts to separate component
    let nowEpoch = DateTime.now().valueOf();
    let toastElements = toasts.filter(x => !x.isHidden).map(toast => {
        const onClose = () => {
            dispatch(hideToast(toast.id));
        };
        let hideAfterMs = toast.hideAfterEpoch > nowEpoch ? toast.hideAfterEpoch - nowEpoch : 0;
        return (
            <Toast onClose={onClose} key={toast.id} delay={hideAfterMs} autohide>
                <Toast.Body>{toast.text}</Toast.Body>
            </Toast>
        );
    });
    
    return (
        <div className="container-fluid d-flex flex-column bg-light p-3 vh-100 irudd-when-container">
            <BrowserRouter>
                <Header />
                <div className="d-flex flex-grow-1 justify-content-center align-items-start">
                    <Routes>
                        <Route path="/" element={<CreateEvent />} />
                        <Route path="create" element={<CreateEvent />} />
                        <Route path="event/:eventId" element={<CurrentEvent />} />
                    </Routes>                
                </div>
            </BrowserRouter>
            <ToastContainer className="p-3" position="middle-center">
                {toastElements}
            </ToastContainer>
        </div>            
    );
}

export default App;
