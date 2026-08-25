/** D1 query helpers. All functions take the D1 binding as the first arg. */

function slugify(docName) {
  return docName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatDownloadDate(occurredOn) {
  // '2026-08-19' -> '8.19.26'
  const [y, m, d] = occurredOn.split('-');
  return `${parseInt(m, 10)}.${parseInt(d, 10)}.${y.slice(2)}`;
}

export async function getAccessGrant(db, clientId) {
  return db
    .prepare('SELECT * FROM access_grants WHERE client_id = ? ORDER BY created_at DESC LIMIT 1')
    .bind(clientId)
    .first();
}

export async function logAccessAttempt(db, { clientId, ok, ipHash, userAgent }) {
  await db
    .prepare(
      'INSERT INTO access_log (id, client_id, ok, ip_hash, user_agent, at) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .bind(crypto.randomUUID(), clientId, ok ? 1 : 0, ipHash, userAgent ?? null, new Date().toISOString())
    .run();
}

export async function getBoardPayload(db, clientId) {
  const client = await db.prepare('SELECT * FROM clients WHERE id = ?').bind(clientId).first();
  if (!client) return null;

  const { results: sessions } = await db
    .prepare('SELECT * FROM sessions WHERE client_id = ? ORDER BY seq ASC')
    .bind(clientId)
    .all();

  const { results: artifacts } = await db
    .prepare(
      `SELECT a.* FROM artifacts a
       WHERE a.client_id = ? AND a.is_latest = 1
       ORDER BY a.created_at ASC`
    )
    .bind(clientId)
    .all();

  return {
    client: {
      id: client.id,
      name: client.name,
      site_url: client.site_url,
      accent_hex: client.accent_hex,
    },
    sessions: sessions.map((s) => ({
      id: s.id,
      seq: s.seq,
      occurred_on: s.occurred_on,
      label: s.label,
      tick_x: s.tick_x,
    })),
    artifacts: artifacts.map((a) => ({
      id: a.id,
      session_id: a.session_id,
      title: a.title,
      doc_name: a.doc_name,
      kind: a.kind,
      download_name: a.download_name,
      url: `/clients/${clientId}/artifact/${a.id}`,
      download_url: `/clients/${clientId}/artifact/${a.id}?download=1`,
      board_x: a.board_x,
      board_y: a.board_y,
      is_latest: !!a.is_latest,
      version: a.version,
      updated_on: (a.created_at || '').slice(0, 10),
      connector: a.connector_color
        ? { from_tick: null, color: a.connector_color, style: 'solid' }
        : null,
    })),
    board: {
      width: 2600,
      height: 1300,
      ticks: sessions.map((s) => s.tick_x),
    },
  };
}

export async function getArtifactById(db, clientId, artifactId) {
  return db
    .prepare('SELECT * FROM artifacts WHERE id = ? AND client_id = ?')
    .bind(artifactId, clientId)
    .first();
}

/** Admin dashboard: every client, with a cheap artifact count for the list view. */
export async function listClientsWithCounts(db) {
  const { results } = await db
    .prepare(
      `SELECT c.id, c.name, c.site_url, c.accent_hex,
              COUNT(DISTINCT a.doc_slug) AS doc_count
       FROM clients c
       LEFT JOIN artifacts a ON a.client_id = c.id
       GROUP BY c.id
       ORDER BY c.name ASC`
    )
    .all();
  return results;
}

/**
 * Admin dashboard: full version history for one client, newest version
 * first within each doc - deliberately every row, not just is_latest, so
 * the admin can see what a re-upload is about to supersede.
 */
export async function listArtifactHistory(db, clientId) {
  const { results } = await db
    .prepare(
      `SELECT id, doc_slug, doc_name, title, version, is_latest, created_at
       FROM artifacts WHERE client_id = ?
       ORDER BY doc_slug ASC, version DESC`
    )
    .bind(clientId)
    .all();
  return results;
}

const TICK_SPACING = 680;
const FIRST_TICK_X = 300;
const CONNECTOR_COLORS = ['#E8542A', '#8B7BB5']; // orange, plum - alternate per README section 5

/**
 * Finds or creates the session for (clientId, occurredOn), auto-placing its
 * chrono tick after the last known session for that client.
 */
async function findOrCreateSession(db, clientId, occurredOn, label) {
  const existing = await db
    .prepare('SELECT * FROM sessions WHERE client_id = ? AND occurred_on = ?')
    .bind(clientId, occurredOn)
    .first();
  if (existing) return existing;

  const last = await db
    .prepare('SELECT MAX(seq) as maxSeq FROM sessions WHERE client_id = ?')
    .bind(clientId)
    .first();
  const seq = (last?.maxSeq ?? 0) + 1;
  const tickX = FIRST_TICK_X + (seq - 1) * TICK_SPACING;
  const id = crypto.randomUUID();

  await db
    .prepare(
      'INSERT INTO sessions (id, client_id, seq, occurred_on, label, tick_x) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .bind(id, clientId, seq, occurredOn, label ?? null, tickX)
    .run();

  return { id, client_id: clientId, seq, occurred_on: occurredOn, label, tick_x: tickX };
}

/**
 * Admin-only, step 1: figure out what version this upload will be *before*
 * touching R2, so the R2 key can encode the version number and step 2 never
 * has to guess it.
 *
 * Also resolves the prior version's session, if any - a revision must keep
 * the artifact pinned to its original meeting date. That date is fixed the
 * moment a doc's first version is uploaded; re-uploading a later revision
 * must never move the pin or spawn a new chrono tick just because the
 * upload form's date field happened to default to today.
 */
export async function resolveNextVersion(db, clientId, docName) {
  const docSlug = slugify(docName);
  const prior = await db
    .prepare(
      `SELECT a.*, s.occurred_on AS session_occurred_on
       FROM artifacts a JOIN sessions s ON s.id = a.session_id
       WHERE a.client_id = ? AND a.doc_slug = ? ORDER BY a.version DESC LIMIT 1`
    )
    .bind(clientId, docSlug)
    .first();
  return {
    docSlug,
    version: (prior?.version ?? 0) + 1,
    priorId: prior?.id ?? null,
    priorSessionId: prior?.session_id ?? null,
    priorOccurredOn: prior?.session_occurred_on ?? null,
  };
}

/**
 * Admin-only, step 2: called after the file is already in R2 at r2Key.
 * Inserts a NEW artifact row (append-only versioning - see
 * migrations/0001_init.sql) and only then flips the prior row's is_latest.
 * Never updates an existing row's r2_key.
 */
export async function finalizeArtifactVersion(db, {
  clientId,
  occurredOn,
  sessionLabel,
  docSlug,
  version,
  priorId,
  priorSessionId,
  priorOccurredOn,
  docName,
  title,
  kind,
  r2Key,
  boardX,
  boardY,
}) {
  // A revision (priorId set) is pinned to the session its first version
  // established - the meeting date never moves just because a later
  // upload's date field defaulted to today. Only a doc's first-ever
  // version gets to find-or-create a session from the submitted date.
  const isRevision = !!priorId;
  const session = isRevision
    ? { id: priorSessionId }
    : await findOrCreateSession(db, clientId, occurredOn, sessionLabel);
  const effectiveOccurredOn = isRevision ? priorOccurredOn : occurredOn;

  const connectorCount = await db
    .prepare('SELECT COUNT(*) as n FROM artifacts WHERE client_id = ?')
    .bind(clientId)
    .first();
  const connectorColor = CONNECTOR_COLORS[(connectorCount?.n ?? 0) % 2];

  const id = crypto.randomUUID();
  const downloadName = `Tuku Group_${docName}_${formatDownloadDate(effectiveOccurredOn)}.html`;

  await db
    .prepare(
      `INSERT INTO artifacts
       (id, session_id, client_id, doc_slug, version, title, doc_name, kind, r2_key,
        download_name, board_x, board_y, connector_color, is_latest, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`
    )
    .bind(
      id,
      session.id,
      clientId,
      docSlug,
      version,
      title,
      docName,
      kind,
      r2Key,
      downloadName,
      boardX ?? null,
      boardY ?? null,
      connectorColor,
      new Date().toISOString()
    )
    .run();

  if (priorId) {
    await db.prepare('UPDATE artifacts SET is_latest = 0 WHERE id = ?').bind(priorId).run();
  }

  return { id, version, sessionId: session.id, downloadName, r2Key };
}

export { slugify, formatDownloadDate };
