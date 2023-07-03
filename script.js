const api = {
  key: "4054535fcc56ee7b217bf7f35be322f1",
  base: "https://api.openweathermap.org/data/2.5/",
};

const searchbox = document.querySelector(".search-box");
searchbox.addEventListener("keypress", setQuery);

let previousQuery = "";

function setQuery(evt) {
  if (evt.keyCode == 13) {
    if (searchbox.value !== previousQuery) {
      // Clear previous results
      clearResults();
    }
    getResults(searchbox.value);
  }
}

function clearResults() {
  let city = document.querySelector(".location .city");
  city.innerText = "";

  let date = document.querySelector(".location .date");
  date.innerText = "";

  let temp = document.querySelector(".current .temp");
  temp.innerHTML = "";

  let weather_el = document.querySelector(".current .weather");
  weather_el.innerText = "";

  let hilow = document.querySelector(".hi-low");
  hilow.innerText = "";

  clearError();

  // Hide weather data
  let weatherData = document.querySelector(".current");
  weatherData.style.display = "none";
}

function getResults(query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(displayResults)
    .catch((error) => {
      console.log("Error:", error);
      displayError(
        "Oops! The city you entered seems to be hiding. Let's search again!"
      );
    });
}

function displayResults(weather) {
  clearResults();

  let city = document.querySelector(".location .city");
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  let date = document.querySelector(".location .date");
  date.innerText = dateBuilder(now);

  let temp = document.querySelector(".current .temp");
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°C</span>`;

  let weather_el = document.querySelector(".current .weather");
  weather_el.innerText = weather.weather[0].main;

  let hilow = document.querySelector(".hi-low");
  hilow.innerText = `${weather.main.temp_min}°C / ${weather.main.temp_max}°C`;

  clearError();

  // Show weather data
  let weatherData = document.querySelector(".current");
  weatherData.style.display = "block";

  Toastify({
    text: "Weather data fetched successfully!",
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor: "#4caf50",
    stopOnFocus: true,
  }).showToast();

  // Update previous query
  previousQuery = searchbox.value;
}

function displayError(message) {
  let errorElement = document.querySelector(".error-message");
  errorElement.innerHTML = `<span>${message}</span> <span>🌎🔎</span>`;
  errorElement.style.display = "block";

  Toastify({
    text: "Wrong City Entered",
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor: "#f44336",
    stopOnFocus: true,
  }).showToast();

  // Hide weather data
  let weatherData = document.querySelector(".current");
  weatherData.style.display = "none";
}

function clearError() {
  let errorElement = document.querySelector(".error-message");
  errorElement.innerText = "";
  errorElement.style.display = "none";
}

function dateBuilder(d) {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}
