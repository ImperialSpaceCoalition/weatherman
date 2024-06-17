const apiKey = 'fce48c16dc3ad0cb8aed83e976a215aa'; // Replace with your actual API key

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('city-input').value;
    fetchWeatherData(city);
});

document.getElementById('search-history').addEventListener('click', function(event) {
    if (event.target.classList.contains('history-item')) {
        fetchWeatherData(event.target.textContent);
    }
});

window.addEventListener('load', loadSearchHistory);

function fetchWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Weather data:', data); // Log the fetched data
            displayCurrentWeather(data);
            displayForecast(data);
            saveToSearchHistory(city);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayCurrentWeather(data) {
    const currentWeather = data.list[0];
    const weatherContainer = document.getElementById('current-weather');
    weatherContainer.innerHTML = `
        <div class="weather-card">
            <h2>${data.city.name} (${new Date().toLocaleDateString()})</h2>
            <img src="http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png" alt="${currentWeather.weather[0].description}">
            <p>Temperature: ${currentWeather.main.temp} °C</p>
            <p>Humidity: ${currentWeather.main.humidity}%</p>
            <p>Wind Speed: ${currentWeather.wind.speed} m/s</p>
        </div>
    `;
    document.getElementById('weather-container').style.display = 'block';
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '<h3>5-Day Forecast:</h3>';
    const forecastList = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    forecastList.forEach(forecast => {
        forecastContainer.innerHTML += `
            <div class="weather-card">
                <h4>${new Date(forecast.dt_txt).toLocaleDateString()}</h4>
                <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="${forecast.weather[0].description}">
                <p>Temperature: ${forecast.main.temp} °C</p>
                <p>Humidity: ${forecast.main.humidity}%</p>
                <p>Wind Speed: ${forecast.wind.speed} m/s</p>
            </div>
        `;
    });
}

function saveToSearchHistory(city) {
    let history = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('weatherSearchHistory', JSON.stringify(history));
        loadSearchHistory();
    }
}

function loadSearchHistory() {
    const history = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
    const historyContainer = document.getElementById('search-history');
    historyContainer.innerHTML = '<h3>Search History:</h3>';
    history.forEach(city => {
        historyContainer.innerHTML += `<p class="history-item">${city}</p>`;
    });
}

