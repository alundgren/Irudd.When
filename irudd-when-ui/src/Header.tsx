import React from 'react';

let containerStyle = {
    gap: 15
}
let logoStyle = {
    height: 45,
    width: 45
}

function Header() {
    return (
        <div>
            <div className="navbar-light d-flex flex-row p-2 align-self-center fs-3" style={containerStyle}>
                <img src="/logo.svg" alt="Clock" style={logoStyle} />
                <div className="flex-grow-1 align-self-center">Ny händelse</div>
                <span className="navbar-toggler-icon"></span>
            </div>
        </div>
    );
}

export default Header;
