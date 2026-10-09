import test from "node:test";
import assert from "node:assert/strict";
import { handleRequest } from "./worker.js";

// Minimal in-memory stand-in for a KV namespace
function fakeKV() {
  const store = new Map();
  return {
    store,
    get: async (k) => (store.has(k) ? store.get(k) : null),
    put: async (k, v) => void store.set(k, v),
    delete: async (k) => void store.delete(k),
  };
}

function setup() {
  const env = { CACHE: fakeKV(), ORIGIN_URL: "http://origin.test" };
  const calls = [];
  globalThis.fetch = async (input) => {
    calls.push(String(input.url ?? input));
    return new Response(JSON.stringify([{ betId: 1 }]), { status: 200 });
  };
  return { env, calls };
}

test("first GET misses and is stored in KV, second GET hits without touching the origin", async () => {
  const { env, calls } = setup();
  const req = () => new Request("http://edge.test/api/bets/daily");

  const first = await handleRequest(req(), env);
  assert.equal(first.headers.get("X-Edge-Cache"), "MISS");

  const second = await handleRequest(req(), env);
  assert.equal(second.headers.get("X-Edge-Cache"), "HIT");
  assert.deepEqual(await second.json(), [{ betId: 1 }]);
  assert.equal(calls.length, 1, "origin should be hit exactly once");
});

test("forecast responses are cached per query string", async () => {
  const { env, calls } = setup();
  await handleRequest(new Request("http://edge.test/api/weather/forecast?lat=1&lon=2"), env);
  await handleRequest(new Request("http://edge.test/api/weather/forecast?lat=3&lon=4"), env);
  await handleRequest(new Request("http://edge.test/api/weather/forecast?lat=1&lon=2"), env);
  assert.equal(calls.length, 2);
});

test("writes are proxied and purge the cached daily bets", async () => {
  const { env } = setup();
  await handleRequest(new Request("http://edge.test/api/bets/daily"), env);
  assert.ok(env.CACHE.store.has("/api/bets/daily"));

  const res = await handleRequest(
    new Request("http://edge.test/api/bets/generate-daily", { method: "POST" }),
    env,
  );
  assert.equal(res.headers.get("X-Edge-Cache"), "BYPASS");
  assert.ok(!env.CACHE.store.has("/api/bets/daily"));
});

test("origin errors are not cached", async () => {
  const { env } = setup();
  globalThis.fetch = async () => new Response("boom", { status: 500 });
  const res = await handleRequest(new Request("http://edge.test/api/bets/daily"), env);
  assert.equal(res.status, 500);
  assert.equal(env.CACHE.store.size, 0);
});
