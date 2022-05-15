import ReactSlider from 'react-slider';
import './TimePicker.scss';
import { DateTime } from "luxon";

let allTimes : TimePickerTime[] = []
for(let hour=0;hour<24; hour++) {
    allTimes.push({ hour: hour, minute: 0 });
    allTimes.push({ hour: hour, minute: 15 });
    allTimes.push({ hour: hour, minute: 30 });
    allTimes.push({ hour: hour, minute: 45 });
}

export interface TimePickerProperties {
    onTimeChanged: (newTime: TimePickerTime) => void,
    initialDateAndTime: DateTime | null
}

export interface TimePickerTime {
    hour: number,
    minute: number
}

function TimePicker({onTimeChanged, initialDateAndTime}: TimePickerProperties) {
    const formatValue = (index: number) => {
        let t = allTimes[index];
        return `${t.hour.toString().padStart(2, '0')}:${t.minute.toString().padStart(2, '0')}` ;
    };    
    
    const onSliderValueChanged = (value: number) => {
        onTimeChanged(allTimes[value]);
    }
    
    let defaultValue : number
    if(initialDateAndTime === null) {
        defaultValue = allTimes.findIndex(x => x.hour === 12 && x.minute === 0);
    } else {
        //This will be 3 values
        let matchingHourTimes = allTimes
            .map((x, i) => ({ i: i, t: x, diff: Math.abs(x.minute - initialDateAndTime.minute) }))
            .filter(x => x.t.hour === initialDateAndTime.hour)
            .sort((x1, x2) => x1.diff - x2.diff);
        //Pick the one with the least diff        
        let bestMatch = matchingHourTimes[0];
        defaultValue = bestMatch.i;
    }
    
    return (
        <ReactSlider
            className="clock-slider"
            thumbClassName="clock-thumb"
            trackClassName="clock-track"
            renderThumb={(props : any, state : { index: number, value: number, valueNow: number }) => <div {...props}>{formatValue(state.valueNow)}</div>}
            onChange={onSliderValueChanged}
            min={0}
            max={allTimes.length - 1}
            defaultValue={defaultValue}
            value={defaultValue}            
        />
    )
}

export default TimePicker