import {CurrentEventState, setCurrentEvent} from "./currentEventSlice";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {EventService} from "../../services/EventService";
import { useParams } from "react-router-dom";

export function CurrentEvent() {
    const currentEvent = useSelector((x : { currentEvent : CurrentEventState }) => x.currentEvent.event);
    let {eventId} = useParams();
    const dispatch = useDispatch();
    
    useEffect(() => {
        if(eventId && currentEvent?.id !== eventId) {
            let s = new EventService();
            s.loadExistingEvent(eventId).then(x => {
                dispatch(setCurrentEvent(x));
            })
        }
    }, [eventId])
    
    const json = JSON.stringify(currentEvent);
    return (
        <pre>{json}</pre>
    );
}