const API_KEY = '2a361234029b13ea9a42c5b3a2f5e613'; // API key
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const weatherContainer = document.getElementById('weatherContainer');
const forecastContainer = document.getElementById('forecastContainer');
const historyContainer = document.getElementById('historyContainer');
let citiesSet = new Set();


// Initialize citiesSet from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
  let citiesArray = JSON.parse(localStorage.getItem('cities')) || [];
  citiesSet = new Set(citiesArray);
  citiesSet.forEach(cityName => {
    const historyItem = document.createElement('button');
    historyItem.classList.add('text-blue-500', 'hover:underline', 'mr-2', 'mb-2');
    historyItem.textContent = cityName;
    historyItem.addEventListener('click', () => {
      getWeatherData(cityName); // Fetch and display weather data when clicked
    });
    historyContainer.appendChild(historyItem); // Add the history item to the container
  });
});

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
      saveToLocalStorage(cityName); // Add the city to local storage
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
      showForecast(data); // Display the forecast data;
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
  const currentWeatherCard = document.createElement('div');
  currentWeatherCard.classList.add('weather-card');
  currentWeatherCard.innerHTML = `
    <h2 class="text-xl font-bold mb-2">${data.name}, ${data.sys.country}</h2>
    <p>${getCurrentDate()[0]}</p>
    <img src="${iconUrl}" alt="${weather.description}" class="w-16">
    <p>Temperature: ${temperature}°C</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${convertSpeed(windSpeed)} Km/h</p>
  `;
  weatherContainer.textContent = '';
  weatherContainer.appendChild(currentWeatherCard); // Display the current weather card
}

// Function to display the forecast data on the dashboard
function showForecast(data) {
  const forecastList = data.list;
  const forecastDays = new Set();

  // Clear previous forecast data
  forecastContainer.textContent = '';

  // Loop through the forecast list and create HTML structure for each forecast item
  forecastList.forEach(item => {
    const forecastDate = formatDate(item.dt_txt)[0];
    if (forecastDate !== getCurrentDate()[0] && !forecastDays.has(forecastDate)) {
      forecastDays.add(forecastDate);

      const weather = item.weather[0];
      const temperature = item.main.temp;
      const humidity = item.main.humidity;
      const windSpeed = item.wind.speed;
      const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}.png`;

      // Create the HTML structure for each forecast item
      const forecastItem = document.createElement('div');
      forecastItem.classList.add('weather-card', 'pr-4');
      forecastItem.innerHTML = `
        <h2 class="text-xl font-bold mb-2">${forecastDate}</h2>
        <img src="${iconUrl}" alt="${weather.description}" class="w-16">
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${convertSpeed(windSpeed)} Km/h</p>
      `;
      forecastContainer.appendChild(forecastItem);  // Append the forecast item to the forecast container
    }
  });
}


// Function to add the searched city to the search history
function addToHistory(city) {
    const historyItem = document.createElement('button');
    historyItem.classList.add('text-blue-500', 'hover:underline', 'mr-2', 'mb-2');
    historyItem.textContent = city;
    historyItem.addEventListener('click', () => {
      getWeatherData(city); // Fetch and display weather data when clicked
    });
    historyContainer.appendChild(historyItem); // Add the history item to the container
}


function saveToLocalStorage(cityName) {
  citiesSet.add(cityName);
  let citiesArray = [...citiesSet];
  let citiesString = JSON.stringify(citiesArray);
  localStorage.setItem('cities', citiesString);
}

// Function to get the current date in a formatted string
function getCurrentDate() {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return [new Date().toLocaleDateString('en-US', options), new Date().toLocaleDateString('en-US')];
}

// Function to format the forecast date in a readable format
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { month: 'short', day: 'numeric' };
  return [date.toLocaleDateString('en-US', options), date.toDateString()];
}

// Function to convert m/s to km/h
function convertSpeed(windSpeed) {
  return ((windSpeed) * 3.6).toFixed(2);
}
