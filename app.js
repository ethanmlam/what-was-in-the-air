const state = {
  records: [],
  year: 'all',
  topic: 'all',
  selectedId: null,
};

async function loadRecords() {
  const res = await fetch('data/apple-epic-demo.json');
  const records = await res.json();
  state.records = records;
  state.selectedId = records[0]?.id || null;
  renderFilters();
  render();
}

function uniqueValues(key) {
  return [...new Set(state.records.map((record) => record[key]))].sort();
}

function filteredRecords() {
  return state.records.filter((record) => {
    const yearMatch = state.year === 'all' || String(record.year) === String(state.year);
    const topicMatch = state.topic === 'all' || record.topic === state.topic;
    return yearMatch && topicMatch;
  });
}

function renderFilters() {
  const years = ['all', ...uniqueValues('year')];
  const topics = ['all', ...uniqueValues('topic')];

  renderChipRow(document.getElementById('year-filters'), years, state.year, (value) => {
    state.year = value;
    state.selectedId = filteredRecords()[0]?.id || null;
    render();
  });

  renderChipRow(document.getElementById('topic-filters'), topics, state.topic, (value) => {
    state.topic = value;
    state.selectedId = filteredRecords()[0]?.id || null;
    render();
  });
}

function renderChipRow(el, values, activeValue, onClick) {
  el.innerHTML = '';
  values.forEach((value) => {
    const button = document.createElement('button');
    button.className = `chip ${String(value) === String(activeValue) ? 'active' : ''}`;
    button.textContent = value;
    button.addEventListener('click', () => onClick(value));
    el.appendChild(button);
  });
}

function render() {
  const records = filteredRecords();
  document.getElementById('result-count').textContent = `${records.length} moments`;

  const list = document.getElementById('record-list');
  list.innerHTML = '';

  records.forEach((record) => {
    const card = document.createElement('button');
    card.className = `record-card ${record.id === state.selectedId ? 'active' : ''}`;
    card.innerHTML = `
      <div class="record-year-topic">
        <span class="badge">${record.year}</span>
        <span class="badge">${record.topic}</span>
      </div>
      <div class="record-title">${record.title}</div>
      <div class="record-summary">${record.summary}</div>
    `;
    card.addEventListener('click', () => {
      state.selectedId = record.id;
      render();
    });
    list.appendChild(card);
  });

  const selected = records.find((record) => record.id === state.selectedId) || records[0] || null;
  renderDetail(selected);
}

function renderDetail(record) {
  const detail = document.getElementById('detail-view');
  if (!record) {
    detail.className = 'detail-view empty';
    detail.innerHTML = '<p>No records match this filter yet.</p>';
    return;
  }

  detail.className = 'detail-view';
  detail.innerHTML = `
    <h3 class="detail-title">${record.title}</h3>
    <p class="detail-summary">${record.summary}</p>

    <div class="detail-grid">
      <div class="detail-block">
        <div class="detail-label">year</div>
        <div class="detail-value">${record.year}</div>
      </div>
      <div class="detail-block">
        <div class="detail-label">topic</div>
        <div class="detail-value">${record.topic}</div>
      </div>
      <div class="detail-block">
        <div class="detail-label">people</div>
        <div class="detail-value">${record.people.join(', ')}</div>
      </div>
      <div class="detail-block">
        <div class="detail-label">products</div>
        <div class="detail-value">${record.products.join(', ')}</div>
      </div>
    </div>

    <div class="detail-block">
      <div class="detail-label">why it matters</div>
      <div class="detail-value">${record.whyItMatters}</div>
    </div>

    <div class="detail-footnote">
      Case: ${record.case}<br>
      Company: ${record.company}<br>
      ${record.demo ? 'This is demo scaffold data. Replace with real curated records next.' : ''}
    </div>

    <a class="detail-source" href="${record.sourceUrl}" target="_blank" rel="noreferrer">View source: ${record.sourceLabel}</a>
  `;
}

loadRecords();
