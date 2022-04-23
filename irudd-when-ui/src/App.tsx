import Header from './Header'
import Create from './features/createEvent/CreateEvent'

let containerStyle = {
    maxWidth:450,
    gap:25
}

function App() {
    return (
        <div className="container-fluid d-flex flex-column mt-2" style={containerStyle}>
            <Header />
            <div className="d-flex flex-grow-1 justify-content-center align-items-center">
                <Create  />
            </div>
        </div>            
    );
}

export default App;
