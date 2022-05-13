import { useState } from 'react';
import ReactSlider from 'react-slider';
import './TimePicker.scss';

function TimePicker() {
    const [position, setPosition] = useState(0);

    let positions : number[] = [];
    for(var i = 0; i <= 24; ++i) {
        positions.push(i)
    }

    let hourMarks = positions.map(p => (
        <div className="hour-mark"></div>
    ));
    /*
            <div className="timepicker">
            <div className="pm"> 
                <div className="timepicker-container-outer">
                    <div className="timepicker-container-inner">
                        <div className="timeline-container">
                            <div className="current-time">
                                <div className="actual-time">16:00</div>
                            </div>
                            <div className="timeline">
                            </div>
                            <div className="hours-container">
                                {hourMarks}                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    */
//https://codepen.io/jaromvogel/pen/aNPRwG
    return (
        <ReactSlider
            className="horizontal-slider"
            thumbClassName="example-thumb"
            trackClassName="example-track"
            renderThumb={(props : any, state : { index: number, value: number, valueNow: number }) => <div {...props}>{state.valueNow}</div>}/>
    )
}

export default TimePicker