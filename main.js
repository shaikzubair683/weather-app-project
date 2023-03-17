import "./style.css"
import { getWeather } from "./weather"
import { ICON_MAP } from "./iconMap"

navigator.geolocation.getCurrentPosition(positionSuccess, positionFailure)

function positionSuccess({coords}){
    let p=getWeather(coords.latitude,coords.longitude,Intl.DateTimeFormat().resolvedOptions().timeZone).then(renderweather).catch(
        e=>{
            console.error(e)
            alert("error found")
        }
    )
}

function positionFailure(){
    alert("give location access")
}

let p=getWeather(20,20,Intl.DateTimeFormat().resolvedOptions().timeZone).then(renderweather).catch(
    e=>{
        console.error(e)
        alert("error found")
    }
)
function renderweather({current, daily, hourly}){
    renderCurrentData(current)
    renderDailyData(daily)
    renderHourlyData(hourly)
    document.body.classList.remove("blurred")
}
const currentIcon = document.querySelector("[data-current-icon") 
function renderCurrentData(current){
    currentIcon.src = getIconUrl(current.iconCode)
    setValue("current-temp", current.currentTemp)
    setValue("current-high", current.highTemp)
    setValue("current-low", current.lowTemp)
    setValue("current-Fl-high", current.maxFeelsLike)
    setValue("current-Fl-low", current.lowFeelsLike)
    setValue("current-wind", current.windSpeed)
    setValue("current-precip", current.precip)
}

function setValue(selector, value, {parent=document}={}){
    parent.querySelector(`[data-${selector}]`).textContent=value
}

function getIconUrl(iconCode){
    return `icons/${ICON_MAP.get(iconCode) }.svg`
}

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, {weekday:"long"})
const dailySection = document.querySelector("[data-day-section]")
const dayCardTemplate = document.getElementById("day-card")
function renderDailyData(daily){
    dailySection.innerHTML = ""
    daily.forEach(day => {
        console.log(day)
        const element = dayCardTemplate.content.cloneNode(true) 
        setValue("temp", day.maxTemp, {parent: element})
        setValue("date",DAY_FORMATTER.format(day.timeStamp) , {parent: element})
        element.querySelector("[data-icon]").src= getIconUrl(day.iconCode)
        dailySection.append(element)
    });
}

const HOUR_FORMATTER = new Intl.DateTimeFormat('en-US', {hour: 'numeric'});
const hourlySection = document.querySelector("[data-hour-section]")
const hourRowTemplate = document.getElementById("hour-row")
function renderHourlyData(hourly){
    hourlySection.innerHTML = ""
    hourly.forEach(hour => {
        console.log(hour)
        const element = hourRowTemplate.content.cloneNode(true) 
        setValue("temp", hour.temp, {parent: element})
        setValue("fl-temp", hour.feelsLike, {parent: element})
        setValue("wind", hour.windSpeed, {parent: element})
        setValue("precip", hour.precip, {parent: element})
        setValue("day", DAY_FORMATTER.format(hour.timeStamp), {parent: element})
        setValue("time", HOUR_FORMATTER.format(hour.timeStamp), {parent: element})
        element.querySelector("[data-icon]").src= getIconUrl(hour.iconCode)
        hourlySection.append(element)
    });
}