import { AnyAction } from 'redux'
import { i18nSliceReducer, setLocale } from './i18nSlice';

const createInitialState = () => ({
    locale: 'sv-SE'
});

test('should return the initial state', () => {
    expect(i18nSliceReducer(undefined, {} as AnyAction)).toEqual(createInitialState());
});

test('setLocale changes the locale', () => {
    const initialState = createInitialState();
    const newState = i18nSliceReducer(initialState, setLocale('en-US'));
    expect(newState.locale).toBe('en-US');
});
