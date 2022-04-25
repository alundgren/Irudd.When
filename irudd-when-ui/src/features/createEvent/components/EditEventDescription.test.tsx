import { render, screen } from '@testing-library/react';
import EditEventDescription from "./EditEventDescription";
import {Provider} from "react-redux";
import {createStore} from "../../../store";
import {setDescription} from "../createEventSlice";
import userEvent from '@testing-library/user-event';

let store = createStore();

describe('Edit description', () => {
    beforeEach(() => {
        store = createStore();
    });

    test('setDescription action changes the value', () => {
        store.dispatch(setDescription('Test description'));
        render(
            <Provider store={store}>
                <EditEventDescription />
            </Provider>
        );
        expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
    });

    test('changing the value dispatches setDescription', async () =>{
        render(
            <Provider store={store}>
                <EditEventDescription />
            </Provider>
        );
        const description = await screen.findByTestId('description');
        userEvent.type(description, 'test123');
        expect(store.getState().createEvent.description).toEqual('test123')
    });
});
