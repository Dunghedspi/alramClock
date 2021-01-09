import React from 'react'
import timePicker from "./src/timePicker";
import clock from './asset/clock.svg';
import "./styles.css";
const TimePicker = React.forwardRef((props, ref) => {
    React.useEffect(()=>{
        new timePicker(document.getElementById("canvasTime"), {}, document.getElementById("time"));
    },[]);
    const showCanvas = ()=>{
       document.getElementById("clockCanvas").style.display="flex";
    };
    const hiddenCanvas = (event) => {
        document.getElementById("clockCanvas").style.display="none";
        setTime(document.getElementById("time").value);   
    }
    const {width, height, name, setTime} = props;
    return (
        <div className="root">
        <div className="container-canvas" id="clockCanvas">
            <div className="timepicker">
                <canvas width={width} height={height} id="canvasTime"></canvas>
            </div>
            <div><button className="btn-hidden" onClick={() => hiddenCanvas()}>OK</button></div>
        </div>
        <div className="center">
            <div className="canvas-input">
                <input id={"time"} type="text" defaultValue={"--:--"}  ref={ref} name={name} onClick={() => showCanvas()}/>
                <img src={clock} alt="clockIcon" id="clock" onClick={() => showCanvas()}/>
            </div>
        </div>
        </div>
    )
});

export default TimePicker;
