import {CurrentEventState, setExisitingCurrentEvent, setMissingCurrentEvent } from "./currentEventSlice";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import EventService from "../../services/EventService";
import { useParams } from "react-router-dom";
import IconForButton from "../../components/IconForButton";

export function CurrentEvent() {
    const currentEvent = useSelector((x : { currentEvent : CurrentEventState }) => x.currentEvent);
    let routeEventId = useParams().eventId;

    const dispatch = useDispatch();
    
    useEffect(() => {
        if(routeEventId && currentEvent?.eventId !== routeEventId) {
            let s = new EventService();
            let localRouteEventId = routeEventId;
            s.loadExistingEvent(localRouteEventId).then(x => {
                if(x) {
                    dispatch(setExisitingCurrentEvent(x));
                } else {
                    dispatch(setMissingCurrentEvent(localRouteEventId));
                }
            });
        }
    }, [routeEventId, currentEvent, dispatch])
    
    //http://localhost:3000/event/e9a8wa18dh2sw
    const json = JSON.stringify(currentEvent,null, ' ');
    let containerStyle = {
        
    }
    let timeColumnStyle = {
        width: 100
    }
    let timeColumnClasses = "d-flex justify-content-center align-items-center";

    let result : JSX.Element

    if(!currentEvent.event) {
        if(currentEvent.isMissing) {
            result = <div><a href="/">Skapa ny händelse</a></div>;
        } else {
            result = <div>Laddar...</div>;
        }
    } else {
        result = (
            <div style={{ outline:'1px solid black' }}>
                <div className="d-flex flex-grow-1 p-2 flex-column" style={containerStyle}>
                    <div className="d-flex flex-grow-1 flex-row">
                        <div style={timeColumnStyle} className={timeColumnClasses}>
                            2022-05-03
                        </div>
                        <div style={timeColumnStyle} className={timeColumnClasses}>
                            2022-05-04
                        </div>
                        <div style={timeColumnStyle} className={timeColumnClasses}>
                            2022-05-04
                        </div>                 
                    </div>
                    <div className="d-flex flex-grow-1 flex-row">
                        <div style={timeColumnStyle} className={timeColumnClasses}>
                            12:30
                        </div>
                        <div style={timeColumnStyle} className={timeColumnClasses}>
                            11:30
                        </div>
                        <div style={timeColumnStyle} className={timeColumnClasses}>
                            12:30
                        </div>                 
                    </div>                            
                    <div className="d-flex flex-grow-1 flex-row mt-3">
                        <div className="d-flex flex-grow-1 justify-content-center align-items-center border-bottom">
                            Karl Holger
                        </div>
                    </div>
                    <div className="d-flex flex-grow-1 flex-row mt-1">
                        <div style={timeColumnStyle} className={timeColumnClasses}>
                            <button className="btn btn-warning d-flex justify-content-center align-items-center" type="button">
                                <IconForButton iconType='pendingAnswer' />
                            </button>
                        </div>
                        <div style={timeColumnStyle} className={timeColumnClasses}>
                            <button className="btn btn-success d-flex justify-content-center align-items-center" type="button">
                                <IconForButton iconType='acceptedAnswer' />
                            </button>
                        </div>
                        <div style={timeColumnStyle} className={timeColumnClasses}>
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

    return result;
}