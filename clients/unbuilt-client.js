(function () {
  'use strict';

  var L1 = "Something is happening back there, but it's not for you.";
  var L2 = 'Here is an animal instead.';
  var LEAD = 26;
  var PAUSE = 78;
  var TICK_MS = 34;

  function makeCaret() {
    var c = document.createElement('span');
    c.className = 'caret';
    return c;
  }

  function track(event, label) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', event, {
        event_category: 'engagement',
        event_label: label,
        page_location: window.location.href
      });
    }
  }

  function init() {
    var client = document.body.getAttribute('data-client') || 'unknown';
    var avatarEl = document.getElementById('avatar');
    var typed1El = document.getElementById('typed1');
    var typed2El = document.getElementById('typed2');
    var tryAgainEl = document.getElementById('tryAgain');
    var adoptEl = document.getElementById('adopt');
    var oopsEl = document.getElementById('oopsLink');
    var footerHomeLink = document.getElementById('footerHomeLink');

    var seed = Math.floor(Math.random() * 1e9);
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function render() {
      if (window.AvatarGen) avatarEl.innerHTML = window.AvatarGen.avatar(seed);
    }
    render();

    function reroll() {
      seed = Math.floor(Math.random() * 1e9);
      render();
      track('avatar_reroll', client);
    }
    function save() {
      if (window.AvatarGen) window.AvatarGen.download(seed, 1024);
      track('avatar_download', client);
    }

    avatarEl.addEventListener('click', reroll);
    tryAgainEl.addEventListener('click', reroll);
    adoptEl.addEventListener('click', save);
    if (oopsEl) {
      oopsEl.addEventListener('click', function () {
        window.gtag && window.gtag('event', 'nav_click', {
          event_category: 'navigation',
          event_label: client + '_to_clients',
          page_location: window.location.href
        });
      });
    }
    if (footerHomeLink) {
      footerHomeLink.addEventListener('click', function () {
        window.gtag && window.gtag('event', 'nav_click', {
          event_category: 'navigation',
          event_label: client + '_to_home',
          page_location: window.location.href
        });
      });
    }

    if (reduced) {
      typed1El.textContent = L1;
      typed2El.textContent = L2;
      return;
    }

    var ti = 0;
    var timer = setInterval(function () {
      ti += 1;
      var i1 = ti - LEAD;
      var i2 = i1 - L1.length - PAUSE;

      typed1El.textContent = i1 > 0 ? L1.slice(0, Math.min(i1, L1.length)) : '';
      typed2El.textContent = i2 > 0 ? L2.slice(0, Math.min(i2, L2.length)) : '';

      var cursor1 = i1 >= 0 && i1 <= L1.length;
      var cursor2 = i1 > L1.length && i2 < L2.length;

      if (cursor1 && !typed1El.querySelector('.caret')) typed1El.appendChild(makeCaret());
      if (!cursor1) { var c1 = typed1El.querySelector('.caret'); if (c1) c1.remove(); }
      if (cursor2 && !typed2El.querySelector('.caret')) typed2El.appendChild(makeCaret());
      if (!cursor2) { var c2 = typed2El.querySelector('.caret'); if (c2) c2.remove(); }

      if (i2 >= L2.length) {
        avatarEl.classList.add('shake');
        clearInterval(timer);
      }
    }, TICK_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
