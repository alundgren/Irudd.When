import { AnyAction } from 'redux'
import { createEventSliceReducer, addParticipant, addDate, removeParticipant, removeDate, setDescription, setNewParticipantName, setParticipantName, setDate, setNewDate } from './createEventSlice'
import { DateTime } from 'luxon'

const createInitialState = () => ({
    newParticipantName: '',
    newDate: '',
    description: '',
    dateOnly: true,
    participants: [],
    dates: []
});

test('should return the initial state', () => {
    expect(createEventSliceReducer(undefined, {} as AnyAction)).toEqual(createInitialState());
})

test('addParticipant: added participants should have name', () => {
    let newState = createEventSliceReducer(createInitialState(), addParticipant('Kalle'));
    expect(newState.participants[0].name).toEqual('Kalle');
})

test('addParticipant: added participants should have generated id', () => {
    let newState = createEventSliceReducer(createInitialState(), addParticipant('Kalle'));
    expect(newState.participants[0].id).toBeTruthy();
})

test('removeParticipant: participants with matching ids are removed', () => {
    let initialState = { 
        ...createInitialState(),
        participants: [{ name: 'a', id: 'x' }, { name: 'b', id: 'y' }]
    };
    let newState = createEventSliceReducer(initialState, removeParticipant('x'));

    expect(newState.participants[0].name).toBe('b');
})

test('addDate: added date should have generated id', () => {
    let newState = createEventSliceReducer(createInitialState(), addDate('2022-12-12'));
    expect(newState.dates[0].id).toBeTruthy();
});

test('removeDate: dates with matching ids are removed', () => {
    let initialState = { 
        ...createInitialState(),
        dates: [{ date: '2022-12-12', id: 'x' }, { date: '2022-12-20', id: 'y' }]
    };
    let newState = createEventSliceReducer(initialState, removeDate('x'));

    expect(newState.dates[0].id).toBe('y');
});

test('setDate: should change the date with matching id', () => {
    let initialState = { 
        ...createInitialState(),
        dates: [{ date: '2022-12-12', id: 'x' }, { date: '2022-12-20', id: 'y' }]
    };
    let newState = createEventSliceReducer(initialState, setDate({ id: 'y', date: '2022-12-21' }));

    expect(newState.dates[1].date).toBe('2022-12-21');
});

test('setNewDate: should change the new date', () => {
    let newState = createEventSliceReducer(createInitialState(), setNewDate('2022-12-23'));
    expect(newState.newDate).toEqual('2022-12-23');
});

test('setDescription: should change the description', () => {
    let newState = createEventSliceReducer(createInitialState(), setDescription('test'));
    expect(newState.description).toEqual('test');
});

test('setNewParticipantName: should change the new participant name', () => {
    let newState = createEventSliceReducer(createInitialState(), setNewParticipantName('test'));
    expect(newState.newParticipantName).toEqual('test');
});

test('setParticipantName: should edit matching by id', () => {
    let state = {
        ...createInitialState(),
        participants: [{ id: '1', name: 'foo1' }, { id: '2', name: 'foo2' }]
    };    
    let newState = createEventSliceReducer(state, setParticipantName({ id: '2', name: 'bar2' }));
    expect(newState.participants[1].name).toBe('bar2');
});
