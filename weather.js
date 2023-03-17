import axios from "axios"


export function getWeather(lat, lon,timezone){
    return axios.get("https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lon+"&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&timeformat=unixtime&timezone="+timezone
    ).then(({data})=>{
        
            return {
            current: parseCurrentWeather(data),
            daily: parseDailyWeather(data),
            hourly: parseHourlyWeather(data)
            }
        })
}



function parseCurrentWeather({current_weather, daily}) {
    const {
        temperature : currentTemp,
        windspeed : windSpeed,
    } = current_weather

    const {
        temperature_2m_max: [maxTemp],
        temperature_2m_min: [minTemp],
        apparent_temperature_max: [maxFeelsLike1],
        apparent_temperature_min: [minFeelsLike1],
        precipitation_sum: [precip],  
        weathercode: [iconCode],
        } = daily
     return {
         currentTemp: Math.round(currentTemp),
         highTemp: Math.round(maxTemp),
         lowTemp: Math.round(minTemp),
         maxFeelsLike: Math.round(maxFeelsLike1),
         lowFeelsLike: Math.round(minFeelsLike1),
         windSpeed: Math.round(windSpeed),
         precip,
         iconCode: Math.round(iconCode)
     }
}

function parseDailyWeather({daily}){
    return daily.time.map((time, index)=> {
        return{
            timeStamp: time*1000,
            iconCode: daily.weathercode[index],
            maxTemp : Math.round(daily.temperature_2m_max[index])
        }
    }
    )
}


function parseHourlyWeather({hourly, current_weather}){
    return hourly.time.map((time, index)=> {
        return{
            timeStamp: time*1000,
            iconCode: hourly.weathercode[index],
            temp : Math.round(hourly.temperature_2m[index]),
            feelsLike : Math.round(hourly.apparent_temperature[index]),
            windSpeed : Math.round(hourly.windspeed_10m[index]),
            precip : hourly.precipitation[index]
        }
    }
    ).filter(({timeStamp})=>timeStamp>= current_weather.time*1000)
}1 