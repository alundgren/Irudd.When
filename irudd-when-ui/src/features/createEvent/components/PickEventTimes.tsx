import InputAddonButton from './../../../components/InputAddonButton'

let containerStyle = {
    gap: '10px',
}

function PickEventTimes() {
    return (
        <div className="d-flex flex-column" style={containerStyle}>
            <h3>Tider</h3>
            <div className="input-group flex-grow-1">
                <InputAddonButton iconType='showCalendar' buttonType='secondary' />
                <input type="text" className="form-control flex-grow-1" value="2022-12-21 13:30" />
                <InputAddonButton iconType='removeTime' buttonType='danger' />
            </div>
            <div className="input-group flex-grow-1">
                <InputAddonButton iconType='showCalendar' buttonType='secondary'   />
                <input type="text" className="form-control flex-grow-1" placeholder="Tex 2022-12-12 12:30" />
                <InputAddonButton iconType='addTime'  buttonType='secondary'  />
            </div>
        </div>
    )
}

export default PickEventTimes