const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const STORE_KEY = 'little-home-three-day-mission-v1';
const LEGACY_STORE_KEY = 'grape-journal-v3';
const MISSION_DAYS = 3;

const defaultState = {
  records: {},
  missionCelebrated: false
};

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY));
    if (saved) {
      return {
        ...structuredClone(defaultState),
        ...saved,
        records: saved.records && typeof saved.records === 'object' ? saved.records : {}
      };
    }

    const legacy = JSON.parse(localStorage.getItem(LEGACY_STORE_KEY));
    if (legacy?.records && typeof legacy.records === 'object') {
      return {
        ...structuredClone(defaultState),
        records: Object.fromEntries(Object.entries(legacy.records).map(([date, record]) => [date, {
          text: String(record?.text || '').trim(),
          createdAt: record?.createdAt || `${date}T12:00:00.000Z`
        }]).filter(([, record]) => record.text))
      };
    }
  } catch {
    // A damaged local value should not stop the home from opening.
  }
  return structuredClone(defaultState);
}

let state = loadState();
let editingToday = false;
let toastTimer;
let installPrompt;

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function recordDates() {
  return Object.keys(state.records).filter((date) => state.records[date]?.text).sort();
}

function recordedDayCount() {
  return recordDates().length;
}

function missionProgress() {
  return Math.min(MISSION_DAYS, recordedDayCount());
}

function isInteriorUnlocked() {
  return recordedDayCount() >= MISSION_DAYS;
}

function todayRecord() {
  return state.records[localDateKey()] || null;
}

function formatDate(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return `${month}월 ${day}일 ${['일','월','화','수','목','금','토'][date.getDay()]}요일`;
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

function missionCopy(progress) {
  if (progress === 0) return '첫 번째 잘한 일을 기다리고 있어요.';
  if (progress === 1) return '첫 불빛이 켜졌어요. 이틀의 기록이 더 필요해요.';
  if (progress === 2) return '현관 앞까지 왔어요. 하루만 더 기록하면 돼요.';
  return '미션 완료! 마당의 현관문을 눌러 보세요.';
}

function renderMission() {
  const progress = missionProgress();
  $('#mission-count').textContent = String(progress);
  $('#mission-badge').setAttribute('aria-label', `3일 기록 미션 중 ${progress}일 완료`);
  $('#mission-copy').textContent = missionCopy(progress);

  $$('#mission-days li').forEach((item, index) => {
    item.classList.toggle('is-complete', index < progress);
    item.classList.toggle('is-current', index === progress && progress < MISSION_DAYS);
  });
  $$('#yard-day-stamps i').forEach((stamp, index) => stamp.classList.toggle('is-complete', index < progress));

  const unlocked = isInteriorUnlocked();
  $('#yard-view').classList.toggle('is-unlocked', unlocked);
  $('#house-door').setAttribute('aria-label', unlocked ? '열린 현관문, 거실로 들어가기' : `잠긴 현관문, ${MISSION_DAYS - progress}일의 기록이 더 필요함`);
  $('#door-lock').textContent = unlocked ? '문 열기' : `${progress} / ${MISSION_DAYS}일`;
  $('#yard-mission-title').textContent = unlocked ? '현관문이 열렸어요!' : '아직 문이 잠겨 있어요.';
  $('#yard-mission-copy').textContent = unlocked
    ? '문을 눌러 사흘의 기록으로 열린 거실에 들어가세요.'
    : `서로 다른 날짜에 ${MISSION_DAYS - progress}일 더 기록하면 문이 열려요.`;
  $('#door-hint').textContent = unlocked
    ? '현관문을 누르면 집 안으로 들어갈 수 있어요.'
    : '현관문을 눌러 남은 미션을 확인해 보세요.';
}

function renderJournal() {
  const record = todayRecord();
  $('#record-input').value = record?.text || '';
  $('#record-input').readOnly = Boolean(record) && !editingToday;
  $('#edit-record').hidden = !record || editingToday;
  $('#form-message').textContent = '';
  $('#today-saved').hidden = !record;
  $('#today-saved-text').textContent = record?.text || '';

  if (record && !editingToday) {
    $('#record-button-label').textContent = isInteriorUnlocked() ? '마당으로 가서 문 열기' : '오늘의 집 보러가기';
    $('#record-help').textContent = '오늘 기록은 이미 미션에 반영됐어요. 문장은 언제든 수정할 수 있어요.';
  } else if (editingToday) {
    $('#record-button-label').textContent = '수정한 문장 저장하기';
    $('#record-help').textContent = '문장을 수정해도 기록한 날짜는 그대로 유지돼요.';
  } else {
    $('#record-button-label').textContent = '오늘의 포도알 남기기';
    $('#record-help').textContent = '같은 날 여러 번 적어도 미션에는 하루로 계산돼요.';
  }
  renderMission();
}

function renderMemories() {
  const list = $('#memory-list');
  const records = Object.entries(state.records).filter(([, record]) => record?.text).sort(([a], [b]) => b.localeCompare(a));
  list.replaceChildren();
  if (!records.length) {
    const empty = document.createElement('p');
    empty.className = 'memory-empty';
    empty.textContent = '아직 기록이 없어요. 오늘 잘한 일을 한 줄 남기면 이곳에 차곡차곡 모입니다.';
    list.append(empty);
    return;
  }
  records.forEach(([date, record]) => {
    const item = document.createElement('article');
    item.className = 'memory-item';
    const time = document.createElement('time');
    time.dateTime = date;
    time.textContent = formatDate(date);
    const text = document.createElement('p');
    text.textContent = record.text;
    item.append(time, text);
    list.append(item);
  });
}

function openMemories() {
  renderMemories();
  $('#memory-backdrop').classList.add('is-open');
  $('#memory-backdrop').setAttribute('aria-hidden', 'false');
  setTimeout(() => $('#memory-close').focus(), 80);
}

function closeMemories() {
  $('#memory-backdrop').classList.remove('is-open');
  $('#memory-backdrop').setAttribute('aria-hidden', 'true');
}

function currentViewName() {
  if (!$('#interior-view').hidden) return 'interior';
  if (!$('#yard-view').hidden) return 'yard';
  return 'journal';
}

function showView(name, updateHash = true) {
  const requested = name === 'interior' ? 'interior' : name === 'yard' ? 'yard' : 'journal';
  const next = requested === 'interior' && !isInteriorUnlocked() ? 'yard' : requested;
  $('#journal-view').hidden = next !== 'journal';
  $('#yard-view').hidden = next !== 'yard';
  $('#interior-view').hidden = next !== 'interior';
  $$('.topbar nav [data-view-target]').forEach((button) => button.classList.toggle('is-active', button.dataset.viewTarget === next));
  document.body.dataset.view = next;
  if (updateHash) history.replaceState(null, '', next === 'journal' ? '#home' : `#${next}`);
  if (next === 'journal') renderJournal();
  if (next === 'yard') renderMission();
  window.scrollTo({ top:0, behavior:'smooth' });
}

function openCelebration() {
  const celebration = $('#celebration');
  celebration.classList.add('is-open');
  celebration.setAttribute('aria-hidden', 'false');
  setTimeout(() => {
    celebration.classList.remove('is-open');
    celebration.setAttribute('aria-hidden', 'true');
    showView('yard');
  }, 2100);
}

function handleRecordSubmit(event) {
  event.preventDefault();
  const existing = todayRecord();
  const text = $('#record-input').value.trim();

  if (existing && !editingToday) {
    showView('yard');
    return;
  }
  if (!text) {
    $('#form-message').textContent = '아주 작은 일도 좋아요. 오늘의 잘한 일을 한 줄 적어 주세요.';
    $('#record-input').focus();
    return;
  }

  const wasUnlocked = isInteriorUnlocked();
  state.records[localDateKey()] = {
    text,
    createdAt: existing?.createdAt || new Date().toISOString()
  };
  saveState();

  if (editingToday) {
    editingToday = false;
    renderJournal();
    showToast('오늘의 문장을 다정하게 고쳐두었어요.');
    return;
  }

  renderJournal();
  if (!wasUnlocked && isInteriorUnlocked()) {
    state.missionCelebrated = true;
    saveState();
    openCelebration();
  } else {
    showToast(`오늘의 기록이 저장됐어요. 3일 중 ${missionProgress()}일 완료!`);
    setTimeout(() => showView('yard'), 500);
  }
}

function editTodayRecord() {
  if (!todayRecord()) return;
  editingToday = true;
  renderJournal();
  const input = $('#record-input');
  input.readOnly = false;
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
}

function openHouseDoor() {
  const progress = missionProgress();
  const door = $('#house-door');
  if (!isInteriorUnlocked()) {
    showToast(`아직 문이 잠겨 있어요. 서로 다른 날짜에 ${MISSION_DAYS - progress}일 더 기록해 주세요.`);
    door.animate([
      { transform:'translateX(-50%) rotate(0deg)' },
      { transform:'translateX(-50%) rotate(-2deg)' },
      { transform:'translateX(-50%) rotate(2deg)' },
      { transform:'translateX(-50%) rotate(0deg)' }
    ], { duration:380, easing:'ease-out' });
    return;
  }
  if (door.classList.contains('is-opening')) return;
  door.classList.add('is-opening');
  $('#door-lock').textContent = '어서 와요';
  setTimeout(() => {
    showView('interior');
    door.classList.remove('is-opening');
    $('#door-lock').textContent = '문 열기';
  }, 720);
}

$$('[data-view-target]').forEach((button) => button.addEventListener('click', () => showView(button.dataset.viewTarget)));
$$('[data-open-memories]').forEach((button) => button.addEventListener('click', openMemories));
$('#yard-preview-button').addEventListener('click', () => showView('yard'));
$('#record-form').addEventListener('submit', handleRecordSubmit);
$('#edit-record').addEventListener('click', editTodayRecord);
$('#house-door').addEventListener('click', openHouseDoor);
$('#back-to-yard').addEventListener('click', () => showView('yard'));
$('#memory-close').addEventListener('click', closeMemories);
$('#memory-backdrop').addEventListener('click', (event) => {
  if (event.target === $('#memory-backdrop')) closeMemories();
});

window.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if ($('#memory-backdrop').classList.contains('is-open')) closeMemories();
  else if (currentViewName() === 'interior') showView('yard');
});

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installPrompt = event;
  $('#install-app').hidden = false;
});

$('#install-app').addEventListener('click', async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  $('#install-app').hidden = true;
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(new URL('./sw.js', window.location.href), { scope:'./' }).catch(() => {});
  });
}

saveState();
renderJournal();
const initialView = location.hash === '#interior' ? 'interior' : location.hash === '#yard' ? 'yard' : 'journal';
showView(initialView, false);
