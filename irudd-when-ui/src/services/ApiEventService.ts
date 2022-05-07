import { CreateEventState } from "../features/createEvent/createEventSlice";
import { Choice, CurrentEventState, ExistingEvent } from "../features/currentEvent/currentEventSlice";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { IEventService, ServerCallback } from "./EventService";
import { Store } from "@reduxjs/toolkit";

export class ApiEventService implements IEventService {
    constructor(private rootUrl: string) {
        if (!rootUrl.startsWith('https')) {
            throw new Error('rootUrl must be https://<...>')
        }
        this.getAbsoluteUrl = this.getAbsoluteUrl.bind(this);
        this.createNewEvent = this.createNewEvent.bind(this);
    }

    async createNewEvent(data: CreateEventState): Promise<ExistingEvent> {
        let response = await window.fetch(this.getAbsoluteUrl('api/v1/create-event'), {
            method: 'POST',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        return (await response.json()) as ExistingEvent
    }

    async loadExistingEvent(eventId: string): Promise<ExistingEvent | null> {
        let response = await window.fetch(this.getAbsoluteUrl(`api/v1/event/${eventId}`), {
            method: 'GET',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            }
        })
        if (response.status === 404) {
            return null;
        } else if (!response.ok) {
            throw new Error(response.statusText)
        } else {
            return (await response.json()) as ExistingEvent;
        }
    }

    async setParticipantDateChoice(eventId: string, dateId: string, participantId: string, choice: Choice): Promise<void> {
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
        if (!response.ok) {
            throw new Error(response.statusText)
        }
    }

    setServerCallback(callback: ServerCallback, store: Store): void {
        const connection = new HubConnectionBuilder()
            .withUrl(this.getAbsoluteUrl('hubs/events'))
            .withAutomaticReconnect()
            .build();
        connection.start().then(_ => {
            connection.on('EventUpdate', message => {
                callback(message);
            });
            
            //Subscribe to updates on these events
            let getCurrentEventId = () => (store.getState()?.currentEvent as CurrentEventState)?.eventId;
            let joinEventGroup = (eventId : string | null) => {
                if(!eventId) {
                    return
                }
                connection.invoke('SubscribeToEventUpdates', eventId);
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