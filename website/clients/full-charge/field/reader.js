/**
 * Full Charge — in-page artifact reader.
 * Ported from the docOpen overlay in Full Charge Field.dc.html. Takes an
 * artifact object; has no knowledge of the board. Never navigates the page
 * or touches history/URL - it's an overlay, closing returns to the field
 * at whatever view it was already at.
 *
 * Zoom is a true reflow zoom, not a visual scale-only trick: the iframe's
 * CSS width is set to 100/zoom% of the scroll container and then the whole
 * wrap is counter-scaled by `zoom`, so the artifact's own layout actually
 * reflows at each zoom level (matching the design file's docWrapW/docZoom
 * behavior). Because of that, iframe height can't be a fixed constant - it
 * depends on the specific artifact's content height at the current width,
 * so it's measured live via the iframe's own document (same-origin, since
 * artifacts are always served from this site) and re-measured whenever
 * that content's height changes, including after a zoom-triggered reflow.
 */

const FONTS_HREF = 'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap';
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.0;
const ZOOM_STEP = 0.15;

function injectFonts() {
  if (document.querySelector(`link[href="${FONTS_HREF}"]`)) return;
  const preconnect = document.createElement('link');
  preconnect.rel = 'preconnect';
  preconnect.href = 'https://fonts.gstatic.com';
  preconnect.crossOrigin = 'anonymous';
  document.head.appendChild(preconnect);

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = FONTS_HREF;
  document.head.appendChild(stylesheet);
}

function injectStylesheetOnce() {
  if (document.querySelector('link[data-fcr-css]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  // Cache-busting query param - see the matching comment in field/index.html.
  // Bump this same "?v=" string here whenever reader.css changes.
  link.href = new URL('./reader.css?v=20260825b', import.meta.url).href;
  link.setAttribute('data-fcr-css', '');
  document.head.appendChild(link);
}

const CLOSE_ICON_SVG = `
  <svg viewBox="0 0 42 42">
    <circle cx="21" cy="21" r="19" fill="none" stroke="rgba(242,239,233,0.32)" stroke-width="1.4"></circle>
    <g stroke="#F2EFE9" stroke-width="2.6" stroke-linecap="round">
      <path d="M13.5 13 L28.5 29"></path>
      <path d="M28.5 13 L13.5 29"></path>
    </g>
  </svg>`;

export class FullChargeReader {
  constructor(mountElement) {
    this.mount = mountElement;
    this.zoom = 1;
    this.artifact = null;
    this.openedAt = null;
    this._closeCallbacks = [];
    this._zoomCallbacks = [];
    this._resizeObserver = null;

    injectFonts();
    injectStylesheetOnce();
    this._buildDom();
    this._onKeydown = this._onKeydown.bind(this);
  }

  onClose(callback) {
    this._closeCallbacks.push(callback);
  }

  /** callback receives {artifactId, zoom} - fires on each committed zoom change, not per drag/wheel tick. */
  onZoomChange(callback) {
    this._zoomCallbacks.push(callback);
  }

  open(artifact) {
    this.artifact = artifact;
    this.openedAt = Date.now();
    this.zoom = 1;

    // Design shows the full "Tuku Group_<Doc Name>_<date>" convention in the
    // toolbar (see Full Charge Field.dc.html docOpen header), not doc_name -
    // strip the .html extension the download_name carries for the <a download>.
    this.filenameEl.textContent = (artifact.download_name || artifact.doc_name || artifact.title || '').replace(/\.html$/i, '');
    this.kindEl.textContent = artifact.kind || 'HTML';
    this.openFullLink.href = artifact.url;
    this.saveCopyLink.href = artifact.download_url;
    this.saveCopyLink.setAttribute('download', artifact.download_name || '');

    this._applyZoom();
    this.iframe.src = artifact.url;

    this.root.style.display = 'flex';
    document.addEventListener('keydown', this._onKeydown);
  }

  close() {
    if (this.root.style.display === 'none') return;
    this.root.style.display = 'none';
    document.removeEventListener('keydown', this._onKeydown);

    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }

    const durationMs = this.openedAt ? Date.now() - this.openedAt : 0;
    const artifactId = this.artifact ? this.artifact.id : null;
    this.openedAt = null;

    // Stop whatever's in the iframe (media, timers) and free it.
    this.iframe.src = 'about:blank';

    this._closeCallbacks.forEach((cb) => {
      try {
        cb({ durationMs, artifactId });
      } catch (err) {
        console.error('[FullChargeReader] onClose callback failed', err);
      }
    });
  }

  _onKeydown(e) {
    if (e.key === 'Escape') this.close();
  }

  _buildDom() {
    const root = document.createElement('div');
    root.className = 'fcr-root';

    root.innerHTML = `
      <div class="fcr-toolbar">
        <div class="fcr-meta">
          <div class="fcr-filename"></div>
          <div class="fcr-kind"></div>
        </div>
        <div class="fcr-controls">
          <div class="fcr-zoom">
            <button type="button" class="fcr-zoom-out" aria-label="Zoom out">&minus;</button>
            <button type="button" class="fcr-zoom-label fcr-zoom-reset">100%</button>
            <button type="button" class="fcr-zoom-in" aria-label="Zoom in">+</button>
          </div>
          <a class="fcr-mark-link fcr-open-full" target="_blank" rel="noopener"><span class="fcr-mark-square"></span>OPEN FULL</a>
          <a class="fcr-mark-link fcr-save-copy"><span class="fcr-mark-square"></span>SAVE A COPY</a>
          <button type="button" class="fcr-close" aria-label="Close document">${CLOSE_ICON_SVG}</button>
        </div>
      </div>
      <div class="fcr-scroll">
        <div class="fcr-wrap">
          <iframe class="fcr-frame" title="artifact"></iframe>
        </div>
      </div>
    `;

    this.mount.appendChild(root);

    this.root = root;
    this.filenameEl = root.querySelector('.fcr-filename');
    this.kindEl = root.querySelector('.fcr-kind');
    this.zoomLabelEl = root.querySelector('.fcr-zoom-reset');
    this.openFullLink = root.querySelector('.fcr-open-full');
    this.saveCopyLink = root.querySelector('.fcr-save-copy');
    this.scrollEl = root.querySelector('.fcr-scroll');
    this.wrapEl = root.querySelector('.fcr-wrap');
    this.iframe = root.querySelector('.fcr-frame');

    root.querySelector('.fcr-zoom-out').addEventListener('click', () => this._setZoom(this.zoom - ZOOM_STEP));
    root.querySelector('.fcr-zoom-in').addEventListener('click', () => this._setZoom(this.zoom + ZOOM_STEP));
    root.querySelector('.fcr-zoom-reset').addEventListener('click', () => this._setZoom(1));
    root.querySelector('.fcr-close').addEventListener('click', () => this.close());

    this.iframe.addEventListener('load', () => this._onFrameLoad());
  }

  _setZoom(next, { silent = false } = {}) {
    const clamped = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, +next.toFixed(2)));
    if (clamped === this.zoom) return;
    this.zoom = clamped;
    this._applyZoom();

    if (silent) return;

    const artifactId = this.artifact ? this.artifact.id : null;
    this._zoomCallbacks.forEach((cb) => {
      try {
        cb({ artifactId, zoom: this.zoom });
      } catch (err) {
        console.error('[FullChargeReader] onZoomChange callback failed', err);
      }
    });
  }

  _applyZoom() {
    this.zoomLabelEl.textContent = Math.round(this.zoom * 100) + '%';
    this.wrapEl.style.width = (100 / this.zoom) + '%';
    this.wrapEl.style.transform = `scale(${this.zoom})`;
    // The width change reflows the same-origin iframe's content; the
    // ResizeObserver set up in _onFrameLoad picks up the resulting height
    // change on its own. Nothing further to do here.
  }

  _onFrameLoad() {
    let doc;
    try {
      doc = this.iframe.contentDocument;
    } catch (err) {
      // Cross-origin fallback (shouldn't happen - artifacts are same-origin):
      // the iframe scrolls itself and we can't measure or forward wheel.
      return;
    }
    if (!doc) return;

    const measure = () => {
      const h = doc.documentElement.scrollHeight || doc.body.scrollHeight || 0;
      this.iframe.style.height = h + 'px';
    };
    measure();

    // Fit-to-width: an artifact authored with a fixed, non-responsive
    // layout won't reflow to the 100%-width iframe - its content just
    // overflows sideways inside .fcr-scroll instead, which on a narrow
    // (mobile) screen reads as the document running off screen. Detect
    // that by comparing the natural content width against what's actually
    // available and, if it's wider, start at a lower zoom - reusing the
    // same reflow-zoom mechanism the +/- controls use - so the artifact is
    // visible in full on open instead of requiring a sideways scroll the
    // toolbar never hints at. Only runs once, at open (load fires once per
    // src set; changing zoom afterward doesn't re-trigger it).
    const availableWidth = this.scrollEl.clientWidth;
    const naturalWidth = doc.documentElement.scrollWidth;
    if (availableWidth > 0 && naturalWidth > availableWidth + 2) {
      this._setZoom(availableWidth / naturalWidth, { silent: true });
    }

    if (this._resizeObserver) this._resizeObserver.disconnect();
    this._resizeObserver = new ResizeObserver(measure);
    this._resizeObserver.observe(doc.documentElement);

    try {
      this.iframe.contentWindow.addEventListener(
        'wheel',
        (ev) => {
          this.scrollEl.scrollTop += ev.deltaY;
          ev.preventDefault();
        },
        { passive: false }
      );
    } catch (err) {
      // Cross-origin: iframe scrolls itself.
    }
  }
}
