import { render, screen } from '@testing-library/react';
import App from './App';
import { createStore } from './store';
import { Provider } from 'react-redux';

let store = createStore();

describe('App', () => {
    beforeEach(() => {
        store = createStore();
    });

    test('expect initial page to be create', async () => {
        render(
            <Provider store={store}>
                <App />
            </Provider>
        );

        const element = screen.getByText(/Ny händelse/i);

        expect(element).toBeInTheDocument();
    });
});