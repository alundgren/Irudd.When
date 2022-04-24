import React from 'react';
import { render, screen } from '@testing-library/react';
import EditEventDescription from "./EditEventDescription";
import {Provider} from "react-redux";
import {createStore} from "../../../store";
import {setDescription} from "../createEventSlice";
import {EnhancedStore} from "@reduxjs/toolkit";

function createTestStore() {
    return createStore();
}

let store : any;

describe('foo', () => {
    beforeEach(() => {
        store = createTestStore();
    });
    
    test('starts with placeholder', async () => {
        store.dispatch(setDescription('Test description'))
        const { findByText } = render(
            <Provider store={store}>
                <EditEventDescription />
            </Provider>
        )        
        await screen.findByDisplayValue('Test description')
    });   
});
