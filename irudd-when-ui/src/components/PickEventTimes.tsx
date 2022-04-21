import InputAddonButton from './InputAddonButton'

let containerStyle = {
    gap: '10px',
    maxWidth:450
}

function PickEventTimes() {
    return (
        <div className="d-flex flex-column" style={containerStyle}>
            <h3>Tider</h3>
            <div className="input-group">
                <InputAddonButton iconType='showCalendar' buttonType='secondary' />
                <input type="text" className="form-control" value="2022-12-21 13:30" />
                <InputAddonButton iconType='removeTime' buttonType='danger' />
            </div>
            <div className="input-group">
                <InputAddonButton iconType='showCalendar' buttonType='secondary'   />
                <input type="text" className="form-control" placeholder="Tex 2022-12-12 12:30" />
                <InputAddonButton iconType='addTime'  buttonType='secondary'  />
            </div>
        </div>
    )
}

export default PickEventTimes