import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'

interface CreateEventState {
    dateOnly: boolean
    participants: EventParticipant[]
    dates: EventDate[]
}

interface EventParticipant {
    id: string
    name: string
}

interface EventDate {
    id: string
    date: DateTime
}

const initialState : CreateEventState = { 
    dateOnly: true,
    participants: [],
    dates: []
}

const generateItemId = () => Math.random().toString(36).substring(2, 8) //random string like nruam1

const normalizeEventDate = (date: DateTime, dateOnly: boolean) => dateOnly 
    ? date.startOf('day')
    : date.startOf('minute')

const createEventSlice = createSlice({
    name: 'createEvent',
    initialState,
    reducers: {
        addParticipant(state, action: PayloadAction<string>) {
            state.participants.push({ 
                id: generateItemId(),
                name: action.payload
             })
        },
        removeParticipant(state, action: PayloadAction<string>) {
            state.participants = state.participants.filter(x => x.id !== action.payload)
        },
        addDate(state, action: PayloadAction<DateTime>) {
            state.dates.push({ 
                id: generateItemId(),
                date: normalizeEventDate(action.payload, state.dateOnly)
             })
        },
        removeDate(state, action: PayloadAction<string>) {
            state.dates = state.dates.filter(x => x.id !== action.payload)
        }
    }
})

export const { addParticipant, addDate, removeParticipant, removeDate } = createEventSlice.actions
export default createEventSlice.reducer