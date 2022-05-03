import {CurrentEventState, setCurrentEvent} from "./currentEventSlice";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import EventService from "../../services/EventService";
import { useParams } from "react-router-dom";
import IconForButton from "../../components/IconForButton";

export function CurrentEvent() {
    const currentEvent = useSelector((x : { currentEvent : CurrentEventState }) => x.currentEvent.event);
    let {eventId} = useParams();
    const dispatch = useDispatch();
    
    const currentEventId = currentEvent?.id;
    useEffect(() => {
        if(eventId && currentEventId !== eventId) {
            let s = new EventService();
            s.loadExistingEvent(eventId).then(x => {
                dispatch(setCurrentEvent(x));
            });
        }
    }, [eventId, currentEventId, dispatch])
    
    //http://localhost:3000/event/e9a8wa18dh2sw
    const json = JSON.stringify(currentEvent,null, ' ');
    let containerStyle = {
        
    }
    let timeColumnStyle = {
        width: 100
    }
    return (
        <div style={{ outline:'1px solid black' }}>
            <div className="d-flex flex-grow-1 p-2 flex-column" style={containerStyle}>
                <div className="d-flex flex-grow-1 flex-row">
                    <div style={timeColumnStyle}>
                        2022-05-03
                    </div>
                    <div style={timeColumnStyle}>
                        2022-05-04
                    </div>
                    <div style={timeColumnStyle}>
                        2022-05-04
                    </div>                 
                </div>
                <div className="d-flex flex-grow-1 flex-row">
                    <div style={timeColumnStyle}>
                        12:30
                    </div>
                    <div style={timeColumnStyle}>
                        11:30
                    </div>
                    <div style={timeColumnStyle}>
                        12:30
                    </div>                 
                </div>                            
                <div className="d-flex flex-grow-1 flex-row">
                    <div className="d-flex flex-grow-1 justify-content-center align-items-center">
                        Karl Holger
                    </div>
                </div>
                <div className="d-flex flex-grow-1 flex-row">
                    <div style={timeColumnStyle}>
                        <button className="btn btn-warning d-flex justify-content-center align-items-center" type="button">
                            <IconForButton iconType='pendingAnswer' />
                        </button>
                    </div>
                    <div style={timeColumnStyle}>
                        <button className="btn btn-success d-flex justify-content-center align-items-center" type="button">
                            <IconForButton iconType='acceptedAnswer' />
                        </button>
                    </div>
                    <div style={timeColumnStyle}>
                        <button className="btn btn-danger d-flex justify-content-center align-items-center" type="button">
                            <IconForButton iconType='rejectedAnswer' />
                        </button>
                    </div>                 
                </div>                  
            </div>
            <pre>{json}</pre>
        </div>
        
    );
}