import { SyntheticEvent } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'
import { addParticipant, CreateEventState, removeParticipant, setNewParticipantName } from '../createEventSlice'
import InputAddonButton from './../../../components/InputAddonButton'

let containerStyle = {
    gap: '10px',
}

function PickEventParticipants() {
    const participants = useSelector((x : { createEvent: CreateEventState }) => x.createEvent.participants);
    const newParticipantName = useSelector((x : { createEvent: CreateEventState }) => x.createEvent.newParticipantName);
    const dispatch = useDispatch();

    const onRemoveParticipant = (id: string, evt: SyntheticEvent) => {
        dispatch(removeParticipant(id));
    };

    const dispatchAddParticipant = () => {
        dispatch(setNewParticipantName(''));
        dispatch(addParticipant(newParticipantName));
    }

    const onAddParticipant = (evt: SyntheticEvent) => {
        dispatchAddParticipant();
    };

    const onNewParticipantNameChanged = (evt : React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setNewParticipantName(evt.currentTarget.value));
    };

    const onNewParticipantNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key !== 'Enter') {
            return;
        }
        e.preventDefault();
        if(e.currentTarget.value) {
            dispatchAddParticipant();
        }
    };    

    let participantElements = participants.map(x => (
        <div className="input-group" data-testid="participantContainer">
            <input type="text" className="form-control" value={x.name} />
            <InputAddonButton iconType='removePerson' buttonType='danger' onClick={(e) => onRemoveParticipant(x.id, e)} 
                testId="removeButton" />
         </div>
    ));

    return (
        <div className="d-flex flex-column" style={containerStyle}>
            <h3>Deltagare</h3>
            {participantElements}
            <div className="input-group">
                <input type="text" className="form-control" placeholder="Namn på nästa deltagare" 
                    data-testid="addInput" value={newParticipantName} onChange={onNewParticipantNameChanged} 
                    onKeyDown={onNewParticipantNameKeyDown} />
                <InputAddonButton iconType='addPerson' buttonType='secondary' 
                    testId="addButton" onClick={onAddParticipant} isDisabled={!newParticipantName} />
            </div>
        </div>
    )
}

export default PickEventParticipants