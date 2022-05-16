import { CreateEventState } from "../features/createEvent/createEventSlice";
import { Choice, CurrentEventState, ExistingEvent } from "../features/currentEvent/currentEventSlice";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { IEventService, ServerCallback } from "./EventService";
import { Store } from "@reduxjs/toolkit";

export class ApiEventService implements IEventService {
    constructor(private rootUrl: string) {
        if (!rootUrl.startsWith('https')) {
            throw new Error('rootUrl must be https://<...>')
        }
        this.getAbsoluteUrl = this.getAbsoluteUrl.bind(this);
        this.createNewEvent = this.createNewEvent.bind(this);
        this.connection = new HubConnectionBuilder()
            .withUrl(this.getAbsoluteUrl('hubs/events'))
            .withAutomaticReconnect()
            .build();
    }
    
    private connection: HubConnection;
    
    async createNewEvent(data: CreateEventState): Promise<ExistingEvent> {
        let newEvent : ExistingEvent = await this.connection.invoke('CreateEvent', data);
        return newEvent
    }

    async loadExistingEvent(eventId: string): Promise<ExistingEvent | null> {
        let existingEvent : ExistingEvent | null = await this.connection.invoke('GetEvent', eventId);
        return existingEvent
    }

    async setParticipantDateChoice(eventId: string, dateId: string, participantId: string, choice: Choice): Promise<void> {
        let participantChoice = {
            ParticipantId: participantId,
            DateId: dateId,
            Choice: choice
        };
        await this.connection.invoke('SetParticipantDateChoice', eventId, participantChoice);
    }

    setServerCallback(callback: ServerCallback, store: Store): Promise<void> {
        return this.connection.start().then(_ => {
            this.connection.on('EventUpdate', message => {
                callback(message);
            });
            
            //Subscribe to updates on these events
            let getCurrentEventId = () => (store.getState()?.currentEvent as CurrentEventState)?.eventId;
            let joinEventGroup = (eventId : string | null) => {
                if(!eventId) {
                    return
                }
                this.connection.invoke('SubscribeToEventUpdates', eventId);
            };
            let currentEventId = getCurrentEventId();
            if(currentEventId) {
                joinEventGroup(currentEventId);
            }
            store.subscribe(() => {
                let newCurrentEventId = getCurrentEventId();
                if(currentEventId !== newCurrentEventId) {
                    currentEventId = newCurrentEventId;
                    joinEventGroup(currentEventId);
                }
            })
        });
    }

    private getAbsoluteUrl(relativeUrl: string) {
        let url = this.rootUrl
        if (!url.endsWith('/')) {
            url += '/'
        }
        url += relativeUrl.startsWith('/') ? relativeUrl.substring(1) : relativeUrl;
        return url;
    }
}