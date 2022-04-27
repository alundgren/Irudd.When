import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { DateService } from '../../../services/DateService';
import { I18nState } from '../../i18n/i18nSlice';
import { CreateEventState, setNewDate } from '../createEventSlice';
import InputAddonButton from './../../../components/InputAddonButton';

let containerStyle = {
    gap: '10px',
};
/*
            <div className="input-group flex-grow-1" date-testid="dateContainer">
                <InputAddonButton iconType='showCalendar' buttonType='secondary' />
                <input type="text" className="form-control flex-grow-1" value="2022-12-21 13:30" />
                <InputAddonButton iconType='removeTime' buttonType='danger' />
            </div>
*/
function PickEventTimes() {
    const dateOnly = useSelector((x : { createEvent: CreateEventState }) => x.createEvent.dateOnly);
    const dates = useSelector((x : { createEvent: CreateEventState }) => x.createEvent.dates);
    const locale = useSelector((x: { i18n: I18nState }) => x.i18n.locale);
    const newDate = useSelector((x : { createEvent: CreateEventState }) => x.createEvent.newDate);
    const dispatch = useDispatch();

    const dateService = new DateService(locale, dateOnly);

    const isNewDateValid = dateService.isValid(newDate);

    const dateElements = dates.map(date => (
        <div key={date.id} className="input-group flex-grow-1" date-testid="dateContainer">
            <InputAddonButton iconType='showCalendar' buttonType='secondary' />
            <input type="text" className="form-control flex-grow-1" value={date.date} />
            <InputAddonButton iconType='removeTime' buttonType='danger' />
        </div>
    ));

    const onNewDateChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setNewDate(e.target.value));
    };

    return (
        <div className="d-flex flex-column" style={containerStyle}>
            <h3>Tider</h3>
            {dateElements}
            <div className="input-group flex-grow-1">
                <InputAddonButton iconType='showCalendar' buttonType='secondary' data-testid="showCalendar" />
                <input type="text" className="form-control flex-grow-1" placeholder="Tex 2022-12-12 12:30" 
                    data-testid="addInput" value={newDate} onChange={onNewDateChanged} />
                <InputAddonButton iconType='addTime'  buttonType='secondary' testId="addButton" isDisabled={!isNewDateValid} />
            </div>
        </div>
    );
}

export default PickEventTimes;