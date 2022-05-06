import { Store } from "@reduxjs/toolkit";
import { CreateEventState } from "../features/createEvent/createEventSlice";
import { Choice, CurrentEventState, ExistingEvent, ExistingEventParticipantDateChoice, setParticipantDateChoice } from "../features/currentEvent/currentEventSlice";

type ServerCallback = (data: { name: string, payload: any }) => void;

interface IEventService {
    createNewEvent(data: CreateEventState) : Promise<ExistingEvent>;
    loadExistingEvent(eventId: string) : Promise<ExistingEvent | null>;
    setParticipantDateChoice(eventId: string, dateId: string, participantId: string, choice: Choice) : Promise<void>;
    setServerCallback(callback: ServerCallback) : void;
}

let eventService : IEventService;

function getEventService() : IEventService {
    if(eventService) {
        return eventService
    }

    if(process.env.REACT_APP_API_URL) {
        eventService = new ApiEventService(process.env.REACT_APP_API_URL);
    } else {
        let localService = new LocalStorageEventService('event_v1_');
        eventService = localService;
    }

    return eventService;
}

export function connectStoreToServerCallbacks(store: Store) {
    let eventService = getEventService();
    eventService.setServerCallback(data => {
        if(data.name === 'participantDateChoice') {
            let d : { eventId: string, participantDateChoice: ExistingEventParticipantDateChoice } = data.payload;
            let currentEvent = store.getState().currentEvent as CurrentEventState;
            if(currentEvent.eventId === d.eventId) {
                store.dispatch(setParticipantDateChoice(d.participantDateChoice));
            }
        }
    });
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

    setParticipantDateChoice(eventId: string, dateId: string, participantId: string, choice: Choice) : Promise<void> {
        return this.service.setParticipantDateChoice(eventId, dateId, participantId, choice);
    }

    setServerCallback(callback: ServerCallback) : void {
        return this.service.setServerCallback(callback);
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

    async setParticipantDateChoice(eventId: string, dateId: string, participantId: string, choice: Choice) : Promise<void> {
        let response = await window.fetch(this.getAbsoluteUrl('api/v1/set-participant-date-choice'), {
            method: 'POST',
            headers: {
            'content-type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({
                EventId: eventId,
                Choice: {
                    ParticipantId: participantId,
                    DateId: dateId,
                    Choice: choice
                }
            }),
        });
        if(!response.ok) {
            throw new Error(response.statusText)
        }
    }

    setServerCallback(callback: ServerCallback) : void {
        
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

    private onServerCallback : (data: { name: string, payload: any }) => void = () => {};

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

                this.saveInLocalStorage(event);

                resolve(event);
            }, MockDelayMs);
        });
    }

    loadExistingEvent(eventId: string) : Promise<ExistingEvent | null> {
        return new Promise<ExistingEvent | null>(resolve => {
            setTimeout(() => {
                let event = this.getEventFromLocalStorage(eventId);
                resolve(event);
            }, MockDelayMs);
        });
    }

    setParticipantDateChoice(eventId: string, dateId: string, participantId: string, choice: Choice) {
        return new Promise<void>(resolve => {
            setTimeout(() => {
                let event = this.getEventFromLocalStorage(eventId);
                if(!event) {
                    resolve();
                    return;
                }
                let pChoice = { dateId: dateId, participantId: participantId, choice: choice } as ExistingEventParticipantDateChoice;
                if(!event.participantDateChoices) {
                    event.participantDateChoices = []
                }
                event.participantDateChoices.push(pChoice);
                this.saveInLocalStorage(event);
                setTimeout(() => {
                    //Simulating signalr callback
                    this.onServerCallback({ name: 'participantDateChoice', payload: { eventId, participantDateChoice: pChoice } })
                }, MockDelayMs);
                resolve();
            }, MockDelayMs);
        });
    }

    setServerCallback(callback: ServerCallback) : void {
        this.onServerCallback = callback;
    }

    private getEventFromLocalStorage(eventId: string) : ExistingEvent | null {
        let rawData = window.localStorage.getItem(this.storagePrefix + eventId);
        return rawData ? (JSON.parse(rawData) as ExistingEvent) : null;
    }

    private saveInLocalStorage(event: ExistingEvent) {
        window.localStorage.setItem(this.storagePrefix + event.id, JSON.stringify(event));
    }
}