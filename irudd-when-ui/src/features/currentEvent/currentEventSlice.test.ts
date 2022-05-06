import { AnyAction } from 'redux'
import { currentEventSliceReducer, ExistingEvent, getCurrentParticipantDateChoice, setExisitingCurrentEvent, setParticipantDateChoice } from './currentEventSlice';

const createInitialState = () => ({
    eventId : null,
    event : null,
    isMissing: false
});

const createSimpleEvent = () => ({
        id: 'A424242',
        description: 'Some event',
        dateOnly: true,
        participants: [ { id: 'p1', name: 'Kalle' }, { id: 'p2', name: 'Hobbe' } ],
        dates: [ { id: 'd1', date: '2022-05-04'}, { id: 'd2', date: '2022-05-05'} ],
        participantDateChoices: []
    } as ExistingEvent);

const createSimpleEventState = () => currentEventSliceReducer(
        createInitialState(), 
        setExisitingCurrentEvent(createSimpleEvent()));

test('should return the initial state', () => {
    expect(currentEventSliceReducer(undefined, {} as AnyAction)).toEqual(createInitialState());
});

test('setExisitingCurrentEvent: Sets the current event', () => {
    let state = createSimpleEventState();
    let simpleEvent = createSimpleEvent();
    expect(state).toStrictEqual({
        eventId: simpleEvent.id,
        event: simpleEvent,
        isMissing: false
    });
});

test('setParticipantDateChoice: Uses the latest choice', () => {
    let state = currentEventSliceReducer(
        createSimpleEventState(), 
        setParticipantDateChoice({ dateId: 'd1', participantId: 'p1', choice: 'rejected' }));
    state = currentEventSliceReducer(state, 
        setParticipantDateChoice({ dateId: 'd1', participantId: 'p1', choice: 'accepted' }));
    
    expect(getCurrentParticipantDateChoice(state.event, 'd1', 'p1')).toBe('accepted');    
});