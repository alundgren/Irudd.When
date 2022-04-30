import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import { CurrentEventState } from "./features/currentEvent/currentEventSlice";

let containerStyle = {
    gap: 15
}
let logoStyle = {
    height: 45,
    width: 45
}

function Header() {
    const location = useLocation();
    let title = '';

    const currentEvent = useSelector((x : { currentEvent : CurrentEventState }) => x.currentEvent.event);
    
    if(location.pathname === '/create' || location.pathname === '/') {
        title = 'Ny händelse';
    } else if(location.pathname.startsWith('/event')) {                
        title = currentEvent?.description ?? '';
    } else {
        title = 'Sidan finns inte'
    }
    return (
        <div>
            <div className="navbar-light d-flex flex-row p-2 align-self-center fs-3" style={containerStyle}>
                <img src="/logo.svg" alt="Clock" style={logoStyle} />
                <div className="flex-grow-1 align-self-center">{title}</div>
                <span className="navbar-toggler-icon"></span>
            </div>
        </div>
    );
}

export default Header;
