/*!
 * TUKU balloon overlay — standalone, dependency-free.
 *
 *   <script src="/tuku-balloon.js" defer
 *           data-image="/assets/balloon-smiley.png"
 *           data-href="/clients"></script>
 *
 * or:  TukuBalloon.mount({ image: '...', href: '...' });
 *
 * Mounts a fixed-position overlay on <body>. Pointer events pass through
 * everywhere except the balloon itself and its label, so the underlying page
 * stays fully interactive.
 */
(function (global) {
  'use strict';

  var DEFAULTS = {
    image: '/balloon-smiley.png',
    href: '/clients',
    label: 'clients only!',
    riseDelay: 2,        // s before it enters
    riseDuration: 43,    // s to travel from below the fold to the ceiling
    balloonSize: 248,    // px, capped at 44vw
    breeze: 6,           // 0 = still air
    zIndex: 2147483000,
    once: false,         // true = show at most once per session (see note)
    storageKey: 'tuku:balloon:seen',
    respectReducedMotion: true
  };

  var STYLE_ID = 'tuku-balloon-style';
  var CSS = [
    '@keyframes tkBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}',
    '@keyframes tkSway{0%,100%{transform:rotate(-3.4deg)}50%{transform:rotate(3.6deg)}}',
    '@keyframes tkGradientFlow{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}',
    '.tk-balloon-field{position:fixed;inset:0;pointer-events:none;overflow:hidden}',
    '.tk-balloon{position:absolute;left:0;top:0;will-change:transform}',
    '.tk-balloon-bob{animation:tkBob 5.6s ease-in-out infinite}',
    '.tk-balloon-sway{position:relative;transform-origin:50% 12%;animation:tkSway 7.2s ease-in-out infinite alternate}',
    '.tk-balloon img{display:block;height:auto;filter:drop-shadow(0 14px 26px rgba(20,30,50,.16));pointer-events:auto;cursor:grab;touch-action:none;user-select:none;-webkit-user-drag:none}',
    '.tk-balloon-link{position:absolute;pointer-events:auto;font-family:"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.7rem;line-height:1.25;width:4.6em;letter-spacing:.06em;font-weight:600;',
    'background:linear-gradient(90deg,#D63FB8,#A855F7,#F472B6,#A855F7,#D63FB8);background-size:300% 100%;background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent;',
    'text-decoration:underline;text-decoration-color:#D63FB8;text-decoration-thickness:1px;text-underline-offset:2px;text-decoration-skip-ink:none;animation:tkGradientFlow 1.5s ease-in-out infinite}',
    '.tk-balloon-link:hover{opacity:.75}',
    '@media (prefers-reduced-motion: reduce){',
    '.tk-balloon-bob,.tk-balloon-sway,.tk-balloon-link{animation:none}}'
  ].join('');

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function Balloon(opts) {
    this.o = opts;
    this.phase = 'wait';
    this.pos = null;
    this.vel = { x: 0, y: 0 };
    this.seed = [Math.random() * 100, Math.random() * 100, Math.random() * 100];
    this.build();
    this.bind();
    this.start = performance.now();
    this.last = this.start;
    this.tick = this.tick.bind(this);
    this.raf = requestAnimationFrame(this.tick);
  }

  Balloon.prototype.build = function () {
    injectStyle();
    var o = this.o;
    var field = document.createElement('div');
    field.className = 'tk-balloon-field';
    field.style.zIndex = String(o.zIndex);

    var wrap = document.createElement('div');
    wrap.className = 'tk-balloon';
    var bob = document.createElement('div');
    bob.className = 'tk-balloon-bob';
    var sway = document.createElement('div');
    sway.className = 'tk-balloon-sway';

    var img = document.createElement('img');
    img.src = o.image;
    img.alt = '';
    img.draggable = false;
    img.style.width = 'min(' + o.balloonSize + 'px, 44vw)';

    var link = document.createElement('a');
    link.className = 'tk-balloon-link';
    link.href = o.href;
    link.textContent = o.label;
    link.style.left = 'calc(62% + 6px)';
    link.style.bottom = Math.round(o.balloonSize * 0.06) + 'px';

    sway.appendChild(img);
    sway.appendChild(link);
    bob.appendChild(sway);
    wrap.appendChild(bob);
    field.appendChild(wrap);
    document.body.appendChild(field);

    this.field = field;
    this.wrap = wrap;
    this.img = img;
    this.link = link;
  };

  Balloon.prototype.bind = function () {
    var self = this;
    this.onGrab = function (e) { self.grab(e); };
    this.onMove = function (e) { self.dragMove(e); };
    this.onUp = function () { self.release(); };
    this.img.addEventListener('pointerdown', this.onGrab);
    window.addEventListener('pointermove', this.onMove);
    window.addEventListener('pointerup', this.onUp);
    window.addEventListener('pointercancel', this.onUp);
  };

  Balloon.prototype.destroy = function () {
    cancelAnimationFrame(this.raf);
    this.img.removeEventListener('pointerdown', this.onGrab);
    window.removeEventListener('pointermove', this.onMove);
    window.removeEventListener('pointerup', this.onUp);
    window.removeEventListener('pointercancel', this.onUp);
    if (this.field.parentNode) this.field.parentNode.removeChild(this.field);
  };

  Balloon.prototype.metrics = function () {
    return {
      W: this.field.clientWidth || window.innerWidth,
      H: this.field.clientHeight || window.innerHeight,
      bw: this.img.offsetWidth || this.o.balloonSize,
      bh: this.img.offsetHeight || 340
    };
  };

  Balloon.prototype.grab = function (e) {
    if (!this.pos) return;
    this.phase = 'drag';
    this.grabOff = { x: e.clientX - this.pos.x, y: e.clientY - this.pos.y };
    this.vel = { x: 0, y: 0 };
    this.pointerId = e.pointerId;
    this.img.style.cursor = 'grabbing';
    try { this.img.setPointerCapture(e.pointerId); } catch (err) {}
    e.preventDefault();
  };

  Balloon.prototype.dragMove = function (e) {
    if (this.phase !== 'drag' || !this.pos) return;
    var nx = e.clientX - this.grabOff.x;
    var ny = e.clientY - this.grabOff.y;
    this.vel.x = (nx - this.pos.x) * 12;
    this.vel.y = (ny - this.pos.y) * 12;
    this.pos.x = nx;
    this.pos.y = ny;
    this.apply();
  };

  Balloon.prototype.release = function () {
    if (this.phase !== 'drag') return;
    this.phase = 'parked';
    this.vel = { x: 0, y: 0 };
    this.img.style.cursor = 'grab';
    try { if (this.pointerId != null) this.img.releasePointerCapture(this.pointerId); } catch (err) {}
    this.pointerId = null;
  };

  Balloon.prototype.tick = function (now) {
    this.raf = requestAnimationFrame(this.tick);
    var m = this.metrics(), W = m.W, H = m.H, bw = m.bw, bh = m.bh;
    if (!bw || !H) return;

    var pad = 24;
    var minX = pad;
    var maxX = Math.max(pad, W - bw - pad - (W < 640 ? 46 : 58));
    var maxY = H - bh - pad;
    var restY = pad + 6;
    var delayMs = this.o.riseDelay * 1000;
    var riseMs = this.o.riseDuration * 1000;
    var t = now - this.start;
    var dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;

    if (!this.pos) {
      this.startX = Math.min(maxX, W * 0.74);
      this.startY = H + 80;
      this.pos = { x: this.startX, y: this.startY };
      this.apply();
    }

    if (this.phase === 'drag' || this.phase === 'parked') return;

    if (this.phase === 'wait' || this.phase === 'rise') {
      if (t < delayMs) { this.apply(); return; }
      this.phase = 'rise';
      var p = Math.min(1, (t - delayMs) / riseMs);
      var ease = 1 - Math.pow(1 - p, 2.2);
      var sway = Math.sin(p * Math.PI * 2.4 + this.seed[0]) * (W * 0.045);
      var prev = { x: this.pos.x, y: this.pos.y };
      this.pos.y = this.startY + (restY - this.startY) * ease;
      this.pos.x = Math.max(minX, Math.min(maxX, this.startX + sway));
      if (dt > 0) { this.vel.x = (this.pos.x - prev.x) / dt; this.vel.y = (this.pos.y - prev.y) / dt; }
      if (p >= 1) { this.phase = 'float'; this.vel.y = 0; }
      this.apply();
      return;
    }

    var s = this.seed, time = t / 1000, strength = this.o.breeze;
    var bx = Math.sin(time * 0.14 + s[0]) * 0.7 + Math.sin(time * 0.053 + s[1]) * 1.0;
    var by = Math.sin(time * 0.11 + s[1]) * 0.4 + Math.sin(time * 0.041 + s[2]) * 0.5;
    this.vel.x += bx * strength * dt;
    this.vel.y += by * strength * 0.6 * dt;
    this.vel.y -= (this.pos.y - restY) * 0.9 * dt;

    var topBand = H * 0.34, leftCol = W * 0.3;
    if (this.pos.y > topBand && this.pos.x > leftCol) {
      this.vel.y -= (this.pos.y - topBand) * 1.2 * dt;
      this.vel.x -= (this.pos.x - leftCol) * 0.4 * dt;
    }

    this.vel.x *= Math.pow(0.5, dt);
    this.vel.y *= Math.pow(0.5, dt);
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;

    var bounce = 0.5;
    if (this.pos.x < minX) { this.pos.x = minX; this.vel.x = Math.abs(this.vel.x) * bounce; }
    if (this.pos.x > maxX) { this.pos.x = maxX; this.vel.x = -Math.abs(this.vel.x) * bounce; }
    if (this.pos.y < pad) { this.pos.y = pad; this.vel.y = Math.abs(this.vel.y) * bounce; }
    if (this.pos.y > maxY) { this.pos.y = maxY; this.vel.y = -Math.abs(this.vel.y) * bounce; }

    this.apply();
  };

  Balloon.prototype.apply = function () {
    if (this.pos) this.wrap.style.transform =
      'translate3d(' + this.pos.x.toFixed(1) + 'px,' + this.pos.y.toFixed(1) + 'px,0)';
  };

  /* Static (reduced-motion) variant: no rise, no physics, no drag. */
  function StaticBalloon(opts) {
    injectStyle();
    var field = document.createElement('div');
    field.className = 'tk-balloon-field';
    field.style.zIndex = String(opts.zIndex);
    var wrap = document.createElement('div');
    wrap.className = 'tk-balloon';
    wrap.style.left = 'auto';
    wrap.style.right = '78px';
    wrap.style.top = '30px';
    wrap.style.position = 'absolute';
    var img = document.createElement('img');
    img.src = opts.image;
    img.alt = '';
    img.draggable = false;
    img.style.width = 'min(' + opts.balloonSize + 'px, 44vw)';
    img.style.cursor = 'default';
    var link = document.createElement('a');
    link.className = 'tk-balloon-link';
    link.href = opts.href;
    link.textContent = opts.label;
    link.style.left = 'calc(62% + 6px)';
    link.style.bottom = Math.round(opts.balloonSize * 0.06) + 'px';
    var sway = document.createElement('div');
    sway.className = 'tk-balloon-sway';
    sway.appendChild(img);
    sway.appendChild(link);
    wrap.appendChild(sway);
    field.appendChild(wrap);
    document.body.appendChild(field);
    this.field = field;
    this.destroy = function () { if (field.parentNode) field.parentNode.removeChild(field); };
  }

  var instance = null;

  function mount(options) {
    if (instance) return instance;
    var o = {};
    for (var k in DEFAULTS) o[k] = DEFAULTS[k];
    for (var j in (options || {})) if (options[j] != null) o[j] = options[j];

    if (o.once) {
      try {
        if (sessionStorage.getItem(o.storageKey)) return null;
        sessionStorage.setItem(o.storageKey, '1');
      } catch (err) {}
    }

    var reduced = o.respectReducedMotion &&
      global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

    instance = reduced ? new StaticBalloon(o) : new Balloon(o);
    return instance;
  }

  function unmount() {
    if (instance) { instance.destroy(); instance = null; }
  }

  function autoMount(el) {
    el = el || document.querySelector('script[data-tuku-balloon],script[src*="tuku-balloon"]');
    if (!el) return;
    var d = el.dataset || {};
    if (d.auto === 'false') return;
    var num = function (v) { return v == null ? null : parseFloat(v); };
    mount({
      image: d.image, href: d.href, label: d.label,
      riseDelay: num(d.riseDelay), riseDuration: num(d.riseDuration),
      balloonSize: num(d.balloonSize), breeze: num(d.breeze),
      zIndex: num(d.zIndex), once: d.once === 'true'
    });
  }

  global.TukuBalloon = { mount: mount, unmount: unmount, defaults: DEFAULTS };

  var script = document.currentScript;
  function boot() { autoMount(script); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
