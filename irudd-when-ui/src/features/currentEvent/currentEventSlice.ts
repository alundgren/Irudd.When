import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CurrentEventState {
    event ?: ExistingEvent
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

}

const currentEventSlice = createSlice({
    name: 'currentEvent',
    initialState,
    reducers: {
        setCurrentEvent(state, action: PayloadAction<ExistingEvent>) {
            state.event = action.payload
        },
        clearCurrentEvent(state) {
            state.event = undefined;
        }
    }
});

export const { setCurrentEvent, clearCurrentEvent } = currentEventSlice.actions;
export const currentEventSliceReducer = currentEventSlice.reducer;