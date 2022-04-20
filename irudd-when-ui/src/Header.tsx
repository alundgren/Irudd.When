import React from 'react';

import Container from 'react-bootstrap/Container';

let style = {
    gap: '15px'
}

function Header() {
    return (
        <div>
            <div className="navbar-light d-flex flex-row p-2 align-self-center fs-3" style={style}>
                <img src="/logo.svg" alt="Clock" width="45" height="45" />
                <div className="flex-grow-1 align-self-center">Ny händelse</div>
                <span className="navbar-toggler-icon"></span>
            </div>
        </div>
    );
}

export default Header;
