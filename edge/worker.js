// Edge cache for the WeatherKings API, running on Cloudflare Workers with a KV namespace.
//
// GET /api/bets/daily and GET /api/weather/forecast are answered from KV when possible, so
// repeated reads never reach the origin (Spring Boot + Redis + MySQL). Everything else is
// proxied straight through. Writes under /api/bets purge the cached daily bets.
//
// Response header `X-Edge-Cache` is HIT or MISS (BYPASS for proxied requests).

// Cacheable paths and their TTLs in seconds (Workers KV requires a TTL of at least 60).
const CACHEABLE = {
  "/api/bets/daily": 60,
  "/api/weather/forecast": 600,
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function withHeaders(response, extra) {
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(extra)) headers.set(k, v);
  return new Response(response.body, { status: response.status, headers });
}

export async function handleRequest(request, env) {
  const url = new URL(request.url);

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  const origin = new URL(url.pathname + url.search, env.ORIGIN_URL);
  const ttl = CACHEABLE[url.pathname];

  if (request.method === "GET" && ttl) {
    const key = url.pathname + url.search;
    const cached = await env.CACHE.get(key);
    if (cached !== null) {
      return new Response(cached, {
        headers: { "Content-Type": "application/json", "X-Edge-Cache": "HIT", ...CORS },
      });
    }

    const res = await fetch(origin, { headers: { Accept: "application/json" } });
    if (res.ok) {
      const body = await res.text();
      await env.CACHE.put(key, body, { expirationTtl: ttl });
      return new Response(body, {
        headers: { "Content-Type": "application/json", "X-Edge-Cache": "MISS", ...CORS },
      });
    }
    return withHeaders(res, { "X-Edge-Cache": "BYPASS", ...CORS });
  }

  // Anything else goes to the origin untouched. A write to /api/bets invalidates the daily list.
  const res = await fetch(new Request(origin, request));
  if (request.method !== "GET" && url.pathname.startsWith("/api/bets")) {
    await env.CACHE.delete("/api/bets/daily");
  }
  return withHeaders(res, { "X-Edge-Cache": "BYPASS", ...CORS });
}

export default { fetch: handleRequest };
