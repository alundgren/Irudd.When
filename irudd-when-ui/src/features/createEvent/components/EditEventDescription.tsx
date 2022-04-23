import {useDispatch, useSelector} from "react-redux"
import { CreateEventState, setDescription } from "../createEventSlice"
import React from "react";

let containerStyle = {
    maxWidth:450
}

function EditEventDescription() {
    const dispatch = useDispatch()
    const description = useSelector((x : { createEvent: CreateEventState }) => x.createEvent.description)
    const onChange = (e: React.FormEvent<HTMLInputElement>) => {
        dispatch(setDescription(e.currentTarget.value))
    }
    return (
        <span className="d-flex fs-5 flex-grow-1" style={containerStyle}>
            <input className="form-control" type="text" name="eventDescription" placeholder="Kort beskrivning, tex AW med gänget" value={description} onChange={onChange} />
        </span>
    )
}

export default EditEventDescription