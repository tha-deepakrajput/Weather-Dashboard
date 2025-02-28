const cityForm = document.getElementById('cityForm');
const cityInput = document.getElementById('cityInput');
const errorMsg = document.getElementById('errorMsg');
const currentWeather = document.getElementById('currentWeather');
const currentWeatherDetails = document.getElementById('currentWeatherDetails');
const forecast = document.getElementById('forecast');
const forecastDetails = document.getElementById('forecastDetails');

// The API key : 
const apiKey = '98cbb1228ee7fe94df78c47e61d4e64f';

// Form : 
cityForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    
    if (city) {
        fetchWeatherData(city);
        cityInput.value = '';
    }
    else {
        errorMsg.textContent = 'Please enter a city name.';
        errorMsg.classList.remove('hidden');
    }
});

// Here this async function is to fetch the data from the Open weather map API : 
async function fetchWeatherData(city) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        // Here it will fetch the current weather and forecast data at the same time : 
        const [currentWeatherResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl),
        ]);

        // This condition will check if the response are oKay or not : 
        if (!currentWeatherResponse.ok || !forecastResponse) {
            throw new Error('City not found. Please try again.');
        }

        // Here we are converting the responsed to JSON format : 
        const currentWeatherData = await currentWeatherResponse.json();
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(currentWeatherData);
        displayForecast(forecastData);

        errorMsg.classList.add('hidden');
    }
    catch (error) {
        errorMsg.textContent = error.message;
        errorMsg.classList.remove('hidden');
        currentWeather.classList.add('hidden');
        forecast.classList.add('hidden');
    }
}

// Display current weather : 
function displayCurrentWeather(data) {
    const name = data.name;
    const dt = data.dt;
    const main = data.main;
    const weather = data.weather;
    const wind = data.wind;

    const date = new Date(dt * 1000).toLocaleDateString();

    currentWeatherDetails.innerHTML = `
    <div class="weatherCard"> 
        <h3> ${name} (${date}) </h3>
        <img src="https://openweathermap.org/img/wn/${weather[0].icon}.png" alt="${weather[0].description}">
        <p> Temperature: ${main.temp}°C </p>
        <p> Weather Des: ${weather[0].description} </p>
        <p> Humidity: ${main.humidity}% </p>
        <p> Wind Speed: ${wind.speed} m/s </p>
    </div>
    `;

    currentWeather.classList.remove('hidden');
}

// Display 5-day forecast : 
function displayForecast(data) {
    const forecastList = data.list.filter((item, index) => index % 8 === 0);
    
    const fiveDaysForecast = forecastList.slice(0, 5);

    forecastDetails.innerHTML = fiveDaysForecast.map((item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        return `
        <div class="weatherCard">
            <h3>${date}</h3>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
            <p> Temperature: ${item.main.temp}°C</p>
            <p> Weather Des: ${item.weather[0].description}</p>
            <p> Humidity: ${item.main.humidity}</p>
            <p> Wind Speed: ${item.wind.speed}</p>
        </div>
        `;
    }).join('');

    forecast.classList.remove('hidden');
}

