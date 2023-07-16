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

document.getElementById('search').addEventListener('click', cityName);