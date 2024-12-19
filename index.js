//Store API key and base URL
const api = {
  key: "fcc8de7015bbb202209bbf0261babf4c", // OpenWeather API key
  base: "https://api.openweathermap.org/data/2.5/" 
}

// Default city to  fetch weather data for
const city = 'Delhi'; // you can change if  you want to set other

// function to fetch weather data for default city
async function fetchWeather(){
  const response = await fetch(`${api.base}weather?q=${city}&units=metric&appid=${api.key}`);
  const data = await response.json();
  updateUI(data);
}
//function to update the user interface with weather data
function updateUI(data){
  //update city and country
  document.getElementById('city').textContent = `${data.name}, ${data.sys.country}`;
  //update temperature
  document.getElementById('temp').innerHTML = `${Math.round(data.main.temp)}<span>°C</span>`;
  // update weather condition
  document.getElementById('weather').textContent = data.weather[0].main;
  // update high and low temp
  document.getElementById('hi-low').textContent = `${Math.round(data.main.temp_min)}°C / ${Math.round(data.main.temp_max)}°C`;
 //update the current date
 const today = new Date();
 const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
 const date = `${days[today.getDay()]} ${today.getDate()} ${today.toLocaleString('default', {month: 'long'})} ${today.getFullYear()}`;
 document.getElementById('date').textContent = date;
}

// call the function to get weather data for delhi
fetchWeather();
// event listener for the search box
const searchbox= document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

function setQuery(evt){
  if(evt.keyCode === 13){
    getResults(searchbox.value);
  }
}

//function to get weather data for the searched city
function getResults(query){
  fetch(`${api.base}weather?q=${query}&units=metric&appid=${api.key}`)
  .then(response => {
    if (!response.ok) {
      throw new Error("City not found");
    }
    return response.json();
  })
  .then(displayResults)
  .catch(error => {
    alert(error.message);
  })
}
//function to display fetched weather in the UI
function displayResults(weather){
  let city = document.querySelector('.location .city');
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  let date = document.querySelector('.location .date');
  date.innerText = dateBuilder(now);

  let temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°C</span>`;

  let weather_el = document.querySelector('.current .weather');
  weather_el.innerText = weather.weather[0].main;

  let hilow = document.querySelector('.hi-low');
  hilow.innerText = `${Math.round(weather.main.temp_min)}°C / ${Math.round(weather.main.temp_max)}°C`;

  changeBackground(Math.round(weather.main.temp));
}
// function to change the background based on temperature
function changeBackground(temp){
  const body = document.body;
  let gradient;
  
  if(temp<0){
    gradient = 'linear-gradient(135deg,#00bcd4, #e1f5fe)'; // cool blue
  } else if(temp<15){
    gradient = 'linear-gradient(135deg,#4caf50, #c8ebc9)'; //fresh green
  } else if(temp<25){

    gradient = 'linear-gradient(135deg,#ffeb3b, #fff59d)'; //warm yellow
  }else {
    gradient = 'linear-gradient(135deg,#f44336,#ffebee)';// hot red
  }
  body.style.background = gradient; // set the background

}
// function to build a formatted date string

function dateBuilder(d){
  let months = ["January","February","March","April","May","June","July","August", "September","October","November","December"];
  let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  let day = days[d.getDay()];//get the day of the week
  let date = d.getDate(); // get the date
  let month = months[d.getMonth()];// get the month
  let year = d.getFullYear();
  return `${day} ${date} ${month} ${year}`;// return formatted date

}