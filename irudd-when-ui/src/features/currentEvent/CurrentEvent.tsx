import {CurrentEventState, setCurrentEvent} from "./currentEventSlice";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import EventService from "../../services/EventService";
import { useParams } from "react-router-dom";

export function CurrentEvent() {
    const currentEvent = useSelector((x : { currentEvent : CurrentEventState }) => x.currentEvent.event);
    let {eventId} = useParams();
    const dispatch = useDispatch();
    
    const currentEventId = currentEvent?.id;
    useEffect(() => {
        if(eventId && currentEventId !== eventId) {
            let s = new EventService();
            s.loadExistingEvent(eventId).then(x => {
                dispatch(setCurrentEvent(x));
            });
        }
    }, [eventId, currentEventId, dispatch])
    
    const json = JSON.stringify(currentEvent);
    return (
        <pre>{json}</pre>
    );
}