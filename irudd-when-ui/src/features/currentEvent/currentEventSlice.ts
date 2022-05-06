import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Choice = 'unknown' | 'accepted' | 'rejected'

export interface CurrentEventState {
    eventId : string | null
    event : ExistingEvent | null
    isMissing: boolean
}

export interface ExistingEvent {
    id: string
    description: string
    dateOnly: boolean
    participants: ExistingEventParticipant[]
    dates: ExistingEventDate[]
    participantDateChoices: ExistingEventParticipantDateChoice[]
}

export interface ExistingEventParticipantDateChoice {
    dateId: string
    participantId: string
    choice: Choice
}

interface ExistingEventParticipant {
    id: string
    name: string
}

export interface ExistingEventDate {
    id: string
    date: string
}

const initialState : CurrentEventState = {
    eventId: null,
    event: null,
    isMissing: false
}

const currentEventSlice = createSlice({
    name: 'currentEvent',
    initialState,
    reducers: {
        setExisitingCurrentEvent(state, action: PayloadAction<ExistingEvent>) {
            state.eventId = action.payload.id;
            state.event = action.payload;           
            state.isMissing = false;
        },
        setMissingCurrentEvent(state, action: PayloadAction<string>) {
            state.eventId = action.payload;
            state.event = null;
            state.isMissing = true;       
        },        
        clearCurrentEvent(state) {
            state.eventId = null;
            state.event = null;
            state.isMissing = false;
        },
        setParticipantDateChoice(state, action: PayloadAction<ExistingEventParticipantDateChoice>) {
            //TODO: This feels like code smell. The current event abstraction is probably not the right size puzzle piece.
            if(!state.event) {
                return;
            }
            if(!state.event.participantDateChoices) {
                state.event.participantDateChoices = [];
            }
            state.event.participantDateChoices.push(action.payload);
        }
    }
});

export function getCurrentParticipantDateChoice(event: ExistingEvent | null, dateId: string, participantId: string) : Choice {
    if(event === null) {
        return 'unknown';
    }
    
    if(!event.participantDateChoices)
        return 'unknown';

    let hits = event.participantDateChoices.filter(x => x.dateId === dateId && x.participantId === participantId);
    if(hits.length === 0)
        return 'unknown';
    
    return hits[hits.length - 1].choice;
}

export const { setMissingCurrentEvent, setExisitingCurrentEvent, clearCurrentEvent, setParticipantDateChoice } = currentEventSlice.actions;
export const currentEventSliceReducer = currentEventSlice.reducer;