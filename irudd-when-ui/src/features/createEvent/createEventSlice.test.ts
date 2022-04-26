import { AnyAction } from 'redux'
import { createEventSliceReducer, addParticipant, addDate, removeParticipant, removeDate, setDescription, setNewParticipantName } from './createEventSlice'
import { DateTime } from 'luxon'

const createInitialState = () => ({
    newParticipantName: '',
    description: '',
    dateOnly: true,
    participants: [],
    dates: []
})


test('should return the initial state', () => {
    expect(createEventSliceReducer(undefined, {} as AnyAction)).toEqual(createInitialState())
})

test('addParticipant: added participants should have name', () => {
    let newState = createEventSliceReducer(createInitialState(), addParticipant('Kalle'))
    expect(newState.participants[0].name).toEqual('Kalle')
})

test('addParticipant: added participants should have generated id', () => {
    let newState = createEventSliceReducer(createInitialState(), addParticipant('Kalle'))
    expect(newState.participants[0].id).toBeTruthy()
})

test('removeParticipant: participants with matching ids are removed', () => {
    let initialState = { 
        ...createInitialState(),
        participants: [{ name: 'a', id: 'x' }, { name: 'b', id: 'y' }]
    }
    let newState = createEventSliceReducer(initialState, removeParticipant('x'))

    expect(newState.participants[0].name).toBe('b')
})

test('addDate: added date when date only should not have time removed', () => {
    let newDate = DateTime.local(2022, 12, 24, 16, 45, 30, 25)
    let state = {
        ...createInitialState(),
        dateOnly: true
    }
    let newState = createEventSliceReducer(state, addDate(newDate))
    expect(newState.dates[0].date).toEqual(DateTime.local(2022, 12, 24))
})

test('addDate: added date when date and time should not have seconds and milliseconds removed', () => {    
    let newDate = DateTime.local(2022, 12, 24, 16, 45, 30, 25)
    let state = {
        ...createInitialState(),
        dateOnly: false
    }
    let newState = createEventSliceReducer(state, addDate(newDate))
    expect(newState.dates[0].date).toEqual(DateTime.local(2022, 12, 24, 16, 45))
})

test('addDate: added date should have generated id', () => {
    let newState = createEventSliceReducer(createInitialState(), addDate(DateTime.now()))
    expect(newState.dates[0].id).toBeTruthy()
})

test('removeDate: dates with matching ids are removed', () => {
    let initialState = { 
        ...createInitialState(),
        dates: [{ date: DateTime.now(), id: 'x' }, { date: DateTime.now(), id: 'y' }]
    }
    let newState = createEventSliceReducer(initialState, removeDate('x'))

    expect(newState.dates[0].id).toBe('y')
})

test('setDescription: should change the description', () => {
    let newState = createEventSliceReducer(createInitialState(), setDescription('test'))
    expect(newState.description).toEqual('test')
})

test('setNewParticipantName: should change the new participant name', () => {
    let newState = createEventSliceReducer(createInitialState(), setNewParticipantName('test'))
    expect(newState.newParticipantName).toEqual('test')
})
