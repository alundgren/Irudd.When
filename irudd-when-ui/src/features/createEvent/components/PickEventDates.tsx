import React, { SyntheticEvent } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { DateService } from '../../../services/DateService';
import { I18nState } from '../../i18n/i18nSlice';
import { addDate, CreateEventState, removeDate, setDate, setNewDate } from '../createEventSlice';
import InputAddonButton from '../../../components/InputAddonButton';

let containerStyle = {
    gap: '10px',
};

function PickEventDates() {
    const dateOnly = useSelector((x : { createEvent: CreateEventState }) => x.createEvent.dateOnly);
    const dates = useSelector((x : { createEvent: CreateEventState }) => x.createEvent.dates);
    const locale = useSelector((x: { i18n: I18nState }) => x.i18n.locale);
    const newDate = useSelector((x : { createEvent: CreateEventState }) => x.createEvent.newDate);
    const dispatch = useDispatch();

    const dateService = new DateService(locale, dateOnly);

    const isNewDateValid = dateService.isValid(newDate);

    const onRemoveDate = (id: string) => {
        dispatch(removeDate(id));
    };
    
    const classes = (x: string[]) => {
        return x.filter(x => !!x).join(' ')
    };

    const dateElements = dates.map(date => {
        const isDateValid = dateService.isValid(date.date);
        const dateFilledInAndInvalid = date.date && !isDateValid;
        const dateClasses = ['form-control', 'flex-grow-1', dateFilledInAndInvalid ? 'is-invalid' : ''];
        const onDateChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
            dispatch(setDate({ id: date.id, date: e.target.value }));
        };

        return (
            <div key={date.id} className="input-group flex-grow-1" data-testid="dateContainer">
                <InputAddonButton iconType='showCalendar' buttonType='secondary' isDisabled={true} />
                <input type="text" className={classes(dateClasses)}  onChange={onDateChanged} value={date.date}
                    data-testid="editDateInput" />
                <InputAddonButton iconType='removeTime' buttonType='danger' testId='removeButton' onClick={e => onRemoveDate(date.id)} />
            </div>
        );
    });

    const dispatchAddDate = () => {
        dispatch(setNewDate(''));
        dispatch(addDate(newDate));
    }

    const onAddDate = (evt: SyntheticEvent) => {
        dispatchAddDate();
    };

    const onNewDateChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setNewDate(e.target.value));
    };

    const newDateFilledInAndInvalid = newDate && !isNewDateValid
    const newDateClasses = ['form-control', 'flex-grow-1', newDateFilledInAndInvalid ? 'is-invalid' : ''];

    const onNewDateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key !== 'Enter' || !isNewDateValid) {
            return;
        }
        e.preventDefault();
        if(e.currentTarget.value) {
            dispatchAddDate();
        }
    };    

    return (
        <div className="d-flex flex-column" style={containerStyle}>
            <h3>Tider</h3>
            {dateElements}
            <div className="input-group flex-grow-1">
                <InputAddonButton iconType='showCalendar' buttonType='secondary' data-testid="showCalendar" isDisabled={true} />
                <input type="text" className={classes(newDateClasses)} placeholder={dateService.getDateFormat('full')}
                    data-testid="addInput" value={newDate} onChange={onNewDateChanged} onKeyDown={onNewDateKeyDown} />
                <InputAddonButton iconType='addTime' buttonType='secondary' testId="addButton" isDisabled={!isNewDateValid}
                    onClick={onAddDate} />
            </div>
        </div>
    );
}

export default PickEventDates;