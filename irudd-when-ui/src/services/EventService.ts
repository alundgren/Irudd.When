import { CreateEventState } from "../features/createEvent/createEventSlice";
import { ExistingEvent } from "../features/currentEvent/currentEventSlice";

const MockDelayMs = 200;


/*
const response = window.fetch('https://localhost:7095/api/v1/create-event', {
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify({ id: 'test' }),
  })
*/

/*
const response = window.fetch('https://localhost:7095/api/v1/event/A424224', {
    method: 'GET',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    }
  })
*/


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