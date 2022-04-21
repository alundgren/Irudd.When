import React from 'react';

import EditEventDescription from './components/EditEventDescription';
import PickEventParticipants from './components/PickEventParticipants';
import PickEventTimes from './components/PickEventTimes';
import SelectDateOrDateTime from './components/SelectDateOrDateTime'

let wrapperStyle = {
    gap: '15px',
    maxWidth:450
}

let singleLineRowStyle = {
    height: '2em'
}

function Create() {
    return (
        <form className="d-flex p-2 flex-column" style={wrapperStyle}>
            <div className="d-flex" style={singleLineRowStyle}>
                <SelectDateOrDateTime />
            </div>
            <div className="d-flex" style={singleLineRowStyle}>
                <EditEventDescription />
            </div>
            <div className="d-flex flex-grow-1">
                <div className="flex-grow-1">
                    <PickEventParticipants />
                </div>
            </div>
            <div className="d-flex flex-grow-1">
                <div className="flex-grow-1">
                    <PickEventTimes />
                </div>                
            </div>            
            <div className="d-flex justify-content-end mt-2">
                <button className="btn btn-outline-primary">Skapa</button>
            </div>           
        </form>
    );
}

export default Create;

