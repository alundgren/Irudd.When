import React from 'react';
import { useSelector } from 'react-redux';
import { CreateEventState } from '../createEventSlice';
import 'react-calendar/dist/Calendar.css';
import SingleDateOrDateTimeEditor from './SingleDateOrDateTimeEditor';

let containerStyle = {
    gap: '10px',
};

function PickEventDates() {
    const dates = useSelector((x : { createEvent: CreateEventState }) => x.createEvent.dates);

    const dateElements = dates.map(date => {
        return (
            <React.Fragment key={date.id}>
                <SingleDateOrDateTimeEditor isEdit={true} editDateId={date.id} />
            </React.Fragment>
        );
    });

    return (
        <div className="d-flex flex-column" style={containerStyle}>
            <h3>Tider</h3>
            {dateElements}
            <SingleDateOrDateTimeEditor isEdit={false} editDateId={''} />
        </div>
    );
}

export default PickEventDates;