import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createStore } from '../../store';
import CreateEvent from "./CreateEvent";
import { addDate, addParticipant, setDateOnly, setDescription } from "./createEventSlice";
import React from "react";
import EventService from "../../services/EventService";

let store = createStore();

describe('Create event', () => {
    beforeEach(() => {
        store = createStore();        
        //NOTE: Want this in beforeAll but that does not work
        jest.spyOn(EventService.prototype, 'createNewEvent')
            .mockResolvedValue({ id: 'a42', description: 'test', participants: [], dates: [], dateOnly: false });
    });
    
    afterEach(() => {
        jest.restoreAllMocks();    
    });
    
    test('can create event', async () => {
        store.dispatch(setDateOnly(true));
        store.dispatch(setDescription('Test'));
        store.dispatch(addParticipant('Kalle'));
        store.dispatch(addDate('2021-12-12'));
       
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={["/"]}>
                    <Routes>
                        <Route path="/" element={<CreateEvent />} />
                        <Route path="event/a42" element={<div>Test event</div>} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const createButton = await screen.findByTestId('createButton');
        userEvent.click(createButton);
        await waitFor(() => {
            const element = screen.getByText(/Test event/i);
            expect(element).toBeInTheDocument();
        });        
    });
});