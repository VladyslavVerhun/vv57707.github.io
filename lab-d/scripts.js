// PTW LAB D - REST API Client
// Aktualna pogoda: XMLHttpRequest
// Prognoza pogody: Fetch API

const API_KEY = "c831defb961db3d0f8016b26b2b70faa";

const cityInput = document.getElementById("cityInput");
const checkButton = document.getElementById("checkButton");
const statusText = document.getElementById("statusText");
const currentWeatherBox = document.getElementById("currentWeather");
const forecastWeatherBox = document.getElementById("forecastWeather");

checkButton.addEventListener("click", function () {
  const city = cityInput.value.trim();

  if (city === "") {
    showError("Wpisz nazwę miasta.");
    return;
  }

  statusText.textContent = "Pobieranie danych pogodowych...";

  getCurrentWeather(city);
  getForecastWeather(city);
});

cityInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    checkButton.click();
  }
});

function getCurrentWeather(city) {
  const currentUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    encodeURIComponent(city) +
    "&appid=" +
    API_KEY +
    "&units=metric&lang=pl";

  const xhr = new XMLHttpRequest();

  xhr.open("GET", currentUrl, true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);

      console.log("Odpowiedź API Current Weather - XMLHttpRequest:");
      console.log(data);

      displayCurrentWeather(data);
    } else {
      console.log("Błąd Current Weather:");
      console.log(xhr.responseText);

      currentWeatherBox.innerHTML =
        '<div class="error-box">Nie udało się pobrać aktualnej pogody. Sprawdź nazwę miasta albo klucz API.</div>';
    }
  };

  xhr.onerror = function () {
    currentWeatherBox.innerHTML =
      '<div class="error-box">Błąd połączenia z API Current Weather.</div>';
  };

  xhr.send();
}

function getForecastWeather(city) {
  const forecastUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    encodeURIComponent(city) +
    "&appid=" +
    API_KEY +
    "&units=metric&lang=pl";

  fetch(forecastUrl)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Błąd pobierania prognozy pogody.");
      }

      return response.json();
    })
    .then(function (data) {
      console.log("Odpowiedź API Forecast - Fetch:");
      console.log(data);

      displayForecastWeather(data);
      statusText.textContent = "Dane zostały pobrane poprawnie.";
    })
    .catch(function (error) {
      console.log("Błąd Forecast:");
      console.log(error);

      forecastWeatherBox.innerHTML =
        '<div class="error-box">Nie udało się pobrać prognozy pogody. Sprawdź nazwę miasta albo klucz API.</div>';

      statusText.textContent = "Wystąpił błąd podczas pobierania danych.";
    });
}

function displayCurrentWeather(data) {
  const iconCode = data.weather[0].icon;
  const iconUrl = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";

  currentWeatherBox.className = "current-weather";

  currentWeatherBox.innerHTML = `
        <div class="current-card">
            <img src="${iconUrl}" alt="Ikona pogody">

            <div>
                <p class="city-name">${data.name}, ${data.sys.country}</p>
                <p class="temperature">${Math.round(data.main.temp)}°C</p>
                <p class="description">${data.weather[0].description}</p>
                <p class="details">
                    Odczuwalna: ${Math.round(data.main.feels_like)}°C |
                    Wilgotność: ${data.main.humidity}% |
                    Wiatr: ${data.wind.speed} m/s |
                    Ciśnienie: ${data.main.pressure} hPa
                </p>
            </div>
        </div>
    `;
}

function displayForecastWeather(data) {
  forecastWeatherBox.innerHTML = "";

  const forecastsByDay = {};

  data.list.forEach(function (item) {
    const date = new Date(item.dt * 1000);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const dayKey = day + "." + month + "." + year;

    if (!forecastsByDay[dayKey]) {
      forecastsByDay[dayKey] = [];
    }

    forecastsByDay[dayKey].push(item);
  });

  Object.keys(forecastsByDay).forEach(function (dayKey) {
    const daySection = document.createElement("div");
    daySection.className = "forecast-day";

    const dayTitle = document.createElement("h3");
    dayTitle.textContent = "Dzień: " + dayKey;

    const hoursGrid = document.createElement("div");
    hoursGrid.className = "forecast-hours";

    forecastsByDay[dayKey].forEach(function (item) {
      const date = new Date(item.dt * 1000);

      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const time = hours + ":" + minutes;

      const iconCode = item.weather[0].icon;
      const iconUrl = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";

      const card = document.createElement("div");
      card.className = "forecast-card";

      card.innerHTML = `
                <p class="forecast-date">${time}</p>
                <img src="${iconUrl}" alt="Ikona pogody">
                <p class="forecast-temp">${Math.round(item.main.temp)}°C</p>
                <p class="forecast-desc">${item.weather[0].description}</p>
                <p class="details">
                    Odczuwalna: ${Math.round(item.main.feels_like)}°C<br>
                    Wilgotność: ${item.main.humidity}%
                </p>
            `;

      hoursGrid.appendChild(card);
    });

    daySection.appendChild(dayTitle);
    daySection.appendChild(hoursGrid);

    forecastWeatherBox.appendChild(daySection);
  });
}

function showError(message) {
  statusText.textContent = message;

  currentWeatherBox.innerHTML =
    '<div class="error-box">' + message + "</div>";

  forecastWeatherBox.innerHTML =
    '<div class="error-box">' + message + "</div>";
}
