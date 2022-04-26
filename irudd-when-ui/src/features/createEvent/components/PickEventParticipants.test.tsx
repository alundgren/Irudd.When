import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Provider} from "react-redux";
import {createStore} from "../../../store";
import {addParticipant} from "../createEventSlice";
import PickEventParticipants from './PickEventParticipants';

let store = createStore();

describe('Pick event participants', () => {
    beforeEach(() => {
        store = createStore();
    });

    test('can add participants', async () => {
        render(
            <Provider store={store}>
                <PickEventParticipants />
            </Provider>
        );
        const addInput = await screen.findByTestId('addInput');
        userEvent.type(addInput, 'Some person');
        const addButton = await screen.findByTestId('addButton');
        userEvent.click(addButton);

        expect(await screen.queryAllByTestId('participantContainer')).toHaveLength(1);
    });

    test('name input is cleared after adding a participant', async () => {
        render(
            <Provider store={store}>
                <PickEventParticipants />
            </Provider>
        );
        const addInput = await screen.findByTestId('addInput') as HTMLInputElement;
        userEvent.type(addInput, 'Some person');
        const addButton = await screen.findByTestId('addButton');
        userEvent.click(addButton);

        expect(addInput.value).toBe('');
    });    

    test('can remove participants', async () => {
        store.dispatch(addParticipant('Some person'));
        render(
            <Provider store={store}>
                <PickEventParticipants />
            </Provider>
        );
        const removeButton = await screen.findByTestId('removeButton');
        userEvent.click(removeButton);

        expect(await screen.queryAllByTestId('participantContainer')).toHaveLength(0);
    });    
});