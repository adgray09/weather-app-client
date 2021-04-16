export default function WeatherDataSection({ weather, onUnitsUpdated }) {
    return <>
        <h1>Temperature: {weather.data.getWeather.temperature}</h1>
        <button value="imperial" onClick={
            (e) => onUnitsUpdated(e.target.value)}>Imperial</button>
        <button value="standard" onClick={
            (e) => onUnitsUpdated(e.target.value)}>Standard</button>
    </>
}