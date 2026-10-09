#!/usr/bin/env bash
# Tiny latency benchmark for a read endpoint.
#
#   scripts/bench.sh [url] [requests] [concurrency]
#
# Compare cache on vs. off against the same stack:
#   CACHE_ENABLED=false docker compose up -d backend && scripts/bench.sh
#   CACHE_ENABLED=true  docker compose up -d backend && scripts/bench.sh
set -euo pipefail

URL="${1:-http://localhost:8080/api/bets/daily}"
N="${2:-300}"
C="${3:-10}"

# Make sure there is something to read (generate tomorrow's bets only if none exist), then warm up.
if [ "$(curl -s http://localhost:8080/api/bets/daily)" = "[]" ]; then
  curl -s -X POST http://localhost:8080/api/bets/generate-daily >/dev/null
fi
curl -s -o /dev/null "$URL"

out=$(mktemp)
seq "$N" | xargs -P "$C" -I{} curl -s -o /dev/null -D - -w 'TIME %{time_total}\n' "$URL" > "$out"

python3 - "$out" <<'PY'
import sys, statistics
times, hits = [], 0
for line in open(sys.argv[1]):
    if line.startswith("TIME "):
        times.append(float(line.split()[1]) * 1000)
    elif line.lower().startswith(("x-cache: hit", "x-edge-cache: hit")):
        hits += 1
times.sort()
n = len(times)
print(f"requests={n}  cache_hits={hits} ({100*hits//max(n,1)}%)")
print(f"avg={statistics.mean(times):.1f} ms  p50={times[n//2]:.1f} ms  p95={times[int(n*0.95)-1]:.1f} ms")
PY
rm -f "$out"
