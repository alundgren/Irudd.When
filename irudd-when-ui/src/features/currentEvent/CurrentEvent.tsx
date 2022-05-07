import {
    Choice,
    CurrentEventState,
    getCurrentParticipantDateChoice,
    setExisitingCurrentEvent,
    setMissingCurrentEvent,
    setParticipantDateChoice
} from "./currentEventSlice";
import {useDispatch, useSelector} from "react-redux";
import React, {SyntheticEvent, useEffect } from "react";
import EventService from "../../services/EventService";
import { useParams } from "react-router-dom";
import IconForButton from "../../components/IconForButton";
import { DateService } from "../../services/DateService";
import { I18nState } from "../i18n/i18nSlice";

export function CurrentEvent() {
    const locale = useSelector((x: { i18n: I18nState }) => x.i18n.locale);
    const currentEvent = useSelector((x : { currentEvent : CurrentEventState }) => x.currentEvent);
    let routeEventId = useParams().eventId;    
    const dispatch = useDispatch();
    
    useEffect(() => {
        if(routeEventId && currentEvent?.eventId !== routeEventId) {            
            let localRouteEventId = routeEventId;
            let s = new EventService();
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
    let containerStyle = {
        
    }
    let timeColumnStyle = {
        width: 100
    }
    let timeColumnClasses = "d-flex justify-content-center align-items-center";

    let result : JSX.Element    

    if(currentEvent.event) {
        let event = currentEvent.event;
        let dateService = new DateService(locale, event.dateOnly);
        
        let dateRow = (
            <div className="d-flex flex-grow-1 flex-row justify-content-between">
                {event.dates.map(x => (
                    <div style={timeColumnStyle} className={timeColumnClasses} key={"d" + x.id}>
                        {dateService.formatForDisplay(x.date, 'dateOnly')}
                    </div>
                ))}
            </div>
        );

        let timeRow = !event.dateOnly ? (
            <div className="d-flex flex-grow-1 flex-row justify-content-between">
                {event.dates.map(x => (
                    <div style={timeColumnStyle} className={timeColumnClasses} key={"t" + x.id}>
                        {dateService.formatForDisplay(x.date, 'timeOnly')}
                    </div>
                ))}
            </div>
        ) : null;

        let onChoiceClicked = (evt : SyntheticEvent, dateId: string, participantId: string) => {
            evt?.preventDefault();
            let currentChoice = getCurrentParticipantDateChoice(event, dateId, participantId);
            let nextChoice : Choice = currentChoice === 'unknown' ? 'accepted' : (currentChoice === 'accepted' ? 'rejected' : 'unknown');            
            let s = new EventService();
            dispatch(setParticipantDateChoice({ dateId, participantId, choice: nextChoice }));
            s.setParticipantDateChoice(event.id, dateId, participantId, nextChoice);
        };

        let getChoiceButtonIconType = (dateId: string, participantId: string) => {
            let choice = getCurrentParticipantDateChoice(event, dateId, participantId);
            if(choice === 'accepted') {
                return 'acceptedAnswer';
            } else if(choice === 'rejected') {
                return 'rejectedAnswer';
            } else {
                return 'pendingAnswer';
            }
        }

        let getChoiceButtonClass = (dateId: string, participantId: string) => {
            let btnType = 'warning';
            let choice = getCurrentParticipantDateChoice(event, dateId, participantId);
            if(choice === 'accepted') {
                btnType = 'success';
            } else if(choice === 'rejected') {
                btnType = 'danger';
            }
            return `btn btn-${btnType} d-flex justify-content-center align-items-center`;
        };

        let participants = event.participants.map(participant => (<React.Fragment key={participant.id}>
            <div className="d-flex flex-grow-1 flex-row mt-5">
                <div className="d-flex flex-grow-1 justify-content-center align-items-center border-bottom fst-italic">
                    {participant.name}
                </div>
            </div>
            <div className="d-flex flex-grow-1 flex-row mt-1 justify-content-between">
                {event.dates.map(date => (
                    <div style={timeColumnStyle} className={timeColumnClasses} key={date.id + "#" + participant.id}>
                        <button className={getChoiceButtonClass(date.id, participant.id)}
                            type="button" onClick={(e) => onChoiceClicked(e, date.id, participant.id)}>
                            <IconForButton iconType={getChoiceButtonIconType(date.id, participant.id)} />
                        </button>
                    </div>
                ))}
            </div>
        </React.Fragment>));

        result = (
            <div className="d-flex flex-grow-1 p-2 flex-column" style={containerStyle}>
                {dateRow}
                {timeRow}
                {participants}
            </div>
        );      
    } else {
        if(currentEvent.isMissing) {
            result = <div><a href="/">Skapa ny händelse</a></div>;
        } else {
            result = <div>Laddar...</div>;
        }
    }

    return result;
}