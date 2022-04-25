import { render, screen } from '@testing-library/react';
import EditEventDescription from "./EditEventDescription";
import {Provider} from "react-redux";
import {createStore} from "../../../store";
import {setDescription} from "../createEventSlice";
import userEvent from '@testing-library/user-event';

let store = createStore();

describe('Pick event participants', () => {
    beforeEach(() => {
        store = createStore();
    });
});