const DASH_PASSWORD = 'sq2026';

let allSubmissions = [];
let filtered = [];
let sortCol = 'submitted_at';
let sortDir = 'desc';
let refreshTimer = null;

/* ── Auth ──────────────────────────────────────────────────── */
function initAuth() {
  const gate = document.getElementById('dash-gate');
  const main = document.getElementById('dash-main');
  const input = document.getElementById('pw-input');
  const btn = document.getElementById('pw-submit');
  const err = document.getElementById('pw-error');

  function tryLogin() {
    if (input.value === DASH_PASSWORD) {
      gate.classList.add('hidden');
      main.classList.add('visible');
      loadData();
      startAutoRefresh();
    } else {
      err.classList.add('visible');
      err.textContent = 'Incorrect password. Try again.';
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 400);
      input.value = '';
      input.focus();
    }
  }

  btn.addEventListener('click', tryLogin);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });
}

/* ── Data ──────────────────────────────────────────────────── */
async function loadData() {
  showTableLoading(true);
  updateRefreshStatus('Refreshing…');
  try {
    allSubmissions = await getAllSubmissions();
    renderStats();
    applyFilter();
    updateRefreshStatus('Last updated: ' + new Date().toLocaleTimeString());
  } catch (err) {
    console.error(err);
    updateRefreshStatus('Error loading data');
    showError('Failed to load submissions. Check Supabase connection.');
  } finally {
    showTableLoading(false);
  }
}

function startAutoRefresh() {
  refreshTimer = setInterval(loadData, 60000);
}

function updateRefreshStatus(msg) {
  const el = document.getElementById('refresh-status');
  if (el) el.textContent = msg;
}

/* ── Stats ─────────────────────────────────────────────────── */
function renderStats() {
  const total = allSubmissions.length;
  document.getElementById('stat-total').textContent = total;

  if (total === 0) {
    document.getElementById('stat-avg-mcq').textContent = '—';
    document.getElementById('stat-avg-sort').textContent = '—';
    document.getElementById('stat-last').textContent = '—';
    return;
  }

  const avgMcq = (allSubmissions.reduce((s, r) => s + (r.mcq_score || 0), 0) / total).toFixed(1);
  const avgSort = (allSubmissions.reduce((s, r) => s + (r.sort_score || 0), 0) / total).toFixed(1);
  const last = new Date(allSubmissions[0].submitted_at);

  document.getElementById('stat-avg-mcq').textContent = avgMcq + ' / 20';
  document.getElementById('stat-avg-sort').textContent = avgSort + ' / 8';
  document.getElementById('stat-last').textContent = last.toLocaleString();
}

/* ── Table ─────────────────────────────────────────────────── */
function applyFilter() {
  const q = (document.getElementById('search-input').value || '').toLowerCase();
  filtered = allSubmissions.filter(r =>
    (r.student_name || '').toLowerCase().includes(q) ||
    (r.student_matrix || '').toLowerCase().includes(q)
  );
  sortData();
  renderTable();
}

function sortData() {
  filtered.sort((a, b) => {
    let av = a[sortCol], bv = b[sortCol];
    if (typeof av === 'string') av = av.toLowerCase();
    if (typeof bv === 'string') bv = bv.toLowerCase();
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });
}

function setSort(col) {
  if (sortCol === col) {
    sortDir = sortDir === 'asc' ? 'desc' : 'asc';
  } else {
    sortCol = col;
    sortDir = 'asc';
  }

  document.querySelectorAll('thead th[data-col]').forEach(th => {
    th.classList.remove('sort-asc', 'sort-desc');
    if (th.dataset.col === col) th.classList.add('sort-' + sortDir);
  });

  sortData();
  renderTable();
}

function renderTable() {
  const tbody = document.getElementById('sub-tbody');
  tbody.innerHTML = '';

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty-state">
            <div class="empty-icon">📭</div>
            <div>${allSubmissions.length === 0 ? 'No submissions yet.' : 'No results match your search.'}</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach((row, idx) => {
    const tr = document.createElement('tr');
    const submittedAt = new Date(row.submitted_at).toLocaleString();

    tr.innerHTML = `
      <td class="td-muted">${idx + 1}</td>
      <td><strong>${escHtml(row.student_name || '—')}</strong></td>
      <td class="td-mono">${escHtml(row.student_matrix || '—')}</td>
      <td class="td-muted">${submittedAt}</td>
      <td><span class="score-pill blue">${row.mcq_score ?? '—'} / 20</span></td>
      <td><span class="score-pill teal">${row.sort_score ?? '—'} / 8</span></td>
      <td>
        <button class="btn btn-sm btn-ghost view-btn" data-id="${row.id}">View</button>
      </td>
    `;

    tr.querySelector('.view-btn').addEventListener('click', () => openModal(row));
    tbody.appendChild(tr);
  });
}

function showTableLoading(on) {
  const el = document.getElementById('table-loading');
  if (el) el.style.display = on ? 'block' : 'none';
}

function showError(msg) {
  const tbody = document.getElementById('sub-tbody');
  tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">⚠️</div><div>${msg}</div></div></td></tr>`;
}

/* ── Modal ─────────────────────────────────────────────────── */
function openModal(row) {
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-student-name').textContent = row.student_name || '—';
  document.getElementById('modal-student-matrix').textContent = row.student_matrix || '—';
  document.getElementById('modal-submitted-at').textContent = new Date(row.submitted_at).toLocaleString();

  const container = document.getElementById('modal-answers');
  container.innerHTML = '';

  const qData = [
    { id: 'c1', label: 'C1', question: 'Identify the error, fault, and failure in this scenario.' },
    { id: 'c2', label: 'C2', question: 'The app had zero crashes. Why does it still represent a quality failure? Reference at least two ISO/IEC 25010:2023 characteristics.' },
    { id: 'c3', label: 'C3', question: 'The team redeployed in 4 hours. Which DORA metric does this represent and what performance tier does it indicate?' },
    { id: 'c4', label: 'C4', question: 'If MySihat adds an AI feature to predict appointment no-shows, which standard applies on top of ISO 25010, and name two quality dimensions it must address.' }
  ];

  const modelAnswers = {
    c1: "Error — Developer incorrectly implemented session token isolation during parallel requests. Fault — The code assigned session data from one user's request context to another user's appointment record. Failure — 3,000 patients received appointment confirmations with wrong clinic/time details — an externally observable deviation from expected behaviour.",
    c2: "The app failed on Functional Suitability (did not perform its intended function correctly) and Reliability (fault tolerance and integrity sub-characteristics — produced incorrect data under concurrent load). Security is also compromised — user data was exposed to the wrong identity, a confidentiality breach.",
    c3: "This measures Mean Time to Restore (MTTR). 4 hours is within the high/elite performer range. The incident also counts toward Change Failure Rate, and the redeployment is a Rework Rate event (2024 DORA addition).",
    c4: "ISO/IEC 25059:2023 applies. Two dimensions: (1) Fairness — the model must not predict higher no-shows for patients based on demographic group. (2) Explainability — clinicians and patients must understand why a no-show was predicted, especially critical in healthcare."
  };

  qData.forEach(sq => {
    const studentAns = row['scenario_' + sq.id] || '(no answer provided)';
    const modelAns = modelAnswers[sq.id];

    const block = document.createElement('div');
    block.className = 'modal-answer-block';
    block.innerHTML = `
      <div class="modal-q-header">
        <span class="modal-q-tag">${sq.label}</span>
        <span class="modal-q-text">${escHtml(sq.question)}</span>
      </div>
      <div class="answer-compare">
        <div class="answer-box student">
          <div class="box-label">Student Answer</div>
          ${escHtml(studentAns).replace(/\n/g, '<br>')}
        </div>
        <div class="answer-box model">
          <div class="box-label">Model Answer</div>
          ${escHtml(modelAns).replace(/\n/g, '<br>')}
        </div>
      </div>
    `;
    container.appendChild(block);
  });

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── CSV Export ────────────────────────────────────────────── */
function exportCSV() {
  if (filtered.length === 0) {
    alert('No data to export.');
    return;
  }

  const headers = ['#', 'Name', 'Matrix No.', 'Submitted At', 'MCQ Score', 'Sort Score', 'C1', 'C2', 'C3', 'C4'];
  const rows = filtered.map((r, i) => [
    i + 1,
    csvEsc(r.student_name),
    csvEsc(r.student_matrix),
    new Date(r.submitted_at).toLocaleString(),
    r.mcq_score ?? '',
    r.sort_score ?? '',
    csvEsc(r.scenario_c1),
    csvEsc(r.scenario_c2),
    csvEsc(r.scenario_c3),
    csvEsc(r.scenario_c4)
  ]);

  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sq-lab-submissions-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function csvEsc(val) {
  if (val == null) return '""';
  return '"' + String(val).replace(/"/g, '""') + '"';
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ── Init ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initAuth();

  document.getElementById('search-input').addEventListener('input', applyFilter);
  document.getElementById('btn-refresh').addEventListener('click', loadData);
  document.getElementById('btn-export').addEventListener('click', exportCSV);

  document.querySelectorAll('thead th[data-col]').forEach(th => {
    th.addEventListener('click', () => setSort(th.dataset.col));
  });

  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
});
