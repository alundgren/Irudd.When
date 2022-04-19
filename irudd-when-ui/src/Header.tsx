import React from 'react';

import Container from 'react-bootstrap/Container';

let style = {
    gap: '15px'
}

function Header() {
    return (
    <div className="d-flex flex-row p-2 align-self-center" style={style}>
        <img src="/logo.svg" alt="Clock" width="45" height="45" />
        <div className="d-flex align-self-center">test</div>
    </div>        
    );
}

export default Header;
