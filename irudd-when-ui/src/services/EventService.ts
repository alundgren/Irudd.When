import { Store } from "@reduxjs/toolkit";
import { CreateEventState } from "../features/createEvent/createEventSlice";
import {
    Choice,
    CurrentEventState,
    ExistingEvent,
    ExistingEventParticipantDateChoice,
    setParticipantDateChoice
} from "../features/currentEvent/currentEventSlice";
import LocalStorageEventService from "./LocalStorageEventService";
import { ApiEventService } from "./ApiEventService";

export type ServerCallback = (data: { name: string, payload: any }) => void;

export interface IEventService {
    createNewEvent(data: CreateEventState) : Promise<ExistingEvent>;
    loadExistingEvent(eventId: string) : Promise<ExistingEvent | null>;
    setParticipantDateChoice(eventId: string, dateId: string, participantId: string, choice: Choice) : Promise<void>;
    setServerCallback(callback: ServerCallback, store: Store) : Promise<void>;
}

let eventService : IEventService;

function getEventService() : IEventService {
    if(eventService) {
        return eventService
    }

    if(process.env.REACT_APP_API_URL) {
        eventService = new ApiEventService(process.env.REACT_APP_API_URL);
    } else {
        eventService = new LocalStorageEventService('event_v1_');
    }

    return eventService;
}

export function connectStoreToServerCallbacks(store: Store) : Promise<void> {
    let eventService = getEventService();
    return eventService.setServerCallback(data => {
        if(data.name === 'participantDateChoice') {
            let d : { eventId: string, participantDateChoice: ExistingEventParticipantDateChoice } = data.payload;
            let currentEvent = store.getState().currentEvent as CurrentEventState;
            if(currentEvent.eventId === d.eventId) {
                store.dispatch(setParticipantDateChoice(d.participantDateChoice));
            }
        }
    }, store);
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

    setServerCallback(callback: ServerCallback, store: Store) : Promise<void> {
        return this.service.setServerCallback(callback, store);
    }
}