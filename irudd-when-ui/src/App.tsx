import Header from './Header'
import Create from './features/createEvent/CreateEvent'
import { RoutingState } from './features/routing/routingSlice';
import { useSelector } from 'react-redux';
import {CurrentEvent} from "./features/currentEvent/CurrentEvent";

let containerStyle = {
    maxWidth:450,
    gap:25
}

function App() {
    const routing = useSelector((x : { routing: RoutingState}) => x.routing);
    
    let body : JSX.Element;

    if(routing.isNavigating) {
        body = <div>Loading...</div>;
    }
    if(routing.current.pageName === 'create') {
        body = <Create  />;
    } else if(routing.current.pageName === 'event') {
        body = <CurrentEvent />;
    } else {
        //TODO: Prettify
        body = <div>TODO: Länk till skapa ny</div>
    }

    return (
        <div className="container-fluid d-flex flex-column mt-2" style={containerStyle}>
            <Header />
            <div className="d-flex flex-grow-1 justify-content-center align-items-center">
                {body}
            </div>
        </div>            
    );
}

export default App;
