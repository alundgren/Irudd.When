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

//6 char random string of lower chase chars and ints
const generateItemId = () => Math.random().toString(36).substring(2, 8);

const initialState : CurrentEventState = {

}

const currentEventSlice = createSlice({
    name: 'currentEvent',
    initialState,
    reducers: {
        setCurrentEvent(state, action: PayloadAction<ExistingEvent>) {
            state.event = action.payload
        }
    }
});

export const { setCurrentEvent } = currentEventSlice.actions;
export const currentEventSliceReducer = currentEventSlice.reducer;