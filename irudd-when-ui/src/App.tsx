import Header from './Header'
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import CreateEvent from "./features/createEvent/CreateEvent";
import {CurrentEvent} from "./features/currentEvent/CurrentEvent";
import './App.css';

function App() {
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
        </div>            
    );
}

export default App;
