import React, { useEffect, useState } from "react";
import './ForecastContainer.css'; 
import DayCard from './DayCard';
import getWeatherData from "../services";
import  {v4 as uuidv4} from "uuid";



const ForecastContainer = () =>{

    const [weatherData, setWeatherData] = useState(null);
    const [unit, setUnit] = useState("imperial");
    const [city, setCity] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState([])
    const [currentLocation, setCurrentLocation] = useState("")

    const HandleKeyPress = async(e) =>{
        if(e.key==="Enter"){
            const cityArg = `q=${e.target.value}`
            setCity(cityArg);
            setCurrentLocation("")
            e.target.value=""
            e.target.blur();
        }
    };

    useEffect(()=>{
        
        const getCoordinate = (position)=>{
            setError([]);
            const location = `lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            setCurrentLocation(location)
        }

        const handleError = (err)=>{
            setError([])
            setWeatherData(null)
            // eslint-disable-next-line
            switch(err.code){
                case err.PERMISSION_DENIED: setError([...error, "Geolocation permission denied"] )
                break;
               
                case err.POSITION_UNAVAILABLE: setError([...error, "Location information unavailable "] )
                break;

                case err.TIMEOUT: setError([...error, "Request timeout"] )
                break;

                case err.UNKNOWN_ERROR: setError([...error, "Unknown geolocation error"] )
                break;
            }
        }
            
        if(navigator.geolocation){
                    navigator.geolocation.getCurrentPosition(getCoordinate, handleError)
            }else{setError([...error, "Geolocation Unsupported"])
        }
        // eslint-disable-next-line
    }, [])

    useEffect(()=>{
        const fetchWeatherData = async()=>{
            setIsLoading(true)
            const data = await getWeatherData(city || currentLocation, unit)
            setIsLoading(false)
            setWeatherData(data)
            setError([])
        }
        fetchWeatherData()
        .catch((err)=>{
            setIsLoading(false);
            setWeatherData(null)
            setError([...error, err.message]);
        })
        // eslint-disable-next-line
    }, [currentLocation, city,unit])
    
    return(
        <div className="container">
            <div className="header">
                <h1> Five (5) Day Forecast</h1>
                <h2>{currentLocation? "Your Current Location": city.toUpperCase().slice(2)}</h2>
            </div>
            <div className="container__details">
                <div className="details__city">
                    
                    <input type="text" placeholder="Enter city..." onKeyDown={HandleKeyPress} />
                    
                    <div className="details__units">
                        <div>
                            <label htmlFor="fahrenheit">Fahrenheit</label>
                            <input
                                type="radio" 
                                id="fahrenheit" 
                                name="tempUnit" 
                                checked = {unit === "imperial"}
                                value="imperial" 
                                onChange={({target: {value}}) =>{setUnit(value) }}/>
                        </div>
                        <div>
                            <label htmlFor="celsius">Celsius</label>
                            <input
                            type="radio" 
                            id="celsius" 
                            name="tempUnit" 
                            checked = {unit === "metric"}
                            value="metric" 
                            onChange={({target: {value}}) =>{setUnit(value) }}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="cards">
             {isLoading? "loading data...": weatherData?.map((item)=>(
                 <DayCard key={item.date} unit={unit} data={item}/>
                 )
             )}
                {(!weatherData && !isLoading)? <h4>Please Enter City...</h4>:""}
            </div>
            <div>
              {error?.map((message)=>(<h3 key={uuidv4()} style={{color: "red"}}>Error loading data.. {message} </h3>))}
            </div>
        </div>
    )
};

export default ForecastContainer;