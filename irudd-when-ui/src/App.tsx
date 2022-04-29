import Header from './Header'
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import CreateEvent from "./features/createEvent/CreateEvent";
import {CurrentEvent} from "./features/currentEvent/CurrentEvent";

let containerStyle = {
    maxWidth:450,
    gap:25
}

function App() {
    let body : JSX.Element;
    return (
        <div className="container-fluid d-flex flex-column mt-2" style={containerStyle}>
            <Header />
            <div className="d-flex flex-grow-1 justify-content-center align-items-center">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<CreateEvent />} />
                        <Route path="create" element={<CreateEvent />} />
                        <Route path="event/:eventId" element={<CurrentEvent />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </div>            
    );
}

export default App;
