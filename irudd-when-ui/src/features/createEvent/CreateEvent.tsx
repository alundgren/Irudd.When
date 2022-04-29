import EditEventDescription from './components/EditEventDescription';
import PickEventParticipants from './components/PickEventParticipants';
import PickEventDates from './components/PickEventDates';
import SelectDateOrDateTime from './components/SelectDateOrDateTime'
import { CreateEventState } from './createEventSlice';
import { useSelector } from 'react-redux';
import { DateService } from '../../services/DateService';
import { I18nState } from '../i18n/i18nSlice';
import React, {useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import { EventService } from '../../services/EventService';

let wrapperStyle = {
    gap: 30,
}

let singleLineRowStyle = {
    height: '2em'
}

function CreateEvent() {
    const locale = useSelector((x: { i18n: I18nState }) => x.i18n.locale);
    const create = useSelector((x : { createEvent: CreateEventState }) => x.createEvent);

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

    const dispatch = useDispatch();
    const [isCreating, setIsCreating] = useState(false);
    useEffect(() => {
        if(isCreating) {
            let eventService = new EventService();
            eventService.createNewEvent(create).then(x => {
                setIsCreating(false);
                navigate({ pageName: 'event', pageData: x.id });
            });
        }
    }, [isCreating, navigate, create]);
    const onCreateClicked = (e: React.SyntheticEvent) => {
        setIsCreating(true);
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
                <button className="btn btn-outline-primary" disabled={!isValid || isCreating} onClick={onCreateClicked}>Skapa</button>
            </div>           
        </form>
    );
}

export default CreateEvent;

