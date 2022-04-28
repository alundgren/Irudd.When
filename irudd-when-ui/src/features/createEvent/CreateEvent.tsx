import EditEventDescription from './components/EditEventDescription';
import PickEventParticipants from './components/PickEventParticipants';
import PickEventDates from './components/PickEventDates';
import SelectDateOrDateTime from './components/SelectDateOrDateTime'

let wrapperStyle = {
    gap: 30,
}

let singleLineRowStyle = {
    height: '2em'
}

function CreateEvent() {
    return (
        <form className="d-flex flex-grow-1 p-2 flex-column" style={wrapperStyle} noValidate={true}>
            <div className="d-flex" style={singleLineRowStyle}>
                <SelectDateOrDateTime />
            </div>
            <div className="d-flex" style={singleLineRowStyle}>
                <EditEventDescription />
            </div>
            <div className="d-flex flex-grow-1">
                <div className="flex-grow-1">
                    <PickEventParticipants />
                </div>
            </div>
            <div className="d-flex flex-grow-1">
                <div className="flex-grow-1">
                    <PickEventDates />
                </div>                
            </div>            
            <div className="d-flex justify-content-end mt-2">
                <button className="btn btn-outline-primary">Skapa</button>
            </div>           
        </form>
    );
}

export default CreateEvent;

