import Header from './Header'
import Create from './Create'

function App() {
    return (
        <div className="container-fluid d-flex flex-column">
            <Header />
            <div className="flex-grow-1">
                <Create  />
            </div>
        </div>        
    );
}

export default App;
