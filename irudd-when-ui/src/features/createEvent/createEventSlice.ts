import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'

export interface CreateEventState {
    description: string
    dateOnly: boolean
    newParticipantName: string
    participants: EventParticipant[]
    dates: EventDate[]
}

interface EventParticipant {
    id: string
    name: string
}

interface EventDate {
    id: string
    date: string
}

//6 char random string of lower chase chars and ints
const generateItemId = () => Math.random().toString(36).substring(2, 8);

const initialState : CreateEventState = {
    newParticipantName: '',
    description: '',
    dateOnly: true,
    participants: [],
    dates: []
}

const createEventSlice = createSlice({
    name: 'createEvent',
    initialState,
    reducers: {
        addParticipant(state, action: PayloadAction<string>) {
            state.participants.push({ 
                id: generateItemId(),
                name: action.payload
             });
        },
        removeParticipant(state, action: PayloadAction<string>) {
            state.participants = state.participants.filter(x => x.id !== action.payload);
        },
        addDate(state, action: PayloadAction<string>) {
            state.dates.push({ 
                id: generateItemId(),
                date: action.payload
             })
        },
        removeDate(state, action: PayloadAction<string>) {
            state.dates = state.dates.filter(x => x.id !== action.payload);
        },
        setDate(state, action: PayloadAction<{id: string, date: string}>) {
            let date = state.dates.find(x => x.id === action.payload.id);
            if(date) {
                date.date = action.payload.date;
            }            
        },
        setDescription(state, action: PayloadAction<string>) {
            state.description = action.payload;
        },
        setNewParticipantName(state, action: PayloadAction<string>) {
            state.newParticipantName = action.payload;
        },
        setParticipantName(state, action: PayloadAction<{id: string, name: string}>) {
            let participant = state.participants.find(x => x.id === action.payload.id);
            if(participant) {
                participant.name = action.payload.name;
            }
        }
    }
})

export const { addParticipant, addDate, removeParticipant, removeDate, setDescription, setNewParticipantName, setParticipantName, setDate } = createEventSlice.actions
export const createEventSliceReducer = createEventSlice.reducer