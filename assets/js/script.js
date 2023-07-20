/*
const cityName = () => {
  let city = document.getElementById('city').value;
  console.log(city);
  weatherNow(city);
  weatherForecast(city);
}

const weatherNow = (city) => {
  const APIkey = '2a361234029b13ea9a42c5b3a2f5e613';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIkey}`;
  console.log(url)
  fetch(url)
    .then(response  => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));
}

const weatherForecast = (city) => {
  const APIkey = '2a361234029b13ea9a42c5b3a2f5e613';
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${APIkey}`;
  console.log(url)
  fetch(url)
    .then(response  => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));
}

const getCityNames = () => {

}

const setCityNames = () => {
  let city = document.getElementById('city').value;
  localStorage.setItem('cities', city)
  let cities = [];
  for (let i = 0; i < cities.length; i++) {
    
  }
}

document.getElementById('search').addEventListener('click', cityName);*/

// API key
const API_KEY = '2a361234029b13ea9a42c5b3a2f5e613';

// Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const weatherContainer = document.getElementById('weatherContainer');
const forecastContainer = document.getElementById('forecastContainer');
const historyContainer = document.getElementById('historyContainer');

// Event listener for the search form submission
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const cityName = cityInput.value;
  if (cityName) {
    getWeatherData(cityName);
    cityInput.value = '';
  }
});

// Function to fetch weather data for a given city
function getWeatherData(cityName) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`;

  // Fetch current weather data from the API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      showCurrentWeather(data); // Display the current weather data
      addToHistory(cityName); // Add the city to the search history
      console.log(data);
      getForecastData(cityName); // Fetch forecast
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

// Function to fetch forecast data for a given city
function getForecastData(city) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

  // Fetch forecast data from the API
  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      showForecast(data); // Display the forecast data
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

// Function to display the current weather data on the dashboard
function showCurrentWeather(data) {
  const weather = data.weather[0];
  const temperature = data.main.temp;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}.png`;

  // Create the HTML structure for the current weather card
  const currentWeatherCard = `
    <div class="weather-card">
      <h2 class="text-xl font-bold mb-2">${data.name}, ${data.sys.country}</h2>
      <p>${getCurrentDate()}</p>
      <img src="${iconUrl}" alt="${weather.description}" class="w-16">
      <p>Temperature: ${temperature}°C</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${convertSpeed(windSpeed)} Km/h</p>
    </div>
  `;

  weatherContainer.innerHTML = currentWeatherCard; // Display the current weather card
}

// Function to display the forecast data on the dashboard
function showForecast(data) {
  const forecastList = data.list;

  // Clear previous forecast data
  forecastContainer.innerHTML = '';

  // Loop through the forecast list and create HTML structure for each forecast item
  forecastList.forEach(item => {
    const weather = item.weather[0];
    const temperature = item.main.temp;
    const humidity = item.main.humidity;
    const windSpeed = item.wind.speed;
    const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}.png`;
    const forecastDate = formatDate(item.dt_txt);
    const forecastTime = formatTime(item.dt_txt);

    // Create the HTML structure for each forecast item
    const forecastItem = `
      <div class="weather-card pr-4">
        <h2 class="text-xl font-bold mb-2">${forecastDate}</h2>
        <h4>${forecastTime}</h4>
        <img src="${iconUrl}" alt="${weather.description}" class="w-16">
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${convertSpeed(windSpeed)} Km/h</p>
      </div>
    `;

    forecastContainer.innerHTML += forecastItem; // Append the forecast item to the forecast container
  });
}

// Function to add the searched city to the search history
function addToHistory(cityName) {
  const historyItem = document.createElement('button');
  historyItem.classList.add('text-blue-500', 'hover:underline', 'mr-2', 'mb-2');
  historyItem.textContent = cityName;
  historyItem.addEventListener('click', () => {
    getWeatherData(cityName); // Fetch and display weather data when clicked
  });

  historyContainer.appendChild(historyItem); // Add the history item to the container
}

// Function to get the current date in a formatted string
function getCurrentDate() {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date().toLocaleDateString('en-US', options);
}

// Function to format the forecast date in a readable format
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Function to format the forecast time in a readable format
function formatTime(dateString) {
  const date = new Date(dateString);
  const options = { hour: 'numeric', minute: 'numeric' };
  return date.toLocaleTimeString('en-US', options);
}

// Function to convert m/s to km/h
function convertSpeed(windSpeed) {
  return ((windSpeed) * 3.6).toFixed(2);
}