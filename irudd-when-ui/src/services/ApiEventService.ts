import { CreateEventState } from "../features/createEvent/createEventSlice";
import { Choice, ExistingEvent } from "../features/currentEvent/currentEventSlice";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { IEventService, ServerCallback } from "./EventService";

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

    setServerCallback(callback: ServerCallback): void {
        const connection = new HubConnectionBuilder()
            .withUrl(this.getAbsoluteUrl('hubs/events'))
            .withAutomaticReconnect()
            .build();
        connection.start().then(_ => {
            connection.on('EventUpdate', message => {
                callback(message);
            });
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