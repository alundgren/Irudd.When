import { CreateEventState } from "../features/createEvent/createEventSlice";
import { ExistingEvent } from "../features/currentEvent/currentEventSlice";

interface IEventService {
    createNewEvent(data: CreateEventState) : Promise<ExistingEvent>;
    loadExistingEvent(eventId: string) : Promise<ExistingEvent | null>;
}

function getEventService() : IEventService {
    if(process.env.REACT_APP_API_URL) {
        return new ApiEventService(process.env.REACT_APP_API_URL);
    } else {
        return new LocalStorageEventService('event_v1_');
    }
}

//This is a class since I could not get jest.spyOn to work with exporting getEventService and mocking that which is what I wanted to do.
export default class EventService implements IEventService {
    private service: IEventService;

    constructor() {
        this.service = getEventService();
        this.createNewEvent = this.createNewEvent.bind(this);
        this.loadExistingEvent = this.loadExistingEvent.bind(this);
    }

    createNewEvent(data: CreateEventState) : Promise<ExistingEvent> {
        return this.service.createNewEvent(data);
    }

    loadExistingEvent(eventId: string) : Promise<ExistingEvent | null> {
        return this.service.loadExistingEvent(eventId);
    }
}

class ApiEventService implements IEventService {
    constructor(private rootUrl: string) {
        if(!rootUrl.startsWith('https')) {
            throw new Error('rootUrl must be https://<...>')
        }
        this.getAbsoluteUrl = this.getAbsoluteUrl.bind(this);
        this.createNewEvent = this.createNewEvent.bind(this);
    }

    async createNewEvent(data: CreateEventState) : Promise<ExistingEvent> {
        let response = await window.fetch(this.getAbsoluteUrl('api/v1/create-event'), {
            method: 'POST',
            headers: {
            'content-type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify(data),
        });
        if(!response.ok) {
            throw new Error(response.statusText)
        }
        let result = (await response.json()) as ExistingEvent
        return result
    }

    async loadExistingEvent(eventId: string) : Promise<ExistingEvent | null> {
        let response = await window.fetch(this.getAbsoluteUrl(`api/v1/event/${eventId}`), {
            method: 'GET',
            headers: {
            'content-type': 'application/json;charset=UTF-8',
            }
        })
        if(response.status === 404) {
            return null;
        } else if(!response.ok) {
            throw new Error(response.statusText)
        } else {
            let result = (await response.json()) as ExistingEvent;
            return result;
        }
    }

    private getAbsoluteUrl(relativeUrl: string) {
        let url = this.rootUrl
        if(!url.endsWith('/')) {
            url += '/'
        }
        url += relativeUrl.startsWith('/') ? relativeUrl.substring(1) : relativeUrl;
        return url;
    }
}

const MockDelayMs = 50;
class LocalStorageEventService implements IEventService {
    constructor(private storagePrefix: string) {

    }
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
                    description: data.description,
                    participantDateChoices: []
                };

                window.localStorage.setItem(this.storagePrefix + eventId, JSON.stringify(event));

                resolve(event);
            }, MockDelayMs);
        });
    }

    loadExistingEvent(eventId: string) : Promise<ExistingEvent | null> {
        return new Promise<ExistingEvent | null>(resolve => {
            setTimeout(() => {
                let rawData = window.localStorage.getItem(this.storagePrefix + eventId);
                if(rawData) {
                    resolve(JSON.parse(rawData));
                } else {
                    resolve(null);
                }                
            }, MockDelayMs);
        });
    }
}