import { CreateEventState } from "../features/createEvent/createEventSlice";
import { Choice, ExistingEvent, ExistingEventParticipantDateChoice } from "../features/currentEvent/currentEventSlice";
import { IEventService, ServerCallback } from "./EventService";

const MockDelayMs = 50;

export default class LocalStorageEventService implements IEventService {
    constructor(private storagePrefix: string) {

    }    

    private onServerCallback: (data: { name: string, payload: any }) => void = () => {
    };

    createNewEvent(data: CreateEventState): Promise<ExistingEvent> {
        const generateItemId = () => Math.random().toString(36).substring(2, 8);
        return new Promise<ExistingEvent>(resolve => {
            setTimeout(() => {
                let eventId = 'e' + generateItemId() + generateItemId();
                let event: ExistingEvent = {
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

    loadExistingEvent(eventId: string): Promise<ExistingEvent | null> {
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
                if (!event) {
                    resolve();
                    return;
                }
                let pChoice = {
                    dateId: dateId,
                    participantId: participantId,
                    choice: choice
                } as ExistingEventParticipantDateChoice;
                if (!event.participantDateChoices) {
                    event.participantDateChoices = []
                }
                event.participantDateChoices.push(pChoice);
                this.saveInLocalStorage(event);
                setTimeout(() => {
                    //Simulating signalr callback
                    this.onServerCallback({
                        name: 'participantDateChoice',
                        payload: {eventId, participantDateChoice: pChoice}
                    })
                }, MockDelayMs);
                resolve();
            }, MockDelayMs);
        });
    }

    setServerCallback(callback: ServerCallback): void {
        this.onServerCallback = callback;
    }

    private getEventFromLocalStorage(eventId: string): ExistingEvent | null {
        let rawData = window.localStorage.getItem(this.storagePrefix + eventId);
        return rawData ? (JSON.parse(rawData) as ExistingEvent) : null;
    }

    private saveInLocalStorage(event: ExistingEvent) {
        window.localStorage.setItem(this.storagePrefix + event.id, JSON.stringify(event));
    }
}