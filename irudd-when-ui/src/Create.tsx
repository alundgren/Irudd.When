import React from 'react';

import Container from 'react-bootstrap/Container';
import SelectDateOrDateTime from './create-components/SelectDateOrDateTime'

let wrapperStyle = {
    gap: '10px'
}

let rowStyle = {
    height: '2em'
}

function Create() {
    return (
        <form className="d-flex p-2 flex-column" style={wrapperStyle}>
            <div className="d-flex" style={rowStyle}>
                <SelectDateOrDateTime />
            </div>
            <div style={rowStyle}>r2</div>
            <div style={rowStyle}>r3</div>
        </form>
    );
}

export default Create;

