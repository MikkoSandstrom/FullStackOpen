import { useState, useEffect} from "react";
import axios from 'axios'

const Weather = ({weather}) => {
  if(weather)
    return <div><p>temperature {weather.main.temp} celcius</p>
    <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}/>
    <p>wind {weather.wind.speed} m/s</p></div>
  else
    return <p>Weather unavailable</p>
}


const Country = ({country, SetWeather, weather}) => {
  const languages = [];
  useEffect(()=>{
    axios
    .get(`http://api.openweathermap.org/geo/1.0/direct?q=${country.capital}&limit=1&appid=${import.meta.env.VITE_SOME_KEY}`)
    .then(response => {
      axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${response.data[0].lat}&lon=${response.data[0].lon}&units=metric&appid=${import.meta.env.VITE_SOME_KEY}`)
      .then(response => {
        SetWeather(response.data);
      }).catch(error =>{
        SetWeather(null)
        console.log('Weather data unavailable')}
      )
    }).catch(error =>{
      SetWeather(null)
      console.log('Weather data unavailable')}
    )}
    ,[])
  for (const language in country.languages){
    languages.push(country.languages[language])
  }
  return <div>
    <h1>{country.name.common}</h1>
    capital {country.capital}
    <br/>
    area {country.area}
    <h3>languages:</h3>
    <ul> 
    {languages.map(language => <li key={language}>{language}</li>)}
    </ul>
    <img src={country.flags['png']}/>
    <h1>Weather in {country.capital}</h1>
    <Weather weather={weather}/>
  </div>
}

const CountryList = ({countries, handleCountriesToShowChange}) => {
  return countries.map(country => <tr key={country.name.common}><td>{country.name.common} <button onClick={()=>handleCountriesToShowChange(country.name.common)}>show</button></td></tr>)
}

const Content = ({countries, handleCountriesToShowChange, SetWeather, weather}) => {
  if (countries){
    if(countries.length>10)
      return <p>Too many matches specify another filter</p>

    if(countries.length>1)
      return <table>
        <tbody>
        <CountryList countries={countries} handleCountriesToShowChange={handleCountriesToShowChange}/>
        </tbody>
        </table>
    if(countries.length===1){
      return <Country country={countries[0]} SetWeather={SetWeather} weather={weather}/>
    }
    else{
      return <p>No country matching search</p>}
  }
  return null
}

function App() {
  const [countrySearch, setCountrySearch] = useState('')
  const [countries, setCountries] = useState([])
  const [countriesToShow, setCountriesToShow] = useState([])
  const [weather, SetWeather] = useState(null) 
 
  useEffect(()=>{
    axios
    .get('https://studies.cs.helsinki.fi/restcountries/api/all')
    .then(response => {
      setCountries(response.data)
      setCountriesToShow(response.data.filter(country => country.name.common.toLowerCase().includes(countrySearch.toLowerCase())))
    })}
    ,[])

  
  const handleCountryChange = event =>{
    setCountrySearch(event.target.value) 
    handleCountriesToShowChange(event.target.value)
  }
  
  const handleCountriesToShowChange = (name) => {
    setCountriesToShow(countries.filter(country => country.name.common.toLowerCase().includes(name.toLowerCase())))
  }
  return (
    <div className="App">
      find countries <input value={countrySearch} onChange={handleCountryChange}/>
      <Content countries={countriesToShow} handleCountriesToShowChange={handleCountriesToShowChange} SetWeather={SetWeather} weather={weather}/>
    </div>
  );
}

export default App;

