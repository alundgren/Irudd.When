import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { DateService } from '../../../services/DateService';
import { I18nState } from '../../i18n/i18nSlice';
import { addDate, CreateEventState, removeDate, setDate, setNewDate } from '../createEventSlice';
import InputAddonButton from '../../../components/InputAddonButton';
import { DateTime } from 'luxon';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import TimePicker, { TimePickerTime } from './TimePicker';

export interface SingleDateOrDateTimeEditorProperties {
    isEdit: boolean
    editDateId: string
}
function SingleDateOrDateTimeEditor({isEdit, editDateId} : SingleDateOrDateTimeEditorProperties) {
    const createEvent = useSelector((x : { createEvent: CreateEventState }) => x.createEvent);
    const locale = useSelector((x: { i18n: I18nState }) => x.i18n.locale);
    const dispatch = useDispatch();    
    const [isEditorVisible, setEditorVisible] = useState(false);

    const dateService = new DateService(locale, createEvent.dateOnly);

    const classes = (x: string[]) => {
        return x.filter(x => !!x).join(' ')
    };

    let date = (isEdit ? createEvent.dates.find(x => x.id === editDateId)?.date : createEvent.newDate) ?? ''
    const isDateValid = dateService.isValid(date)
    const [calendarDate, setCalendarDate] = useState(isDateValid ? dateService.parse(date).toJSDate() : new Date());
    const dateFilledInAndInvalid = date && !isDateValid
    const dateClasses = ['form-control', 'flex-grow-1', dateFilledInAndInvalid ? 'is-invalid' : ''];

    let setTheDate = (d: string) => {
        if(isEdit) {
            dispatch(setDate({ id: editDateId, date: d}))
        } else {
            dispatch(setNewDate(d));
        }
    }
    
    const dispatchAddDate = () => {
        //Increment by one day or 30 minutes depending on dateonly so you can just keep hitting add and get something that could be useful
        let parsedDate = dateService.parse(date);
        let dateAfter = parsedDate.plus(createEvent.dateOnly ? { days: 1 } : { minutes: 30 });
        let dateAfterFormatted = dateService.formatDateForEdit(dateAfter);
        dispatch(setNewDate(dateAfterFormatted));
        dispatch(addDate(date));
        setCalendarDate(dateAfter.toJSDate());
    }

    const onDateAction = () => {
        if(isEdit) {
            dispatch(removeDate(editDateId));
        } else {
            dispatchAddDate()
        }         
    };

    const onDateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key !== 'Enter' || !isDateValid) {
            return;
        }
        e.preventDefault();
        if(isEdit) {
            return
        }
        dispatchAddDate();     
    };    

    const onDateChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTheDate(e.target.value)
    };
    
    const onToggleEditor = (e: React.SyntheticEvent) => {
        e?.preventDefault();
        setEditorVisible(!isEditorVisible);
        if(!isEditorVisible) {
            setCalendarDate(isDateValid ? dateService.parse(date).toJSDate() : new Date());
        }
    }; 

    const onCalendarDateChanged = (editedCalendarDate: Date) => {
        let newCalendarDate = DateTime.fromJSDate(editedCalendarDate);
        if(isDateValid) {
            let d = dateService.parse(date);
            d = d.set({ year: newCalendarDate.year, month: newCalendarDate.month, day: newCalendarDate.day });
            setTheDate(dateService.formatDateForEdit(d));
        } else {
            newCalendarDate = newCalendarDate.set({ hour: 12, minute: 0, second: 0, millisecond: 0 });
            setTheDate(dateService.formatDateForEdit(newCalendarDate));
        }
    };
    
    const onTimePickerTimeChanged = (newTime: TimePickerTime) => {
        if(isDateValid) {
            let d = dateService.parse(date);
            d = d.set({ hour: newTime.hour, minute: newTime.minute });
            setTheDate(dateService.formatDateForEdit(d));
        } else {
            let d = DateTime.now().set({ hour: newTime.hour, minute: newTime.minute, second: 0, millisecond: 0 })
            setTheDate(dateService.formatDateForEdit(d));
        }        
    }
    
    let editor : JSX.Element = <></>;
    
    if(isEditorVisible) {
        editor = (
            <div className="d-flex flex-column">
                {createEvent.dateOnly ? null : <TimePicker onTimeChanged={onTimePickerTimeChanged} initialDateAndTime={dateService.tryParse(date)} />}
                <Calendar onChange={onCalendarDateChanged} value={calendarDate} locale={locale} />
            </div>
        );
    }

    return (
        <>
        <div className="input-group flex-grow-1" data-testid={isEdit ? 'dateContainer' : null}>
            <InputAddonButton iconType='showCalendar' buttonType='info' onClick={onToggleEditor} />
            <input type="text" className={classes(dateClasses)} onKeyDown={onDateKeyDown}  
                onChange={onDateChanged} value={date} data-testid={isEdit ? 'editDateInput' : 'addInput'}
                placeholder={dateService.getDateFormat('full')} />
            <InputAddonButton iconType={isEdit ? 'removeTime' : 'addTime'} buttonType={isEdit ? 'danger' : 'primary'} 
                testId={isEdit ? 'removeButton' : 'addButton'} onClick={_ => onDateAction()} isDisabled={!isEdit && !isDateValid} />
        </div>        
        {editor}
        </>
    )
}

export default SingleDateOrDateTimeEditor;