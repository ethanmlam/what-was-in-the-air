const FALLBACK_RECORDS = [
  {
    id: 'apple-001',
    company: 'Apple',
    case: 'Epic v. Apple',
    year: 2013,
    topic: 'messaging',
    title: 'iMessage expansion debate',
    summary: 'Public reporting around Epic v. Apple surfaced internal discussion about whether iMessage should grow into a broader messaging platform instead of staying narrower and more Apple-centric.',
    people: ['Eddy Cue', 'Phil Schiller'],
    products: ['iMessage'],
    whyItMatters: 'This is the kind of internal strategic moment the app should make legible. Not just what Apple built, but which adjacent futures it considered and passed on.',
    sourceUrl: 'https://www.theverge.com/2021/5/27/22454959/epic-apple-trial-recap-video-tim-cook-xbox-playstation-business'
  },
  {
    id: 'apple-002',
    company: 'Apple',
    case: 'Epic v. Apple',
    year: 2015,
    topic: 'security',
    title: 'XcodeGhost response scale',
    summary: 'Emails surfaced in coverage of the trial described the scale of the XcodeGhost impact and the internal recognition that many more users were affected than initially understood.',
    people: ['Apple executives'],
    products: ['App Store', 'iOS'],
    whyItMatters: 'A good example of the app surfacing internal temperature during a crisis, not just product strategy.',
    sourceUrl: 'https://www.theverge.com/c/22611236/epic-v-apple-emails-project-liberty-app-store-schiller-sweeney-cook-jobs'
  },
  {
    id: 'apple-003',
    company: 'Apple',
    case: 'Epic v. Apple',
    year: 2016,
    topic: 'ecosystem',
    title: 'Lock-in logic around messaging',
    summary: 'Publicly surfaced internal discussion suggested iMessage was seen as a meaningful way to keep users inside the Apple ecosystem rather than opening the platform more broadly.',
    people: ['Apple leadership'],
    products: ['iMessage', 'iPhone'],
    whyItMatters: 'This is exactly the kind of moment where internal logic and public posture can diverge in interesting ways.',
    sourceUrl: 'https://www.theverge.com/2021/5/27/22454959/epic-apple-trial-recap-video-tim-cook-xbox-playstation-business'
  },
  {
    id: 'apple-004',
    company: 'Apple',
    case: 'Epic v. Apple',
    year: 2020,
    topic: 'app-store',
    title: 'Fortnite escalation becomes the center of gravity',
    summary: 'Once Epic triggered the payment fight, public exhibits and reporting captured Apple internal communications around enforcement, precedent, and how hard to push back.',
    people: ['App Store leadership'],
    products: ['Fortnite', 'App Store'],
    whyItMatters: 'This gives the app a crisp narrative turning point. One year, one fight, one huge concentration of internal attention.',
    sourceUrl: 'https://www.theverge.com/2020/8/21/21396313/apple-fortnite-lawsuit-emails-app-store-ban-epic'
  },
  {
    id: 'apple-005',
    company: 'Apple',
    case: 'Epic v. Apple',
    year: 2021,
    topic: 'commissions',
    title: 'App Store fee structure under pressure',
    summary: 'Trial reporting pulled together internal and external material showing how central App Store commissions and developer control had become to Apple strategy and litigation risk.',
    people: ['Tim Cook', 'Phil Schiller', 'App Store executives'],
    products: ['App Store'],
    whyItMatters: 'It turns a broad lawsuit into a tangible strategic obsession the interface can visualize.',
    sourceUrl: 'https://www.washingtonpost.com/video-games/2021/05/04/epic-games-vs-apple-trial-takeaways/'
  },
  {
    id: 'apple-006',
    company: 'Apple',
    case: 'Epic v. Apple',
    year: 2021,
    topic: 'control',
    title: 'Review speed and platform discretion',
    summary: 'Public accounts of the trial highlighted internal review dynamics that made Apple’s platform discretion feel more subjective and strategic than neutral.',
    people: ['App Review team', 'Apple leadership'],
    products: ['App Review', 'App Store'],
    whyItMatters: 'This is a good example of how the app can surface institutional behavior, not just one-off executive quotes.',
    sourceUrl: 'https://www.axios.com/apple-epic-trial-private-emails-1a4b306f-efa9-469f-bf18-6a626c930123.html'
  }
];

const state = {
  records: [],
  slideIndex: 0,
  inArchive: false,
};

function topicCounts(records) {
  const counts = new Map();
  records.forEach((record) => counts.set(record.topic, (counts.get(record.topic) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function yearCounts(records) {
  const counts = new Map();
  records.forEach((record) => counts.set(record.year, (counts.get(record.year) || 0) + 1));
  return [...counts.entries()].sort((a, b) => a[0] - b[0]);
}

function topPeople(records, limit = 5) {
  const counts = new Map();
  records.forEach((record) => {
    record.people.forEach((person) => counts.set(person, (counts.get(person) || 0) + 1));
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

function strongestMoment(records) {
  return records.find((record) => record.id === 'apple-004') || records[0];
}

async function loadRecords() {
  try {
    const res = await fetch('data/apple-epic-demo.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    state.records = await res.json();
  } catch (err) {
    console.warn('Falling back to embedded demo records:', err);
    state.records = FALLBACK_RECORDS;
  }
  render();
}

function getSlides() {
  const records = state.records;
  const [topTopic, topTopicCount] = topicCounts(records)[0] || ['control', 0];
  const years = yearCounts(records);
  const [spikeYear, spikeCount] = [...years].sort((a, b) => b[1] - a[1])[0] || ['2020', 0];
  const people = topPeople(records);
  const moment = strongestMoment(records);

  return [
    () => `
      <section class="slide">
        <div class="kicker">Apple / Epic</div>
        <h1 class="display">What Was in the Air</h1>
        <p class="subtext">A slide-first look at internal Apple moments surfaced through Epic v. Apple.</p>
      </section>
    `,
    () => `
      <section class="slide">
        <div class="kicker">The thesis</div>
        <h2 class="statement">Apple wasn’t just defending the App Store.<br>It was defending control.</h2>
      </section>
    `,
    () => `
      <section class="slide compact">
        <div class="kicker">Biggest obsession</div>
        <div class="big-stat">${topTopic}</div>
        <div class="note">${topTopicCount} surfaced moments cluster around this theme.</div>
        <div class="topic-row">
          ${topicCounts(records).slice(0, 5).map(([topic]) => `<div class="topic-chip ${topic === topTopic ? 'hero' : ''}">${topic}</div>`).join('')}
        </div>
      </section>
    `,
    () => `
      <section class="slide compact">
        <div class="kicker">Pressure point</div>
        <div class="big-stat">${spikeYear}</div>
        <div class="note">${spikeCount} moments. Fortnite turned long-running tension into open conflict.</div>
        <div class="mini-years">
          ${years.map(([year]) => `<div class="year-chip ${year === spikeYear ? 'hero' : ''}">${year}</div>`).join('')}
        </div>
      </section>
    `,
    () => `
      <section class="slide compact">
        <div class="kicker">One sharp moment</div>
        <div class="quote-card">
          <h2 class="quote">${moment.summary}</h2>
          <div class="quote-source">${moment.year} · ${moment.topic} · ${moment.products.join(', ')}</div>
        </div>
      </section>
    `,
    () => `
      <section class="slide compact">
        <div class="kicker">Who kept showing up</div>
        <h2 class="statement">The cast</h2>
        <div class="people-row">
          ${people.map(([person, count]) => `<div class="person-chip">${person} · ${count}</div>`).join('')}
        </div>
      </section>
    `,
    () => `
      <section class="slide">
        <div class="kicker">Explore</div>
        <h2 class="statement">Now enter the archive.</h2>
        <p class="subtext">Start with the strongest surfaced Apple moments, then swap in real curated records.</p>
        <button id="enter-archive" class="enter-btn" type="button">Enter archive</button>
      </section>
    `,
  ];
}

function renderDots(total) {
  const el = document.getElementById('progress-dots');
  el.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.className = `progress-dot ${i === state.slideIndex ? 'active' : ''}`;
    el.appendChild(dot);
  }
}

function renderArchive() {
  const stage = document.getElementById('slide-stage');
  const tpl = document.getElementById('archive-template');
  stage.innerHTML = tpl.innerHTML;

  const recordsEl = document.getElementById('archive-records');
  recordsEl.innerHTML = state.records.map((record) => `
    <article class="archive-card">
      <div class="archive-meta">
        <span class="topic-chip">${record.year}</span>
        <span class="topic-chip">${record.topic}</span>
      </div>
      <div class="archive-title">${record.title}</div>
      <div class="archive-summary">${record.summary}</div>
      <a class="archive-link" href="${record.sourceUrl}" target="_blank" rel="noreferrer">Open source</a>
    </article>
  `).join('');

  document.getElementById('back-to-story').addEventListener('click', () => {
    state.inArchive = false;
    render();
  });
}

function renderStory() {
  const slides = getSlides();
  const stage = document.getElementById('slide-stage');
  stage.innerHTML = slides[state.slideIndex]();
  renderDots(slides.length);

  document.getElementById('prev-btn').disabled = state.slideIndex === 0;
  document.getElementById('next-btn').textContent = state.slideIndex === slides.length - 1 ? 'Finish' : 'Next';

  if (state.slideIndex === slides.length - 1) {
    document.getElementById('enter-archive')?.addEventListener('click', () => {
      state.inArchive = true;
      render();
    });
  }
}

function render() {
  if (state.inArchive) {
    document.getElementById('progress-dots').innerHTML = '';
    document.getElementById('prev-btn').style.visibility = 'hidden';
    document.getElementById('next-btn').style.visibility = 'hidden';
    renderArchive();
    return;
  }

  document.getElementById('prev-btn').style.visibility = 'visible';
  document.getElementById('next-btn').style.visibility = 'visible';
  renderStory();
}

document.getElementById('prev-btn').addEventListener('click', () => {
  if (state.slideIndex > 0) {
    state.slideIndex -= 1;
    render();
  }
});

document.getElementById('next-btn').addEventListener('click', () => {
  const total = getSlides().length;
  if (state.slideIndex < total - 1) {
    state.slideIndex += 1;
    render();
  }
});

document.addEventListener('keydown', (event) => {
  if (state.inArchive) return;
  if (event.key === 'ArrowRight') document.getElementById('next-btn').click();
  if (event.key === 'ArrowLeft') document.getElementById('prev-btn').click();
});

loadRecords();
