// Controller: connects user events, API and UI.
const searchWeather = async (event) => {
  event.preventDefault();
  const city = $("cityInput").value.trim();

  if (!city) return showError("Please enter a city name.");
  if (!/^[\p{L}\s.'-]{2,}$/u.test(city)) return showError("Please enter a valid city name (letters only).");

  showLoading(true);
  try {
    displayAll(await fetchWeather(city));
  } catch (err) {
    showError(err instanceof WeatherError ? err.message : "Something went wrong. Please try again.");
  } finally {
    showLoading(false);
  }
};

$("searchForm").addEventListener("submit", searchWeather);
