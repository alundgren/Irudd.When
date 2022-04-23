let containerStyle = {
    gap: '5px',
    maxWidth:450
}

function SelectDateOrDateTime() {
    return (
        <span className="d-flex fs-5" style={containerStyle}>
            <span className="d-flex flex-grow-1">
                <input className="form-check-input" type="radio" name="dateOrDateTime" />
                <label className="form-check-label">
                    Datum och tid
                </label>
            </span>
            <span className="d-flex flex-grow-1 ps-2">
                <input className="form-check-input" type="radio" name="dateOrDateTime" />
                <label className="form-check-label">
                    Bara datum
                </label>
            </span>            
        </span>
    )
}

export default SelectDateOrDateTime