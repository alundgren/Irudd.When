import { useDispatch, useSelector } from "react-redux"
import { CreateEventState, setDateOnly } from "../createEventSlice";

let containerStyle = {
    gap: '5px',
    maxWidth:450
}

function SelectDateOrDateTime() {
    const dateOnly = useSelector((x : { createEvent: CreateEventState }) => x.createEvent.dateOnly);
    const dispatch = useDispatch();
    
    const onValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setDateOnly(e.currentTarget.value === 'dateOnly'))
        
    };

    return (
        <span className="d-flex fs-5" style={containerStyle}>
            <span className="d-flex flex-grow-1">
                <input className="form-check-input" type="radio" name="dateOrDateTime" value="dateAndTime"
                    data-testid="dateAndTimeInput" checked={!dateOnly} onChange={onValueChanged} />
                <label className="form-check-label">
                    Datum och tid
                </label>
            </span>
            <span className="d-flex flex-grow-1 ps-2">
                <input className="form-check-input" type="radio" name="dateOrDateTime" value="dateOnly"
                    data-testid="dateOnlyInput" checked={dateOnly} onChange={onValueChanged} />
                <label className="form-check-label">
                    Bara datum
                </label>
            </span>            
        </span>
    )
}

export default SelectDateOrDateTime