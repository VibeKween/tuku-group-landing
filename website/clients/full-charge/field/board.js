/**
 * The Field — spatial board for the Full Charge client archive.
 * Vanilla reimplementation of the approved design
 * (website/design_handoff_full_charge/Full Charge Field.dc.html) — that
 * file's DCLogic/React runtime is a design-preview tool only and is not
 * shipped here. Every timing/easing/coordinate constant below is lifted
 * directly from that file's <script type="text/x-dc"> Component class.
 */
import { FullChargeReader } from './reader.js';

const W = 2600, H = 1300, HDR = 180;
const WORDS = ['purpose', 'clarity', 'craft', 'intention', 'candor', 'collaboration', 'thoughtfulness', 'momentum'];
const WORD_HOLD = 1350;
const MARK_DELAY = 620;
const TICKS = [300, 980, 1660, 2340]; // fixed decorative timeline slots, always drawn regardless of data
const CAPTION_HEIGHT = 46; // .fc-caption's own height + margin - see index.html
// Static hand-drawn chrono line — decorative, not data-driven (board.fixture.json carries the
// same literal path; the /clients/:client/board API does not return one, so this is the fallback
// and, in practice, the only source used today).
const CHRONO_PATH = 'M110 202 C560 190, 1020 214, 1600 199 C2000 189, 2230 208, 2470 197';

function gaEvent(name, params) {
  if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
}

function slugParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

export class FullChargeBoard {
  constructor(root) {
    this.root = root;
    this.stage = root.querySelector('[data-stage]');
    this.board = root.querySelector('[data-board]');
    this.headerEl = root.querySelector('[data-header]');
    this.footerEl = root.querySelector('[data-footer]');
    this.wordSlotA = root.querySelector('[data-word-a]');
    this.wordSlotB = root.querySelector('[data-word-b]');
    this.wordGhost = root.querySelector('[data-word-ghost]');
    this.wordBox = root.querySelector('[data-word-box]');
    this.squiggle = root.querySelector('[data-squiggle]');
    this.squiggle2 = root.querySelector('[data-squiggle-2]');
    this.hint = root.querySelector('[data-hint]');
    this.lockLink = root.querySelector('[data-lock]');
    this.fitBtn = root.querySelector('[data-fit]');
    this.latestBtn = root.querySelector('[data-latest]');
    this.readerMount = root.querySelector('[data-reader-mount]');

    this.still = /(\?|&)still(=1)?(&|$)/.test(window.location.search);
    this.reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.view = { x: 0, y: 0, s: 1 };
    this.zoomed = false;
    this.hinted = false;
    this.drag = null;
    this.t0 = Date.now();
    this.tilt = { x: 0, y: 0 };
    this.nearCard = null;
    this.cards = []; // { wrap, cardEl, cardX, cardY, tickX, hasCaption }
    this.wordIx = 0;
    this.slot = 'a';
    this.marked = false;

    this.reader = new FullChargeReader(this.readerMount);
    this.reader.onClose(({ durationMs, artifactId }) => {
      gaEvent('artifact_close', { artifact_id: artifactId, duration_ms: durationMs });
    });
    this.reader.onZoomChange(({ artifactId, zoom }) => {
      gaEvent('artifact_zoom', { artifact_id: artifactId, zoom });
    });

    this._bind();
  }

  _bind() {
    this.stage.addEventListener('pointerdown', (e) => this._onDown(e));
    window.addEventListener('pointermove', (e) => this._onMove(e));
    window.addEventListener('pointerup', () => this._onUp());
    window.addEventListener('resize', () => this._onResize());
    window.addEventListener('mousemove', (e) => this._onHover(e));

    if (this.fitBtn) this.fitBtn.addEventListener('click', () => { this.fitBoard(true); gaEvent('board_fit', {}); });
    if (this.latestBtn) this.latestBtn.addEventListener('click', () => { this.goLatest(true); gaEvent('board_latest_pin', {}); });
    if (this.lockLink) this.lockLink.addEventListener('click', (e) => { e.preventDefault(); this._lock(); });
  }

  async load(payload) {
    this.payload = payload;
    this._renderChrome(payload);
    this._renderChronoLine();
    this._renderArtifacts(payload);

    this.fitBoard(false);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => this._measureWord());
    this._measureWord();

    if (this.still || this.reduced) this._restWord();
    else this._advanceWord();

    this._raf = requestAnimationFrame((t) => this._tick(t));
  }

  _renderChrome(payload) {
    if (this.still) {
      this.root.querySelectorAll('[data-chrome]').forEach((el) => (el.style.display = 'none'));
    }
  }

  _renderChronoLine() {
    const path = (this.payload.board && this.payload.board.chrono_path) || CHRONO_PATH;
    const mainPath = this.root.querySelector('[data-chrono-path]');
    if (mainPath) mainPath.setAttribute('d', path);

    const ticksGroup = this.root.querySelector('[data-tick-marks]');
    if (ticksGroup) {
      ticksGroup.innerHTML = '';
      const ticks = (this.payload.board && this.payload.board.ticks && this.payload.board.ticks.length)
        ? this.payload.board.ticks
        : TICKS;
      // Always draw all four decorative slots (README section 2: the empty slots are
      // deliberate placeholders for future sessions), plus any tick beyond the fixed four.
      const allTicks = Array.from(new Set([...TICKS, ...ticks]));
      allTicks.forEach((x) => {
        const mark = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        mark.setAttribute('d', `M${x} 180 L${x + (x % 2 === 0 ? -1 : 1)} 228`);
        ticksGroup.appendChild(mark);
      });
    }
  }

  _renderArtifacts(payload) {
    const layer = this.root.querySelector('[data-artifact-layer]');
    layer.innerHTML = '';
    this.cards = [];

    const sessionsById = new Map((payload.sessions || []).map((s) => [s.id, s]));
    const connectorsSvg = this.root.querySelector('[data-connectors]');
    connectorsSvg.innerHTML = '';

    (payload.artifacts || []).forEach((artifact, i) => {
      const session = sessionsById.get(artifact.session_id);
      const tickX = (session && session.tick_x) || TICKS[i % TICKS.length];

      const cardX = artifact.board_x != null ? artifact.board_x : tickX - 170;
      const cardY = artifact.board_y != null ? artifact.board_y : 360;

      const hasCaption = !!(session && session.label);
      this._drawConnector(connectorsSvg, tickX, cardY, i);

      if (session) {
        const dateLabel = document.createElement('div');
        dateLabel.className = 'fc-date';
        dateLabel.style.left = `${tickX - 38}px`;
        dateLabel.style.top = '252px';
        dateLabel.textContent = this._formatShortDate(session.occurred_on);
        layer.appendChild(dateLabel);
      }

      const card = this._buildCard(artifact, session, cardX, cardY);
      layer.appendChild(card.wrap);
      this.cards.push({ ...card, cardX, cardY, tickX, hasCaption });
    });

    this._drawFutureReach(connectorsSvg, payload);
  }

  /**
   * Permanent decorative mark, not tied to a second real artifact existing -
   * see Full Charge Field.dc.html lines 46-48: a dashed plum curve reaches
   * from the latest card toward the next unused chrono tick, signaling "more
   * to come" even when there's only one artifact so far. README section 2
   * calls this out explicitly as a placeholder to keep, not a connector that
   * only appears once a second artifact exists.
   */
  _drawFutureReach(svg, payload) {
    if (!this.cards.length) return;
    const usedTicks = new Set((payload.sessions || []).map((s) => s.tick_x));
    const nextTick = TICKS.find((t) => !usedTicks.has(t));
    if (nextTick == null) return;

    const last = this.cards[this.cards.length - 1];
    const CARD_WIDTH = 520, PREVIEW_HEIGHT = 300;
    const boxTop = last.cardY + (last.hasCaption ? CAPTION_HEIGHT : 0);
    const startX = last.cardX + CARD_WIDTH + 12;
    const startY = boxTop + PREVIEW_HEIGHT * 0.71;
    const endY = startY - 46;
    const midX = startX + (nextTick - startX) * 0.35;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M${startX} ${startY} C${midX} ${startY - (startY - endY) * 0.4}, ${nextTick - 120} ${endY - (startY - endY) * 0.1}, ${nextTick} ${endY}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#8B7BB5');
    path.setAttribute('stroke-width', '3.4');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-dasharray', '14 12');
    path.style.animation = 'fcFade 0.6s ease both 2s';
    svg.appendChild(path);
  }

  _formatShortDate(occurredOn) {
    if (!occurredOn) return '';
    const [y, m, d] = occurredOn.split('-');
    return `${parseInt(m, 10)}.${parseInt(d, 10)}.${y.slice(2)}`;
  }

  _drawConnector(svg, tickX, cardY, index) {
    // First artifact gets the orange solid stroke straight from its tick (matches the
    // hand-authored path in the design file exactly when at the default position).
    // Every artifact after the first gets a dashed plum connector, alternating with any
    // future connector-color data the API supplies (see client-archive-worker README).
    // Deliberately a short decorative mark - it does not reach the card.
    const color = index === 0 ? '#E8542A' : '#8B7BB5';
    const dashed = index !== 0;
    const startY = 228;
    const endY = cardY - 24;
    // Matches the design's hand-authored path (Full Charge Field.dc.html:
    // "M300 228 C305 272, 299 304, 303 336") almost exactly - a near-vertical
    // wobble straight below the tick. It does NOT interpolate toward the
    // card's x-position; card placement is independent of this mark's shape.
    const span = endY - startY;
    const d = `M${tickX} ${startY} C${tickX + 5} ${startY + span * 0.39}, ${tickX - 1} ${startY + span * 0.7}, ${tickX + 3} ${endY}`;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', dashed ? '3.4' : '4');
    path.setAttribute('stroke-linecap', 'round');
    if (dashed) {
      path.setAttribute('stroke-dasharray', '14 12');
      path.style.animation = 'fcFade 0.6s ease both 2s';
    } else {
      // Measure the real path length rather than a fixed guess - a hardcoded
      // value shorter than the actual path silently clips the tail of the
      // stroke, since stroke-dasharray repeats "on/off" for that length
      // across the whole path rather than scaling to it.
      const len = path.getTotalLength();
      path.setAttribute('stroke-dasharray', String(len));
      path.style.strokeDashoffset = String(len);
      path.style.animation = 'fcDraw 0.6s ease-out forwards 1.5s';
    }
    svg.appendChild(path);
  }

  _buildCard(artifact, session, x, y) {
    const wrap = document.createElement('div');
    wrap.className = 'fc-card-wrap';
    wrap.style.left = `${x}px`;
    wrap.style.top = `${y}px`;
    wrap.style.animation = 'fcRise 0.7s cubic-bezier(0.16,1,0.3,1) both 0.9s';

    if (session && session.label) {
      const label = document.createElement('div');
      label.className = 'fc-caption';
      label.textContent = session.label;
      wrap.appendChild(label);
    }

    const card = document.createElement('div');
    card.className = 'fc-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Open ${artifact.title}`);

    const tape = document.createElement('div');
    tape.className = 'fc-tape';
    card.appendChild(tape);

    const previewBox = document.createElement('div');
    previewBox.className = 'fc-preview';
    const iframe = document.createElement('iframe');
    iframe.src = artifact.url;
    iframe.title = 'pinned doc preview';
    iframe.scrolling = 'no';
    iframe.tabIndex = -1;
    previewBox.appendChild(iframe);
    const fade = document.createElement('div');
    fade.className = 'fc-preview-fade';
    previewBox.appendChild(fade);
    card.appendChild(previewBox);

    // The pinned tick date (session.occurred_on) is the meeting date and is
    // locked once a doc's first version is uploaded - a later revision must
    // never imply the meeting itself moved. Version/update info lives here
    // on the card instead, separate from that pin.
    const versionNote = artifact.version > 1
      ? `<span class="fc-card-version">v${artifact.version}${artifact.updated_on ? ' &middot; updated ' + escapeHtml(this._formatShortDate(artifact.updated_on)) : ''}</span>`
      : '';

    const footer = document.createElement('div');
    footer.className = 'fc-card-footer';
    footer.innerHTML = `
      <div>
        <div class="fc-card-title">${escapeHtml(artifact.title)}</div>
        <div class="fc-card-kind">${escapeHtml(artifact.kind)}${versionNote}</div>
      </div>
      <div class="fc-card-open">OPEN &rarr;</div>
    `;
    card.appendChild(footer);
    wrap.appendChild(card);

    const openIt = () => {
      if (this.suppressClick) { this.suppressClick = false; return; }
      // Below this page's own mobile breakpoint, open the artifact as a
      // real top-level navigation instead of the in-page iframe reader.
      // Iframes never get the "shrink non-responsive content to fit the
      // screen" treatment mobile browsers apply to top-level page loads
      // without a viewport meta tag - a fixed-width artifact just overflows
      // sideways inside the reader's small iframe instead. A real tab gets
      // native shrink-to-fit and pinch-zoom for free, no custom zoom math.
      const isMobile = window.matchMedia('(max-width: 640px)').matches;
      if (isMobile) {
        window.open(artifact.url, '_blank', 'noopener');
      } else {
        this.reader.open(artifact);
      }
      gaEvent('artifact_open', { artifact_id: artifact.id, surface: isMobile ? 'tab' : 'reader' });
    };
    card.addEventListener('click', openIt);
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openIt(); } });

    return { wrap: wrap, cardEl: card };
  }

  // --- word rotation -----------------------------------------------------

  _restWord() {
    this.wordIx = WORDS.length - 1;
    this.marked = true;
    this._paintWord();
    this._measureWord();
    if (this.still) return;
    this.goLatest(false);
  }

  _advanceWord() {
    const last = WORDS.length - 1;
    this._wordTimer = setTimeout(() => {
      this.wordIx += 1;
      this.slot = this.slot === 'a' ? 'b' : 'a';
      this._paintWord();
      this._measureWord();
      if (this.wordIx === last - 1 && !this.zoomed) this.goLatest(true);
      if (this.wordIx < last) this._advanceWord();
      else this._wordTimer = setTimeout(() => { this.marked = true; this._paintSquiggle(); }, MARK_DELAY);
    }, WORD_HOLD);
  }

  _paintWord() {
    const word = WORDS[this.wordIx];
    const prevWord = WORDS[Math.max(0, this.wordIx - 1)];
    const active = this.slot === 'a' ? this.wordSlotA : this.wordSlotB;
    const inactive = this.slot === 'a' ? this.wordSlotB : this.wordSlotA;

    active.textContent = word;
    inactive.textContent = prevWord;

    active.style.opacity = '1';
    active.style.transform = 'translateY(0) rotate(0deg)';
    active.style.filter = 'blur(0px)';

    inactive.style.opacity = '0';
    inactive.style.transform = 'translateY(-0.36em) rotate(-1.8deg)';
    inactive.style.filter = 'blur(4px)';

    this.wordGhost.textContent = word;
    this._paintSquiggle();
  }

  _paintSquiggle() {
    const on = this.marked ? '1' : '0';
    const dash = this.marked ? '0' : '300';
    this.squiggle.style.opacity = on;
    this.squiggle.style.strokeDashoffset = dash;
    this.squiggle2.style.opacity = on;
    this.squiggle2.style.strokeDashoffset = dash;
  }

  _measureWord() {
    const w = Math.ceil(this.wordGhost.getBoundingClientRect().width) + 2;
    if (w > 0) this.wordBox.style.width = `${w}px`;
  }

  // --- view transform ------------------------------------------------------

  _apply(animate) {
    this.board.style.transition = animate ? 'transform 1.6s cubic-bezier(0.34,0.86,0.2,1)' : 'none';
    this.board.style.transform = `translate(${this.view.x}px, ${this.view.y}px) scale(${this.view.s})`;
  }

  fitBoard(animate) {
    this.zoomed = false;
    if (this.still) {
      const s = Math.max(0.5, Math.min(0.68, this.stage.clientWidth / 1500));
      this.view = { s, x: this.stage.clientWidth / 2 - 400 * s, y: this.stage.clientHeight / 2 - 400 * s };
      this._apply(false);
      return;
    }
    const availH = this.stage.clientHeight - HDR - 50;
    const s = Math.min(this.stage.clientWidth / W, availH / H) * 0.94;
    this.view = { s, x: this.stage.clientWidth / 2 - (W / 2) * s, y: HDR + availH / 2 - (H / 2) * s };
    this._apply(animate !== false);
  }

  goLatest(animate) {
    this.zoomed = true;
    const narrow = this.stage.clientWidth < 640;
    const hdr = narrow ? 150 : HDR;
    const availH = this.stage.clientHeight - hdr;
    const s = Math.min(0.9, (this.stage.clientWidth - (narrow ? 24 : 60)) / 580, Math.max(0.42, availH / 640));
    this.view = {
      s,
      x: Math.min(narrow ? 12 : 40, this.stage.clientWidth / 2 - 390 * s),
      y: hdr - (narrow ? 34 : 20) - 198 * s,
    };
    this._apply(animate !== false);
  }

  _onResize() {
    this._measureWord();
    if (this.zoomed) this.goLatest(false); else this.fitBoard(false);
  }

  // --- drag ------------------------------------------------------------

  _onDown(e) {
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.fc-card')) return;
    this.drag = { x: e.clientX, y: e.clientY, vx: this.view.x, vy: this.view.y, moved: false };
    this.stage.style.cursor = 'grabbing';
  }

  _onMove(e) {
    if (!this.drag) return;
    const dx = e.clientX - this.drag.x, dy = e.clientY - this.drag.y;
    if (!this.drag.moved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
      this.drag.moved = true;
      if (!this.hinted) {
        this.hinted = true;
        this.hint.style.opacity = '0';
        gaEvent('board_drag', {});
      }
    }
    this.view.x = this.drag.vx + dx;
    this.view.y = this.drag.vy + dy;
    this._apply(false);
  }

  _onUp() {
    if (!this.drag) return;
    this.suppressClick = this.drag.moved;
    this.stage.style.cursor = 'grab';
    this.drag = null;
  }

  // --- card 3D loop (single rAF, never per-render) ------------------------

  _onHover(e) {
    let nearest = null;
    for (const card of this.cards) {
      const r = card.cardEl.getBoundingClientRect();
      if (!r.width || r.bottom < -300 || r.top > window.innerHeight + 300) continue;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const near = Math.abs(e.clientX - cx) < r.width * 1.4 && Math.abs(e.clientY - cy) < r.height * 1.4;
      card._tiltTarget = {
        near,
        x: Math.max(-1, Math.min(1, (e.clientX - cx) / (r.width * 0.85))) * (near ? 1 : 0.25),
        y: Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height * 1.2))) * (near ? 1 : 0.25),
      };
      if (near) nearest = card;
    }
    this.nearCard = nearest;
  }

  _tick() {
    const t = (Date.now() - this.t0) / 1000;
    const driftY = Math.sin(t * 0.62) * 1.1;
    const driftX = Math.cos(t * 0.48) * 0.9;

    for (const card of this.cards) {
      const tilt = card._tiltTarget || { x: 0, y: 0, near: false };
      const ry = tilt.x * 6 + driftX;
      const rx = -tilt.y * 4.5 + driftY * 0.5;
      const lift = tilt.near ? 6 : 0;
      card.cardEl.style.transform = `perspective(1400px) rotate(-0.7deg) translate3d(0, ${driftY * 1.6 - lift}px, 0) rotateY(${ry}deg) rotateX(${rx}deg)`;
      card.cardEl.style.boxShadow = `${-ry * 2.6}px ${34 + rx * 2 + lift}px ${52 + lift * 2}px rgba(0,0,0,${tilt.near ? 0.55 : 0.45})`;
    }
    this._raf = requestAnimationFrame((tt) => this._tick(tt));
  }

  async _lock() {
    try {
      await fetch(`/clients/lock/full-charge`, { method: 'POST', credentials: 'same-origin' });
    } catch (err) { /* best-effort: navigate regardless */ }
    gaEvent('lock', {});
    window.location.href = '../';
  }

  destroy() {
    cancelAnimationFrame(this._raf);
    clearTimeout(this._wordTimer);
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}
