import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Provider} from "react-redux";
import {createStore} from "../../../store";
import {addDate, setDateOnly} from "../createEventSlice";
import PickEventDates from './PickEventDates';


let store = createStore();

describe('Pick event dates', () => {
    beforeEach(() => {
        store = createStore();
        store.dispatch(setDateOnly(true));
    });

    test('can add valid date using add button', async () => {
        render(
            <Provider store={store}>
                <PickEventDates />
            </Provider>
        );
        const addInput = await screen.findByTestId('addInput');
        userEvent.type(addInput, '2012-12-24');
        const addButton = await screen.findByTestId('addButton');
        userEvent.click(addButton);
        
        expect(await screen.queryAllByTestId('dateContainer')).toHaveLength(1);
    });

    test('cant add invalid date using add button', async () => {
        render(
            <Provider store={store}>
                <PickEventDates />
            </Provider>
        );
        const addInput = await screen.findByTestId('addInput');
        userEvent.type(addInput, '2012-13-24');
        const addButton = await screen.findByTestId('addButton');
        userEvent.click(addButton);
        
        expect(await screen.queryAllByTestId('dateContainer')).toHaveLength(0);
    });    

    test('can add date using enter', async () => {
        render(
            <Provider store={store}>
                <PickEventDates />
            </Provider>
        );
        const addInput = await screen.findByTestId('addInput');
        userEvent.type(addInput, '2012-12-24{enter}');
        
        expect(await screen.queryAllByTestId('dateContainer')).toHaveLength(1);
    });    

    test('new date input is cleared after adding a date', async () => {
        render(
            <Provider store={store}>
                <PickEventDates />
            </Provider>
        );
        const addInput = await screen.findByTestId('addInput') as HTMLInputElement;
        userEvent.type(addInput, '2012-12-24{enter}');

        expect(addInput.value).toBe('');
    });

    test('can remove dates', async () => {
        store.dispatch(addDate('2012-12-24'));
        render(
            <Provider store={store}>
                <PickEventDates />
            </Provider>
        );
        const removeButton = await screen.findByTestId('removeButton');
        userEvent.click(removeButton);

        expect(await screen.queryAllByTestId('dateContainer')).toHaveLength(0);
    });

    test('can edit date', async () => {
        store.dispatch(addDate('2022-12-24'));
        render(
            <Provider store={store}>
                <PickEventDates />
            </Provider>
        );
        const editInput = await screen.findByTestId('editDateInput') as HTMLInputElement;
        userEvent.clear(editInput);
        userEvent.type(editInput, '2022-12-25');

        expect(store.getState().createEvent.dates[0].date).toBe('2022-12-25');
    });    
});