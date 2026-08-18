const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const positions = [
  [86,59],[143,55],[57,102],[114,102],[171,103],[28,149],
  [85,149],[142,150],[199,150],[57,196],[114,197],[171,197],
  [85,244],[142,244],[114,291],[0,196],[228,196],[28,243],
  [199,243],[57,290],[171,290],[86,337],[142,337],[114,384]
];

const fieldCatalog = [
  { name: '캠벨 얼리', note: '새콤달콤한 기본 품종', unlock: 0, baseUpgrade: 380 },
  { name: '샤인머스캣', note: '높은 가격을 받는 인기 품종', unlock: 900, baseUpgrade: 620 },
  { name: '루비 로망', note: '농장의 명성을 높이는 희귀 품종', unlock: 2200, baseUpgrade: 980 }
];

const defaultState = {
  grapes: 7,
  crates: 0,
  gold: 1240,
  totalEarned: 0,
  marketPrice: 420,
  note: '미뤄둔 일을 하나 끝냈다.',
  journal: [
    { text: '아침에 이불을 정리했다.', date: '오늘', type: 'grape' },
    { text: '잠깐이라도 산책을 다녀왔다.', date: '어제', type: 'grape' }
  ],
  fields: [{ unlocked: true, level: 3 }, { unlocked: false, level: 1 }, { unlocked: false, level: 1 }]
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem('grape-journal-tycoon-v1'));
    return saved ? { ...defaultState, ...saved } : structuredClone(defaultState);
  } catch {
    return structuredClone(defaultState);
  }
}

let state = loadState();
let toastTimer;

function saveState() {
  localStorage.setItem('grape-journal-tycoon-v1', JSON.stringify(state));
}

function formatNumber(value) {
  return Number(value).toLocaleString('ko-KR');
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 1900);
}

function renderBoard(animateIndex = -1) {
  const board = $('#grape-board');
  board.replaceChildren();
  positions.forEach(([x, y], index) => {
    const grape = document.createElement('span');
    grape.className = `grape-cell${index < state.grapes ? ' filled' : ''}${index === animateIndex ? ' pop' : ''}`;
    grape.style.left = `${x}px`;
    grape.style.top = `${y * .82}px`;
    grape.textContent = index + 1;
    board.append(grape);
  });
  $('.sheet-head b').textContent = `${String(state.grapes).padStart(2, '0')} / 24`;
  $('.sheet-footer em').textContent = `수확까지 ${24 - state.grapes}알`;
  board.setAttribute('aria-label', `24알 중 ${state.grapes}알 수확`);
}

function renderFields() {
  const fieldList = $('#field-list');
  fieldList.replaceChildren();
  state.fields.forEach((field, index) => {
    const info = fieldCatalog[index];
    const article = document.createElement('article');
    article.className = `field-plot${field.unlocked ? '' : ' is-locked'}`;
    const upgradeCost = info.baseUpgrade * field.level;
    article.innerHTML = `
      <div class="field-plot-head"><span>${field.unlocked ? `PLOT 0${index + 1}` : 'LOCKED PLOT'}</span><b>${field.unlocked ? `Lv. ${field.level}` : '🔒 잠김'}</b></div>
      <div class="vine-visual" aria-hidden="true"></div>
      <h4>${info.name}</h4><p>${info.note}</p>
      <button class="field-action ${field.unlocked ? 'upgrade' : ''}" data-field="${index}" type="button">${field.unlocked ? '밭 업그레이드' : '새 밭 열기'}</button>
      <small class="field-cost">🪙 ${formatNumber(field.unlocked ? upgradeCost : info.unlock)} G</small>`;
    fieldList.append(article);
  });
  $('#open-field-count').textContent = `${state.fields.filter((field) => field.unlocked).length} / 3 밭 운영 중`;
}

function renderJournal() {
  const list = $('#journal-list');
  list.replaceChildren();
  if (!state.journal.length) {
    const empty = document.createElement('li');
    empty.className = 'journal-empty';
    empty.textContent = '오늘 수확한 포도가 아직 없어요.';
    list.append(empty);
    return;
  }
  state.journal.slice(0, 5).forEach((entry) => {
    const li = document.createElement('li');
    const icon = document.createElement('span');
    icon.textContent = entry.type === 'sale' ? '📦' : '🍇';
    const copy = document.createElement('p');
    const title = document.createElement('b');
    title.textContent = entry.text;
    const note = document.createElement('small');
    note.textContent = entry.type === 'sale' ? '마을 상점 출하' : '포도 한 알 수확';
    const time = document.createElement('time');
    time.textContent = entry.date;
    copy.append(title, note);
    li.append(icon, copy, time);
    list.append(li);
  });
}

function renderAll(animateIndex = -1) {
  renderBoard(animateIndex);
  renderFields();
  renderJournal();
  $('#gold-count').textContent = formatNumber(state.gold);
  $('#stat-grapes').textContent = state.grapes;
  $('#crate-count').textContent = state.crates;
  $('#market-crates').textContent = state.crates;
  $('#total-earned').textContent = formatNumber(state.totalEarned);
  $('#reputation-level').textContent = `Lv. ${1 + Math.floor(state.totalEarned / 1200)}`;
  $('#market-price').textContent = formatNumber(state.marketPrice);
  $('#goal-progress').textContent = `${state.grapes} / 24알`;
  $('#goal-bar').style.width = `${(state.grapes / 24) * 100}%`;
  $('#today-note-text').textContent = `“${state.note}”`;
  const sellButton = $('#sell-crate');
  sellButton.disabled = state.crates < 1;
  sellButton.querySelector('span').textContent = `＋${formatNumber(state.marketPrice)} G`;
  const growth = Math.min(96, 41 + state.fields[0].level * 9);
  $('.field-status progress').value = growth;
  $('.field-status > small b').textContent = `${growth}%`;
}

function openModal() {
  $('#harvest-modal').classList.add('open');
  $('#harvest-modal').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  window.setTimeout(() => $('#achievement-input').focus(), 120);
}

function closeModal() {
  $('#harvest-modal').classList.remove('open');
  $('#harvest-modal').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function completeHarvest() {
  const input = $('#achievement-input');
  const text = input.value.trim();
  if (!text) {
    input.focus();
    input.animate([{ transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'none' }], { duration: 220 });
    return;
  }
  const addedIndex = state.grapes;
  state.grapes += 1;
  state.note = text;
  state.marketPrice = Math.floor(380 + Math.random() * 141);
  state.journal.unshift({ text, date: '방금 전', type: 'grape' });
  input.value = '';
  closeModal();
  renderAll(addedIndex);
  saveState();
  showToast('포도 한 알이 톡! 익었어요 🍇');
  if (state.grapes === 24) {
    window.setTimeout(() => {
      state.grapes = 0;
      state.crates += 1;
      saveState();
      renderAll();
      $('#level-modal').classList.add('open');
      $('#level-modal').setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }, 850);
  }
}

function handleFieldAction(index) {
  const field = state.fields[index];
  const info = fieldCatalog[index];
  const cost = field.unlocked ? info.baseUpgrade * field.level : info.unlock;
  if (state.gold < cost) {
    showToast(`골드가 ${formatNumber(cost - state.gold)} G 부족해요.`);
    return;
  }
  state.gold -= cost;
  if (field.unlocked) {
    field.level += 1;
    showToast(`${info.name} 밭이 Lv. ${field.level}로 자랐어요 🌿`);
  } else {
    field.unlocked = true;
    showToast(`${info.name} 밭을 새로 열었어요!`);
  }
  saveState();
  renderAll();
}

$('#harvest-button').addEventListener('click', openModal);
$('#close-modal').addEventListener('click', closeModal);
$('#confirm-harvest').addEventListener('click', completeHarvest);
$('#achievement-input').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') completeHarvest();
});
$$('.quick-notes button').forEach((button) => button.addEventListener('click', () => {
  $('#achievement-input').value = button.textContent;
  $('#achievement-input').focus();
}));
$('#edit-note').addEventListener('click', () => {
  $('#achievement-input').value = state.note;
  openModal();
});
$('#field-list').addEventListener('click', (event) => {
  const button = event.target.closest('[data-field]');
  if (button) handleFieldAction(Number(button.dataset.field));
});
$('#sell-crate').addEventListener('click', () => {
  if (!state.crates) return;
  const earned = state.marketPrice;
  state.crates -= 1;
  state.gold += earned;
  state.totalEarned += earned;
  state.journal.unshift({ text: `포도 한 상자를 ${formatNumber(earned)} G에 출하했다.`, date: '방금 전', type: 'sale' });
  state.marketPrice = Math.floor(380 + Math.random() * 141);
  saveState();
  renderAll();
  showToast(`첫 출하 성공! ${formatNumber(earned)} G를 받았어요 📦`);
});
$('#clear-journal').addEventListener('click', () => {
  state.journal = [];
  saveState();
  renderJournal();
  showToast('수확 일지를 깔끔하게 정리했어요.');
});
$('#close-level').addEventListener('click', () => {
  $('#level-modal').classList.remove('open');
  $('#level-modal').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  $('#tycoon').scrollIntoView({ behavior: 'smooth' });
});
$('#harvest-modal').addEventListener('click', (event) => {
  if (event.target.id === 'harvest-modal') closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && $('#harvest-modal').classList.contains('open')) closeModal();
});
$$('.nav-pill').forEach((button, index) => button.addEventListener('click', () => {
  $$('.nav-pill').forEach((item) => item.classList.remove('is-active'));
  button.classList.add('is-active');
  (index === 0 ? $('#farm') : $('#tycoon')).scrollIntoView({ behavior: 'smooth' });
}));

renderAll();
