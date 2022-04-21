let containerStyle = {
    maxWidth:450
}

function EditEventDescription() {
    return (
        <span className="d-flex fs-5 flex-grow-1" style={containerStyle}>
            <input className="form-control" type="text" name="eventDescription" placeholder="Kort beskrivning, tex AW med gänget" />
        </span>
    )
}

export default EditEventDescription