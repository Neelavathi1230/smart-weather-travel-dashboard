// UI layer: all DOM manipulation lives here.
const $ = (id) => document.getElementById(id);
const THEMES = ["theme-default", "theme-sunny", "theme-cloudy", "theme-rainy", "theme-storm", "theme-snow", "theme-fog", "theme-night"];

const showLoading = (on) => {
  $("loader").hidden = !on;
  $("searchBtn").disabled = on;
  $("cityInput").disabled = on;
  if (on) { $("error").hidden = true; $("welcome").hidden = true; $("results").hidden = true; }
};

const showError = (message) => {
  $("error").textContent = message;
  $("error").hidden = false;
  $("results").hidden = true;
  $("welcome").hidden = true;
};

const updateWeatherTheme = (code, isDay) => {
  const { group } = getWeatherInfo(code);
  const map = { clear: "theme-sunny", cloudy: "theme-cloudy", rain: "theme-rainy", storm: "theme-storm", snow: "theme-snow", fog: "theme-fog" };
  const theme = !isDay && (group === "clear" || group === "cloudy") ? "theme-night" : map[group] || "theme-default";
  document.body.classList.remove(...THEMES);
  document.body.classList.add(theme);
};

const formatTime = (iso) => new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

const displayCurrentWeather = ({ location, current, daily }) => {
  const isDay = current.is_day === 1;
  const info = getWeatherInfo(current.weather_code);
  $("cityName").textContent = location.country ? `${location.name}, ${location.country}` : location.name;
  $("localDate").textContent = new Date(current.time).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" });
  $("weatherIcon").textContent = getWeatherIcon(current.weather_code, isDay);
  $("temperature").textContent = `${Math.round(current.temperature_2m)}°C`;
  $("condition").textContent = info.label;

  const items = [
    ["🌡️", "Feels Like", `${Math.round(current.apparent_temperature)}°C`],
    ["💧", "Humidity", `${current.relative_humidity_2m}%`],
    ["💨", "Wind", `${Math.round(current.wind_speed_10m)} km/h`],
    ["🧭", "Pressure", `${Math.round(current.surface_pressure)} hPa`],
    ["👁️", "Visibility", `${(current.visibility / 1000).toFixed(1)} km`],
    ["🌅", "Sunrise", formatTime(daily.sunrise[0])],
    ["🌇", "Sunset", formatTime(daily.sunset[0])]
  ];
  $("details").innerHTML = items
    .map(([icon, label, value]) => `<div class="detail"><span>${icon}</span><p>${label}</p><strong>${value}</strong></div>`)
    .join("");
};

const displayForecast = ({ daily }) => {
  $("forecastGrid").innerHTML = daily.time.map((date, i) => {
    const d = new Date(`${date}T00:00:00`);
    const day = i === 0 ? "Today" : d.toLocaleDateString("en-US", { weekday: "short" });
    return `<article class="card forecast-card">
      <h3>${day}</h3>
      <p class="muted">${d.toLocaleDateString("en-US", { day: "numeric", month: "short" })}</p>
      <div class="f-icon" aria-hidden="true">${getWeatherIcon(daily.weather_code[i])}</div>
      <p>${getWeatherInfo(daily.weather_code[i]).label}</p>
      <p class="f-temp"><strong>${Math.round(daily.temperature_2m_max[i])}°</strong> / ${Math.round(daily.temperature_2m_min[i])}°</p>
      <p class="muted">💧 ${Math.round(daily.relative_humidity_2m_mean[i])}% · 💨 ${Math.round(daily.wind_speed_10m_max[i])} km/h</p>
    </article>`;
  }).join("");
};

const displayTravel = (current) => {
  const { headline, recommended, carry } = generateTravelSuggestions(current);
  const { score, label, stars } = calculateTravelScore(current);
  const li = (arr) => arr.map((t) => `<li>${t}</li>`).join("");
  $("travelHeadline").textContent = headline;
  $("recList").innerHTML = li(recommended);
  $("carryList").innerHTML = li(carry);
  $("stars").textContent = "★".repeat(stars) + "☆".repeat(5 - stars);
  $("scoreValue").textContent = `${score}%`;
  $("scoreLabel").textContent = label;
  $("scoreBar").style.width = `${score}%`;
};

const displayAll = (data) => {
  displayCurrentWeather(data);
  displayForecast(data);
  displayTravel(data.current);
  updateWeatherTheme(data.current.weather_code, data.current.is_day === 1);
  $("results").hidden = false;
};
