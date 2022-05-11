import EditEventDescription from './components/EditEventDescription';
import PickEventParticipants from './components/PickEventParticipants';
import PickEventDates from './components/PickEventDates';
import SelectDateOrDateTime from './components/SelectDateOrDateTime'
import { CreateEventState, resetCreate } from './createEventSlice';
import { useSelector } from 'react-redux';
import { DateService } from '../../services/DateService';
import { I18nState } from '../i18n/i18nSlice';
import React, { useState } from 'react';
import EventService from '../../services/EventService';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

let wrapperStyle = {
    gap: 30,
}

let singleLineRowStyle = {
    height: '2em'
}

function CreateEvent() {
    const locale = useSelector((x: { i18n: I18nState }) => x.i18n.locale);
    const create = useSelector((x : { createEvent: CreateEventState }) => x.createEvent);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    let isValid = true;
    const dateService = new DateService(locale, create.dateOnly);
    if(create.dates.length === 0 || create.dates.find(x => !dateService.isValid(x.date))) {
        isValid = false;
    }

    if(create.participants.length === 0 || create.participants.find(x => !x.name)) {
        isValid = false;
    }
    
    if(!create.description) {
        isValid = false;
    }

    const [isCreating, setIsCreating] = useState(false);
    
    const onCreateClicked = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setIsCreating(true);
        let eventService = new EventService();
        let event = await eventService.createNewEvent(create);
        setIsCreating(false);
        dispatch(resetCreate());
        navigate('/event/' + event.id);
    };

    return (
        <form className="d-flex flex-grow-1 p-2 flex-column" style={wrapperStyle} noValidate={true}>
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
                    <PickEventDates />
                </div>                
            </div>            
            <div className="d-flex justify-content-end mt-2">
                <button className="btn btn-outline-primary" disabled={!isValid || isCreating} onClick={onCreateClicked} data-testid="createButton">Skapa</button>
            </div>           
        </form>
    );
}

export default CreateEvent;

