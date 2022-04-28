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
    const currentRoute = useSelector((x : { routing: RoutingState}) => x.routing.current);
    let body : JSX.Element;

    if(currentRoute.pageName === 'create') {
        body = <Create  />;
    } else if(currentRoute.pageName === 'event') {
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
