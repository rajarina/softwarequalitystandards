/* ── State ─────────────────────────────────────────────────── */
const state = {
  student: { name: '', matrix: '' },
  mcq: {
    answers: new Array(20).fill(null),
    score: 0
  },
  sort: {
    selected: null,
    placements: {},
    checked: false,
    score: 0
  },
  scenario: { c1: '', c2: '', c3: '', c4: '' }
};

/* ── Helpers ───────────────────────────────────────────────── */
function $(id) { return document.getElementById(id); }
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}

function showToast(msg, type = '') {
  const t = $('toast');
  t.textContent = msg;
  t.className = 'toast visible' + (type ? ' ' + type : '');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => t.className = 'toast', 3000);
}

function setLoading(on) {
  $('loading-overlay').classList.toggle('active', on);
}

/* ── Registration ──────────────────────────────────────────── */
function initRegistration() {
  $('btn-start').addEventListener('click', () => {
    const name = $('inp-name').value.trim();
    const matrix = $('inp-matrix').value.trim();
    let valid = true;

    $('err-name').classList.toggle('visible', !name);
    $('inp-name').classList.toggle('error', !name);
    if (!name) valid = false;

    const matrixOk = matrix.length >= 5;
    $('err-matrix').classList.toggle('visible', !matrixOk);
    $('inp-matrix').classList.toggle('error', !matrixOk);
    if (!matrixOk) valid = false;

    if (!valid) return;

    state.student.name = name;
    state.student.matrix = matrix.toUpperCase();

    $('sidebar-name').textContent = name;
    $('sidebar-matrix').textContent = state.student.matrix;

    showScreen('screen-lab');
    showPart('a');
  });

  document.querySelectorAll('#screen-register input').forEach(inp => {
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') $('btn-start').click(); });
  });
}

/* ── Sidebar navigation ────────────────────────────────────── */
function showPart(part) {
  document.querySelectorAll('.part-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  $('part-' + part).classList.add('active');
  $('nav-' + part).classList.add('active');

  const colorMap = { a: '', b: 'teal', c: 'amber' };
  $('nav-' + part).classList.add(colorMap[part] || '');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initNav() {
  ['a', 'b', 'c'].forEach(p => {
    $('nav-' + p).addEventListener('click', () => showPart(p));
  });

  $('sidebar-toggle').addEventListener('click', () => {
    $('sidebar').classList.toggle('open');
  });

  document.addEventListener('click', e => {
    const sidebar = $('sidebar');
    const toggle = $('sidebar-toggle');
    if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
}

/* ── MCQ ───────────────────────────────────────────────────── */
function initMCQ() {
  const container = $('mcq-questions');
  container.innerHTML = '';

  QUESTIONS.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.id = 'qcard-' + idx;

    const letters = ['A', 'B', 'C', 'D'];
    card.innerHTML = `
      <div class="question-number">Question ${idx + 1} of ${QUESTIONS.length}</div>
      <div class="question-text">${q.question}</div>
      <div class="options-list">
        ${q.options.map((opt, i) => `
          <button class="option-btn" data-q="${idx}" data-opt="${i}">
            <span class="option-letter">${letters[i]}</span>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
      <div class="feedback-box" id="feedback-${idx}">
        <div class="feedback-label"></div>
        <div class="feedback-text"></div>
      </div>
    `;
    container.appendChild(card);
  });

  container.addEventListener('click', e => {
    const btn = e.target.closest('.option-btn');
    if (!btn) return;
    const qIdx = parseInt(btn.dataset.q);
    const optIdx = parseInt(btn.dataset.opt);

    if (state.mcq.answers[qIdx] !== null) return;

    state.mcq.answers[qIdx] = optIdx;
    const isCorrect = optIdx === QUESTIONS[qIdx].correct;
    if (isCorrect) state.mcq.score++;

    renderMCQAnswer(qIdx, optIdx, isCorrect);
    updateMCQProgress();
    updateScoreBadge('score-a', state.mcq.score, 20);
  });

  updateMCQProgress();
}

function renderMCQAnswer(qIdx, chosen, isCorrect) {
  const card = $('qcard-' + qIdx);
  const q = QUESTIONS[qIdx];
  const buttons = card.querySelectorAll('.option-btn');

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) {
      btn.classList.add(isCorrect ? 'correct' : 'correct-reveal');
    } else if (i === chosen && !isCorrect) {
      btn.classList.add('wrong');
    }
  });

  const fb = $('feedback-' + qIdx);
  fb.classList.add('visible', isCorrect ? 'correct' : 'wrong');
  fb.querySelector('.feedback-label').innerHTML = isCorrect
    ? '✓ Correct!'
    : `✗ Incorrect — correct answer: ${['A','B','C','D'][q.correct]}`;
  fb.querySelector('.feedback-text').textContent = q.explanation;

  card.classList.add('answered');
}

function updateMCQProgress() {
  const answered = state.mcq.answers.filter(a => a !== null).length;
  const pct = (answered / QUESTIONS.length) * 100;
  $('mcq-progress-fill').style.width = pct + '%';
  $('mcq-progress-text').textContent = `${answered} / ${QUESTIONS.length} answered`;
  updateSubmitChecklist();
}

function updateScoreBadge(id, score, total) {
  $(id).textContent = score + '/' + total;
}

/* ── Sort ──────────────────────────────────────────────────── */
function initSort() {
  renderSortItems();
  renderBuckets();

  $('btn-check-sort').addEventListener('click', checkSort);
  $('btn-reset-sort').addEventListener('click', resetSort);
}

function renderSortItems() {
  const pool = $('sort-pool');
  pool.innerHTML = '';

  const shuffled = [...SORT_ITEMS].sort(() => Math.random() - .5);

  shuffled.forEach(item => {
    const el = document.createElement('div');
    el.className = 'sort-item';
    el.dataset.id = item.id;
    el.textContent = item.text;

    if (state.sort.placements[item.id]) {
      el.classList.add('placed');
    }

    el.addEventListener('click', () => {
      if (state.sort.checked) return;
      if (state.sort.placements[item.id]) return;

      if (state.sort.selected === item.id) {
        state.sort.selected = null;
        el.classList.remove('selected');
      } else {
        document.querySelectorAll('.sort-item').forEach(i => i.classList.remove('selected'));
        state.sort.selected = item.id;
        el.classList.add('selected');
      }
    });

    pool.appendChild(el);
  });
}

function renderBuckets() {
  const grid = $('sort-buckets');
  grid.innerHTML = '';

  SORT_BUCKETS.forEach(bucket => {
    const el = document.createElement('div');
    el.className = 'sort-bucket';
    el.dataset.bucket = bucket.id;

    const placed = Object.entries(state.sort.placements)
      .filter(([, b]) => b === bucket.id)
      .map(([id]) => id);

    if (placed.length > 0) el.classList.add('has-item');

    el.innerHTML = `
      <div class="bucket-label">${bucket.label}</div>
      <div class="bucket-contents" id="bucket-${bucket.id}">
        ${placed.map(id => {
          const item = SORT_ITEMS.find(i => i.id === id);
          return `
            <div class="bucket-item" data-item="${id}">
              <span>${item.text}</span>
              <button class="remove-btn" data-item="${id}" title="Remove">×</button>
            </div>
          `;
        }).join('')}
      </div>
    `;

    el.addEventListener('click', e => {
      if (state.sort.checked) return;

      const removeBtn = e.target.closest('.remove-btn');
      if (removeBtn) {
        const itemId = removeBtn.dataset.item;
        delete state.sort.placements[itemId];
        refreshSort();
        updateSubmitChecklist();
        return;
      }

      if (!state.sort.selected) return;

      const itemId = state.sort.selected;
      state.sort.placements[itemId] = bucket.id;
      state.sort.selected = null;
      refreshSort();
      updateSubmitChecklist();
    });

    grid.appendChild(el);
  });
}

function refreshSort() {
  renderSortItems();
  renderBuckets();
}

function checkSort() {
  const placed = Object.keys(state.sort.placements).length;
  if (placed < SORT_ITEMS.length) {
    showToast('Place all 8 items before checking answers.', 'error');
    return;
  }

  state.sort.checked = true;
  state.sort.score = 0;

  SORT_ITEMS.forEach(item => {
    const isCorrect = state.sort.placements[item.id] === item.correct;
    if (isCorrect) state.sort.score++;

    const bucketItem = document.querySelector(`.bucket-item[data-item="${item.id}"]`);
    if (bucketItem) bucketItem.classList.add(isCorrect ? 'correct' : 'wrong');

    const poolItem = document.querySelector(`.sort-item[data-id="${item.id}"]`);
    if (poolItem) poolItem.classList.add(isCorrect ? 'correct' : 'wrong');
  });

  $('sort-score-display').textContent = `Score: ${state.sort.score} / ${SORT_ITEMS.length}`;
  $('btn-check-sort').disabled = true;
  updateScoreBadge('score-b', state.sort.score, 8);
  updateSubmitChecklist();
}

function resetSort() {
  if (state.sort.checked) {
    if (!confirm('Sort has already been checked. Reset anyway?')) return;
  }
  state.sort.placements = {};
  state.sort.selected = null;
  state.sort.checked = false;
  state.sort.score = 0;
  $('sort-score-display').textContent = '';
  $('btn-check-sort').disabled = false;
  refreshSort();
  updateScoreBadge('score-b', 0, 8);
  updateSubmitChecklist();
}

/* ── Scenario ──────────────────────────────────────────────── */
function initScenario() {
  SCENARIO_QUESTIONS.forEach(sq => {
    const ta = $('ta-' + sq.id);
    const cc = $('cc-' + sq.id);
    ta.addEventListener('input', () => {
      state.scenario[sq.id] = ta.value;
      cc.textContent = ta.value.length + ' characters';
      updateSubmitChecklist();
    });
  });
}

/* ── Checklist ─────────────────────────────────────────────── */
function updateSubmitChecklist() {
  const mcqDone = state.mcq.answers.filter(a => a !== null).length === QUESTIONS.length;
  const sortDone = state.sort.checked;
  const c1Done = state.scenario.c1.trim().length > 10;
  const c2Done = state.scenario.c2.trim().length > 10;
  const c3Done = state.scenario.c3.trim().length > 10;
  const c4Done = state.scenario.c4.trim().length > 10;
  const scenarioDone = c1Done && c2Done && c3Done && c4Done;

  function setCheck(id, done) {
    const el = $(id);
    if (!el) return;
    el.classList.toggle('done', done);
    el.classList.toggle('missing', !done);
    el.querySelector('.check-icon').textContent = done ? '✓' : '○';
  }

  setCheck('check-mcq', mcqDone);
  setCheck('check-sort', sortDone);
  setCheck('check-scenario', scenarioDone);

  const allDone = mcqDone && scenarioDone;
  $('btn-submit').disabled = !allDone;
}

/* ── Submit ────────────────────────────────────────────────── */
function initSubmit() {
  $('btn-submit').addEventListener('click', async () => {
    const c1 = state.scenario.c1.trim();
    const c2 = state.scenario.c2.trim();
    const c3 = state.scenario.c3.trim();
    const c4 = state.scenario.c4.trim();

    if (!c1 || !c2 || !c3 || !c4) {
      showToast('Please answer all Part C questions before submitting.', 'error');
      showPart('c');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        student_name: state.student.name,
        student_matrix: state.student.matrix,
        mcq_answers: state.mcq.answers,
        mcq_score: state.mcq.score,
        sort_answers: state.sort.placements,
        sort_score: state.sort.score,
        scenario_c1: c1,
        scenario_c2: c2,
        scenario_c3: c3,
        scenario_c4: c4
      };

      await saveSubmission(payload);
      setLoading(false);
      showResults();
    } catch (err) {
      setLoading(false);
      console.error(err);
      showToast('Submission failed. Check your internet connection and try again.', 'error');
    }
  });
}

/* ── Results ───────────────────────────────────────────────── */
function showResults() {
  $('result-name').textContent = state.student.name;
  $('result-matrix').textContent = state.student.matrix;
  $('result-mcq-score').textContent = state.mcq.score + ' / 20';
  $('result-sort-score').textContent = state.sort.score + ' / 8';

  renderMCQResults();
  renderSortResults();
  renderScenarioResults();

  showScreen('screen-results');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  $('btn-print').addEventListener('click', () => window.print());
}

function renderMCQResults() {
  const list = $('mcq-results-list');
  list.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];

  QUESTIONS.forEach((q, i) => {
    const chosen = state.mcq.answers[i];
    const correct = chosen === q.correct;
    const item = document.createElement('div');
    item.className = 'mcq-result-item';
    item.innerHTML = `
      <div class="result-dot ${correct ? 'correct' : 'wrong'}"></div>
      <div class="mcq-result-q">Q${i + 1}: ${q.question.substring(0, 60)}${q.question.length > 60 ? '…' : ''}</div>
      <div class="mcq-result-status ${correct ? 'correct' : 'wrong'}">
        ${correct ? '✓' : `✗ (${chosen !== null ? letters[chosen] : '—'} → ${letters[q.correct]})`}
      </div>
    `;
    list.appendChild(item);
  });
}

function renderSortResults() {
  const body = $('sort-results-body');
  body.innerHTML = '';

  SORT_ITEMS.forEach(item => {
    const placed = state.sort.placements[item.id];
    const correct = placed === item.correct;
    const bucket = SORT_BUCKETS.find(b => b.id === item.correct);
    const row = document.createElement('div');
    row.className = 'mcq-result-item';
    row.innerHTML = `
      <div class="result-dot ${correct ? 'correct' : 'wrong'}"></div>
      <div class="mcq-result-q">${item.text}</div>
      <div class="mcq-result-status ${correct ? 'correct' : 'wrong'}">
        ${correct ? '✓ ' + bucket.label : `✗ → ${bucket.label}`}
      </div>
    `;
    body.appendChild(row);
  });
}

function renderScenarioResults() {
  const container = $('scenario-results');
  container.innerHTML = '';

  SCENARIO_QUESTIONS.forEach(sq => {
    const studentAns = state.scenario[sq.id] || '(no answer)';
    const modelAns = MODEL_ANSWERS[sq.id];

    const block = document.createElement('div');
    block.className = 'model-answer-card';
    block.innerHTML = `
      <div class="model-answer-label">${sq.label}</div>
      <div class="model-answer-q">${sq.question}</div>
      <div class="student-answer-block">${escapeHtml(studentAns)}</div>
      <div class="model-answer-block">
        <div class="block-label">Model Answer</div>
        ${escapeHtml(modelAns)}
      </div>
    `;
    container.appendChild(block);
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

/* ── Init ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initRegistration();
  initNav();
  initMCQ();
  initSort();
  initScenario();
  initSubmit();
  updateSubmitChecklist();
  showScreen('screen-register');
});
