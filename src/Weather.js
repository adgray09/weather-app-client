import { gql } from '@apollo/client';
import { client } from './index';
import { useState, useEffect } from 'react';
import OnFailSection from './components/OnFailSection'
import WeatherDataSection from './components/WeatherDataSection'

function Weather() {
  const [zip, setZip] = useState('')
  const [units, setUnits] = useState('imperial')
  const [weather, setWeather] = useState(null)
  const [myLatitude, setMyLatitude] = useState(null)
  const [myLongitude, setMyLongtitude] = useState(null)

  const submitButtonDisabled = zip.length == null || zip.length < 5 || zip.length > 5

  useEffect(getWeather, [units])

  async function getWeather() {
    try {
      const json = await client.query({
        query: gql`
            query {
              getWeather(zip:${zip}, units:${units}) {
                temperature
                description
                humidity
                cod
                message
              }
            }
          `
      })
      setWeather(json)
      console.log(json)
    } catch (err) {
      console.log(err.message)
    }
  }

  function geoFindMe() {
    const status = document.querySelector('#status');
    const mapLink = document.querySelector('#map-link');

    mapLink.href = '';
    mapLink.textContent = '';

    function onSuccess(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
      mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
    }

    function onError(error) {
      console.log(error)
      status.textContent = 'Unable to retrieve your location';
    }

    if (!navigator.geolocation) {
      console.log('NO LOCATING!!!!')
      status.textContent = 'Geolocation is not supported by your browser ):'
    } else {
      navigator.geolocation.getCurrentPosition(() => console.log('e buh i ran'), e => console.log(`error ${e}`, { timeout: 0.1 }));
      status.textContent = 'Locating...';
    }

    document.querySelector('#find-me').addEventListener('click', geoFindMe);
  }

  const LocationSection = () => <>
    <button onClick={(e) => {
      setMyLatitude(e.target.latitude)
      setMyLongtitude(e.target.longitude)
      geoFindMe()
    }} id="find-me">Show my location</button>
    <p id="status" alt="dddd"></p>
    <a id="map-link" target="_blank" />
  </>

  return (
    <div className="Weather">
      <br />
      <form onSubmit={(e) => {
        e.preventDefault()
        getWeather()
      }}>
        <input
          value={zip}
          onChange={(e) => setZip(e.target.value)}
        />
        <button type="submit" disabled={submitButtonDisabled}>Submit</button>
      </form>

      <br />
      <LocationSection />
      <br />

      {/* No Weather Yet */}
      {weather == null ? <h1>Please enter your zipcode</h1> : null}

      {/* On Fail Section */}
      {weather != null && weather.data.getWeather.message != null ? <OnFailSection zip={zip} message={weather.data.getWeather.message} /> : null}

      {/* Weather Data Section */}
      {weather != null && weather.data.getWeather.temperature != null ? <WeatherDataSection weather={weather} onUnitsUpdated={newUnits => setUnits(newUnits)} /> : null}
    </div >
  );
}

export default Weather