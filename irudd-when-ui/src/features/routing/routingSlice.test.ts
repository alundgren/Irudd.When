import { AnyAction } from 'redux'
import { inferPageFromPathName, routingSliceReducer, setRoute } from './routingSlice';

const createInitialState = () => ({
    isNavigating: false,
    current: {
        pageName: 'create'
    }
});

test('should return the initial state', () => {
    expect(routingSliceReducer(undefined, {} as AnyAction)).toEqual(createInitialState());
});

test('setRoute changes the current route', () => {
    const initialState = createInitialState();
    const newState = routingSliceReducer(initialState, setRoute({ pageName: 'event', pageData: '4242' }));
    expect(newState.current).toStrictEqual({ pageName: 'event', pageData: '4242' });
});

test('inferPageFromPathName / is create', () => {
    expect(inferPageFromPathName('/')).toStrictEqual({ pageName: 'create' })
});

test('inferPageFromPathName /create is create', () => {
    expect(inferPageFromPathName('/')).toStrictEqual({ pageName: 'create' })
});

test('inferPageFromPathName /event/4242 is event with data 4242', () => {
    expect(inferPageFromPathName('/event/4242')).toStrictEqual({ pageName: 'event', pageData: '4242' })
});