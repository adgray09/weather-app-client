import { gql } from '@apollo/client';
import { client } from './index';
import { useState, useEffect } from 'react';
import OnFailSection from './components/OnFailSection'
import WeatherDataSection from './components/WeatherDataSection'

function Weather() {
  const [zip, setZip] = useState('')
  const [units, setUnits] = useState('imperial')
  const [weather, setWeather] = useState(null)
  // const [myLatitude, setMyLatitude] = useState(null)
  // const [myLongitude, setMyLongtitude] = useState(null)

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
      console.log(err)
    }
  }


  // Graphql query to to pass lat on lon

  // async function getWeatherByGeo() {
  //   try {
  //     const json = await client.query({
  //       query: gql`
  //       query {
  //         getWeatherGeo(lat:${lat}, lon:${lat}) {
  //           temperature
  //           description
  //           humidity
  //         }
  //       }
  //     `
  //     })
  //     setWeather(json)
  //     console.log(json)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  // const LocationSection = () => <>
  //   <button onClick={(e) => {
  //     setMyLatitude(e.target.latitude)
  //     setMyLongtitude(e.target.longitude)
  //     geoFindMe()
  //   }} id="find-me">Show my location</button>
  //   <p id="status" alt="dddd"></p>
  //   <a id="map-link" target="_blank" />
  // </>

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
      {/* <LocationSection /> */}
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