const state = {
  records: [],
  year: 'all',
  topic: 'all',
  selectedId: null,
  playing: false,
  playTimer: null,
};

async function loadRecords() {
  const res = await fetch('data/apple-epic-demo.json');
  state.records = await res.json();
  state.selectedId = state.records[0]?.id || null;
  render();
}

function years() {
  return [...new Set(state.records.map((record) => record.year))].sort((a, b) => a - b);
}

function topics() {
  return [...new Set(state.records.map((record) => record.topic))].sort();
}

function filteredRecords() {
  return state.records.filter((record) => {
    const yearMatch = state.year === 'all' || record.year === state.year;
    const topicMatch = state.topic === 'all' || record.topic === state.topic;
    return yearMatch && topicMatch;
  });
}

function countsByTopic(records) {
  const counts = new Map();
  records.forEach((record) => counts.set(record.topic, (counts.get(record.topic) || 0) + 1));
  return [...counts.entries()]
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic));
}

function selectRecord(id) {
  state.selectedId = id;
  renderRecordList();
  renderDetail();
}

function render() {
  renderStats();
  renderYearTrack();
  renderTopicTiles();
  renderTopicRadar();
  renderRecordList();
  renderDetail();
  renderPlayButton();
}

function renderStats() {
  const records = filteredRecords();
  document.getElementById('active-year-label').textContent = state.year === 'all' ? 'All years' : String(state.year);
  document.getElementById('result-count').textContent = String(records.length);
}

function renderYearTrack() {
  const el = document.getElementById('year-track');
  const availableYears = years();
  const counts = new Map();
  state.records.forEach((record) => counts.set(record.year, (counts.get(record.year) || 0) + 1));

  const items = [{ value: 'all', label: 'All years', count: state.records.length, caption: 'full canvas' }]
    .concat(availableYears.map((year) => ({ value: year, label: String(year), count: counts.get(year) || 0, caption: 'moments' })));

  el.innerHTML = '';
  items.forEach((item) => {
    const button = document.createElement('button');
    button.className = `year-pill ${item.value === state.year ? 'active' : ''}`;
    button.innerHTML = `
      <div class="year-pill-top">
        <strong>${item.label}</strong>
        <span class="count">${item.count}</span>
      </div>
      <div class="caption">${item.caption}</div>
    `;
    button.addEventListener('click', () => {
      state.year = item.value;
      ensureSelectedVisible();
      render();
    });
    el.appendChild(button);
  });
}

function renderTopicTiles() {
  const el = document.getElementById('topic-filters');
  const records = state.year === 'all'
    ? state.records
    : state.records.filter((record) => record.year === state.year);
  const topicCounts = countsByTopic(records);
  const max = Math.max(...topicCounts.map((item) => item.count), 1);

  const allCount = records.length;
  el.innerHTML = '';

  const allTile = document.createElement('button');
  allTile.className = `topic-tile ${state.topic === 'all' ? 'active' : ''}`;
  allTile.innerHTML = `
    <div class="topic-name">all topics</div>
    <div class="topic-meta"><span>show everything</span><strong>${allCount}</strong></div>
    <div class="topic-bar"><div class="topic-bar-fill" style="width: 100%"></div></div>
  `;
  allTile.addEventListener('click', () => {
    state.topic = 'all';
    ensureSelectedVisible();
    render();
  });
  el.appendChild(allTile);

  topicCounts.forEach(({ topic, count }) => {
    const tile = document.createElement('button');
    const width = Math.max(12, Math.round((count / max) * 100));
    tile.className = `topic-tile ${state.topic === topic ? 'active' : ''}`;
    tile.innerHTML = `
      <div class="topic-name">${topic}</div>
      <div class="topic-meta"><span>matching moments</span><strong>${count}</strong></div>
      <div class="topic-bar"><div class="topic-bar-fill" style="width:${width}%"></div></div>
    `;
    tile.addEventListener('click', () => {
      state.topic = topic;
      ensureSelectedVisible();
      render();
    });
    el.appendChild(tile);
  });
}

function renderTopicRadar() {
  const records = filteredRecords();
  const topicCounts = countsByTopic(records.length ? records : state.records);
  const max = Math.max(...topicCounts.map((item) => item.count), 1);
  const el = document.getElementById('topic-radar');
  el.innerHTML = '';

  topicCounts.forEach(({ topic, count }) => {
    const row = document.createElement('div');
    row.className = 'radar-row';
    row.innerHTML = `
      <div class="radar-top">
        <div class="radar-name">${topic}</div>
        <div class="radar-count">${count} moments</div>
      </div>
      <div class="radar-bar"><div class="radar-fill" style="width:${Math.round((count / max) * 100)}%"></div></div>
    `;
    el.appendChild(row);
  });
}

function renderRecordList() {
  const records = filteredRecords();
  const list = document.getElementById('record-list');
  list.innerHTML = '';

  records.forEach((record) => {
    const card = document.createElement('button');
    card.className = `record-card ${record.id === state.selectedId ? 'active' : ''}`;
    card.innerHTML = `
      <div class="record-meta">
        <span class="badge">${record.year}</span>
        <span class="badge">${record.topic}</span>
      </div>
      <div class="record-title">${record.title}</div>
      <div class="record-summary">${record.summary}</div>
    `;
    card.addEventListener('click', () => selectRecord(record.id));
    list.appendChild(card);
  });

  if (!records.length) {
    list.innerHTML = `<div class="detail-view empty"><p>No moments match this slice yet.</p></div>`;
  }
}

function renderDetail() {
  const records = filteredRecords();
  const record = records.find((item) => item.id === state.selectedId) || records[0] || null;
  const detail = document.getElementById('detail-view');

  if (!record) {
    detail.className = 'detail-view empty';
    detail.innerHTML = '<p>No record selected.</p>';
    return;
  }

  state.selectedId = record.id;
  detail.className = 'detail-view';
  detail.innerHTML = `
    <h3 class="detail-title">${record.title}</h3>
    <p class="detail-summary">${record.summary}</p>

    <div class="detail-grid">
      <div class="detail-block">
        <div class="detail-label">Year</div>
        <div class="detail-value">${record.year}</div>
      </div>
      <div class="detail-block">
        <div class="detail-label">Topic</div>
        <div class="detail-value">${record.topic}</div>
      </div>
      <div class="detail-block">
        <div class="detail-label">People</div>
        <div class="detail-value">${record.people.join(', ')}</div>
      </div>
      <div class="detail-block">
        <div class="detail-label">Products</div>
        <div class="detail-value">${record.products.join(', ')}</div>
      </div>
    </div>

    <div class="detail-block">
      <div class="detail-label">Why it matters</div>
      <div class="detail-value">${record.whyItMatters}</div>
    </div>

    <div class="detail-footnote">
      Company: ${record.company}<br>
      Case: ${record.case}<br>
      ${record.demo ? 'This screen is live, but the dataset is still demo scaffold data.' : ''}
    </div>

    <a class="detail-source" href="${record.sourceUrl}" target="_blank" rel="noreferrer">Open source → ${record.sourceLabel}</a>
  `;
}

function ensureSelectedVisible() {
  const records = filteredRecords();
  if (!records.some((record) => record.id === state.selectedId)) {
    state.selectedId = records[0]?.id || null;
  }
}

function togglePlay() {
  state.playing = !state.playing;
  if (state.playing) startPlay();
  else stopPlay();
  renderPlayButton();
}

function startPlay() {
  stopPlay();
  const availableYears = years();
  state.playTimer = setInterval(() => {
    const currentIndex = state.year === 'all' ? -1 : availableYears.indexOf(state.year);
    const nextIndex = currentIndex + 1;
    if (nextIndex >= availableYears.length) {
      state.year = 'all';
    } else {
      state.year = availableYears[nextIndex];
    }
    ensureSelectedVisible();
    render();
  }, 1600);
}

function stopPlay() {
  if (state.playTimer) clearInterval(state.playTimer);
  state.playTimer = null;
}

function renderPlayButton() {
  const btn = document.getElementById('play-toggle');
  btn.textContent = state.playing ? 'Pause years' : 'Play years';
  btn.classList.toggle('playing', state.playing);
}

document.getElementById('play-toggle').addEventListener('click', togglePlay);
loadRecords();
