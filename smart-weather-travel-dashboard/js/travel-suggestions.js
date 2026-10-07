// Weather interpretation + travel logic (pure functions, no DOM).
const WEATHER_CODES = [
  { codes: [0], label: "Clear Sky", icon: "☀️", nightIcon: "🌙", group: "clear" },
  { codes: [1, 2], label: "Partly Cloudy", icon: "🌤️", nightIcon: "☁️", group: "cloudy" },
  { codes: [3], label: "Cloudy", icon: "☁️", nightIcon: "☁️", group: "cloudy" },
  { codes: [45, 48], label: "Mist / Fog", icon: "🌫️", nightIcon: "🌫️", group: "fog" },
  { codes: [51, 53, 55, 56, 57], label: "Drizzle", icon: "🌦️", nightIcon: "🌧️", group: "rain" },
  { codes: [61, 63, 65, 66, 67, 80, 81, 82], label: "Rain", icon: "🌧️", nightIcon: "🌧️", group: "rain" },
  { codes: [71, 73, 75, 77, 85, 86], label: "Snow", icon: "❄️", nightIcon: "❄️", group: "snow" },
  { codes: [95, 96, 99], label: "Thunderstorm", icon: "⛈️", nightIcon: "⛈️", group: "storm" }
];

const getWeatherInfo = (code) =>
  WEATHER_CODES.find(({ codes }) => codes.includes(code)) ||
  { label: "Unknown", icon: "🌡️", nightIcon: "🌡️", group: "cloudy" };

const getWeatherIcon = (code, isDay = true) => {
  const info = getWeatherInfo(code);
  return isDay ? info.icon : info.nightIcon;
};

const generateTravelSuggestions = ({ weather_code: code, temperature_2m: temp, wind_speed_10m: wind }) => {
  const { group } = getWeatherInfo(code);

  if (group === "storm") return {
    headline: "⛈️ Unfavorable weather conditions.",
    recommended: ["Consider postponing outdoor activities", "Prefer indoor destinations", "Check local weather updates", "Travel carefully"],
    carry: ["Umbrella", "Power bank", "Waterproof bag"]
  };
  if (group === "rain") return {
    headline: "🌧️ Rainy conditions expected.",
    recommended: ["Museums", "Shopping malls", "Indoor attractions", "Cafés"],
    carry: ["Umbrella", "Raincoat", "Waterproof bag"]
  };
  if (group === "snow" || temp <= 10) return {
    headline: "❄️ Cold weather expected.",
    recommended: ["Indoor attractions", "Mountain destinations", "Cafés", "Scenic locations"],
    carry: ["Warm clothing", "Jacket", "Gloves"]
  };
  if (temp >= 35) return {
    headline: "🌡️ High temperature expected.",
    recommended: ["Prefer morning/evening travel", "Stay hydrated", "Avoid prolonged outdoor activities", "Visit air-conditioned places"],
    carry: ["Water bottle", "Sunscreen", "Hat or cap"]
  };
  if (group === "fog") return {
    headline: "🌫️ Low visibility expected.",
    recommended: ["Drive carefully", "Indoor attractions", "Cafés", "Short local trips"],
    carry: ["Light jacket", "Phone charger"]
  };
  if (wind >= 40) return {
    headline: "💨 Very windy conditions.",
    recommended: ["Indoor attractions", "Sheltered sightseeing", "Cafés"],
    carry: ["Windcheater", "Secure bags"]
  };
  if (group === "clear") return {
    headline: "☀️ Great day for outdoor travel!",
    recommended: ["Beach visits", "Sightseeing", "Parks", "Outdoor photography"],
    carry: ["Sunglasses", "Water bottle", "Sunscreen"]
  };
  return {
    headline: "⛅ Pleasant weather for exploring.",
    recommended: ["Walking tours", "Local markets", "Parks", "Day trips"],
    carry: ["Light jacket", "Water bottle", "Comfortable shoes"]
  };
};

const calculateTravelScore = ({ weather_code: code, temperature_2m: temp, wind_speed_10m: wind }) => {
  let score = 100;
  const { group } = getWeatherInfo(code);

  // Temperature
  if (temp >= 40) score -= 45;
  else if (temp >= 35) score -= 30;
  else if (temp >= 30) score -= 12;
  else if (temp < 0) score -= 35;
  else if (temp < 10) score -= 20;
  else if (temp < 15) score -= 8;

  // Wind
  if (wind >= 40) score -= 30;
  else if (wind >= 25) score -= 15;
  else if (wind >= 15) score -= 5;

  // Condition
  const penalty = { storm: 50, snow: 30, rain: 25, fog: 15, cloudy: 5, clear: 0 };
  score -= penalty[group] ?? 0;

  score = Math.max(0, Math.min(100, score));
  const label = score >= 80 ? "Excellent for travel"
    : score >= 60 ? "Good for travel"
    : score >= 40 ? "Moderate conditions"
    : score >= 20 ? "Poor conditions"
    : "Not recommended";
  return { score, label, stars: Math.round(score / 20) };
};
