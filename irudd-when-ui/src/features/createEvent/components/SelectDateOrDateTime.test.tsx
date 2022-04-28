import { render, screen } from '@testing-library/react';
import {Provider} from "react-redux";
import {createStore} from "../../../store";
import {setDateOnly } from "../createEventSlice";
import userEvent from '@testing-library/user-event';
import SelectDateOrDateTime from './SelectDateOrDateTime';

let store = createStore();

describe('select date or date and time', () => {
    beforeEach(() => {
        store = createStore();
    });

    test('Picking date and time should set dateOnly = false', async () => {
        store.dispatch(setDateOnly(true));
        render(
            <Provider store={store}>
                <SelectDateOrDateTime />
            </Provider>
        );
        const dateAndTimeInput = (await screen.findByTestId('dateAndTimeInput')) as HTMLInputElement;
        dateAndTimeInput.click();
        expect(store.getState().createEvent.dateOnly).toBe(false);
    });

    test('Picking date should set dateOnly = true', async () => {
        store.dispatch(setDateOnly(false));
        render(
            <Provider store={store}>
                <SelectDateOrDateTime />
            </Provider>
        );
        const dateAndTimeInput = (await screen.findByTestId('dateOnlyInput')) as HTMLInputElement;
        dateAndTimeInput.click();
        expect(store.getState().createEvent.dateOnly).toBe(true);
    });    
});
