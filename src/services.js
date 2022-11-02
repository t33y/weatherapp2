const API_KEY = process.env.REACT_APP_API_KEY;

const getWeatherData = async (location, unit) =>{
    if(!location)return;
    const URL = `https://api.openweathermap.org/data/2.5/forecast?${location}&appid=${API_KEY}&units=${unit}`;
    
        const res = await fetch(URL);
        const response = await res.json()
        const data = response.list
        .filter((item)=>item.dt_txt.includes("00:00:00"))
        .map((item)=>({
            temp : item.main.temp,
            date : item.dt,
            desc : item.weather[0].description,
            icon : item.weather[0].icon
        }))
        return data;
}

export default getWeatherData;