const apiKey = 'LH86TBUBVKC354RFNZ9E4BY9H';

async function fetchWeatherData(location = 'alaska', unit = 'metric') {

    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/?key=${apiKey}&unitGroup=${unit}&lang=en`;

    try {
        const response = await fetch(url, { mode: 'cors' });
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return await response.json();
    }
    catch (error) {
        return { error: error.message };
    }
}

async function extractWeatherData(location) {
    try {
        const weatherData = await fetchWeatherData(location);

        if (weatherData.error) {
            throw new Error(weatherData.error);
        }

        const currentConditions = weatherData.currentConditions;

        const data = {
            temp: currentConditions.temp,
            condition: currentConditions.conditions,
            windspeed: currentConditions.windspeed,
            address: weatherData.resolvedAddress,
            humidity: currentConditions.humidity,
            feelslike: currentConditions.feelslike,
            icon: currentConditions.icon,
        };
        return data;
    } catch (error) {
        return { error: error.message };
    }
}

async function weather(location) {
    const data = await extractWeatherData(location);
    if (data.error) {
        displayError(data);
    } else {
        display(data);
    }
}

function display(data) {


    const icon = document.createElement('img');
    const status = document.querySelector('.weather-type');
    const cityName = document.querySelector('.city');

    const error = document.querySelector('.error');

    const degree = document.querySelector('#degree');
    const feelslike = document.querySelector('#feel-like-data');
    const humidity = document.querySelector('#humidity-data');

    const wind = document.querySelector('#wind-data');


    icon.src = `./images/icons/${data.icon}.png`;

    degree.textContent = Math.floor(data.temp);
    feelslike.textContent = data.feelslike + '°C';
    wind.textContent = data.windspeed + ' km/h';
    humidity.textContent = data.humidity + '%';
    status.textContent = data.condition;
    cityName.textContent = data.address;
    error.textContent = "";

    status.append(icon);
}

function displayError() {
    const error = document.querySelector('.error');
    error.textContent = '*Invalid location';
}


const form = document.getElementById('my-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const location = document.querySelector('form input').value;
    weather(location);
});

window.addEventListener('load', () => {
    weather();
});

