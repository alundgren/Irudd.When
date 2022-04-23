import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import Header from './Header'
import Create from './features/createEvent/CreateEvent'
import { createEventSliceReducer } from './features/createEvent/createEventSlice'

const store = configureStore({
    reducer: createEventSliceReducer
})

let containerStyle = {
    maxWidth:450,
    gap:25
}

function App() {
    return (
        <Provider store={store}>
            <div className="container-fluid d-flex flex-column mt-2" style={containerStyle}>
                <Header />
                <div className="d-flex flex-grow-1 justify-content-center align-items-center">
                    <Create  />
                </div>
            </div>            
        </Provider>        
    );
}

export default App;
