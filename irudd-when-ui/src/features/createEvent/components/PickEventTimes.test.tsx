import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Provider} from "react-redux";
import {createStore} from "../../../store";
import {addDate, setDate, removeDate} from "../createEventSlice";
import PickEventTimes from './PickEventTimes';


let store = createStore();

describe('Pick event times', () => {
    beforeEach(() => {
        store = createStore();
    });
/*
    test('can add times using add button', async () => {
        render(
            <Provider store={store}>
                <PickEventTimes />
            </Provider>
        );
        const addInput = await screen.findByTestId('addInput');
        userEvent.type(addInput, '2022-12-24 16:30');
        const addButton = await screen.findByTestId('addButton');
        userEvent.click(addButton);

        expect(await screen.queryAllByTestId('timeContainer')).toHaveLength(1);
    });    
    */
});