# WeatherKings

A weather betting platform: log in, pick a city, and bet on tomorrow's weather — will it rain or snow, will it get hot, will it be sunny. Bets use virtual dollars; a daily job resolves them against real observations and pays out winners.

**Cities:** Austin, Madison, Los Angeles, London

**Bet types** (generated daily for every city)
- Max temperature over/under, with odds from a normal-distribution model around the forecast
- Precipitation (rain/snow) yes/no
- Sunny/clear vs. cloudy

## Stack

| Layer    | Tech |
|----------|------|
| Frontend | React 19, React Bootstrap |
| Backend  | Spring Boot 3.5 (Java 21), Spring Data JPA |
| Database | MySQL 8.4 |
| Weather  | [NWS API](https://www.weather.gov/documentation/services-web-api) for US cities, [Open-Meteo](https://open-meteo.com/) for London |

## Run it

Requires Docker.

```bash
docker compose up --build
```

- App: http://localhost:5173
- API: http://localhost:8080
- MySQL: localhost:4306 (`root` / `root`, database `weatherkings_db`)

Create an account, deposit some balance, and open a city. If there are no bets yet for tomorrow they are generated automatically.

## Develop

```bash
# backend (JDK 21)
cd backend && ./gradlew test

# frontend
cd frontend && npm install && npm start
npm test
```

## Project history

WeatherKings started as a team project for UW–Madison CS 506 (Fall 2025), built by a team of seven. This repository is a continuation: the git history is preserved, and it has since been extended with new cities (Austin, London), a non-US weather provider, and a refreshed UI.
