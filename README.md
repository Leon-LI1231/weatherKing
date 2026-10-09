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
| Caching  | Redis 7 (app layer), Cloudflare Workers KV (edge) |
| Weather  | [NWS API](https://www.weather.gov/documentation/services-web-api) for US cities, [Open-Meteo](https://open-meteo.com/) for London |

## Caching

Two layers sit in front of MySQL and the upstream weather APIs. Both are small on purpose.

```
browser ──► Cloudflare Worker + KV ──► Spring Boot ──► Redis ──► MySQL / NWS / Open-Meteo
            (edge, edge/)               (backend/)      (app layer)
```

- **Application layer (Redis).** `JsonCache` caches weather forecasts (10 min) and the daily bet list (30 s, evicted when bets are generated or resolved). It fails open: if Redis is down, requests go to the origin. `GET /api/bets/daily` returns `X-Cache: HIT|MISS`.
- **Edge layer (Cloudflare KV).** `edge/worker.js` answers `GET /api/bets/daily` and `GET /api/weather/forecast` from a KV namespace, proxies everything else, and purges the daily list on writes. Responses carry `X-Edge-Cache: HIT|MISS|BYPASS`. Tests: `cd edge && npm test`.

Deploy the edge layer (needs a Cloudflare account):

```bash
cd edge && npm install
npx wrangler kv namespace create CACHE   # paste the id into wrangler.toml
# set ORIGIN_URL in wrangler.toml to your deployed API, then:
npx wrangler deploy
# build the frontend with REACT_APP_API_URL=https://<your-worker>.workers.dev
```

Measure it yourself with `scripts/bench.sh` (toggle Redis with `CACHE_ENABLED=false docker compose up -d backend`). On a laptop with Docker, 300 requests at concurrency 10 against `/api/bets/daily` averaged 8.0 ms without the cache and 5.3 ms with it. The forecast endpoint, which otherwise calls the upstream weather API, dropped from about 101 ms to 4 ms. These are local, small-scale numbers, not production traffic.

## Run it

Requires Docker.

```bash
docker compose up --build
```

- App: http://localhost:5173
- API: http://localhost:8080
- MySQL: localhost:4306 (`root` / `root`, database `weatherkings_db`)
- Redis: localhost:6379

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
