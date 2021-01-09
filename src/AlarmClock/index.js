/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */
import React from 'react'
import "./styles.css";
import TimePicker from "../timepicker";
import {setAlarm} from "./alramClock";
import schedule  from 'node-schedule';


const times = [];
const sound = new Audio("./alarm1.mp3");
const startJobSchedule = (alrams) => {
  const job = schedule.scheduleJob('00 00 12 * * 0-6', function(){
      alrams.forEach((element, index) => {
        times[index] = startTimeOut(element);
      });
  });
}

const getElement = (className) => {
    return document.body.getElementsByClassName(className)[0];
}

const toggleClassActive = (event) => {
    const element = event.target;
    if(element.classList.contains('active')){
        element.classList.remove('active');
    }else{
        element.classList.add('active');
    }
    
}

const getFrequencyText = function(frequency) {
    var days;
    days = ['Mo', 'Tue', 'We', 'Th', 'Fr', 'Sa', 'Su'].filter(function(element, index) {
      return frequency.findIndex(item => item===index)!==-1;
    });
    if (days.length === 7) {
      days = ['Everyday'];
    }
    return days.join(' ');
    
};
const handleAddNew = ()   => {
    let element = getElement('alarm_cards');
    element.classList.remove('shown');
    element.classList.add('hidden');

    element = getElement('alarm_change_card_wrapper');
    element.classList.remove('hidden');
    element.classList.add('shown');

}
const toggleSwitch = (event, item, index) => {
    const element = event.target;
    if(element.classList.contains('on')){
        element.classList.remove('on');
        if(times[index]){
          clearTimeout(times[index]);
        }
    }else{
        element.classList.add('on');
        times[index] = startTimeOut(item);
    }
}

const startTimeOut = (item)=>{
  const alarm = new Date();
  console.log(item.frequency)
  const isToday = item.frequency.findIndex(item => item+1 === alarm.getDay());
  var alarmTime = new Date(alarm.getUTCFullYear(), alarm.getUTCMonth(), alarm.getUTCDate(), item.hours, item.minutes, 0);
  var duration = alarmTime.getTime() - (new Date()).getTime();
  console.log(isToday, duration);
  if(isToday !== -1 && duration > 0){
    return setTimeout(startSound, duration);
  }
}

const startSound = () => {
  showModal();
  sound.loop=true;
  sound.load();
  sound.play();
}
const stopSound = () => {
  sound.pause();
}
const handleCloseModal = () => {
  stopSound();
  const modal = document.getElementById("myModal");
  modal.style.display = "none";
}
const showModal = () => {
  const modal = document.getElementById("myModal");
  modal.style.display = "block";
}

const AlarmClock = () => {
    const [alrams, setAlrams] = React.useState([]);
    const [time, setTime] = React.useState("");
    const [alramChangeIndex, setAlramChangeIndex] = React.useState(-1);
    
    React.useEffect(()=>{
      startJobSchedule(alrams);
    },[alrams]);

    React.useEffect(()=> {
      function currentTime() {
        var date = new Date();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        hour = updateTime(hour);
        min = updateTime(min);
        sec = updateTime(sec);
        document.getElementById("clock").innerText = hour + " : " + min + " : " + sec;
        var t = setTimeout(function(){ currentTime() }, 1000);
      }
      
      function updateTime(k) {
        if (k < 10) {
          return "0" + k;
        }
        else {
          return k;
        }
      }
      
      currentTime();
    },[]);
    const handleChangeAlarm = (index)=>{
        setAlramChangeIndex(index);
        let element = getElement('alarm_cards');
        element.classList.remove('shown');
        element.classList.add('hidden');
    
        element = getElement('alarm_change_card_wrapper');
        element.classList.remove('hidden');
        element.classList.add('shown');
    }
    const handleSaving = () => {
            let frequency, hours, minutes;
        
            let element = getElement('alarm_cards');
            element.classList.remove('hidden');
            element.classList.add('shown');
        
            element = getElement('alarm_change_card_wrapper');
            element.classList.add('hidden');
            element.classList.remove('shown');
            
            frequency = [];
            const days = document.body.getElementsByClassName('day');
            for(let i = 0; i<7; i++){
                if(days.item(i).classList.contains('active')){
                    frequency.push(i);
                }
            }
            hours = time.split(":")[0];
            minutes = time.split(":")[1];
            if(alramChangeIndex !== -1){   
                let newAlrams = alrams; 
                newAlrams[alramChangeIndex]=setAlarm(hours, minutes, frequency);
                setAlarm([...newAlrams]);
                setAlramChangeIndex(-1);
        }else{
                setAlrams([...alrams,setAlarm(hours, minutes, frequency)]);
            }
        }
    return (
      <>
        <div className="wrapper">
  <div className="container">
    <div id="clock"></div>
    <div className="alarm_cards">
        {alrams.map((item, index)=>{
            return (<div className="alarm_card first clearfix" data-index="0" key={index}>
            <div className="time"  onClick={()=>handleChangeAlarm(index)}>{item.hours}:{item.minutes}</div>
            <div className="switcher" onClick={(event)=>toggleSwitch(event, item, index)}></div>
            <div className="frequency" onClick={()=>handleChangeAlarm(index)}>
              <img src="./schedule.png" width={15} style={{marginRight: "10px"}} />
              {getFrequencyText(item.frequency)}
            </div>
          </div>);
        })}
    </div>
    <div className="alarm_change_card_wrapper">
      <div className="alarm_change_card">
      <div className="time_block">
          <div className="title">
            WHAT TIME?
          </div>
          <TimePicker width={300} height={300} name={"time"} setTime={setTime}/>
        </div>
        <div className="frequency_block">
          <div className="title">
            WHEN?
          </div>
          <div className="days">
            <div className="day" onClick={(event)=>toggleClassActive(event)}>
              Mo
            </div>
            <div className="day" onClick={(event)=>toggleClassActive(event)} >
              Tue
            </div>
            <div className="day" onClick={(event)=>toggleClassActive(event)}>
              We
            </div>
            <div className="day" onClick={(event)=>toggleClassActive(event)}>
              Th
            </div>
            <div className="day" onClick={(event)=>toggleClassActive(event)}>
              Fr
            </div>
            <div className="day free" onClick={(event)=>toggleClassActive(event)} >
              Sa
            </div>
            <div className="day free" onClick={(event)=>toggleClassActive(event)}>
              Su
            </div>
          </div>
        </div>
        <div className="saving_button" onClick={()=>handleSaving()}>
          SAVE
        </div>
      </div>
    </div>
  </div>
   <div className="add_alarm_card">
          <button className="btn_add" onClick={()=>handleAddNew()}>+</button>
    </div>
</div>

<div id="myModal" class="modal">
  <div class="modal-content">
  <span class="close" onClick={()=>handleCloseModal()}>&times;</span>
  <div>
    <h1>Đã đến giờ</h1>
    <span class="bell fa fa-bell"><img src="./bell.svg" width={50} height="auto" /></span>
  </div>
  <div className="modal-footer">
  <button onClick={()=>handleCloseModal()}>Tắt</button>
  </div>
  </div>
</div>
</>
    )
}

export default AlarmClock;
