import { CreateEventState } from "../features/createEvent/createEventSlice";
import { ExistingEvent } from "../features/currentEvent/currentEventSlice";

const MockDelayMs = 200;

//TODO: Replace with an actual backend
export default class EventService {
    createNewEvent(data: CreateEventState) : Promise<ExistingEvent> {
        const generateItemId = () => Math.random().toString(36).substring(2, 8);
        return new Promise<ExistingEvent>(resolve => {
            setTimeout(() => {
                let eventId = 'e' + generateItemId() + generateItemId();
                let event : ExistingEvent = {
                    id: eventId,
                    participants: data.participants,
                    dateOnly: data.dateOnly,
                    dates: data.dates,
                    description: data.description
                };

                window.localStorage.setItem('event_' + eventId, JSON.stringify(event));

                resolve(event);
            }, MockDelayMs);
        });
    }

    loadExistingEvent(eventId: string) : Promise<ExistingEvent | null> {
        return new Promise<ExistingEvent | null>(resolve => {
            setTimeout(() => {
                let rawData = window.localStorage.getItem('event_' + eventId);
                if(rawData) {
                    console.log(rawData)
                    resolve(JSON.parse(rawData));
                } else {
                    resolve(null);
                }                
            }, MockDelayMs);
        });
    }
}