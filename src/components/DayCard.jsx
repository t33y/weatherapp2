import React from "react";
import "./DayCard.css"
import rain from "../assets/rainy.jpg";
import hot from "../assets/hot.jpg";
import cold from "../assets/cold.jpg";

const DayCard = ({data, unit}) => {

    const {temp, date, desc, icon} = data

    const newDate = new Date(date *1000);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const day = newDate.getDate();
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const thresholdHot = unit === "imperial" ? 80 : 26;
    const thresholdCold = unit === "imperial" ? 61 : 16;

    return(
        <div style={{position: "relative"}} className="card">
            <div style={{
                    backgroundImage:`url(${
                        desc.includes("rain")? rain
                        :temp > thresholdHot? hot
                        :temp < thresholdCold? cold : ""                        
                    })`, 
                    position:"absolute", 
                    top:0, 
                    left:0, 
                    right:0, 
                    bottom:0, 
                    zIndex:1, 
                    opacity:0.4
                }} />
                <h3>{days[newDate.getDay()]}</h3>
                <p>{`${month[newDate.getMonth()]} ${day}`}
                    <sup>{
                        (day.toString().endsWith(1) && day !== 11) ? "st"
                        :(day.toString().endsWith(2) && day !== 12) ? "nd"
                        :(day.toString().endsWith(3) && day !== 13) ? "rd": "th"
                    }</sup> 
                </p>
                <img src= {`http://openweathermap.org/img/wn/${icon}@2x.png`} alt="weatherIcon" />
                <h3>{unit === "imperial" ? `${temp.toFixed(0)}°F`:`${temp.toFixed(0)}°C`}</h3>
                <p>{desc}</p>
        </div>
    )
};

export default DayCard;

