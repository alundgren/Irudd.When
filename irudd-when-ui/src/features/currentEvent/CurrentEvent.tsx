import {CurrentEventState} from "./currentEventSlice";
import {useSelector} from "react-redux";

export function CurrentEvent() {
    const currentEvent = useSelector((x : { currentEvent : CurrentEventState }) => x.currentEvent.event);
    const json = JSON.stringify(currentEvent);
    return (
        <pre>{json}</pre>
    );
}