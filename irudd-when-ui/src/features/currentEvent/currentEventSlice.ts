import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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
}

interface ExistingEventParticipant {
    id: string
    name: string
}

interface ExistingEventDate {
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
        }
    }
});

export const { setMissingCurrentEvent, setExisitingCurrentEvent, clearCurrentEvent } = currentEventSlice.actions;
export const currentEventSliceReducer = currentEventSlice.reducer;