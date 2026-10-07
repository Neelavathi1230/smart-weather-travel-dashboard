# Smart Weather & Travel Dashboard

A responsive, frontend-only dashboard that shows real-time weather, a 5-day forecast and **weather-based travel suggestions** with a travel suitability score.

## Objectives
Demonstrate ES6+ JavaScript, Fetch API with async/await, DOM manipulation, conditional logic, responsive design and Git/GitHub workflow.

## Features
- City search with validation, loading spinner and friendly error messages
- Current weather: temperature, feels-like, humidity, wind, pressure, visibility, sunrise, sunset
- 5-day forecast cards (max/min, humidity, wind)
- Dynamic weather icons and dynamic background themes (sunny, cloudy, rainy, storm, snow, fog, night)
- Smart travel suggestions and a Travel Suitability Score (application-generated, not an official safety rating)
- Responsive layout (CSS Grid, Flexbox, media queries)

## Technologies
HTML5, CSS3, Vanilla JavaScript (ES6+), Fetch API, Git & GitHub

## API Used
[Open-Meteo](https://open-meteo.com/) Geocoding + Forecast APIs. **No API key is required**, so nothing secret is committed to the repo. If you switch to a keyed API, keep the key out of Git (`.gitignore` already excludes `.env`) and load it from a local, untracked config file.

## Project Structure
```
smart-weather-travel-dashboard/
├── index.html
├── css/        style.css, responsive.css
├── js/         main.js, weather-api.js, weather-ui.js, travel-suggestions.js
├── assets/     icons/, images/
├── docs/       PROJECT_REPORT.md
├── README.md
└── .gitignore
```

## Run Locally
1. Clone the repo: `git clone https://github.com/<your-username>/smart-weather-travel-dashboard.git`
2. Open `index.html` in a browser (or use the VS Code *Live Server* extension).

## Travel Score Logic
Starts at 100 and subtracts points for extreme temperature, strong wind and rain/snow/fog/thunderstorm. 80–100 Excellent · 60–79 Good · 40–59 Moderate · 20–39 Poor · 0–19 Not Recommended.

## Git Workflow
`main` holds stable code; use `feature/weather-api`, `feature/weather-ui`, `feature/travel-suggestions`, `feature/responsive-design` branches and merge after testing.

## Screenshots
_Add screenshots in `assets/images/` and link them here._

## Live Demo
_Add your GitHub Pages / Netlify link here._

## Future Enhancements
Geolocation, °C/°F toggle, hourly forecast, saved cities, air-quality data, PWA support.
