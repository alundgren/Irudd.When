import React from 'react';
import { useSelector } from 'react-redux';

let containerStyle = {
    gap: 15
}
let logoStyle = {
    height: 45,
    width: 45
}

function Header() {
    let title = '';
    /*
    if(currentRoute.pageName === 'create') {
        title = 'Ny händelse';
    } else if(currentRoute.pageName === 'event') {
        title = 'Händelse (todo: desc)'
    } else {
        title = 'Sidan finns inte'
    }
    */     
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
