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

const rewardCatalog = [
  { id: 'harvest-basket', icon: '🧺', name: '포도 수확 바구니', copy: '정성껏 모은 포도를 안전하게 담아줘요.' },
  { id: 'watering-can', icon: '🪣', name: '구름 물뿌리개', copy: '포도나무에 시원한 물을 골고루 나눠줘요.' },
  { id: 'farm-boots', icon: '🥾', name: '보랏빛 농장 장화', copy: '흙길에서도 발걸음을 가볍게 해줘요.' },
  { id: 'scarecrow', icon: '🌻', name: '해바라기 허수아비', copy: '포도밭을 든든하게 지켜주는 친구예요.' }
];

function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

const defaultState = {
  grapes: 0,
  crates: 0,
  gold: 1240,
  totalEarned: 0,
  marketPrice: 420,
  note: '아직 오늘의 기록이 없어요.',
  todayRecords: [],
  journal: [],
  activeDay: getTodayKey(),
  care: { water: 54, health: 62, soil: 48, energy: 3 },
  items: [],
  rewardClaimedFor: null,
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

state.todayRecords = Array.isArray(state.todayRecords) ? state.todayRecords : [];
state.items = Array.isArray(state.items) ? state.items : [];
state.care = { ...defaultState.care, ...(state.care || {}) };
if (state.activeDay !== getTodayKey()) {
  state.activeDay = getTodayKey();
  state.todayRecords = [];
  state.care.energy = 3;
  state.rewardClaimedFor = null;
}

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

function renderCare() {
  const meters = [
    ['water', '#water-meter', '#water-value'],
    ['health', '#health-meter', '#health-value'],
    ['soil', '#soil-meter', '#soil-value']
  ];
  meters.forEach(([key, meterSelector, valueSelector]) => {
    $(meterSelector).value = state.care[key];
    $(valueSelector).textContent = `${state.care[key]}%`;
  });
  const energy = $('#energy-pips');
  energy.replaceChildren();
  for (let index = 0; index < 3; index += 1) {
    const pip = document.createElement('i');
    pip.className = `energy-pip${index >= state.care.energy ? ' is-used' : ''}`;
    energy.append(pip);
  }
  energy.setAttribute('aria-label', `활동력 ${state.care.energy}개`);
  $$('#care-actions button').forEach((button) => { button.disabled = state.care.energy < 1; });
  const average = Math.round((state.care.water + state.care.health + state.care.soil) / 3);
  $('#care-mood').textContent = average >= 80 ? '포도나무가 아주 행복해요' : average >= 60 ? '포도나무가 싱그러워졌어요' : '포도나무가 손길을 기다려요';
}

function renderAchievements() {
  const list = $('#achievement-list');
  list.replaceChildren();
  for (let index = 0; index < 3; index += 1) {
    const li = document.createElement('li');
    const record = state.todayRecords[index];
    li.className = record ? 'is-done' : 'is-empty';
    const number = document.createElement('span');
    number.textContent = record ? '✓' : index + 1;
    const copy = document.createElement('p');
    const title = document.createElement('b');
    title.textContent = record || '다음 작은 성취를 기다리고 있어요.';
    const detail = document.createElement('small');
    detail.textContent = record ? '오늘의 포도알 수확 완료' : '한 줄을 기록하면 채워져요.';
    copy.append(title, detail);
    li.append(number, copy);
    list.append(li);
  }
  const completed = Math.min(state.todayRecords.length, 3);
  const isClaimed = state.rewardClaimedFor === getTodayKey();
  const nextReward = rewardCatalog[state.items.length % rewardCatalog.length];
  $('#achievement-count').textContent = completed;
  $('#reward-preview-icon').textContent = isClaimed ? '✓' : nextReward.icon;
  $('#reward-preview-name').textContent = isClaimed ? '오늘의 보상 수령 완료' : nextReward.name;
  $('#reward-status').textContent = isClaimed ? '내일 또 만나요' : completed >= 3 ? '지금 받을 수 있어요!' : `${3 - completed}개 더 기록하면 열려요`;
  $('#claim-item').disabled = completed < 3 || isClaimed;
  $('#claim-item').textContent = isClaimed ? '오늘의 아이템을 받았어요' : '완성 아이템 받기';
}

function renderItems() {
  const shelf = $('#item-shelf');
  shelf.replaceChildren();
  rewardCatalog.forEach((item) => {
    const unlocked = state.items.includes(item.id);
    const tile = document.createElement('div');
    tile.className = `shelf-item${unlocked ? '' : ' is-locked'}`;
    const icon = document.createElement('span');
    icon.textContent = unlocked ? item.icon : '🔒';
    const name = document.createElement('b');
    name.textContent = unlocked ? item.name : '아직 잠긴 아이템';
    tile.append(icon, name);
    shelf.append(tile);
  });
  const latest = [...rewardCatalog].reverse().find((item) => state.items.includes(item.id));
  if (latest) {
    $('#equipped-item span').textContent = latest.icon;
    $('#equipped-item b').textContent = latest.name;
    $('#equipped-item em').textContent = latest.copy;
  }
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
  $('#record-gate').classList.toggle('is-opened', state.todayRecords.length > 0);
  renderCare();
  renderAchievements();
  renderItems();
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
  state.todayRecords.push(text);
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

function enterFarmWithRecord() {
  const input = $('#gate-record-input');
  const text = input.value.trim();
  if (!text) {
    input.focus();
    input.animate([{ transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'none' }], { duration: 220 });
    return;
  }
  state.todayRecords.push(text);
  state.note = text;
  state.grapes = Math.min(24, state.grapes + 1);
  state.journal.unshift({ text, date: '방금 전', type: 'grape' });
  saveState();
  renderAll(state.grapes - 1);
  showToast('첫 포도알과 함께 농장 문이 열렸어요 🍇');
}

function careForFarm(action) {
  if (state.care.energy < 1) {
    showToast('오늘의 활동력을 모두 사용했어요. 내일 다시 돌봐주세요.');
    return;
  }
  const careMap = {
    water: { key: 'water', amount: 18, message: '포도나무가 물을 시원하게 마셨어요 💧' },
    weed: { key: 'health', amount: 15, message: '잡초를 뽑아 포도밭이 산뜻해졌어요 🌱' },
    soil: { key: 'soil', amount: 12, message: '토양에 영양이 차곡차곡 쌓였어요 🪴' }
  };
  const care = careMap[action];
  if (!care) return;
  state.care[care.key] = Math.min(100, state.care[care.key] + care.amount);
  state.care.energy -= 1;
  saveState();
  renderCare();
  $('#farm-mini-scene').classList.remove('is-happy');
  requestAnimationFrame(() => $('#farm-mini-scene').classList.add('is-happy'));
  showToast(care.message);
}

function claimDailyItem() {
  if (state.todayRecords.length < 3 || state.rewardClaimedFor === getTodayKey()) return;
  const reward = rewardCatalog[state.items.length % rewardCatalog.length];
  if (!state.items.includes(reward.id)) state.items.push(reward.id);
  state.rewardClaimedFor = getTodayKey();
  saveState();
  renderAll();
  $('#item-reward-icon').textContent = reward.icon;
  $('#item-reward-name').textContent = reward.name;
  $('#item-reward-copy').textContent = reward.copy;
  $('#item-modal').classList.add('open');
  $('#item-modal').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

$('#enter-farm').addEventListener('click', enterFarmWithRecord);
$('#gate-record-input').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') enterFarmWithRecord();
});
$('#add-achievement').addEventListener('click', openModal);
$('#care-actions').addEventListener('click', (event) => {
  const button = event.target.closest('[data-care]');
  if (button) careForFarm(button.dataset.care);
});
$('#claim-item').addEventListener('click', claimDailyItem);
$('#close-item-reward').addEventListener('click', () => {
  $('#item-modal').classList.remove('open');
  $('#item-modal').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
});

renderAll();
