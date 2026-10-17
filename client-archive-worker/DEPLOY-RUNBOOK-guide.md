# Deploy runbook: client guide route (`/clients/guide/<slug>/`)

Ships the Full Charge team on-site guide at `https://tukugroup.com/clients/guide/full-charge/`, behind the existing Full Charge passphrase, opened from a "On-site guide" card on `/clients/full-charge/field/`.

Three production changes, in this order. Each step is safe on its own, so a stop between steps leaves nothing broken.

1. **R2 upload.** The guide files go to `tuku-client-artifacts` under `guides/full-charge/`. Nothing serves them until step 2.
2. **Worker deploy.** This adds the `tukugroup.com/clients/guide/*` route and the handler. The guide works by direct URL from here on.
3. **Static deploy.** This adds the field card and the gate's `?next=` return. Cloudflare Pages deploys it from `main`.

No guide content goes into this repository. The staged folder lives outside it, in the Full Charge project: `Team On-Site/Freeze prep/ship/dist-guide/`.

## Variables

```bash
REPO="/Users/falonbahal/Desktop/DEVELOPMENT/TUKU-GROUP/01-TUKU-GROUP-dev"
WORKER="$REPO/client-archive-worker"
W="$WORKER/node_modules/.bin/wrangler"          # wrangler 3.114.17
TOS="/Users/falonbahal/Desktop/DEVELOPMENT/TUKU-GROUP/21 - MFSP/Full Charge/Project Management/Team On-Site"
SHIP="$TOS/Freeze prep/ship"
DIST="$SHIP/dist-guide"
```

## 0. Before the gate (local only)

```bash
cd "$TOS/Guide" && python3 team_scan.py                         # last line: 0 uncleared line(s)
python3 -I "$SHIP/stage.py" "$TOS" "$DIST" --r2                  # last line: Stage OK
python3 -I "$SHIP/check-guide-links.py" "$DIST"                  # last line: Links OK
"$WORKER/test/guide-local.sh" "$DIST"                            # last line: N passed, 0 failed
cd "$WORKER" && "$W" deploy --dry-run --env production           # lists ARTIFACTS, CLIENT_ARCHIVE_DB, RATE_LIMIT
```

`stage.py --r2` lifts the 25 MiB Pages limit, so the full 72 MB motion reel ships, and it writes no `_headers`, since the worker sets every header.

Sign in to Cloudflare, then confirm the account and the production secret:

```bash
cd "$WORKER"
"$W" whoami                         # names the account that holds tukugroup.com; if not: ! "$W" login
"$W" secret list --env production   # lists COOKIE_SECRET (already set; the unlock route depends on it)
"$W" r2 bucket dev-url get tuku-client-artifacts   # must say the r2.dev URL is disabled
```

## The approval gate

Nothing below runs without Falon's explicit yes to this prompt.

```
🚨 PRODUCTION DEPLOYMENT APPROVAL REQUIRED 🚨

Changes ready for production:
- R2: upload the team on-site guide (N files, 95.7 MB, three films included) to
  tuku-client-artifacts/guides/full-charge/
- Worker tuku-client-archive-api (env production): new route
  tukugroup.com/clients/guide/* serving those files behind the Full Charge cookie,
  with byte ranges for the films
- Static site (dev -> main): "On-site guide" card on /clients/full-charge/field/,
  opening /clients/guide/full-charge/ in a new tab; the gate returns to ?next= after unlock
- Local testing: test/guide-local.sh against the staged guide: [N passed, 0 failed]
- Quality checks: team scan [0], stage.py [Stage OK], check-guide-links.py [Links OK],
  security scan [clean], wrangler deploy --dry-run [bindings listed]

⚠️  This will deploy to live public site (tukugroup.com)

Proceed with production deployment? (Requires explicit approval)
```

## 1. R2 upload

```bash
"$SHIP/upload-guide.sh" "$DIST" --print     # review: one put per file, keys under guides/full-charge/
"$SHIP/upload-guide.sh" "$DIST" --remote    # PRODUCTION
```

The script reads `MANIFEST.tsv`, sets each content type, and leaves `MANIFEST.tsv` itself local. Check one object arrived:

```bash
"$W" r2 object get tuku-client-artifacts/guides/full-charge/index.html --pipe | head -c 200
```

## 2. Worker deploy

```bash
cd "$WORKER" && "$W" deploy --env production
```

The output lists six routes plus `tukugroup.com/clients/guide/*`. A deploy replaces the whole route set at once, so check all of them in the post-deploy section.

## 3. Static deploy

`dev` is a fast-forward of `origin/main` (checked 2026-10-17: `git log origin/main..dev` held only this change). Push `dev`, then fast-forward `main` from it. This leaves the separate `main` worktree at `01-TUKU GROUP/`, which has local changes, untouched.

```bash
cd "$REPO"
find . -name "*.env*" -not -path "./node_modules/*" -not -path "*/node_modules/*"
grep -r "pk_live\|sk_live\|whsec_" . --exclude-dir=node_modules
git push origin dev
git push origin dev:main            # refuses if main moved; then merge in the main worktree instead
```

Cloudflare Pages publishes `main` in about a minute. `field/index.html` loads `board.js?v=20261017b`, so browsers fetch the new card code at once.

## Post-deploy checks

Signed out:

```bash
B=https://tukugroup.com/clients/guide/full-charge
curl -sI -H 'Accept: text/html' "$B/" | grep -iE '^(HTTP|location)'          # 302, location /clients/full-charge/?next=...
curl -sI "$B/Guide/media/motion-reel.mp4" | grep -i '^HTTP'                   # 401
curl -sI -H 'Range: bytes=0-1' "$B/Guide/media/motion-reel.mp4" | grep -i '^HTTP'   # 401
curl -s "$B/Guide/media/motion-reel.mp4" | head -c 40; echo                  # Unauthorized
curl -sI "$B/../../board/full-charge" --path-as-is | grep -i '^HTTP'          # 401, the board's own check
for p in unlock/full-charge lock/full-charge; do curl -s -o /dev/null -w "%{http_code} $p\n" -X POST "https://tukugroup.com/clients/$p"; done   # 400 (no body) and 200
curl -s -o /dev/null -w '%{http_code} board\n' https://tukugroup.com/clients/board/full-charge     # 401
curl -s -o /dev/null -w '%{http_code} admin\n' https://tukugroup.com/admin                         # 200
curl -s -o /dev/null -w '%{http_code} gate\n'  https://tukugroup.com/clients/full-charge/          # 200, from Pages
```

Signed in, on a laptop:

1. Open `https://tukugroup.com/clients/full-charge/field/` and unlock. The "On-site guide" card sits at the next free tick.
2. Click it. The guide opens in a new tab, signed in.
3. Walk the rail. Open the films page and play and seek each film.

Signed in, on an iPhone in Safari:

1. Open `https://tukugroup.com/clients/guide/full-charge/Guide/team/index.html#films` signed out. The gate shows. Unlock, and the films page opens.
2. Play each film and drag to its middle. Safari plays only when byte ranges work.

## Rollback

Fastest, guide offline in one minute: delete the guide's objects. The route then answers 404 for every file, and the rest of the archive is untouched.

```bash
cut -f1 "$DIST/MANIFEST.tsv" | tail -n +2 | while read -r rel; do
  "$W" r2 object delete "tuku-client-artifacts/guides/full-charge/$rel"
done
```

Remove the card and the `?next=` return: `git revert <static commit>` on `dev`, then repeat step 3.

Remove the route: check out the worker from before this change and deploy it, then return to `dev`.

```bash
cd "$REPO" && git checkout d2f9f2b -- client-archive-worker/src client-archive-worker/wrangler.toml
cd "$WORKER" && "$W" deploy --env production
cd "$REPO" && git checkout dev -- client-archive-worker/src client-archive-worker/wrangler.toml
```

A later upload overwrites keys in place. A file dropped from the guide stays in R2 until deleted by name.

## Local test record, 2026-10-17

All local: `wrangler dev --local` with a temp config, a temp persisted D1, R2 and KV, and random dev-only secrets. No call reached Cloudflare.

- `test/guide-local.sh` with no argument (synthetic guide): 53 passed, 0 failed.
- `test/guide-local.sh "$DIST"` (the staged guide, 31 files, 95.7 MB): 67 passed, 0 failed. It covered these checks:
  - Signed out: a page gets a 302 to the gate with `?next=`; a film, a ranged film request, a HEAD and a CSS or JPG file each get a 401. An expired cookie, a forged signature and another client's cookie each get a 401.
  - Signed in: all 31 files return 200 and match the staged bytes. The response headers are right. Each of the three films answers 206 with the correct `Content-Range`, and its middle 64 KiB matches the file. A HEAD answers with the full length, and a range past the end gets a 416.
  - Traversal: `%2e%2e%2f`, `..%2f`, `%5c`, `%252e` and `%00` each get a 400. A literal `../` that leaves the prefix gets a 404. A slug without a guide gets a 404.
  - Existing routes: unlock, lock, board, admin page, admin clients, admin upload and the artifact all work, signed in and out.
- `check-guide-links.py`: 174 links resolve under `/clients/guide/full-charge/`.
- Chrome, through a local proxy that stands in for Pages: the signed-out guide URL went to the gate. Unlock returned to the films page with `#films` kept. The field showed the card with `href=/clients/guide/full-charge/`, `target=_blank` and `rel=noopener`, and the gate's still preview showed no guide card. Chrome did not load the films in the automation tab, because the tab was hidden. So the films were played over HTTP with ffmpeg instead: all three probed and decoded a frame at 60% through ranged seeks (motion 48 s, athlete 54 s, PWA 97.9 s).
- Not tested: Safari and iPhone playback. The post-deploy checks above cover it.
