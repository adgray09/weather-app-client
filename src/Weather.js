import { gql } from '@apollo/client';
import { client } from './index'
import { useState } from 'react';

function Weather() {
    const [ zip, setZip ] = useState('')
    const [ weather, SetWeather] = useState(null)
    const [units, setUnits] = useState(null)
    const [ myLatitude, setMyLatitude] = useState(null)
    const [ myLongitude, setMyLongtitude ] = useState(null)
  
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
        SetWeather(json)
      } catch(err) {
        console.log(err.message)
      }
    }

    function geoFindMe() {
      const status = document.querySelector('#status');
      const mapLink = document.querySelector('#map-link');

      mapLink.href = '';
      mapLink.textContent = '';

      function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
        mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
      }
      function error() {
        status.textContent = 'Unable to retrieve your location';
      }
      
      if(!navigator.geolocation) {
        status.textContent = 'Geolocation is not supported by your browser ):'
      } else {
        status.textContent = 'Locating...';
        navigator.geolocation.getCurrentPosition(success, error);
      } 
      document.querySelector('#find-me').addEventListener('click', geoFindMe);
    }
    
    return (

      <div className="Weather">
        <br />
        <form onSubmit={(e) => {
          e.preventDefault()
          getWeather()
        }}>
          {weather ? <h1>Temperature: {weather.data.getWeather.temperature}</h1>: <h1>Temperature:</h1>}
          <input
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              />
            <button type="submit">Submit</button>
          <br />
            <button value="imperial" onClick={
              (e) => setUnits(e.target.value)}>Imperial</button>
            <button value="standard" onClick={
              (e) => setUnits(e.target.value)}>Standard</button>

        </form>
            <button onClick={(e) => {
              setMyLatitude(e.target.latitude)
              setMyLongtitude(e.target.longitude)
              geoFindMe()
              console.log(myLatitude, myLongitude)
              
            }} id="find-me">Show my location</button>
            <p id="status" alt="dddd"></p>
            <a id="map-link" target="_blank" />
      </div>
    );
  }
  
  export default Weather 