// API layer only: no DOM code here.
const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

class WeatherError extends Error {
  constructor(type, message) {
    super(message);
    this.type = type; // "notfound" | "network" | "api" | "data"
  }
}

const fetchJSON = async (url) => {
  let response;
  try {
    response = await fetch(url);
  } catch {
    throw new WeatherError("network", "Network error. Please check your internet connection and try again.");
  }
  if (!response.ok) throw new WeatherError("api", "The weather service is unavailable right now. Please try again later.");
  return response.json();
};

const geocodeCity = async (city) => {
  const data = await fetchJSON(`${GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
  if (!data.results || data.results.length === 0) {
    throw new WeatherError("notfound", "Unable to find weather information for this city. Please check the city name and try again.");
  }
  const { name, country, latitude, longitude } = data.results[0];
  return { name, country: country || "", latitude, longitude };
};

const fetchWeather = async (city) => {
  const location = await geocodeCity(city);
  const params = new URLSearchParams({
    latitude: location.latitude,
    longitude: location.longitude,
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,surface_pressure,visibility,is_day",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean,wind_speed_10m_max,sunrise,sunset",
    forecast_days: 5,
    timezone: "auto"
  });
  const data = await fetchJSON(`${FORECAST_URL}?${params}`);
  if (!data.current || !data.daily || !data.daily.time) {
    throw new WeatherError("data", "Weather data is incomplete for this city. Please try another search.");
  }
  return { location, current: data.current, daily: data.daily };
};
