#!/bin/bash
# Local-only test of the /clients/guide/<slug>/ route, plus a smoke test of
# the existing archive routes (unlock, lock, board, artifact, admin).
#
# usage: test/guide-local.sh [DIST]
#
#   DIST  a folder staged with stage.py --r2 (the real guide). It is loaded
#         into a throwaway local R2 store and every file in it is fetched.
#         Without DIST, a small synthetic guide is generated instead, so the
#         test never needs client content in this public repo.
#
# Never touches Cloudflare: every wrangler call passes --local and a temp
# --persist-to, the config is a temp copy with local-only binding ids, and
# COOKIE_SECRET / ADMIN_TOKEN are fresh random dev-only values that die with
# the temp folder. The real .dev.vars is never read.
set -uo pipefail

WORKER="$(cd "$(dirname "$0")/.." && pwd)"
W="$WORKER/node_modules/.bin/wrangler"
PORT="${PORT:-8799}"
BASE="http://127.0.0.1:$PORT"
TMP="$(mktemp -d)"
STATE="$TMP/state"
LOG="$TMP/wrangler.log"
SLUG=full-charge
PASS="dev-only-passphrase-$RANDOM"
SECRET="dev-only-$(openssl rand -hex 24)"
ADMIN="dev-only-$(openssl rand -hex 24)"
DEV_PID=""

cleanup() { [ -n "$DEV_PID" ] && kill "$DEV_PID" 2>/dev/null; wait 2>/dev/null; rm -rf "$TMP"; }
trap cleanup EXIT

PASSED=0; FAILED=0
check() { # name expected actual
  if [ "$2" = "$3" ]; then PASSED=$((PASSED + 1)); printf '  ok    %s\n' "$1"
  else FAILED=$((FAILED + 1)); printf '  FAIL  %s (expected %s, got %s)\n' "$1" "$2" "$3"; fi
}
code() { curl -s -o /dev/null -w '%{http_code}' "$@"; }
header() { curl -s -D - -o /dev/null "${@:2}" | tr -d '\r' | awk -v h="$(echo "$1" | tr A-Z a-z)" 'tolower($0) ~ "^"h":" { sub(/^[^:]*: /, ""); print; exit }'; }

# --- temp config: same code, local-only bindings ---------------------------
cat > "$TMP/wrangler.toml" <<EOF
name = "tuku-client-archive-api-localtest"
main = "$WORKER/src/index.js"
compatibility_date = "2024-01-01"

[env.dev]
vars = { ENVIRONMENT = "development" }

[[env.dev.d1_databases]]
binding = "CLIENT_ARCHIVE_DB"
database_name = "tuku-client-archive"
database_id = "00000000-0000-0000-0000-000000000000"

[[env.dev.r2_buckets]]
binding = "ARTIFACTS"
bucket_name = "tuku-client-artifacts"

[[env.dev.kv_namespaces]]
binding = "RATE_LIMIT"
id = "00000000000000000000000000000000"
EOF
printf 'COOKIE_SECRET=%s\nADMIN_TOKEN=%s\n' "$SECRET" "$ADMIN" > "$TMP/.dev.vars"
WL=(-c "$TMP/wrangler.toml" -e dev)

echo "== setup (local D1 + R2 in $TMP)"
"$W" d1 execute CLIENT_ARCHIVE_DB "${WL[@]}" --local --persist-to "$STATE" --file "$WORKER/migrations/0001_init.sql" >/dev/null 2>&1 \
  || { echo "migration failed"; exit 1; }

HASH="$(cd "$WORKER" && node --no-warnings --input-type=module -e "
  import { hashPassphrase } from './src/services/crypto.js';
  console.log(await hashPassphrase(process.argv[1]));" "$PASS")"
NOW="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
"$W" d1 execute CLIENT_ARCHIVE_DB "${WL[@]}" --local --persist-to "$STATE" --command \
  "INSERT INTO clients (id, name, created_at) VALUES ('$SLUG', 'Full Charge (local test)', '$NOW');
   INSERT INTO clients (id, name, created_at) VALUES ('other-client', 'Other (local test)', '$NOW');
   INSERT INTO access_grants (id, client_id, passphrase_hash, created_at) VALUES ('g1', '$SLUG', '$HASH', '$NOW');" >/dev/null 2>&1 \
  || { echo "seed failed"; exit 1; }

DIST="${1:-}"
if [ -z "$DIST" ]; then
  DIST="$TMP/synthetic"
  mkdir -p "$DIST/Guide/team" "$DIST/Guide/media"
  echo '<!DOCTYPE html><meta http-equiv="refresh" content="0; url=Guide/team/index.html">' > "$DIST/index.html"
  echo '<!DOCTYPE html><link rel="stylesheet" href="../style.css"><video src="../media/film.mp4"></video>' > "$DIST/Guide/team/index.html"
  echo 'body { color: #000 }' > "$DIST/Guide/style.css"
  head -c 3000000 /dev/urandom > "$DIST/Guide/media/film.mp4"
  head -c 2000 /dev/urandom > "$DIST/Guide/media/film.jpg"
fi
DIST="$(cd "$DIST" && pwd)"
FILES=()
while IFS= read -r f; do FILES+=("$f"); done < <(cd "$DIST" && find . -type f ! -name MANIFEST.tsv ! -name .DS_Store | sed 's|^\./||' | sort)
echo "   loading ${#FILES[@]} files from $DIST into local R2"
for f in "${FILES[@]}"; do
  "$W" r2 object put "tuku-client-artifacts/guides/$SLUG/$f" --file "$DIST/$f" --local --persist-to "$STATE" "${WL[@]}" >/dev/null 2>&1 \
    || { echo "local R2 put failed: $f"; exit 1; }
done
# One artifact object for the archive smoke test, put through the real admin upload below.
echo '<!DOCTYPE html><title>local test artifact</title>' > "$TMP/artifact.html"

echo "== start wrangler dev --local on $PORT"
"$W" dev "${WL[@]}" --local --persist-to "$STATE" --port "$PORT" --ip 127.0.0.1 > "$LOG" 2>&1 &
DEV_PID=$!
for _ in $(seq 1 60); do curl -s -o /dev/null "$BASE/admin" && break; sleep 0.5; done

COOKIE="$(cd "$WORKER" && node --no-warnings --input-type=module -e "
  import { signAccessCookie } from './src/services/crypto.js';
  console.log(await signAccessCookie('$SLUG', Date.now() + 3600e3, process.argv[1]));" "$SECRET")"
EXPIRED="$(cd "$WORKER" && node --no-warnings --input-type=module -e "
  import { signAccessCookie } from './src/services/crypto.js';
  console.log(await signAccessCookie('$SLUG', Date.now() - 1000, process.argv[1]));" "$SECRET")"
OTHER="$(cd "$WORKER" && node --no-warnings --input-type=module -e "
  import { signAccessCookie } from './src/services/crypto.js';
  console.log(await signAccessCookie('other-client', Date.now() + 3600e3, process.argv[1]));" "$SECRET")"
FORGED="$(cd "$WORKER" && node --no-warnings --input-type=module -e "
  import { signAccessCookie } from './src/services/crypto.js';
  console.log(await signAccessCookie('$SLUG', Date.now() + 3600e3, 'not-the-secret'));")"
C=(-H "Cookie: tuku_access_$SLUG=$COOKIE")
G="$BASE/clients/guide/$SLUG"
HTML=(-H 'Accept: text/html,application/xhtml+xml,*/*;q=0.8')
FILM="$(printf '%s\n' "${FILES[@]}" | grep '\.mp4$' | head -1)"
CSS="$(printf '%s\n' "${FILES[@]}" | grep -E '\.(css|jpg)$' | head -1)"

echo "== signed out"
check "index, HTML request -> 302"            302 "$(code "${HTML[@]}" "$G/")"
check "302 goes to the gate with ?next="      "/clients/$SLUG/?next=%2Fclients%2Fguide%2F$SLUG%2FGuide%2Fteam%2Findex.html" \
                                              "$(header location "${HTML[@]}" "$G/Guide/team/index.html")"
check "film -> 401"                           401 "$(code "$G/$FILM")"
check "film with Range -> 401"                401 "$(code -H 'Range: bytes=0-1' "$G/$FILM")"
check "film HEAD -> 401"                      401 "$(code -I "$G/$FILM")"
check "css/jpg -> 401 ($CSS)"                 401 "$(code "$G/$CSS")"
check "page, non-HTML Accept -> 401"          401 "$(code "$G/index.html")"
check "401 body is not content"               "Unauthorized" "$(curl -s "$G/$FILM")"
check "expired cookie -> 401"                 401 "$(code -H "Cookie: tuku_access_$SLUG=$EXPIRED" "$G/$FILM")"
check "forged signature -> 401"               401 "$(code -H "Cookie: tuku_access_$SLUG=$FORGED" "$G/$FILM")"
check "other client's cookie -> 401"          401 "$(code -H "Cookie: tuku_access_other-client=$OTHER" "$G/$FILM")"
check "other client's cookie under our name"  401 "$(code -H "Cookie: tuku_access_$SLUG=$OTHER" "$G/$FILM")"
check "no-store on the 302"                   "private, no-store" "$(header cache-control "${HTML[@]}" "$G/")"

echo "== signed in: every file"
bad=0
for f in "${FILES[@]}"; do
  got="$(curl -s "${C[@]}" -o "$TMP/got" -w '%{http_code}' "$G/$f")"
  if [ "$got" != 200 ] || ! cmp -s "$TMP/got" "$DIST/$f"; then bad=$((bad + 1)); echo "        $got $f"; fi
done
check "all ${#FILES[@]} files 200 and byte-identical" 0 "$bad"
check "index at /"                           200 "$(code "${C[@]}" "$G/")"
check "no trailing slash -> 301"             301 "$(code "${C[@]}" "$G")"
check "301 target"                           "/clients/guide/$SLUG/" "$(header location "${C[@]}" "$G")"
check "trailing slash folder -> index.html"  200 "$(code "${C[@]}" "$G/Guide/team/")"
check "missing file -> 404"                  404 "$(code "${C[@]}" "$G/Guide/nope.html")"
check "unknown extension -> 404"             404 "$(code "${C[@]}" "$G/MANIFEST.tsv")"
check "HTML content type"                    "text/html; charset=utf-8" "$(header content-type "${C[@]}" "$G/")"
check "HTML cache"                           "private, no-store" "$(header cache-control "${C[@]}" "$G/")"
check "asset cache"                          "private, max-age=3600" "$(header cache-control "${C[@]}" "$G/$FILM")"
check "noindex"                              "noindex, nofollow" "$(header x-robots-tag "${C[@]}" "$G/$FILM")"
check "mp4 content type"                     "video/mp4" "$(header content-type "${C[@]}" "$G/$FILM")"

echo "== signed in: Range on every film"
for f in $(printf '%s\n' "${FILES[@]}" | grep '\.mp4$'); do
  size=$(wc -c < "$DIST/$f" | tr -d ' ')
  check "$f bytes=0-1 -> 206"                206 "$(code "${C[@]}" -H 'Range: bytes=0-1' "$G/$f")"
  check "$f Content-Range 0-1"               "bytes 0-1/$size" "$(header content-range "${C[@]}" -H 'Range: bytes=0-1' "$G/$f")"
  mid=$((size / 2))
  curl -s "${C[@]}" -H "Range: bytes=$mid-$((mid + 65535))" -o "$TMP/part" "$G/$f"
  check "$f middle 64 KiB matches the file"  "ok" "$(dd if="$DIST/$f" bs=1 skip=$mid count=65536 2>/dev/null | cmp -s - "$TMP/part" && echo ok)"
  check "$f open-ended range"                "bytes $mid-$((size - 1))/$size" "$(header content-range "${C[@]}" -H "Range: bytes=$mid-" "$G/$f")"
  check "$f suffix range"                    "bytes $((size - 500))-$((size - 1))/$size" "$(header content-range "${C[@]}" -H 'Range: bytes=-500' "$G/$f")"
  check "$f HEAD length"                     "$size" "$(header content-length -I "${C[@]}" "$G/$f")"
  check "$f range past the end -> 416"       416 "$(code "${C[@]}" -H "Range: bytes=$size-" "$G/$f")"
done

echo "== signed in: traversal and other clients"
check "encoded ../ (%2e%2e%2f) refused"      400 "$(code --path-as-is "${C[@]}" "$G/Guide/%2e%2e%2f%2e%2e%2fx.html")"
check "encoded slash (..%2f) refused"        400 "$(code --path-as-is "${C[@]}" "$G/..%2f..%2fartifacts%2fx.html")"
check "backslash (%5c) refused"              400 "$(code --path-as-is "${C[@]}" "$G/..%5c..%5cx.html")"
check "double-encoded (%252e) refused"       400 "$(code --path-as-is "${C[@]}" "$G/%252e%252e/x.html")"
check "NUL (%00) refused"                    400 "$(code --path-as-is "${C[@]}" "$G/index.html%00.css")"
check "literal ../ resolves inside prefix"   200 "$(code --path-as-is "${C[@]}" "$G/Guide/../index.html")"
check "literal ../ out of the prefix -> 404" 404 "$(code --path-as-is "${C[@]}" "$G/../../../etc/passwd.txt")"
check "slug without a guide -> 404"          404 "$(code -H "Cookie: tuku_access_other-client=$OTHER" "$BASE/clients/guide/other-client/")"
check "POST not routed"                      404 "$(code -X POST "${C[@]}" "$G/")"

echo "== existing archive routes"
check "unlock, wrong passphrase -> 401"      401 "$(code -X POST -H 'Content-Type: application/json' -d '{"passphrase":"nope"}' "$BASE/clients/unlock/$SLUG")"
SETC="$(curl -s -D - -o /dev/null -X POST -H 'Content-Type: application/json' -d "{\"passphrase\":\"$PASS\"}" "$BASE/clients/unlock/$SLUG" | tr -d '\r' | grep -i '^set-cookie:')"
check "unlock sets Path=/clients, SameSite=Lax" "yes" "$(echo "$SETC" | grep -q 'Path=/clients;' && echo "$SETC" | grep -q 'SameSite=Lax' && echo yes)"
UC="$(echo "$SETC" | sed -E 's/^[Ss]et-[Cc]ookie: ([^;]*);.*/\1/')"
check "unlock cookie opens the guide"         200 "$(code -H "Cookie: $UC" "$G/$FILM")"
check "board, signed out -> 401"             401 "$(code "$BASE/clients/board/$SLUG")"
check "admin page -> 200"                    200 "$(code "$BASE/admin")"
check "admin clients, no token -> 401"       401 "$(code "$BASE/admin/clients")"
check "admin clients, token -> 200"          200 "$(code -H "Authorization: Bearer $ADMIN" "$BASE/admin/clients")"
UP="$(curl -s -H "Authorization: Bearer $ADMIN" -F client_id=$SLUG -F doc_name='Local test' -F title='Local test' \
      -F occurred_on=2026-10-17 -F session_label='local test' -F "file=@$TMP/artifact.html;type=text/html" "$BASE/admin/artifacts")"
check "admin upload -> ok"                   "true" "$(echo "$UP" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).ok))')"
BOARD="$(curl -s -H "Cookie: $UC" "$BASE/clients/board/$SLUG")"
AURL="$(echo "$BOARD" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const b=JSON.parse(s);console.log(b.artifacts.length?b.artifacts[0].url:"none")})')"
check "board, signed in, lists the upload"   "yes" "$( [ "$AURL" != none ] && echo yes)"
check "artifact, signed in -> 200"           200 "$(code -H "Cookie: $UC" "$BASE$AURL")"
check "artifact, signed out -> 401"          401 "$(code "$BASE$AURL")"
LC="$(curl -s -D - -o /dev/null -X POST "$BASE/clients/lock/$SLUG" | tr -d '\r' | grep -i '^set-cookie:')"
check "lock clears the cookie"               "yes" "$(echo "$LC" | grep -q 'Max-Age=0' && echo yes)"

echo
echo "$PASSED passed, $FAILED failed"
[ "$FAILED" = 0 ]
