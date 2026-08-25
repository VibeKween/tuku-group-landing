/**
 * Internal-only admin dashboard: pick a client, see its artifact version
 * history, drop in a new file. Scales to many clients/many artifacts - one
 * central place rather than a trigger scattered across each client's own
 * field page (that page's own visual identity is independent of this tool's
 * - see the design note in the build-progress doc). Auth is the ADMIN_TOKEN
 * secret (never a client passphrase) - entered once per browser session,
 * kept in sessionStorage only (cleared when the tab closes), sent as a
 * Bearer token on every request below.
 *
 * Styled to match tukugroup.com's own design system (website/css/main.css,
 * website/book/booking.css): JetBrains Mono, black/white/gold, blue-accent
 * interactive states, hairline borders, no rounded corners.
 */
export const ADMIN_PAGE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Client Archive Admin - TUKU GROUP</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  :root {
    --color-black: #000000;
    --color-white: #FFFFFF;
    --color-gold: #C19A4B;
    --color-blue-light: #f0f9ff;
    --color-blue-accent: #5691c8;
    --color-blue-deep: #4a7ba7;
    --color-grey: #666666;
    --color-grey-light: #999999;
    --color-hairline: #e5e5e5;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 15px; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
  body {
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    font-weight: 400; color: var(--color-black); background: var(--color-white);
    line-height: 1.6;
  }
  .page { max-width: 960px; margin: 0 auto; padding: 80px 32px 120px; }

  h1 { font-size: 1.375rem; font-weight: 600; letter-spacing: -0.02em; line-height: 1.15; }
  h1 .accent { color: var(--color-gold); }
  p.sub { color: var(--color-grey); font-size: 0.875rem; margin-top: 12px; max-width: 46ch; }

  .connect-row { display: flex; align-items: flex-end; gap: 16px; margin-top: 56px; }
  label { display: block; font-size: 0.75rem; font-weight: 500; margin-bottom: 8px; }
  input[type=password], input[type=text], input[type=date] {
    width: 100%; padding: 11px 12px; font-family: inherit; font-size: 0.875rem;
    border: 1px solid var(--color-grey-light); border-radius: 3px; background: var(--color-white);
    transition: border-color 0.2s ease, background-color 0.2s ease;
  }
  input[type=password]:focus, input[type=text]:focus, input[type=date]:focus {
    outline: none; border-color: var(--color-blue-accent); background: var(--color-blue-light);
  }
  .connect-row input { max-width: 320px; }

  button {
    display: inline-block; padding: 11px 22px; font-family: inherit; font-size: 0.8125rem;
    font-weight: 500; border-radius: 6px; cursor: pointer; transition: all 0.2s ease;
    white-space: nowrap;
  }
  .btn-primary { color: var(--color-white); background: var(--color-blue-accent); border: none; }
  .btn-primary:hover { background: var(--color-blue-deep); }
  .btn-primary:disabled { background: var(--color-grey-light); cursor: not-allowed; }

  #connectError { color: var(--color-gold); font-size: 0.8125rem; margin-top: 12px; }

  .layout { display: none; grid-template-columns: 220px 1fr; gap: 64px; margin-top: 72px; }
  .layout.active { display: grid; }

  .client-list { border-right: 1px solid var(--color-hairline); padding-right: 32px; }
  .client-row {
    display: flex; justify-content: space-between; gap: 12px; padding: 13px 10px;
    border-bottom: 1px solid var(--color-hairline); border-radius: 4px; cursor: pointer;
    color: var(--color-black); font-size: 0.875rem; transition: opacity 0.2s ease, background-color 0.2s ease;
  }
  .client-row:hover { opacity: 0.6; }
  .client-row.selected { color: var(--color-blue-accent); font-weight: 500; background: var(--color-blue-light); }
  .client-row .count { color: var(--color-grey-light); font-size: 0.75rem; }
  .empty { color: var(--color-grey-light); font-size: 0.8125rem; }

  .detail-header { font-size: 1.0625rem; font-weight: 600; letter-spacing: -0.01em; margin-bottom: 32px; }

  table.history { width: 100%; border-collapse: collapse; margin-bottom: 56px; font-size: 0.8125rem; }
  table.history th, table.history td { text-align: left; padding: 12px 8px; border-bottom: 1px solid var(--color-hairline); }
  table.history th { color: var(--color-grey-light); font-weight: 500; font-size: 0.6875rem; letter-spacing: 0.06em; text-transform: uppercase; }
  .latest-badge { color: var(--color-blue-accent); font-size: 0.625rem; letter-spacing: 0.06em; margin-left: 8px; }

  .upload-panel h2 { font-size: 0.875rem; font-weight: 600; margin-bottom: 24px; }
  .form-group { margin-bottom: 20px; }
  .form-group .hint { color: var(--color-grey-light); font-size: 0.75rem; margin-top: 6px; }
  .drop {
    border: 1px dashed var(--color-blue-accent); border-radius: 6px; padding: 48px 20px; text-align: center;
    color: var(--color-grey); font-size: 0.8125rem; margin-bottom: 20px; cursor: pointer; transition: background-color 0.2s ease;
  }
  .drop.dragover { background: var(--color-blue-light); }
  #log { margin-top: 20px; font-size: 0.8125rem; }
  #log div { padding: 4px 0; }
  #log .ok { color: var(--color-blue-deep); }
  #log .err { color: var(--color-gold); }

  @media (max-width: 720px) {
    .page { padding: 48px 20px 80px; }
    .layout.active { grid-template-columns: 1fr; gap: 40px; }
    .client-list { border-right: none; border-bottom: 1px solid var(--color-hairline); padding-right: 0; padding-bottom: 24px; }
  }
</style>
</head>
<body>
<div class="page">
  <h1>Client <span class="accent">Archive</span>.</h1>
  <p class="sub">Pick a client to see its artifact history and drop in a new version. Nothing is ever overwritten.</p>

  <div class="connect-row">
    <div>
      <label for="token">Admin token</label>
      <input type="password" id="token" autocomplete="off">
    </div>
    <button class="btn-primary" id="connect">Connect</button>
  </div>
  <div id="connectError"></div>

  <div class="layout" id="layout">
    <div class="client-list" id="clientList"></div>
    <div id="detail"><p class="empty">Select a client.</p></div>
  </div>
</div>

<script>
(function () {
  const $ = (id) => document.getElementById(id);
  const tokenEl = $('token'), connectBtn = $('connect'), connectErrorEl = $('connectError'),
        layoutEl = $('layout'), clientListEl = $('clientList'), detailEl = $('detail');

  let clients = [];
  let selectedClientId = null;

  tokenEl.value = sessionStorage.getItem('adminToken') || '';
  tokenEl.addEventListener('input', () => sessionStorage.setItem('adminToken', tokenEl.value));

  async function api(path, options) {
    const res = await fetch(path, {
      ...options,
      headers: { ...(options && options.headers), Authorization: 'Bearer ' + tokenEl.value },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) throw new Error(data.error || ('http ' + res.status));
    return data;
  }

  async function connect() {
    connectErrorEl.textContent = '';
    connectBtn.disabled = true;
    try {
      const data = await api('/admin/clients');
      clients = data.clients;
      layoutEl.classList.add('active');
      renderClientList();
    } catch (err) {
      layoutEl.classList.remove('active');
      connectErrorEl.textContent = 'Could not connect: ' + err.message;
    } finally {
      connectBtn.disabled = false;
    }
  }

  connectBtn.addEventListener('click', connect);
  tokenEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') connect(); });
  if (tokenEl.value) connect();

  function renderClientList() {
    clientListEl.innerHTML = '';
    if (!clients.length) {
      clientListEl.innerHTML = '<p class="empty">No clients yet.</p>';
      return;
    }
    clients.forEach((c) => {
      const row = document.createElement('div');
      row.className = 'client-row' + (c.id === selectedClientId ? ' selected' : '');
      row.innerHTML = '<span>' + escapeHtml(c.name) + '</span><span class="count">' + c.doc_count + '</span>';
      row.addEventListener('click', () => selectClient(c.id));
      clientListEl.appendChild(row);
    });
  }

  async function selectClient(clientId) {
    selectedClientId = clientId;
    renderClientList();
    detailEl.innerHTML = '<p class="empty">Loading…</p>';
    try {
      const data = await api('/admin/clients/' + clientId + '/artifacts');
      renderDetail(clientId, data.artifacts);
    } catch (err) {
      detailEl.innerHTML = '<p class="empty">Could not load: ' + escapeHtml(err.message) + '</p>';
    }
  }

  function renderDetail(clientId, artifacts) {
    const client = clients.find((c) => c.id === clientId);
    detailEl.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'detail-header';
    header.textContent = client ? client.name : clientId;
    detailEl.appendChild(header);

    detailEl.appendChild(buildHistoryTable(artifacts));
    detailEl.appendChild(buildUploadPanel(clientId));
  }

  function buildHistoryTable(artifacts) {
    if (!artifacts.length) {
      const p = document.createElement('p');
      p.className = 'empty';
      p.style.marginBottom = '56px';
      p.textContent = 'No artifacts uploaded yet.';
      return p;
    }
    const table = document.createElement('table');
    table.className = 'history';
    table.innerHTML = '<thead><tr><th>Doc</th><th>Version</th><th>Uploaded</th></tr></thead>';
    const tbody = document.createElement('tbody');
    artifacts.forEach((a) => {
      const tr = document.createElement('tr');
      const latest = a.is_latest ? '<span class="latest-badge">LATEST</span>' : '';
      tr.innerHTML =
        '<td>' + escapeHtml(a.doc_name) + latest + '</td>' +
        '<td>v' + a.version + '</td>' +
        '<td>' + escapeHtml((a.created_at || '').slice(0, 10)) + '</td>';
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    return table;
  }

  function buildUploadPanel(clientId) {
    const panel = document.createElement('div');
    panel.className = 'upload-panel';
    panel.innerHTML =
      '<h2>Add a version</h2>' +
      '<div class="form-group"><label for="docName">Doc name</label><input type="text" id="docName" placeholder="What are we asking"></div>' +
      '<div class="form-group"><label for="title">Title</label><input type="text" id="title" placeholder="Question Ownership: Full Charge"></div>' +
      '<div class="form-group"><label for="occurredOn">Session date</label><input type="date" id="occurredOn">' +
        '<div class="hint">Only used the first time this doc name is uploaded. Later versions keep the original meeting date.</div></div>' +
      '<div class="drop" id="drop">Drop the artifact .html file here, or click to choose one.</div>' +
      '<input type="file" id="file" accept=".html" style="display:none">' +
      '<button class="btn-primary" id="upload" disabled>Upload</button>' +
      '<div id="log"></div>';

    const docNameEl = panel.querySelector('#docName'), titleEl = panel.querySelector('#title'),
          occurredOnEl = panel.querySelector('#occurredOn'), dropEl = panel.querySelector('#drop'),
          fileEl = panel.querySelector('#file'), uploadBtn = panel.querySelector('#upload'),
          logEl = panel.querySelector('#log');

    occurredOnEl.valueAsDate = new Date();
    let selectedFile = null;

    function setFile(f) {
      selectedFile = f;
      dropEl.textContent = f ? 'Selected: ' + f.name : 'Drop the artifact .html file here, or click to choose one.';
      uploadBtn.disabled = !f;
    }

    dropEl.addEventListener('click', () => fileEl.click());
    fileEl.addEventListener('change', () => setFile(fileEl.files[0] || null));
    dropEl.addEventListener('dragover', (e) => { e.preventDefault(); dropEl.classList.add('dragover'); });
    dropEl.addEventListener('dragleave', () => dropEl.classList.remove('dragover'));
    dropEl.addEventListener('drop', (e) => {
      e.preventDefault();
      dropEl.classList.remove('dragover');
      const f = e.dataTransfer.files[0];
      if (f) setFile(f);
    });

    function log(msg, cls) {
      const line = document.createElement('div');
      if (cls) line.className = cls;
      line.textContent = msg;
      logEl.prepend(line);
    }

    uploadBtn.addEventListener('click', async () => {
      if (!selectedFile) return;
      uploadBtn.disabled = true;

      const form = new FormData();
      form.set('client_id', clientId);
      form.set('doc_name', docNameEl.value.trim());
      form.set('title', titleEl.value.trim() || docNameEl.value.trim());
      form.set('occurred_on', occurredOnEl.value);
      form.set('file', selectedFile);

      try {
        const data = await api('/admin/artifacts', { method: 'POST', body: form });
        log('Uploaded ' + docNameEl.value.trim() + ' as version ' + data.version, 'ok');
        setFile(null);
        docNameEl.value = '';
        titleEl.value = '';
        const refreshed = await api('/admin/clients/' + clientId + '/artifacts');
        detailEl.replaceChild(buildHistoryTable(refreshed.artifacts), detailEl.querySelector('table.history, p.empty'));
      } catch (err) {
        log('Failed: ' + err.message, 'err');
      } finally {
        uploadBtn.disabled = !selectedFile;
      }
    });

    return panel;
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }
})();
</script>
</body>
</html>`;
