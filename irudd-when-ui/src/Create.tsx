import React from 'react';

import EditEventDescription from './components/EditEventDescription';
import SelectDateOrDateTime from './components/SelectDateOrDateTime'

let wrapperStyle = {
    gap: '15px'
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
            <div className="d-flex" style={rowStyle}>
                <EditEventDescription />
            </div>
            <div style={rowStyle}>r3</div>
        </form>
    );
}

export default Create;

