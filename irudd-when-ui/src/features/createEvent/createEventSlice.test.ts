import { AnyAction } from 'redux'
import reducer, { addParticipant, addDate, removeParticipant, removeDate } from './createEventSlice'
import { DateTime } from 'luxon'

const createExpectedInitialState = () => ({
    dateOnly: true,
    participants: [],
    dates: []
})
    

test('should return the initial state', () => {
    expect(reducer(undefined, {} as AnyAction)).toEqual(createExpectedInitialState())
})

test('addParticipant: added participants should have name', () => {
    let newState = reducer(createExpectedInitialState(), addParticipant('Kalle'))
    expect(newState.participants[0].name).toEqual('Kalle')
})

test('addParticipant: added participants should have generated id', () => {
    let newState = reducer(createExpectedInitialState(), addParticipant('Kalle'))
    expect(newState.participants[0].id).toBeTruthy()
})

test('removeParticipant: participants with matching ids are removed', () => {
    let initialState = { 
        ...createExpectedInitialState(),
        participants: [{ name: 'a', id: 'x' }, { name: 'b', id: 'y' }]
    }
    let newState = reducer(initialState, removeParticipant('x'))

    expect(newState.participants[0].name).toBe('b')
})

test('addDate: added date when date only should not have time removed', () => {
    let newDate = DateTime.local(2022, 12, 24, 16, 45, 30, 25)
    let state = {
        ...createExpectedInitialState(),
        dateOnly: true
    }
    let newState = reducer(state, addDate(newDate))
    expect(newState.dates[0].date).toEqual(DateTime.local(2022, 12, 24))
})

test('addDate: added date when date and time should not have seconds and milliseconds removed', () => {
    let newDate = DateTime.local(2022, 12, 24, 16, 45, 30, 25)
    let state = {
        ...createExpectedInitialState(),
        dateOnly: false
    }
    let newState = reducer(state, addDate(newDate))
    expect(newState.dates[0].date).toEqual(DateTime.local(2022, 12, 24, 16, 45))
})

test('addDate: added date should have generated id', () => {
    let newState = reducer(createExpectedInitialState(), addDate(DateTime.now()))
    expect(newState.dates[0].id).toBeTruthy()
})

test('removeDate: dates with matching ids are removed', () => {
    let initialState = { 
        ...createExpectedInitialState(),
        dates: [{ date: DateTime.now(), id: 'x' }, { date: DateTime.now(), id: 'y' }]
    }
    let newState = reducer(initialState, removeDate('x'))

    expect(newState.dates[0].id).toBe('y')
})
