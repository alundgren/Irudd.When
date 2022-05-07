import React, { SyntheticEvent, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { CurrentEventState } from "./features/currentEvent/currentEventSlice";
import { showToast } from "./features/toasts/toastsSlice";

let containerStyle = {
    gap: 15
}
let logoStyle = {
    height: 45,
    width: 45
}

function Header() {
    const location = useLocation();
 
    const currentEvent = useSelector((x : { currentEvent : CurrentEventState }) => x.currentEvent);
    
    let dispatch = useDispatch();
    let [showShare, setShowShare] = useState(false);    
    
    let shareIcon = <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" fill="currentColor" className="bi bi-box-arrow-up" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1h-2z"/>
        <path fillRule="evenodd" d="M7.646.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 1.707V10.5a.5.5 0 0 1-1 0V1.707L5.354 3.854a.5.5 0 1 1-.708-.708l3-3z"/>
    </svg>
    
    let shareIconStyles = {
        display: 'inline-block',
        width: '1.5em',
        height: '1.5em',
        cursor:'pointer'
    }
 
    let titlePart : JSX.Element;    
    if(location.pathname === '/create' || location.pathname === '/') {
        titlePart = (<>
            <div className="flex-grow-1 align-self-center">Ny händelse</div>
        </>);
    } else if(location.pathname.startsWith('/event')) {
        if(currentEvent?.event) {
            const onShareClicked = (e: SyntheticEvent) => {
                setShowShare(!showShare);
            };
            
            const onUrlFocused = (e: React.FocusEvent) => {
                //TODO: Make sure the toast is only sent once when tabbing out and back
                let inputElement = e.target as HTMLInputElement;
                inputElement.select();
                
                navigator.clipboard.writeText(inputElement.value).then(_ => {
                    dispatch(showToast('Copied to clipboard'));
                }).catch(_ =>{
                    /* Ignored: They will have to copy manually */
                });
            };
            let sharePart = <span style={shareIconStyles} className="d-flex justify-content-center align-items-center" onClick={onShareClicked}>{shareIcon}</span> 
            if(!showShare) {
                titlePart = (<>
                    <div className="flex-grow-1 align-self-center">{currentEvent.event?.description}</div>
                    {sharePart}
                </>);
            } else {
                let url = window.location.href;
                titlePart = (<>
                    <div className="flex-grow-1 align-self-center"><input className="form-control" readOnly={true} type="url" value={url} onFocus={onUrlFocused} /></div>
                    {sharePart}
                </>);                
            }
        } else {
            let titleText = currentEvent?.isMissing === true 
                ? 'Händelsen finns inte' 
                : '';
            titlePart = (<>
                <div className="flex-grow-1 align-self-center">{titleText}</div>
            </>);            
        }
    } else {
        titlePart = (<>
            <div className="flex-grow-1 align-self-center">Sidan finns inte</div>
        </>);
    }
    return (
        <div>
            <div className="navbar-light d-flex flex-row p-2 align-self-center fs-3 border-bottom" style={containerStyle}>
                <img src="/logo.svg" alt="Clock" style={logoStyle} />
                {titlePart}
            </div>
        </div>
    );
}

export default Header;
