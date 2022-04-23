import InputAddonButton from './../../../components/InputAddonButton'

let containerStyle = {
    gap: '10px',
}

function PickEventParticipants() {
    return (
        <div className="d-flex flex-column" style={containerStyle}>
            <h3>Deltagare</h3>
            <div className="input-group">
                <input type="text" className="form-control" value="Kalle" />
                <InputAddonButton iconType='removePerson' buttonType='danger' />
            </div>            
            <div className="input-group">
                <input type="text" className="form-control" placeholder="Namn på nästa deltagare" />
                <InputAddonButton iconType='addPerson' buttonType='secondary' />
            </div>
        </div>
    )
}

export default PickEventParticipants