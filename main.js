import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.min.js';

const canvas = document.querySelector('#house-canvas');
const sceneWrap = document.querySelector('.scene-wrap');
const sceneLoader = document.querySelector('#scene-loader');
const modal = document.querySelector('#entry-backdrop');
const input = document.querySelector('#memory-input');
const recentList = document.querySelector('#recent-list');
const countEl = document.querySelector('#record-count');
const grapeBunch = document.querySelector('#grape-bunch');
const grapeNextCopy = document.querySelector('#grape-next-copy');
const completedBunchesEl = document.querySelector('#completed-bunches');
const todayPreview = document.querySelector('#today-preview');
const previewCount = document.querySelector('#preview-count');
const toast = document.querySelector('#toast');
const streakButton = document.querySelector('#streak-button');
const streakNumber = document.querySelector('#streak-number');
const streakCopy = document.querySelector('#streak-copy');
const streakBackdrop = document.querySelector('#streak-backdrop');
const startDateInput = document.querySelector('#start-date-input');
const streakTitle = document.querySelector('#streak-title');
const streakDescription = document.querySelector('#streak-description');
const startDateNote = document.querySelector('#start-date-note');
const saveStartDate = document.querySelector('#save-start-date');
const decorTooltip = document.querySelector('#decor-tooltip');
const houseNameEditor = document.querySelector('#house-name-editor');
const houseNameButton = document.querySelector('#house-name-button');
const houseNameText = document.querySelector('#house-name-text');
const houseNameInput = document.querySelector('#house-name-input');
const openHomeCaptureButton = document.querySelector('#open-home-capture');
const shareHomeLinkButton = document.querySelector('#share-home-link');
const resetHomeButton = document.querySelector('#reset-home');
const soundButton = document.querySelector('#sound-button');
const captureBackdrop = document.querySelector('#capture-backdrop');
const closeCaptureButton = document.querySelector('#close-capture');
const capturedHomeImage = document.querySelector('#captured-home-image');
const saveCapturedImageButton = document.querySelector('#save-captured-image');
const shareCapturedImageButton = document.querySelector('#share-captured-image');
const decorOptions = document.querySelector('#decor-options');
const managerBackdrop = document.querySelector('#manager-backdrop');
const managerList = document.querySelector('#manager-list');
const weekSummary = document.querySelector('#week-summary');
const managerEditor = document.querySelector('#manager-editor');
const editMemoryText = document.querySelector('#edit-memory-text');
const guideBackdrop = document.querySelector('#guide-backdrop');
const routineThemeName = document.querySelector('#routine-theme-name');
const returnMessage = document.querySelector('#return-message');
const dailyPrompt = document.querySelector('#daily-prompt');
const quickPromptList = document.querySelector('#quick-prompt-list');
const entryQuickPrompts = document.querySelector('#entry-quick-prompts');
const themeOptions = document.querySelector('#theme-options');
const saveRestDayButton = document.querySelector('#save-rest-day');
const openWeeklyReflectionButton = document.querySelector('#open-weekly-reflection');
const weeklyLetter = document.querySelector('#weekly-letter');
const rewardBackdrop = document.querySelector('#grape-reward-backdrop');
const rewardPraise = document.querySelector('#reward-praise');
const rewardBunch = document.querySelector('#reward-bunch');
const rewardProgressText = document.querySelector('#reward-progress-text');
const rewardGift = document.querySelector('#reward-gift');
const rewardGiftImage = document.querySelector('#reward-gift-image');
const rewardGiftName = document.querySelector('#reward-gift-name');
const rewardContinueButton = document.querySelector('#reward-continue');
const rewardStoreButton = document.querySelector('#reward-store');
const rewardPlaceButton = document.querySelector('#reward-place');
const inventoryBackdrop = document.querySelector('#inventory-backdrop');
const inventoryList = document.querySelector('#inventory-list');
const inventoryCount = document.querySelector('#inventory-count');
const interiorView = document.querySelector('#interior-view');
const interiorCanvas = document.querySelector('#interior-canvas');
const interiorOptions = document.querySelector('#interior-options');
const interiorHouseName = document.querySelector('#interior-house-name');
const storeInteriorItemButton = document.querySelector('#store-interior-item');
const STORAGE_KEY = 'my-little-day-memories-v1';
const HOUSE_NAME_KEY = 'my-little-day-house-name-v1';
const STREAK_START_KEY = 'my-little-day-streak-start-v1';
const DECOR_LAYOUT_KEY = 'my-little-day-decor-layout-v1';
const GUIDE_SEEN_KEY = 'my-little-day-guide-seen-v1';
const SHARE_HASH_PREFIX = '#my-little-home=';
const SHARE_ID_PREFIX = '#share=';
const SHARE_LINK_CACHE_KEY = 'my-little-day-last-share-link-v1';
const ROUTINE_THEME_KEY = 'my-little-day-routine-theme-v1';
const GRAPE_PROGRESS_KEY = 'my-little-day-grape-progress-v1';
const COMPLETED_BUNCHES_KEY = 'my-little-day-completed-bunches-v1';
const GRAPE_MIGRATION_KEY = 'my-little-day-grape-system-v1';
const GRAPE_SIZE_MIGRATION_KEY = 'my-little-day-grape-size-v2';
const GRAPES_PER_BUNCH = 6;
const INTERIOR_LAYOUT_KEY = 'my-little-day-interior-layout-v1';
const INTERIOR_UNLOCK_BUNCHES = 3;
const SHARE_ENDPOINT = 'https://alpxeyqkqlacbbluwazq.supabase.co/functions/v1/home-share';
const SHARE_PUBLISHABLE_KEY = 'sb_publishable_kx3FsYOCmIZJTVcIDr1B0g_FWZr8BT_';
let selectedDecor = 'flower';
let editingMemoryDate = null;
let pendingRewardMemoryDate = null;
const ROUTINE_THEMES = {
  care:{label:'나를 돌보는',chip:'돌봄',prompts:['나에게 고마웠던 순간을 적어 볼까요?','내 몸을 위해 해낸 작은 일을 남겨요.','오늘 나를 편하게 해 준 선택은 무엇인가요?']},
  growth:{label:'조금씩 자라는',chip:'성장',prompts:['어제보다 한 걸음 나아간 일을 적어 볼까요?','배운 것 하나를 짧게 남겨요.','미뤄둔 일 중 시작한 것은 무엇인가요?']},
  relation:{label:'마음을 나누는',chip:'관계',prompts:['누군가에게 건넨 따뜻함을 적어 볼까요?','고마웠던 사람을 떠올려 봐요.','오늘의 작은 연결을 남겨요.']},
  rest:{label:'천천히 쉬어가는',chip:'휴식',prompts:['잠시 멈춘 것도 오늘의 잘함이에요.','나를 쉬게 해 준 순간을 적어 봐요.','부담을 내려놓은 일을 남겨요.']}
};
const DECOR_OPTIONS = [
  ['flower','✿','꽃 화분'],['lamp','☀','작은 조명'],['book','▤','책 더미'],['flag','⚑','응원 깃발'],['tree','♟','작은 나무'],['bigtree','♟','큰 나무'],['bench','▰','나무 벤치'],
  ['fountain','⛲','분수'],['birdhouse','⌂','새집'],['mailbox','✉','우편함'],['fence','▥','울타리'],['swing','♧','그네'],['bicycle','◎','자전거'],
  ['stone','●','정원 돌'],['mushroom','♣','버섯'],['birdbath','◉','새 목욕탕'],['lantern','◈','랜턴'],['leafplant','☘','잎 화분'],['watering','♒','물뿌리개'],
  ['flowerbed','✽','꽃밭'],['sunflower','✺','해바라기'],['gnome','♟','정원 요정'],['basket','▱','피크닉 바구니'],['hammock','⌒','해먹'],['arch','∩','정원 아치'],
  ['chime','♬','바람 종'],['pumpkin','●','호박'],['cat','⌁','고양이'],['dog','♧','강아지'],['stepping','◌','디딤돌'],['topiary','✦','토피어리'],
  ['rooflight','✦','지붕 조명']
];
const SHARE_DECOR_TYPES = DECOR_OPTIONS.map(([type])=>type);
const DECOR_INFO = Object.fromEntries(DECOR_OPTIONS.map(([type,icon,label])=>[type,{icon,label}]));
const DECOR_CATEGORIES=[
  ['식물 · 꽃',['flower','tree','bigtree','leafplant','flowerbed','sunflower','mushroom','pumpkin','topiary','stone']],
  ['정원 · 휴식',['bench','fountain','birdbath','fence','swing','hammock','arch','stepping','watering']],
  ['야외 소품',['lamp','book','flag','birdhouse','mailbox','bicycle','lantern','basket','chime']],
  ['집 · 친구',['rooflight','gnome','cat','dog']]
];
const DECOR_ART = {
  flower:'<path d="M29 42h15l-2-13H31z" fill="#d97855"/><path d="M36 29v-12" stroke="#4f7d50" stroke-width="3"/><g fill="#ef90a3"><circle cx="36" cy="15" r="6"/><circle cx="29" cy="20" r="6"/><circle cx="43" cy="20" r="6"/><circle cx="31" cy="27" r="6"/><circle cx="41" cy="27" r="6"/></g><circle cx="36" cy="21" r="4" fill="#f8cb50"/>',
  lamp:'<path d="M36 43V24" stroke="#75533c" stroke-width="4"/><path d="M23 27h26L36 12z" fill="#f3c558"/><circle cx="36" cy="29" r="6" fill="#fff0a3"/>',
  book:'<rect x="18" y="34" width="35" height="8" rx="2" fill="#dc7658"/><rect x="22" y="26" width="32" height="8" rx="2" fill="#f0bd48"/><rect x="18" y="18" width="33" height="8" rx="2" fill="#72a7a4"/>',
  flag:'<path d="M26 43V11" stroke="#79543a" stroke-width="4"/><path d="M28 13h25L42 23l11 10H28z" fill="#eb7d62"/>',
  tree:'<path d="M36 44V31" stroke="#795039" stroke-width="6"/><circle cx="29" cy="24" r="13" fill="#5c8e58"/><circle cx="42" cy="25" r="13" fill="#6c9f60"/><circle cx="35" cy="15" r="14" fill="#477f50"/>',
  bigtree:'<path d="M36 45V29" stroke="#795039" stroke-width="8"/><circle cx="25" cy="25" r="15" fill="#5a8b52"/><circle cx="47" cy="26" r="15" fill="#6fa161"/><circle cx="36" cy="14" r="18" fill="#477f50"/><circle cx="35" cy="28" r="16" fill="#5f9558"/>',
  bench:'<path d="M20 33h34v7H20zM23 22h30v7H23z" fill="#a66d45"/><path d="M27 40v6m20-6v6" stroke="#795039" stroke-width="4"/>',
  fountain:'<ellipse cx="36" cy="40" rx="21" ry="7" fill="#74a9b4"/><path d="M29 39v-12h14v12" fill="#8ac0c6"/><path d="M31 26c0-8 10-9 10 0" fill="none" stroke="#dff7f3" stroke-width="3"/>',
  birdhouse:'<path d="M36 43V30" stroke="#795039" stroke-width="4"/><path d="M23 32V19h26v13z" fill="#7cadbf"/><path d="M20 20l16-11 16 11z" fill="#e97b58"/><circle cx="36" cy="25" r="4" fill="#46382c"/>',
  mailbox:'<path d="M28 44V31" stroke="#795039" stroke-width="4"/><path d="M19 32v-11c0-7 7-9 16-9h10v20z" fill="#5e9fba"/><path d="M35 12v20" stroke="#447b97" stroke-width="2"/>',
  fence:'<path d="M17 40h38M17 31h38" stroke="#fff2d2" stroke-width="4"/><path d="M22 44V18l4-6 4 6v26m11 0V18l4-6 4 6v26" stroke="#fff2d2" stroke-width="4"/>',
  swing:'<path d="M19 43L28 13m25 30L44 13M25 16h22" stroke="#795039" stroke-width="4"/><path d="M32 17v15m8-15v15" stroke="#eee2c8" stroke-width="2"/><path d="M28 32h16v5H28z" fill="#e98962"/>',
  bicycle:'<circle cx="23" cy="37" r="8" fill="none" stroke="#4d5960" stroke-width="3"/><circle cx="50" cy="37" r="8" fill="none" stroke="#4d5960" stroke-width="3"/><path d="M23 37l12-16 8 16H23l15-7 12 7M35 21h9m-8 0l-4-5" fill="none" stroke="#e16f54" stroke-width="3"/>',
  stone:'<ellipse cx="23" cy="38" rx="10" ry="6" fill="#a9a799"/><ellipse cx="38" cy="35" rx="13" ry="8" fill="#c6bfaa"/><ellipse cx="53" cy="40" rx="8" ry="5" fill="#a9a799"/>',
  mushroom:'<path d="M31 43V30h10v13z" fill="#fff0d4"/><path d="M20 31c2-14 30-14 32 0z" fill="#e77c5c"/><g fill="#fff8e8"><circle cx="29" cy="25" r="2"/><circle cx="40" cy="21" r="2"/><circle cx="46" cy="27" r="2"/></g>',
  birdbath:'<path d="M33 43v-13h6v13" fill="#879aa1"/><ellipse cx="36" cy="28" rx="16" ry="7" fill="#9ec1c7"/><ellipse cx="36" cy="27" rx="10" ry="3" fill="#d9f0ec"/>',
  lantern:'<path d="M25 42V22h22v20z" fill="#74543b"/><path d="M29 38V25h14v13z" fill="#ffe79a"/><path d="M24 22l12-10 12 10" fill="#493727"/>',
  leafplant:'<path d="M29 43h15l-2-13H31z" fill="#d97855"/><path d="M36 31V17" stroke="#527f50" stroke-width="3"/><g fill="#5f9a65"><ellipse cx="27" cy="23" rx="6" ry="10" transform="rotate(-35 27 23)"/><ellipse cx="45" cy="23" rx="6" ry="10" transform="rotate(35 45 23)"/><ellipse cx="36" cy="17" rx="6" ry="10"/></g>',
  watering:'<path d="M23 35a12 12 0 0 1 24 0v7H23z" fill="#78aabd"/><path d="M46 34l13-7" stroke="#78aabd" stroke-width="5"/><path d="M25 30c0-12 15-12 15 0" fill="none" stroke="#78aabd" stroke-width="4"/>',
  flowerbed:'<path d="M16 43h40l-3-14H19z" fill="#895b42"/><path d="M25 30v-10m11 10V16m11 14V20" stroke="#4e7c4e" stroke-width="3"/><g fill="#ef8fa1"><circle cx="25" cy="18" r="4"/><circle cx="47" cy="18" r="4"/></g><circle cx="36" cy="14" r="5" fill="#f5c74d"/>',
  sunflower:'<path d="M36 43V26" stroke="#547a3f" stroke-width="4"/><g fill="#ffd256"><circle cx="36" cy="16" r="12"/><circle cx="25" cy="16" r="6"/><circle cx="47" cy="16" r="6"/><circle cx="36" cy="5" r="6"/><circle cx="36" cy="27" r="6"/></g><circle cx="36" cy="16" r="7" fill="#70462f"/>',
  gnome:'<path d="M25 43c0-14 22-14 22 0z" fill="#5692b2"/><circle cx="36" cy="25" r="8" fill="#ffd0ab"/><path d="M22 22l14-15 14 15z" fill="#e6635d"/>',
  basket:'<path d="M20 42c1-16 31-16 32 0z" fill="#c88b4e"/><path d="M27 29c0-14 18-14 18 0" fill="none" stroke="#9b663d" stroke-width="4"/><circle cx="31" cy="35" r="4" fill="#ed7e5a"/><circle cx="41" cy="35" r="4" fill="#f1b640"/>',
  hammock:'<path d="M18 43V14m36 29V14" stroke="#795039" stroke-width="4"/><path d="M20 26c11 19 22 19 34 0-10 6-24 6-34 0z" fill="#e8967a"/>',
  arch:'<path d="M22 43V27a14 14 0 0 1 28 0v16" fill="none" stroke="#f6ecd3" stroke-width="5"/><g fill="#ef8fa1"><circle cx="24" cy="28" r="5"/><circle cx="31" cy="16" r="5"/><circle cx="43" cy="16" r="5"/><circle cx="50" cy="28" r="5"/></g>',
  chime:'<path d="M20 16h32" stroke="#795039" stroke-width="4"/><path d="M25 17v20m11-20v25m11-25v20" stroke="#cfdfe0" stroke-width="3"/><path d="M20 16l16-8 16 8" fill="none" stroke="#795039" stroke-width="3"/>',
  pumpkin:'<path d="M36 17v-6" stroke="#587945" stroke-width="4"/><g fill="#f39b36"><ellipse cx="27" cy="34" rx="10" ry="9"/><ellipse cx="36" cy="33" rx="11" ry="11"/><ellipse cx="45" cy="34" rx="10" ry="9"/></g>',
  cat:'<path d="M22 41c0-18 21-20 27-8 8 15-8 12-13 5" fill="#e79d64"/><circle cx="43" cy="25" r="8" fill="#e79d64"/><path d="M37 19l3-7 5 6m3 0l4-6 2 8" fill="#e79d64"/>',
  dog:'<path d="M20 40c0-15 24-16 27-3 3 11-16 10-19 4" fill="#c78653"/><circle cx="45" cy="27" r="8" fill="#c78653"/><ellipse cx="48" cy="20" rx="4" ry="7" fill="#795039"/>',
  stepping:'<ellipse cx="21" cy="40" rx="10" ry="5" fill="#dbc99a"/><ellipse cx="36" cy="32" rx="10" ry="5" fill="#e8d7a8"/><ellipse cx="51" cy="22" rx="10" ry="5" fill="#dbc99a"/>',
  topiary:'<path d="M29 43h15l-2-12H31z" fill="#d97855"/><path d="M36 31V23" stroke="#795039" stroke-width="4"/><circle cx="36" cy="16" r="12" fill="#57854f"/><circle cx="43" cy="21" r="8" fill="#6ba15d"/>',
  rooflight:'<path d="M13 29L36 10l23 19" fill="#e97855"/><path d="M17 27c10-2 27-2 38 0" fill="none" stroke="#534338" stroke-width="3"/><g fill="#ffe075"><circle cx="21" cy="29" r="4"/><circle cx="29" cy="27" r="4"/><circle cx="36" cy="26" r="4"/><circle cx="43" cy="27" r="4"/><circle cx="51" cy="29" r="4"/></g>'
};
function decorThumbnail(type){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 52"><rect width="72" height="52" rx="10" fill="#fff1c9"/><path d="M0 45c19-8 49-8 72 0v7H0z" fill="#b7d774"/>${DECOR_ART[type]||''}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
function renderDecorOptions(){
  decorOptions.innerHTML=DECOR_CATEGORIES.map(([category,types])=>`<section class="decor-category" aria-label="${category}"><h3>${category}</h3><div class="decor-category-grid">${types.map(type=>{ const {label}=DECOR_INFO[type]; return `<button class="decor-option${type===selectedDecor?' selected':''}" data-decor="${type}" type="button"><img class="decor-option-image" src="${decorThumbnail(type)}" alt="" aria-hidden="true" /><span class="decor-option-label">${label}</span></button>`; }).join('')}</div></section>`).join('');
}
renderDecorOptions();
function decodeSharedHome(){
  const encoded=location.hash.startsWith(SHARE_HASH_PREFIX)?location.hash.slice(SHARE_HASH_PREFIX.length):'';
  if(!encoded) return null;
  try {
    const unpacked=window.LZString?.decompressFromEncodedURIComponent(encoded);
    const padded=encoded.replace(/-/g,'+').replace(/_/g,'/')+'==='.slice((encoded.length+3)%4);
    const binary=unpacked?null:atob(padded);
    const bytes=binary?Uint8Array.from(binary,char=>char.charCodeAt(0)):null;
    const data=JSON.parse(unpacked||new TextDecoder().decode(bytes));
    if(data.v===2) return unpackSharedHome(data);
    if(!Array.isArray(data.memories)||!data.decorLayout||typeof data.houseName!=='string') return null;
    return data;
  } catch { return null; }
}
function sharedHomeIdFromHash(){
  const id=location.hash.startsWith(SHARE_ID_PREFIX)?location.hash.slice(SHARE_ID_PREFIX.length):'';
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)?id:'';
}
async function loadSharedHome(id){
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),8000);
  try {
    const response=await fetch(`${SHARE_ENDPOINT}?id=${encodeURIComponent(id)}`,{
      headers:{apikey:SHARE_PUBLISHABLE_KEY},
      signal:controller.signal,
    });
    if(!response.ok) return null;
    const payload=await response.json();
    return payload?.state?.v===2?unpackSharedHome(payload.state):null;
  } catch { return null; }
  finally { clearTimeout(timeout); }
}
function compactDecorationId(id){
  return id.startsWith('memory-')?`m${Date.parse(id.slice(7))}`:id==='starter-flower'?'s0':id==='starter-book'?'s1':id;
}
function expandDecorationId(id){
  if(typeof id!=='string') return '';
  if(id.startsWith('m')) {
    const time=Number(id.slice(1));
    return Number.isFinite(time)?`memory-${new Date(time).toISOString()}`:id;
  }
  return id==='s0'?'starter-flower':id==='s1'?'starter-book':id;
}
function packSharedHome(){
  const active=placed.children.map(decoration=>{
    const saved=decorLayout[decoration.userData.decorationId]||{};
    const bloomMask=(saved.bloomedBuds||[]).reduce((bits,index)=>bits|(1<<index),0);
    return [
      compactDecorationId(decoration.userData.decorationId),
      Math.round(decoration.position.x*100),
      Math.round(decoration.position.z*100),
      decoration.userData.flowerColor||saved.flowerColor||0,
      bloomMask,
      decoration.userData.roofLightOn?1:0
    ];
  });
  return {
    v:2,
    m:memories.map(memory=>[memory.text,Math.max(0,SHARE_DECOR_TYPES.indexOf(memory.decor)),Date.parse(memory.date)||0,memory.flowerColor||0,memory.kind==='rest'?1:0,memory.decor&&memory.decor!=='rest'?1:0,memory.rewardStored?1:0,(memory.rewardMemoryDates||[]).map(date=>Date.parse(date)||0)]),
    s:streakStartDate,
    n:houseName,
    d:active,
    g:[grapeProgress,completedBunches],
    i:Object.entries(interiorLayout).filter(([,item])=>item?.placed).map(([type,item])=>[type,Math.round((item.x||0)*100),Math.round((item.z||0)*100)]),
    o:Math.round(interiorOrbitTargetAngle*1000),
    q:Math.round(interiorZoomTarget*1000),
    w:[Math.round(world.rotation.y*1000),Math.round(camera.position.y*100)]
  };
}
function unpackSharedHome(data){
  if(!Array.isArray(data.m)||!Array.isArray(data.d)||typeof data.n!=='string') return null;
  const memories=data.m.map(([text,typeIndex,time,flowerColor,isRest,hasDecor,rewardStored,rewardTimes])=>({
    text:String(text||''),
    decor:hasDecor===undefined?(isRest?'rest':SHARE_DECOR_TYPES[typeIndex]||'flower'):hasDecor===0?(isRest?'rest':null):SHARE_DECOR_TYPES[typeIndex]||'flower',
    date:Number.isFinite(time)&&time>0?new Date(time).toISOString():new Date().toISOString(),
    flowerColor:flowerColor||null,
    kind:isRest?'rest':undefined,
    rewardStored:Boolean(rewardStored),
    rewardMemoryDates:Array.isArray(rewardTimes)?rewardTimes.filter(time=>Number.isFinite(time)&&time>0).map(time=>new Date(time).toISOString()):[]
  }));
  const decorLayout={};
  data.d.forEach(([compactId,x,z,flowerColor,bloomMask,roofLightOn])=>{
    const id=expandDecorationId(compactId);
    if(!id||!Number.isFinite(x)||!Number.isFinite(z)) return;
    const saved={x:x/100,z:z/100};
    if(flowerColor) saved.flowerColor=flowerColor;
    if(bloomMask) saved.bloomedBuds=[0,1,2].filter(index=>bloomMask&(1<<index));
    if(roofLightOn) saved.roofLightOn=true;
    decorLayout[id]=saved;
  });
  const interiorLayout={};
  if(Array.isArray(data.i)) data.i.forEach(([type,x,z])=>{ if(typeof type==='string'&&Number.isFinite(x)&&Number.isFinite(z)) interiorLayout[type]={placed:true,x:x/100,z:z/100}; });
  return {memories,streakStartDate:data.s||'',houseName:data.n,decorLayout,interiorLayout,interiorViewAngle:Number.isFinite(data.o)?data.o/1000:0,interiorViewZoom:Number.isFinite(data.q)?data.q/1000:1,grapeProgress:Array.isArray(data.g)?Number(data.g[0])||0:memories.length%GRAPES_PER_BUNCH,completedBunches:Array.isArray(data.g)?Number(data.g[1])||0:Math.floor(memories.length/GRAPES_PER_BUNCH),view:{rotation:(data.w?.[0]??440)/1000,cameraHeight:(data.w?.[1]??630)/100}};
}
function encodeSharedHome(data){
  const packed=window.LZString?.compressToEncodedURIComponent(JSON.stringify(data));
  if(packed) return packed;
  const bytes=new TextEncoder().encode(JSON.stringify(data));
  let binary='';
  bytes.forEach(byte=>{ binary+=String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
let sharedHome=decodeSharedHome();
const shortSharedHomeId=sharedHomeIdFromHash();
if(!sharedHome&&shortSharedHomeId) sharedHome=await loadSharedHome(shortSharedHomeId);
const isSharedHome=Boolean(sharedHome);
const sharedView=sharedHome?.view||{};
const sharedRotation=Number.isFinite(sharedView.rotation)?sharedView.rotation:.44;
const sharedCameraHeight=Number.isFinite(sharedView.cameraHeight)?sharedView.cameraHeight:6.3;
function persistLocal(key,value){ if(!isSharedHome) localStorage.setItem(key,value); }
let memories = sharedHome?.memories ?? JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let streakStartDate = sharedHome?.streakStartDate ?? (localStorage.getItem(STREAK_START_KEY) || '');
let decorLayout = sharedHome?.decorLayout ?? JSON.parse(localStorage.getItem(DECOR_LAYOUT_KEY) || '{}');
let interiorLayout = isSharedHome ? (sharedHome?.interiorLayout || {}) : JSON.parse(localStorage.getItem(INTERIOR_LAYOUT_KEY) || '{}');
let houseName = sharedHome?.houseName ?? (localStorage.getItem(HOUSE_NAME_KEY) || '우리');
let routineTheme = isSharedHome ? 'care' : (localStorage.getItem(ROUTINE_THEME_KEY) || 'care');
if(!ROUTINE_THEMES[routineTheme]) routineTheme='care';
const eligibleMemoryCount=memories.length;
const hadLegacyGrapeSystem=!isSharedHome&&Boolean(localStorage.getItem(GRAPE_MIGRATION_KEY));
let grapeProgress=isSharedHome?(sharedHome?.grapeProgress??eligibleMemoryCount%GRAPES_PER_BUNCH):Number(localStorage.getItem(GRAPE_PROGRESS_KEY));
let completedBunches=isSharedHome?(sharedHome?.completedBunches??Math.floor(eligibleMemoryCount/GRAPES_PER_BUNCH)):Number(localStorage.getItem(COMPLETED_BUNCHES_KEY));
if(!isSharedHome&&!localStorage.getItem(GRAPE_MIGRATION_KEY)){
  grapeProgress=eligibleMemoryCount%GRAPES_PER_BUNCH;
  completedBunches=Math.floor(eligibleMemoryCount/GRAPES_PER_BUNCH);
  localStorage.setItem(GRAPE_PROGRESS_KEY,String(grapeProgress));
  localStorage.setItem(COMPLETED_BUNCHES_KEY,String(completedBunches));
  localStorage.setItem(GRAPE_MIGRATION_KEY,'1');
}
if(!Number.isFinite(completedBunches)||completedBunches<0) completedBunches=0;
if(!Number.isFinite(grapeProgress)||grapeProgress<0) grapeProgress=0;
if(!isSharedHome&&!localStorage.getItem(GRAPE_SIZE_MIGRATION_KEY)){
  if(hadLegacyGrapeSystem){
    const legacyGrapeTotal=completedBunches*7+grapeProgress;
    completedBunches=Math.floor(legacyGrapeTotal/GRAPES_PER_BUNCH);
    grapeProgress=legacyGrapeTotal%GRAPES_PER_BUNCH;
    localStorage.setItem(GRAPE_PROGRESS_KEY,String(grapeProgress));
    localStorage.setItem(COMPLETED_BUNCHES_KEY,String(completedBunches));
  }
  localStorage.setItem(GRAPE_SIZE_MIGRATION_KEY,'1');
}
if(isSharedHome&&grapeProgress>=GRAPES_PER_BUNCH){ completedBunches+=Math.floor(grapeProgress/GRAPES_PER_BUNCH); grapeProgress%=GRAPES_PER_BUNCH; }

const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true, preserveDrawingBuffer:true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
camera.position.set(3.6, 6.3, 13.6);
const target = new THREE.Vector3(0, 1.45, 0);
const world = new THREE.Group();
// Keep the front facade in view so the open doorway can reveal the room depth.
world.rotation.y = .44;
scene.add(world);

scene.add(new THREE.HemisphereLight(0xfff3c8, 0x56745c, 2.3));
const sun = new THREE.DirectionalLight(0xffe0a0, 3.1);
sun.position.set(4, 9, 6); sun.castShadow = true; sun.shadow.mapSize.set(1024,1024); scene.add(sun);

const palette = { wall:0xfff4d7, roof:0xeb7651, trim:0xf1a237, wood:0x99623e, lawn:0x82aa68, path:0xf0c97a, glass:0x93c7d0, leaf:0x537b50, pot:0xdd7652, dark:0x493727, cream:0xfff9e8, blue:0x6babc3, pink:0xea8790 };
const mat = (color, roughness=.8) => new THREE.MeshStandardMaterial({ color, roughness });
function mesh(geometry, material, position, parent=world) { const m = new THREE.Mesh(geometry, material); m.position.copy(position); m.castShadow=true; m.receiveShadow=true; parent.add(m); return m; }
function box(x,y,z,color,pos, parent=world) { return mesh(new THREE.BoxGeometry(x,y,z),mat(color),pos,parent); }
function cylinder(rt,rb,h,color,pos,parent=world) { return mesh(new THREE.CylinderGeometry(rt,rb,h,20),mat(color),pos,parent); }
function sphere(r,color,pos,parent=world) { return mesh(new THREE.SphereGeometry(r,20,16),mat(color),pos,parent); }

// hand-painted toy base
const base = mesh(new THREE.CylinderGeometry(5.7, 5.95, .48, 64), mat(0x759d63), new THREE.Vector3(0,-.35,0));
const soil = mesh(new THREE.CylinderGeometry(5.32,5.42,.16,64),mat(0x9cc479),new THREE.Vector3(0,-.04,0));
base.rotation.z = .02;
// winding stone path
for (let i=0;i<6;i++) { const stone=mesh(new THREE.SphereGeometry(.54-(i%2)*.05,16,10),mat(palette.path),new THREE.Vector3(-.2+i*.22,.08,4.25-i*.73)); stone.scale.set(1.15,.22,.8); stone.rotation.y=i*.25; }

// house body and roof
const houseBody=new THREE.Group(); world.add(houseBody);
// Build the walls as a shell so the doorway is a real opening, not a picture on the facade.
box(5.25,3.25,.18,palette.wall,new THREE.Vector3(0,1.63,-2.38),houseBody);
box(.18,3.25,4.45,palette.wall,new THREE.Vector3(-2.54,1.63,-.25),houseBody);
box(.18,3.25,4.45,palette.wall,new THREE.Vector3(2.54,1.63,-.25),houseBody);
box(5.25,.18,4.45,palette.wall,new THREE.Vector3(0,3.16,-.25),houseBody);
box(2.08,3.25,.18,palette.wall,new THREE.Vector3(-1.58,1.63,1.88),houseBody);
box(2.08,3.25,.18,palette.wall,new THREE.Vector3(1.58,1.63,1.88),houseBody);
box(1.08,1.25,.18,palette.wall,new THREE.Vector3(0,2.63,1.88),houseBody);
box(5.48,.30,4.68,palette.trim,new THREE.Vector3(0,.12,-.25));
const roof = mesh(new THREE.ConeGeometry(3.95,2.55,4),mat(palette.roof),new THREE.Vector3(0,4.55,-.25)); roof.rotation.y=Math.PI/4;
const roofCap = mesh(new THREE.CylinderGeometry(.22,.29,.52,20),mat(palette.wood),new THREE.Vector3(0,5.85,-.25));

// front door and windows
const frontFacade=new THREE.Group(); world.add(frontFacade);
const warmInterior = new THREE.Group(); warmInterior.visible=false; world.add(warmInterior);
// A miniature of the actual living room sits behind the open doorway.
box(1.03,.08,2.38,0xd89a55,new THREE.Vector3(0,.12,.67),warmInterior);
box(1.02,2.24,.09,palette.wall,new THREE.Vector3(0,1.17,-.52),warmInterior);
const doorwayInteriorFurniture=new THREE.Group(); warmInterior.add(doorwayInteriorFurniture);
const picture=box(.38,.30,.035,0x8e5948,new THREE.Vector3(-.12,1.58,-.46),warmInterior);
box(.28,.20,.02,palette.cream,new THREE.Vector3(-.12,1.58,-.43),warmInterior);
const doorwayArtStem=box(.012,.06,.008,palette.leaf,new THREE.Vector3(-.1,1.66,-.414),warmInterior); doorwayArtStem.rotation.z=-.35;
[[-.14,1.62],[-.1,1.62],[-.06,1.62],[-.12,1.58],[-.08,1.58],[-.1,1.54]].forEach(([x,y],index)=>mesh(new THREE.CircleGeometry(.024,12),mat(index%2?0x8e5f86:0xa66d96),new THREE.Vector3(x,y,-.408),warmInterior));
const doorwayArtLeaf=mesh(new THREE.CircleGeometry(.025,12),mat(palette.leaf),new THREE.Vector3(-.065,1.66,-.408),warmInterior); doorwayArtLeaf.scale.set(1.5,.65,1); doorwayArtLeaf.rotation.z=.45;
const doorPivot=new THREE.Group(); doorPivot.position.set(-.54,.08,2.04); world.add(doorPivot);
const doorMesh=box(1.08,1.92,.16,palette.wood,new THREE.Vector3(.54,.96,0),doorPivot); doorMesh.userData.isDoor=true;
box(.72,.055,.035,palette.trim,new THREE.Vector3(.54,1.38,.095),doorPivot); box(.72,.055,.035,palette.trim,new THREE.Vector3(.54,.56,.095),doorPivot);
mesh(new THREE.SphereGeometry(.085,12,10),mat(0xf6ca4d),new THREE.Vector3(.88,.97,.12),doorPivot);
let doorOpen=false, doorTargetRotation=0;
const OPEN_DOOR_ANGLE=-Math.PI*.47;
box(1.5,1.42,.12,palette.blue,new THREE.Vector3(-1.66,2.22,2.09),frontFacade);
box(1.5,1.42,.12,palette.blue,new THREE.Vector3(1.66,2.22,2.09),frontFacade);
for (const x of [-1.66,1.66]) { box(.12,1.62,.12,palette.cream,new THREE.Vector3(x,2.22,2.18),frontFacade); box(1.68,.12,.12,palette.cream,new THREE.Vector3(x,2.22,2.18),frontFacade); box(1.82,.15,.15,palette.roof,new THREE.Vector3(x,3.05,2.17),frontFacade); }

// A heart-shaped nameplate, rendered as part of the house facade.
const nameplateCanvas = document.createElement('canvas');
nameplateCanvas.width = 512; nameplateCanvas.height = 512;
const nameplateContext = nameplateCanvas.getContext('2d');
const nameplateTexture = new THREE.CanvasTexture(nameplateCanvas);
nameplateTexture.colorSpace = THREE.SRGBColorSpace;
function drawNameplate(){
  const ctx = nameplateContext; ctx.clearRect(0,0,512,512); ctx.save(); ctx.scale(2,2);
  ctx.beginPath(); ctx.moveTo(128,231);
  ctx.bezierCurveTo(112,216,35,165,35,92);
  ctx.bezierCurveTo(35,52,82,31,111,56);
  ctx.bezierCurveTo(119,63,124,71,128,80);
  ctx.bezierCurveTo(132,71,137,63,145,56);
  ctx.bezierCurveTo(174,31,221,52,221,92);
  ctx.bezierCurveTo(221,165,144,216,128,231); ctx.closePath();
  ctx.fillStyle='#ed8c78'; ctx.fill(); ctx.lineWidth=5; ctx.strokeStyle='#fff1ca'; ctx.stroke();
  ctx.beginPath(); ctx.arc(92,73,8,0,Math.PI*2); ctx.fillStyle='rgba(255,245,210,.72)'; ctx.fill();
  const label=`${houseName}네 집`; ctx.fillStyle='#fffdf4'; ctx.textAlign='center'; ctx.textBaseline='middle';
  const nameFontSize = label.length <= 4 ? 44 : label.length <= 6 ? 34 : 27;
  ctx.font=`800 ${nameFontSize}px Nanum Gothic, sans-serif`; ctx.fillText(label,128,134);
  ctx.restore(); nameplateTexture.needsUpdate=true;
}
drawNameplate();
const nameplate = mesh(new THREE.PlaneGeometry(1.42,1.42),new THREE.MeshBasicMaterial({map:nameplateTexture,transparent:true,alphaTest:.05,depthWrite:false,depthTest:true,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1,side:THREE.DoubleSide}),new THREE.Vector3(0,2.65,2.18));
nameplate.renderOrder = 3;
nameplate.visible = true;
// chimney
box(.72,1.45,.72,palette.wood,new THREE.Vector3(1.58,4.7,-.65)); box(.9,.16,.9,palette.cream,new THREE.Vector3(1.58,5.42,-.65));

const placed = new THREE.Group(); world.add(placed);
const roofGarland = new THREE.Group(); world.add(roofGarland);
houseNameText.textContent = `${houseName}네 집`;
const slots = [ [-2.65,.04,1.75], [2.3,.04,1.42], [-3.05,.04,-.2], [3.15,.04,.15], [-1.7,.04,3.2], [1.72,.04,3.28], [-3.75,.04,1.0], [3.8,.04,2.1] ];
const houseZone = { minX:-2.82, maxX:2.82, minZ:-2.82, maxZ:2.28 };
const TOP_LAWN_RADIUS = 5.32;
const DECOR_FOOTPRINTS={flower:.42,lamp:.38,book:.44,flag:.36,tree:.68,bigtree:.98,bench:.6,fountain:.55,birdhouse:.4,mailbox:.44,fence:.56,swing:.74,bicycle:.56,stone:.44,mushroom:.4,birdbath:.44,lantern:.34,leafplant:.48,watering:.44,flowerbed:.58,sunflower:.44,gnome:.38,basket:.4,hammock:.72,arch:.58,chime:.38,pumpkin:.5,cat:.42,dog:.44,stepping:.46,topiary:.48};
function decorFootprint(type){ return DECOR_FOOTPRINTS[type]??.5; }
function keepInsideTopLawn(x,z){
  const maxRadius=TOP_LAWN_RADIUS;
  const distance=Math.hypot(x,z);
  if(distance<=maxRadius) return {x,z};
  return {x:x/distance*maxRadius,z:z/distance*maxRadius};
}
function keepOutsideHouse(x,z,clearance=.28){
  const {x:safeX,z:safeZ}=keepInsideTopLawn(x,z);
  const safeHouse={minX:houseZone.minX-clearance,maxX:houseZone.maxX+clearance,minZ:houseZone.minZ-clearance,maxZ:houseZone.maxZ+clearance};
  if(safeX<=safeHouse.minX || safeX>=safeHouse.maxX || safeZ<=safeHouse.minZ || safeZ>=safeHouse.maxZ) return {x:safeX,z:safeZ};
  const edges=[
    {distance:safeX-safeHouse.minX,x:safeHouse.minX,z:safeZ},
    {distance:safeHouse.maxX-safeX,x:safeHouse.maxX,z:safeZ},
    {distance:safeZ-safeHouse.minZ,x:safeX,z:safeHouse.minZ},
    {distance:safeHouse.maxZ-safeZ,x:safeX,z:safeHouse.maxZ}
  ];
  const nearest=edges.reduce((closest,edge)=>edge.distance<closest.distance?edge:closest);
  return keepInsideTopLawn(nearest.x,nearest.z);
}
const DECORATION_GAP = .08;
function keepDecorationSeparate(x,z,excludedDecoration=null,type='flower'){
  const candidateRadius=decorFootprint(type);
  let position=keepOutsideHouse(x,z,candidateRadius+.08);
  for(let attempt=0;attempt<48;attempt++){
    const conflict=placed.children.find(decoration=>{
      if(decoration===excludedDecoration) return false;
      if(!decoration.userData.memoryText) return false;
      if(decoration.userData.isRoofDecoration) return false;
      return Math.hypot(decoration.position.x-position.x,decoration.position.z-position.z)<candidateRadius+decorFootprint(decoration.userData.type)+DECORATION_GAP;
    });
    if(!conflict) return position;
    const dx=position.x-conflict.position.x;
    const dz=position.z-conflict.position.z;
    const angle=(Math.abs(dx)+Math.abs(dz)<.01?(attempt+1)*2.399:Math.atan2(dz,dx)+attempt*.45);
    const openDistance=candidateRadius+decorFootprint(conflict.userData.type)+DECORATION_GAP;
    position=keepOutsideHouse(conflict.position.x+Math.cos(angle)*openDistance,conflict.position.z+Math.sin(angle)*openDistance,candidateRadius+.08);
  }
  return position;
}
function isDecorationPositionOpen(x,z,excludedDecoration,type){
  const radius=decorFootprint(type);
  if(Math.hypot(x,z)>TOP_LAWN_RADIUS) return false;
  const houseSafe=keepOutsideHouse(x,z,radius+.08);
  if(Math.hypot(houseSafe.x-x,houseSafe.z-z)>.001) return false;
  return !placed.children.some(decoration=>{
    if(decoration===excludedDecoration||!decoration.userData.memoryText||decoration.userData.isRoofDecoration) return false;
    const minimumDistance=radius+decorFootprint(decoration.userData.type)+DECORATION_GAP;
    return Math.hypot(decoration.position.x-x,decoration.position.z-z)<minimumDistance;
  });
}
function keepDragPosition(decoration,x,z){
  const type=decoration.userData.type;
  const target=keepInsideTopLawn(x,z);
  if(isDecorationPositionOpen(target.x,target.z,decoration,type)) return target;
  const start={x:decoration.position.x,z:decoration.position.z};
  if(!isDecorationPositionOpen(start.x,start.z,decoration,type)) return keepDecorationSeparate(target.x,target.z,decoration,type);
  let free=0;
  let blocked=1;
  for(let step=0;step<14;step++){
    const progress=(free+blocked)/2;
    const candidate={x:THREE.MathUtils.lerp(start.x,target.x,progress),z:THREE.MathUtils.lerp(start.z,target.z,progress)};
    if(isDecorationPositionOpen(candidate.x,candidate.z,decoration,type)) free=progress;
    else blocked=progress;
  }
  return {x:THREE.MathUtils.lerp(start.x,target.x,free),z:THREE.MathUtils.lerp(start.z,target.z,free)};
}
const flowerColors = [0xf0a4ac,0xf18b75,0xeb7795,0xaf83ce,0xffb943,0x8fcf9a];
function randomFlowerColor(){ return flowerColors[Math.floor(Math.random()*flowerColors.length)]; }
function nextFlowerColor(currentColor){ const choices=flowerColors.filter(color=>color!==currentColor); return choices[Math.floor(Math.random()*choices.length)]; }
function saveDecorationPosition(decoration){
  decorLayout[decoration.userData.decorationId]={...decorLayout[decoration.userData.decorationId],x:Number(decoration.position.x.toFixed(2)),z:Number(decoration.position.z.toFixed(2))};
  persistLocal(DECOR_LAYOUT_KEY,JSON.stringify(decorLayout));
}
function changeFlowerColor(decoration){
  const nextColor=nextFlowerColor(decoration.userData.flowerColor);
  decoration.userData.flowerColor=nextColor;
  decoration.userData.petalMeshes.forEach(petal=>petal.material.color.setHex(nextColor));
  decorLayout[decoration.userData.decorationId]={...decorLayout[decoration.userData.decorationId],x:Number(decoration.position.x.toFixed(2)),z:Number(decoration.position.z.toFixed(2)),flowerColor:nextColor};
  persistLocal(DECOR_LAYOUT_KEY,JSON.stringify(decorLayout));
}
function bloomFlowerbedBud(decoration,bud,animate=true){
  if(!bud||bud.bloomed) return;
  bud.bloomed=true;
  bud.roundBud.visible=false;
  bud.stem.scale.y=.56;
  bud.stem.position.y=.284;
  const tulip=new THREE.Group();
  const tulipColor=bud.color;
  const heartShape=new THREE.Shape();
  heartShape.moveTo(0,-.105);
  heartShape.bezierCurveTo(-.075,-.045,-.11,.01,-.1,.07);
  heartShape.bezierCurveTo(-.09,.12,-.035,.14,0,.08);
  heartShape.bezierCurveTo(.035,.14,.09,.12,.1,.07);
  heartShape.bezierCurveTo(.11,.01,.075,-.045,0,-.105);
  const heartMaterial=mat(tulipColor);
  heartMaterial.polygonOffset=true;
  heartMaterial.polygonOffsetFactor=-1;
  heartMaterial.polygonOffsetUnits=-1;
  const heart=mesh(new THREE.ExtrudeGeometry(heartShape,{depth:.055,bevelEnabled:true,bevelThickness:.014,bevelSize:.012,bevelSegments:2,curveSegments:14}),heartMaterial,new THREE.Vector3(0,0,-.028),tulip);
  heart.castShadow=true;
  heart.receiveShadow=true;
  bud.holder.add(tulip);
  if(animate){
    const start=performance.now();
    const grow=now=>{
      const progress=Math.min((now-start)/360,1);
      const size=.12+Math.sin(progress*Math.PI*.5)*.98;
      tulip.scale.setScalar(size);
      if(progress<1) requestAnimationFrame(grow); else tulip.scale.setScalar(1);
    };
    requestAnimationFrame(grow);
  }
  const saved=decorLayout[decoration.userData.decorationId]??{};
  const bloomedBuds=new Set(saved.bloomedBuds??[]);
  bloomedBuds.add(bud.index);
  decorLayout[decoration.userData.decorationId]={...saved,x:Number(decoration.position.x.toFixed(2)),z:Number(decoration.position.z.toFixed(2)),bloomedBuds:[...bloomedBuds]};
  persistLocal(DECOR_LAYOUT_KEY,JSON.stringify(decorLayout));
}
const ROOF_LIGHT_BOUNDS={minX:-1.05,maxX:1.05,minZ:.86,maxZ:1.62};
const ROOF_LIGHT_GAP=.43;
const roofLightRaycaster=new THREE.Raycaster();
function keepRoofLightsSeparate(decoration,x,z){
  let position={x:THREE.MathUtils.clamp(x,ROOF_LIGHT_BOUNDS.minX,ROOF_LIGHT_BOUNDS.maxX),z:THREE.MathUtils.clamp(z,ROOF_LIGHT_BOUNDS.minZ,ROOF_LIGHT_BOUNDS.maxZ)};
  for(let attempt=0;attempt<24;attempt++){
    const conflict=placed.children.find(other=>other!==decoration&&other.userData.isRoofDecoration&&Math.hypot(other.position.x-position.x,other.position.z-position.z)<ROOF_LIGHT_GAP);
    if(!conflict) return position;
    const dx=position.x-conflict.position.x;
    const dz=position.z-conflict.position.z;
    const angle=Math.abs(dx)+Math.abs(dz)<.01?(attempt%2?1:-1)*Math.PI/2:Math.atan2(dz,dx)+attempt*.45;
    position={x:THREE.MathUtils.clamp(conflict.position.x+Math.cos(angle)*ROOF_LIGHT_GAP,ROOF_LIGHT_BOUNDS.minX,ROOF_LIGHT_BOUNDS.maxX),z:THREE.MathUtils.clamp(conflict.position.z+Math.sin(angle)*ROOF_LIGHT_GAP,ROOF_LIGHT_BOUNDS.minZ,ROOF_LIGHT_BOUNDS.maxZ)};
  }
  return position;
}
function setRoofLightPosition(decoration,x,z){
  const openPosition=keepRoofLightsSeparate(decoration,x,z);
  const {x:safeX,z:safeZ}=openPosition;
  world.updateMatrixWorld(true);
  const probe=world.localToWorld(new THREE.Vector3(safeX,8,safeZ));
  roofLightRaycaster.set(probe,new THREE.Vector3(0,-1,0));
  const roofHit=roofLightRaycaster.intersectObject(roof,false)[0];
  if(!roofHit) return;
  const roofPosition=placed.worldToLocal(roofHit.point.clone());
  const roofNormalWorld=roofHit.face.normal.clone().transformDirection(roof.matrixWorld).normalize();
  const roofNormal=placed.worldToLocal(roofHit.point.clone().add(roofNormalWorld)).sub(roofPosition).normalize();
  decoration.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),roofNormal);
  decoration.position.set(safeX,roofPosition.y+roofNormal.y*.015,safeZ);
  refreshRoofGarland();
}
function clearRoofGarland(){
  roofGarland.children.forEach(line=>line.traverse(node=>{
    node.geometry?.dispose();
    if(Array.isArray(node.material)) node.material.forEach(material=>material.dispose());
    else node.material?.dispose();
  }));
  roofGarland.clear();
}
function refreshRoofGarland(){
  clearRoofGarland();
  world.updateMatrixWorld(true);
  const roofLights=placed.children.filter(decoration=>decoration.userData.isRoofDecoration&&decoration.userData.garlandPoint).sort((a,b)=>a.position.x-b.position.x);
  for(let index=1;index<roofLights.length;index++){
    const start=roofGarland.worldToLocal(roofLights[index-1].localToWorld(roofLights[index-1].userData.garlandPoint.clone()));
    const end=roofGarland.worldToLocal(roofLights[index].localToWorld(roofLights[index].userData.garlandPoint.clone()));
    if(start.distanceTo(end)<.14) continue;
    const sagPoint=start.clone().lerp(end,.5);
    sagPoint.y-=.08+Math.min(.05,start.distanceTo(end)*.03);
    sagPoint.z+=.04;
    mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(start,sagPoint,end),22,.018,7,false),mat(0x534338),new THREE.Vector3(0,0,0),roofGarland);
  }
}
function setRoofLightState(decoration,isOn){
  decoration.userData.roofLightOn=isOn;
  decoration.userData.roofBulbs.forEach(({mesh:bulb})=>{
    bulb.material.color.setHex(isOn?0xfffff1:0xf0b63f);
    bulb.material.emissive.setHex(isOn?0xfffff1:0xf0b63f);
    bulb.material.emissiveIntensity=isOn ? 1.05 : .03;
  });
  decoration.userData.roofGlows.forEach(glow=>{ glow.intensity=isOn ? .38 : 0; });
}
function toggleRoofLight(decoration){
  setRoofLightState(decoration,!decoration.userData.roofLightOn);
  decorLayout[decoration.userData.decorationId]={...decorLayout[decoration.userData.decorationId],x:Number(decoration.position.x.toFixed(2)),z:Number(decoration.position.z.toFixed(2)),roofLightOn:decoration.userData.roofLightOn};
  persistLocal(DECOR_LAYOUT_KEY,JSON.stringify(decorLayout));
  showCaptureNotice(decoration.userData.roofLightOn?'지붕 조명을 켰어요':'지붕 조명을 껐어요',decoration.userData.roofLightOn?' 전구가 따뜻하게 반짝입니다.':' 전구 불빛이 꺼졌습니다.');
}
function toggleSmallLamp(decoration){
  const isOn=!decoration.userData.lampOn;
  decoration.userData.lampOn=isOn;
  decoration.userData.lampBulb.material.color.setHex(isOn?0xffffe2:0xffed9b);
  decoration.userData.lampBulb.material.emissive.setHex(0xffd878);
  decoration.userData.lampBulb.material.emissiveIntensity=isOn ? .95 : .08;
  decoration.userData.lampGlow.intensity=isOn ? .75 : 0;
  showCaptureNotice(isOn?'작은 조명을 켰어요':'작은 조명을 껐어요',isOn?' 주변에 은은한 빛이 퍼집니다.':' 빛이 사그라들었습니다.');
}
function nudgeChime(decoration){
  if(decoration.userData.chimeAnimating) return;
  decoration.userData.chimeAnimating=true;
  const silver=decoration.userData.chimeSilver;
  if(!silver){ decoration.userData.chimeAnimating=false; return; }
  const start=performance.now();
  const move=now=>{ const progress=Math.min((now-start)/540,1); silver.rotation.z=-Math.sin(progress*Math.PI)*.16; if(progress<1) requestAnimationFrame(move); else { silver.rotation.z=0; decoration.userData.chimeAnimating=false; } };
  requestAnimationFrame(move);
}
function swingForwardBack(decoration){
  if(decoration.userData.swingAnimating) return;
  decoration.userData.swingAnimating=true;
  const pivot=decoration.userData.swingPivot;
  const start=performance.now();
  const move=now=>{ const progress=Math.min((now-start)/1050,1); pivot.rotation.x=Math.sin(progress*Math.PI*3)*.25*(1-progress*.55); if(progress<1) requestAnimationFrame(move); else { pivot.rotation.x=0; decoration.userData.swingAnimating=false; } };
  requestAnimationFrame(move);
}
function addDecoration(type,index,animate=false,memoryText='나를 위한 첫 장식',decorationId=`${type}-${index}`,flowerColor=null) {
  const isRoofDecoration=type==='rooflight';
  const [slotX,slotY,slotZ]=slots[index%slots.length];
  const savedPosition=decorLayout[decorationId];
  const roofLightNumber=placed.children.filter(decoration=>decoration.userData.isRoofDecoration).length;
  const roofLightX=[-1.02,-.51,0,.51,1.02][roofLightNumber%5];
  const roofLightZ=1.46-(Math.floor(roofLightNumber/5)%2)*.22;
  const [x,y,z]=isRoofDecoration?[savedPosition?.x??roofLightX,0,savedPosition?.z??roofLightZ]:[slotX,slotY,slotZ];
  const g = new THREE.Group(); const safePosition=keepOutsideHouse(savedPosition?.x??x,savedPosition?.z??z,decorFootprint(type)+.08); const openPosition=isRoofDecoration?{x,z}:keepDecorationSeparate(safePosition.x,safePosition.z,null,type); g.position.set(openPosition.x,y,openPosition.z); placed.add(g);
  g.userData.memoryText = memoryText;
  g.userData.type = type;
  g.userData.decorationId = decorationId;
  g.userData.isRoofDecoration = isRoofDecoration;
  g.userData.baseY = y;
  const hotspot = document.createElement('button');
  hotspot.className = 'decor-hotspot'; hotspot.type = 'button';
  hotspot.setAttribute('aria-label', `잘한 일: ${memoryText}`);
  sceneWrap.appendChild(hotspot);
  g.userData.hotspot = hotspot;
  hotspot.addEventListener('mouseenter', () => showDecorTooltip(g, Number.parseFloat(hotspot.style.left), Number.parseFloat(hotspot.style.top)));
  hotspot.addEventListener('focus', () => showDecorTooltip(g, Number.parseFloat(hotspot.style.left), Number.parseFloat(hotspot.style.top)));
  hotspot.addEventListener('mouseleave', hideDecorTooltip);
  hotspot.addEventListener('blur', hideDecorTooltip);
  hotspot.addEventListener('click', () => { if(g.userData.isRoofDecoration) toggleRoofLight(g); });
  if(type==='flower') { const petalColor=savedPosition?.flowerColor??flowerColor??randomFlowerColor(); g.userData.flowerColor=petalColor; g.userData.petalMeshes=[]; cylinder(.26,.34,.42,palette.pot,new THREE.Vector3(0,.21,0),g); for(let i=0;i<5;i++){ const a=i*Math.PI*2/5; g.userData.petalMeshes.push(sphere(.14,petalColor,new THREE.Vector3(Math.cos(a)*.18,.58,Math.sin(a)*.18),g)); } sphere(.12,0xf3c743,new THREE.Vector3(0,.58,0),g); }
  if(type==='lamp') { cylinder(.06,.09,.78,palette.dark,new THREE.Vector3(0,.39,0),g); const shade=mesh(new THREE.ConeGeometry(.3,.42,18,1,true),mat(0xf5c64d),new THREE.Vector3(0,.86,0),g); shade.rotation.x=Math.PI; const bulb=sphere(.11,0xffed9b,new THREE.Vector3(0,.78,0),g); bulb.material.emissive.setHex(0xffd878); bulb.material.emissiveIntensity=.08; const glow=new THREE.PointLight(0xffcd71,0,1.55,2); glow.position.set(0,.78,.12); g.add(glow); g.userData.lampBulb=bulb; g.userData.lampGlow=glow; g.userData.lampOn=false; }
  if(type==='book') { box(.55,.16,.38,0x74a7a0,new THREE.Vector3(0,.1,0),g); box(.48,.16,.36,0xf1b640,new THREE.Vector3(.03,.26,.01),g); box(.43,.16,.34,0xe47758,new THREE.Vector3(-.02,.42,-.01),g); }
  if(type==='flag') { cylinder(.045,.055,1.05,palette.wood,new THREE.Vector3(0,.53,0),g); const flag=mesh(new THREE.PlaneGeometry(.54,.34),mat(0xf08368),new THREE.Vector3(.3,.84,0),g); flag.rotation.y=Math.PI/18; }
  if(type==='tree') { cylinder(.12,.17,.78,palette.wood,new THREE.Vector3(0,.39,0),g); sphere(.42,palette.leaf,new THREE.Vector3(0,.92,0),g); sphere(.31,0x6b975b,new THREE.Vector3(.25,.78,.06),g); sphere(.29,0x6b975b,new THREE.Vector3(-.25,.82,.06),g); }
  if(type==='bigtree') { cylinder(.18,.25,1.38,palette.wood,new THREE.Vector3(0,.69,0),g); sphere(.72,0x4f824e,new THREE.Vector3(0,1.73,0),g); sphere(.56,0x649856,new THREE.Vector3(.42,1.52,.08),g); sphere(.54,0x5a8d51,new THREE.Vector3(-.42,1.55,.08),g); sphere(.48,0x76a964,new THREE.Vector3(0,2.13,.02),g); }
  if(type==='bench') { box(.82,.13,.25,0xa66b43,new THREE.Vector3(0,.49,0),g); box(.82,.12,.12,0xa66b43,new THREE.Vector3(0,.72,-.1),g); for(const x of [-.31,.31]) box(.10,.48,.10,palette.wood,new THREE.Vector3(x,.24,0),g); }
  if(type==='fountain') { cylinder(.38,.48,.14,0x8eb9c3,new THREE.Vector3(0,.07,0),g); cylinder(.17,.23,.27,0x79afbc,new THREE.Vector3(0,.25,0),g); sphere(.12,0xeaf7fa,new THREE.Vector3(0,.49,0),g); }
  if(type==='birdhouse') { cylinder(.05,.07,.75,palette.wood,new THREE.Vector3(0,.38,0),g); box(.36,.32,.28,0x79a8ba,new THREE.Vector3(0,.84,0),g); const roof=mesh(new THREE.ConeGeometry(.32,.22,4),mat(0xeb7651),new THREE.Vector3(0,1.11,0),g); roof.rotation.y=Math.PI/4; sphere(.05,palette.dark,new THREE.Vector3(0,.84,.15),g); }
  if(type==='mailbox') { box(.11,.74,.11,palette.wood,new THREE.Vector3(0,.37,0),g); const mailbox=mesh(new THREE.CylinderGeometry(.22,.22,.48,16,1,false,0,Math.PI),mat(0x5f9ab3),new THREE.Vector3(0,.75,0),g); mailbox.rotation.z=Math.PI/2; }
  if(type==='fence') { for(const x of [-.32,0,.32]) box(.08,.52,.08,palette.cream,new THREE.Vector3(x,.26,0),g); box(.8,.07,.07,palette.cream,new THREE.Vector3(0,.18,0),g); box(.8,.07,.07,palette.cream,new THREE.Vector3(0,.4,0),g); }
  if(type==='swing') { for(const x of [-.3,.3]) { const post=box(.06,.98,.06,palette.wood,new THREE.Vector3(x,.49,0),g); post.rotation.z=x<0?.18:-.18; } box(.72,.06,.06,palette.wood,new THREE.Vector3(0,.96,0),g); const swingPivot=new THREE.Group(); swingPivot.position.set(0,.97,0); g.add(swingPivot); for(const x of [-.13,.13]) cylinder(.012,.012,.60,0xe7d9bd,new THREE.Vector3(x,-.30,0),swingPivot); box(.38,.07,.18,0xe98759,new THREE.Vector3(0,-.63,0),swingPivot); g.userData.swingPivot=swingPivot; }
  if(type==='bicycle') {
    const rearLeft=new THREE.Vector3(-.23,.14,-.16);
    const rearRight=new THREE.Vector3(-.23,.14,.16);
    const frontWheel=new THREE.Vector3(.31,.18,0);
    const wheel=(position,radius)=>{
      mesh(new THREE.TorusGeometry(radius,.026,8,16),mat(0x556169),position,g);
      sphere(.028,0xf3c84c,position.clone().add(new THREE.Vector3(0,0,.026)),g);
    };
    wheel(rearLeft,.12); wheel(rearRight,.12); wheel(frontWheel,.17);
    box(.07,.06,.42,0xe56f52,new THREE.Vector3(-.23,.17,0),g);
    const tube=(from,to,width=.03)=>mesh(new THREE.TubeGeometry(new THREE.LineCurve3(from,to),5,width,7,false),mat(0xe56f52),new THREE.Vector3(0,0,0),g);
    const seatBase=new THREE.Vector3(-.13,.43,0);
    const handleBase=new THREE.Vector3(.25,.52,0);
    tube(new THREE.Vector3(-.23,.2,0),seatBase); tube(seatBase,handleBase); tube(handleBase,frontWheel);
    box(.26,.065,.2,0xf2b849,new THREE.Vector3(-.15,.49,0),g);
    box(.08,.055,.38,0x5d6870,new THREE.Vector3(.25,.59,0),g);
  }
  if(type==='stone') { for(const [x,z,s] of [[-.2,-.05,.22],[.14,.05,.28],[.02,.2,.18]]) { const rock=sphere(s,0xb9b2a1,new THREE.Vector3(x,.06,z),g); rock.scale.y=.35; } }
  if(type==='mushroom') { cylinder(.09,.12,.32,0xffe6c5,new THREE.Vector3(0,.16,0),g); const cap=sphere(.27,0xe77c5c,new THREE.Vector3(0,.37,0),g); cap.scale.y=.55; sphere(.035,0xfff6df,new THREE.Vector3(-.1,.44,.17),g); sphere(.03,0xfff6df,new THREE.Vector3(.12,.45,.14),g); }
  if(type==='birdbath') { cylinder(.06,.1,.48,0x879aa1,new THREE.Vector3(0,.24,0),g); const bath=mesh(new THREE.CylinderGeometry(.3,.21,.10,20),mat(0x9ebec4),new THREE.Vector3(0,.51,0),g); bath.scale.y=.55; sphere(.04,0x5f7f95,new THREE.Vector3(.08,.55,0),g); }
  if(type==='lantern') { box(.18,.42,.18,0x7b5a3f,new THREE.Vector3(0,.28,0),g); sphere(.09,0xffe797,new THREE.Vector3(0,.3,.1),g); const cap=mesh(new THREE.ConeGeometry(.17,.16,4),mat(palette.dark),new THREE.Vector3(0,.57,0),g); cap.rotation.y=Math.PI/4; }
  if(type==='leafplant') { cylinder(.22,.28,.35,palette.pot,new THREE.Vector3(0,.18,0),g); for(let i=0;i<5;i++){ const leaf=sphere(.18,0x5e9b68,new THREE.Vector3(Math.cos(i*1.26)*.17,.52,Math.sin(i*1.26)*.17),g); leaf.scale.set(.65,1.45,.65); } }
  if(type==='watering') { const can=cylinder(.18,.18,.32,0x79a9b3,new THREE.Vector3(0,.23,0),g); can.rotation.z=Math.PI/2; const spout=box(.38,.07,.07,0x79a9b3,new THREE.Vector3(.27,.28,0),g); spout.rotation.z=.22; const handle=mesh(new THREE.TorusGeometry(.14,.03,8,16,Math.PI),mat(0x79a9b3),new THREE.Vector3(-.08,.39,0),g); handle.rotation.y=Math.PI/2; }
  if(type==='flowerbed') {
    box(.72,.16,.48,0x8a5a3f,new THREE.Vector3(0,.08,0),g);
    const bloomedBuds=new Set(savedPosition?.bloomedBuds??[]);
    for(const [index,x] of [-.22,0,.22].entries()) {
      const stem=cylinder(.018,.025,.36,0x537b50,new THREE.Vector3(x,.28,0),g);
      const holder=new THREE.Group();
      holder.position.set(x,.49,0);
      g.add(holder);
      const roundBud=sphere(.11,index===1?0xf3bb43:0xed8194,new THREE.Vector3(0,0,0),holder);
      const bud={index,holder,roundBud,stem,color:index===1?0xf3bb43:0xed8194,bloomed:false};
      holder.userData.flowerbedBud=bud;
      if(bloomedBuds.has(index)) bloomFlowerbedBud(g,bud,false);
    }
  }
  if(type==='sunflower') { cylinder(.035,.05,.75,0x55763d,new THREE.Vector3(0,.38,0),g); for(let i=0;i<8;i++){ const a=i*Math.PI/4; const petal=sphere(.11,0xffd24d,new THREE.Vector3(Math.cos(a)*.16,.82,Math.sin(a)*.16),g); petal.scale.y=.55; } sphere(.11,0x70462f,new THREE.Vector3(0,.82,0),g); }
  if(type==='gnome') { mesh(new THREE.ConeGeometry(.22,.48,16),mat(0x4d8fb0),new THREE.Vector3(0,.24,0),g); sphere(.13,0xffd1ad,new THREE.Vector3(0,.54,0),g); mesh(new THREE.ConeGeometry(.17,.36,16),mat(0xe45f59),new THREE.Vector3(0,.78,0),g); }
  if(type==='basket') { cylinder(.28,.23,.28,0xc78a4f,new THREE.Vector3(0,.14,0),g); const handle=mesh(new THREE.TorusGeometry(.21,.03,8,16,Math.PI),mat(0x9b663d),new THREE.Vector3(0,.38,0),g); handle.rotation.y=Math.PI/2; sphere(.1,0xf07e5a,new THREE.Vector3(-.1,.3,.05),g); sphere(.09,0xf1b640,new THREE.Vector3(.1,.31,.05),g); }
  if(type==='hammock') { for(const x of [-.38,.38]) box(.06,.85,.06,palette.wood,new THREE.Vector3(x,.43,0),g); const bed=mesh(new THREE.PlaneGeometry(.68,.28),mat(0xe8967a),new THREE.Vector3(0,.45,0),g); bed.rotation.x=-Math.PI/2; }
  if(type==='arch') { for(const x of [-.28,.28]) box(.08,.74,.08,0xf5edd2,new THREE.Vector3(x,.37,0),g); const arch=mesh(new THREE.TorusGeometry(.28,.045,8,20,Math.PI),mat(0xf5edd2),new THREE.Vector3(0,.72,0),g); arch.rotation.y=Math.PI; sphere(.09,0xf08b94,new THREE.Vector3(-.24,.7,.03),g); sphere(.09,0xf08b94,new THREE.Vector3(.24,.7,.03),g); }
if(type==='chime') {
  box(.42,.05,.08,palette.wood,new THREE.Vector3(0,.8,0),g);
  const silverChimes=new THREE.Group();
  silverChimes.position.set(0,.8,0);
  g.add(silverChimes);
  for(const x of [-.14,0,.14]) cylinder(.02,.02,.44,0xd6e1df,new THREE.Vector3(x,-.24,0),silverChimes);
  cylinder(.025,.025,.84,palette.wood,new THREE.Vector3(0,.42,0),g);
  g.userData.chimeSilver=silverChimes;
}
  if(type==='pumpkin') { for(const x of [-.12,0,.12]) { const pumpkin=sphere(.2,0xf39b36,new THREE.Vector3(x,.19,0),g); pumpkin.scale.y=.8; } cylinder(.025,.03,.12,0x59804a,new THREE.Vector3(0,.42,0),g); }
  if(type==='cat') { sphere(.2,0xe69c62,new THREE.Vector3(-.05,.2,0),g); sphere(.15,0xe69c62,new THREE.Vector3(.19,.25,0),g); for(const x of [.12,.26]) { const ear=mesh(new THREE.ConeGeometry(.07,.13,3),mat(0xe69c62),new THREE.Vector3(x,.42,0),g); ear.rotation.z=.1; } const tail=mesh(new THREE.TorusGeometry(.16,.025,8,16,Math.PI),mat(0xe69c62),new THREE.Vector3(-.22,.29,0),g); tail.rotation.y=-Math.PI/2; }
  if(type==='dog') { sphere(.23,0xc78653,new THREE.Vector3(-.08,.23,0),g); sphere(.15,0xc78653,new THREE.Vector3(.22,.27,0),g); sphere(.07,0x795039,new THREE.Vector3(.28,.34,.11),g); const tail=mesh(new THREE.TorusGeometry(.14,.025,8,16,Math.PI),mat(0xc78653),new THREE.Vector3(-.28,.32,0),g); tail.rotation.y=Math.PI/2; }
  if(type==='stepping') { for(const [x,z] of [[-.23,-.12],[.08,0],[.25,.15]]) { const step=sphere(.19,0xd8c99a,new THREE.Vector3(x,.05,z),g); step.scale.y=.24; } }
  if(type==='topiary') { cylinder(.2,.27,.34,palette.pot,new THREE.Vector3(0,.17,0),g); cylinder(.06,.07,.36,palette.wood,new THREE.Vector3(0,.48,0),g); sphere(.28,0x54834f,new THREE.Vector3(0,.77,0),g); sphere(.18,0x6da05d,new THREE.Vector3(.16,.69,.03),g); }
  if(type==='rooflight') {
    const cablePoint=new THREE.Vector3(0,-.03,.035);
    const bulbPosition=new THREE.Vector3(0,-.115,.09);
    g.userData.garlandPoint=cablePoint;
    mesh(new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(0,.02,.008),cablePoint),5,.017,7,false),mat(0x534338),new THREE.Vector3(0,0,0),g);
    cylinder(.038,.05,.075,0x534338,new THREE.Vector3(0,-.072,.065),g);
    g.userData.roofBulbs=[];
    g.userData.roofGlows=[];
    const bulbMaterial=new THREE.MeshStandardMaterial({color:0xf0b63f,emissive:0xf0b63f,emissiveIntensity:.03,roughness:.22});
    const bulb=mesh(new THREE.SphereGeometry(.105,20,16),bulbMaterial,bulbPosition,g);
    bulb.scale.y=1.2;
    g.userData.roofBulbs.push({mesh:bulb});
    const glow=new THREE.PointLight(0xffc66a,0,.82,2);
    glow.position.copy(bulbPosition);
    g.add(glow);
    g.userData.roofGlows.push(glow);
    setRoofLightPosition(g,openPosition.x,openPosition.z);
    setRoofLightState(g,Boolean(savedPosition?.roofLightOn));
    refreshRoofGarland();
  }
  if(!savedPosition || savedPosition.x!==g.position.x || savedPosition.z!==g.position.z) saveDecorationPosition(g);
  if(animate) { const baseY=g.position.y; g.scale.setScalar(.01); const start=performance.now(); const grow=now=>{ const p=Math.min((now-start)/480,1); g.scale.setScalar(1+(1-p)*.15); g.position.y=baseY+Math.sin(p*Math.PI)*.22; if(p<1) requestAnimationFrame(grow); else g.position.y=baseY; }; requestAnimationFrame(grow); }
}
function decorationMemoryText(memory){
  const bundled=(memory.rewardMemoryDates||[]).map(date=>memories.find(item=>item.date===date)?.text).filter(Boolean);
  return bundled.length?bundled.join(' · '):memory.text;
}
function addStoredDecorations(){ memories.filter(memory=>memory.decor&&memory.decor!=='rest'&&!memory.rewardStored).forEach((m,i)=>addDecoration(m.decor,i,false,decorationMemoryText(m),`memory-${m.date||i}`,m.flowerColor)); }
addStoredDecorations();
function settleGroundDecorations(){
  for(let pass=0;pass<5;pass++){
    let moved=false;
    placed.children.filter(decoration=>decoration.userData.memoryText&&!decoration.userData.isRoofDecoration).forEach(decoration=>{
      const safePosition=keepOutsideHouse(decoration.position.x,decoration.position.z,decorFootprint(decoration.userData.type)+.08);
      const openPosition=keepDecorationSeparate(safePosition.x,safePosition.z,decoration,decoration.userData.type);
      if(Math.hypot(decoration.position.x-openPosition.x,decoration.position.z-openPosition.z)>.01){
        decoration.position.set(openPosition.x,decoration.userData.baseY,openPosition.z);
        saveDecorationPosition(decoration);
        moved=true;
      }
    });
    if(!moved) break;
  }
}
settleGroundDecorations();

function clearPlacedDecorations(){
  placed.children.slice().forEach(decoration=>{
    decoration.userData.hotspot?.remove();
    decoration.traverse(node=>{
      node.geometry?.dispose();
      if(Array.isArray(node.material)) node.material.forEach(material=>material.dispose());
      else node.material?.dispose();
    });
    placed.remove(decoration);
  });
  clearRoofGarland();
}
function rebuildDecorations(){
  clearPlacedDecorations();
  addStoredDecorations();
  settleGroundDecorations();
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const dragPlane = new THREE.Plane(new THREE.Vector3(0,1,0),-.04);
const dragPoint = new THREE.Vector3();
const decorationDragOffset = new THREE.Vector2();
let dragging=false, draggingDecoration=null, clickedFlowerbedBud=null, dragStartX=0, dragStartY=0, decorationMoved=false, doorPressed=false, doorStartX=0, doorStartY=0, lastX=0, lastY=0, desiredRotation=sharedRotation, desiredCameraHeight=sharedCameraHeight, userHasDragged=isSharedHome;
function hideDecorTooltip(){ decorTooltip.classList.remove('show'); canvas.style.cursor='grab'; }
function showDecorTooltip(decoration, x, y){
  decorTooltip.querySelector('p').textContent=decoration.userData.memoryText;
  decorTooltip.style.left=`${x}px`;
  decorTooltip.style.top=`${y-6}px`;
  decorTooltip.classList.add('show');
}
function getDecorationAtEvent(event){
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX-rect.left)/rect.width)*2-1;
  pointer.y = -((event.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera(pointer,camera);
  const hit = raycaster.intersectObjects(placed.children,true)[0];
  if(!hit) return null;
  let decoration=hit.object;
  while(decoration && !decoration.userData.memoryText) decoration=decoration.parent;
  return decoration||null;
}
function getFlowerbedBudAtEvent(event){
  const rect=canvas.getBoundingClientRect();
  pointer.x=((event.clientX-rect.left)/rect.width)*2-1;
  pointer.y=-((event.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera(pointer,camera);
  const hit=raycaster.intersectObjects(placed.children,true)[0];
  if(!hit) return null;
  let target=hit.object;
  while(target){
    if(target.userData.flowerbedBud) return target.userData.flowerbedBud;
    target=target.parent;
  }
  return null;
}
function getDoorAtEvent(event){
  const rect=canvas.getBoundingClientRect();
  pointer.x=((event.clientX-rect.left)/rect.width)*2-1;
  pointer.y=-((event.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera(pointer,camera);
  return raycaster.intersectObject(doorPivot,true).length>0;
}
function toggleDoor(){
  if(doorOpen&&completedBunches>=INTERIOR_UNLOCK_BUNCHES){ enterInterior(); return; }
  doorOpen=!doorOpen;
  doorTargetRotation=doorOpen?OPEN_DOOR_ANGLE:0;
  if(doorOpen) syncDoorwayInterior();
  warmInterior.visible=doorOpen;
  if(doorOpen&&completedBunches>=INTERIOR_UNLOCK_BUNCHES) setTimeout(()=>{ if(doorOpen) enterInterior(); },360);
  else if(doorOpen){
    const remaining=INTERIOR_UNLOCK_BUNCHES-completedBunches;
    showCaptureNotice('문틈으로 따뜻한 거실이 보여요',`포도송이 ${remaining}개를 더 완성하면 문을 열고 직접 꾸밀 수 있어요.`);
  }
}
function getGroundPointAtEvent(event){
  const rect=canvas.getBoundingClientRect();
  pointer.x=((event.clientX-rect.left)/rect.width)*2-1;
  pointer.y=-((event.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera(pointer,camera);
  if(!raycaster.ray.intersectPlane(dragPlane,dragPoint)) return null;
  return placed.worldToLocal(dragPoint.clone());
}
function moveDecoration(event,decoration){
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX-rect.left)/rect.width)*2-1;
  pointer.y = -((event.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera(pointer,camera);
  if(decoration.userData.isRoofDecoration){
    const roofHit=raycaster.intersectObject(roof,false)[0];
    if(!roofHit) return;
    const roofPosition=placed.worldToLocal(roofHit.point.clone());
    setRoofLightPosition(decoration,roofPosition.x,roofPosition.z);
    return;
  }
  if(!raycaster.ray.intersectPlane(dragPlane,dragPoint)) return;
  const localPoint=placed.worldToLocal(dragPoint.clone());
  const openPosition=keepDragPosition(decoration,localPoint.x+decorationDragOffset.x,localPoint.z+decorationDragOffset.y);
  decoration.position.set(openPosition.x,decoration.userData.baseY,openPosition.z);
}
function checkDecorHover(event){
  if(dragging) return hideDecorTooltip();
  const rect = canvas.getBoundingClientRect();
  if(getDoorAtEvent(event)){ hideDecorTooltip(); canvas.style.cursor='pointer'; return; }
  const decoration=getDecorationAtEvent(event);
  if(!decoration) return hideDecorTooltip();
  showDecorTooltip(decoration,event.clientX-rect.left,event.clientY-rect.top);
  canvas.style.cursor='pointer';
}
canvas.addEventListener('pointerdown',e=>{ if(getDoorAtEvent(e)){ doorPressed=true; doorStartX=e.clientX; doorStartY=e.clientY; canvas.setPointerCapture(e.pointerId); return; } const decoration=getDecorationAtEvent(e); if(decoration&&isSharedHome){ showCaptureNotice('공유받은 집이에요','장식은 원래 모습 그대로 보기 전용으로 열려 있어요.'); return; } dragging=true; lastX=e.clientX; lastY=e.clientY; desiredRotation=world.rotation.y; canvas.setPointerCapture(e.pointerId); if(decoration){ draggingDecoration=decoration; clickedFlowerbedBud=decoration.userData.type==='flowerbed'?getFlowerbedBudAtEvent(e):null; const groundPoint=decoration.userData.isRoofDecoration?null:getGroundPointAtEvent(e); decorationDragOffset.set(groundPoint?decoration.position.x-groundPoint.x:0,groundPoint?decoration.position.z-groundPoint.z:0); dragStartX=e.clientX; dragStartY=e.clientY; decorationMoved=false; hideDecorTooltip(); canvas.style.cursor='grabbing'; return; } });
canvas.addEventListener('pointermove',e=>{ if(doorPressed) return; if(!dragging) return checkDecorHover(e); if(draggingDecoration){ if(Math.hypot(e.clientX-dragStartX,e.clientY-dragStartY)>6){ decorationMoved=true; moveDecoration(e,draggingDecoration); } return; } desiredRotation=THREE.MathUtils.clamp(desiredRotation+(e.clientX-lastX)*.012,-Math.PI/2,Math.PI*.75); desiredCameraHeight=THREE.MathUtils.clamp(desiredCameraHeight+(lastY-e.clientY)*.012,5.45,7.45); lastX=e.clientX; lastY=e.clientY; userHasDragged=true; });
canvas.addEventListener('mousemove',e=>{ if(!dragging&&!doorPressed) checkDecorHover(e); });
canvas.addEventListener('pointerup',e=>{ if(doorPressed){ if(Math.hypot(e.clientX-doorStartX,e.clientY-doorStartY)<8) toggleDoor(); doorPressed=false; checkDecorHover(e); return; } if(draggingDecoration){ const decoration=draggingDecoration; if(decorationMoved) saveDecorationPosition(decoration); else if(decoration.userData.type==='flower') changeFlowerColor(decoration); else if(decoration.userData.type==='flowerbed') bloomFlowerbedBud(decoration,clickedFlowerbedBud); else if(decoration.userData.isRoofDecoration) toggleRoofLight(decoration); else if(decoration.userData.type==='lamp') toggleSmallLamp(decoration); else if(decoration.userData.type==='chime') nudgeChime(decoration); else if(decoration.userData.type==='swing') swingForwardBack(decoration); draggingDecoration=null; clickedFlowerbedBud=null; decorationDragOffset.set(0,0); } dragging=false; checkDecorHover(e); });
canvas.addEventListener('pointercancel',()=>{ doorPressed=false; if(draggingDecoration&&decorationMoved) saveDecorationPosition(draggingDecoration); draggingDecoration=null; clickedFlowerbedBud=null; decorationDragOffset.set(0,0); dragging=false; hideDecorTooltip(); });
canvas.addEventListener('pointerleave',hideDecorTooltip);

function resize(){ const w=canvas.clientWidth,h=canvas.clientHeight; renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix(); }
const projectedPosition = new THREE.Vector3();
const nameplatePosition = new THREE.Vector3();
function updateDecorHotspots(){
  world.updateMatrixWorld(true);
  placed.children.forEach(decoration=>{
    const hotspot=decoration.userData.hotspot;
    if(!hotspot) return;
    decoration.getWorldPosition(projectedPosition);
    projectedPosition.y += .48;
    projectedPosition.project(camera);
    const visible = projectedPosition.z > -1 && projectedPosition.z < 1;
    hotspot.style.display=visible ? 'block' : 'none';
    hotspot.style.left=`${(projectedPosition.x*.5+.5)*canvas.clientWidth}px`;
    hotspot.style.top=`${(-projectedPosition.y*.5+.5)*canvas.clientHeight}px`;
  });
}
function updateHouseName(){
  nameplate.getWorldPosition(nameplatePosition); nameplatePosition.project(camera);
  houseNameEditor.style.left=`${(nameplatePosition.x*.5+.5)*canvas.clientWidth}px`;
  houseNameEditor.style.top=`${(-nameplatePosition.y*.5+.5)*canvas.clientHeight}px`;
}
let sceneHasRendered=false;
function frame(time){ resize(); if(!dragging&&!userHasDragged) desiredRotation=.44+Math.sin(time*.00022)*.08; world.rotation.y += (desiredRotation-world.rotation.y)*.055; camera.position.y+=(desiredCameraHeight-camera.position.y)*.08; doorPivot.rotation.y += (doorTargetRotation-doorPivot.rotation.y)*.14; camera.lookAt(target); updateDecorHotspots(); updateHouseName(); renderer.render(scene,camera); if(!sceneHasRendered){ sceneHasRendered=true; sceneLoader?.classList.add('ready'); } requestAnimationFrame(frame); }
requestAnimationFrame(frame);

const INTERIOR_ITEMS={
  sofa:{label:'포근한 소파',radius:1.05,start:[-1.7,-1.1],unlockBunch:3},
  rug:{label:'둥근 러그',radius:.2,start:[0,.25],unlockBunch:4},
  lamp:{label:'스탠드 조명',radius:.48,start:[3,-2.35],unlockBunch:5},
  plant:{label:'초록 화분',radius:.55,start:[3.2,.2],unlockBunch:6},
  shelf:{label:'나무 선반',radius:.78,start:[-3.7,-2.75],unlockBunch:7}
};
function isInteriorItemUnlocked(type){ return completedBunches>=(INTERIOR_ITEMS[type]?.unlockBunch||Infinity); }
function interiorGiftForBunch(bunch){ return Object.entries(INTERIOR_ITEMS).find(([,item])=>item.unlockBunch===bunch); }
const interiorRenderer=new THREE.WebGLRenderer({canvas:interiorCanvas,antialias:true,alpha:false});
interiorRenderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
interiorRenderer.shadowMap.enabled=true;
interiorRenderer.shadowMap.type=THREE.PCFSoftShadowMap;
interiorRenderer.outputColorSpace=THREE.SRGBColorSpace;
const interiorScene=new THREE.Scene();
const interiorPalette={background:0xf5cd58,wall:palette.wall,wallShade:0xffe8b6,trim:palette.trim,roof:palette.roof,wood:palette.wood,floor:0xd89a55,floorLine:0xb87143,glass:palette.glass,blue:palette.blue,leaf:palette.leaf,lawn:palette.lawn,pot:palette.pot,path:palette.path,cream:palette.cream,pink:palette.pink};
interiorScene.background=new THREE.Color(interiorPalette.background);
const interiorCamera=new THREE.PerspectiveCamera(40,1,.1,60);
interiorCamera.position.set(0,4.9,10.8);
interiorCamera.lookAt(0,1.25,-.65);
interiorScene.add(new THREE.HemisphereLight(0xfff3c8,0x56745c,2.3));
const interiorSun=new THREE.DirectionalLight(0xffe0a0,3.1); interiorSun.position.set(4,9,6); interiorSun.castShadow=true; interiorSun.shadow.mapSize.set(1024,1024); interiorScene.add(interiorSun);
const interiorWarmLight=new THREE.PointLight(0xffd27c,16,10,1.7); interiorWarmLight.position.set(0,3.8,-1); interiorScene.add(interiorWarmLight);
const interiorRoom=new THREE.Group(); interiorScene.add(interiorRoom);
const iMat=(color,roughness=.78)=>new THREE.MeshStandardMaterial({color,roughness});
function iMesh(geometry,color,position,parent=interiorRoom){ const item=new THREE.Mesh(geometry,iMat(color)); item.position.copy(position); item.castShadow=true; item.receiveShadow=true; parent.add(item); return item; }
function iBox(x,y,z,color,position,parent=interiorRoom){ return iMesh(new THREE.BoxGeometry(x,y,z),color,position,parent); }
function iCylinder(rt,rb,h,color,position,parent=interiorRoom){ return iMesh(new THREE.CylinderGeometry(rt,rb,h,24),color,position,parent); }

// Match the room footprint to the exterior house ratio (5.25 wide × 4.45 deep).
const INTERIOR_ROOM_WIDTH=12,INTERIOR_ROOM_DEPTH=10.2,INTERIOR_BACK_Z=-INTERIOR_ROOM_DEPTH/2;
iBox(INTERIOR_ROOM_WIDTH,.22,INTERIOR_ROOM_DEPTH,interiorPalette.floor,new THREE.Vector3(0,-.11,0));
for(let z=INTERIOR_BACK_Z+.1;z<INTERIOR_ROOM_DEPTH/2;z+=.8) iBox(INTERIOR_ROOM_WIDTH-.2,.018,.025,interiorPalette.floorLine,new THREE.Vector3(0,.015,z));
iBox(INTERIOR_ROOM_WIDTH,5,.22,interiorPalette.wall,new THREE.Vector3(0,2.5,INTERIOR_BACK_Z));
iBox(.22,5,INTERIOR_ROOM_DEPTH,interiorPalette.wallShade,new THREE.Vector3(-INTERIOR_ROOM_WIDTH/2,2.5,0));
iBox(.22,5,INTERIOR_ROOM_DEPTH,interiorPalette.wallShade,new THREE.Vector3(INTERIOR_ROOM_WIDTH/2,2.5,0));
iBox(INTERIOR_ROOM_WIDTH,.13,.18,interiorPalette.trim,new THREE.Vector3(0,.11,INTERIOR_BACK_Z+.16));
iBox(.16,2.05,.10,interiorPalette.cream,new THREE.Vector3(-2.35,2.65,INTERIOR_BACK_Z+.16));
iBox(.16,2.05,.10,interiorPalette.cream,new THREE.Vector3(.15,2.65,INTERIOR_BACK_Z+.16));
iBox(2.65,.16,.10,interiorPalette.cream,new THREE.Vector3(-1.1,2.65,INTERIOR_BACK_Z+.16));
iBox(2.65,.16,.10,interiorPalette.cream,new THREE.Vector3(-1.1,3.62,INTERIOR_BACK_Z+.16));
const windowGlass=iBox(2.35,1.8,.05,interiorPalette.glass,new THREE.Vector3(-1.1,2.65,INTERIOR_BACK_Z+.23)); windowGlass.material.roughness=.38;
iBox(.13,2.05,.10,interiorPalette.cream,new THREE.Vector3(-1.1,2.65,INTERIOR_BACK_Z+.29));
iBox(2.65,.13,.10,interiorPalette.cream,new THREE.Vector3(-1.1,2.65,INTERIOR_BACK_Z+.29));
iBox(.58,2.45,.22,interiorPalette.roof,new THREE.Vector3(-2.78,2.55,INTERIOR_BACK_Z+.39));
iBox(.58,2.45,.22,interiorPalette.roof,new THREE.Vector3(.58,2.55,INTERIOR_BACK_Z+.39));
const ceilingShade=iMesh(new THREE.ConeGeometry(.58,.5,24,1,true),interiorPalette.path,new THREE.Vector3(0,4.3,-.9)); ceilingShade.rotation.x=Math.PI;
iCylinder(.12,.12,.22,interiorPalette.wood,new THREE.Vector3(0,4.73,-.9));
const wallArt=iBox(1.5,1.05,.10,interiorPalette.wood,new THREE.Vector3(3.4,2.7,INTERIOR_BACK_Z+.18));
iBox(1.28,.83,.04,interiorPalette.cream,new THREE.Vector3(3.4,2.7,INTERIOR_BACK_Z+.26));
const artStem=iBox(.055,.24,.025,interiorPalette.leaf,new THREE.Vector3(3.43,3.02,INTERIOR_BACK_Z+.31)); artStem.rotation.z=-.35;
[[3.16,2.85],[3.4,2.85],[3.64,2.85],[3.28,2.62],[3.52,2.62],[3.4,2.39]].forEach(([x,y],index)=>iMesh(new THREE.CircleGeometry(.14,20),index%2?0x8e5f86:0xa66d96,new THREE.Vector3(x,y,INTERIOR_BACK_Z+.32)));
const artLeaf=iMesh(new THREE.CircleGeometry(.15,20),interiorPalette.leaf,new THREE.Vector3(3.67,3.03,INTERIOR_BACK_Z+.32)); artLeaf.scale.set(1.5,.62,1); artLeaf.rotation.z=.45;

// The front wall keeps the room enclosed while the open doorway frames the garden outside.
const INTERIOR_FRONT_Z=INTERIOR_ROOM_DEPTH/2,INTERIOR_DOOR_WIDTH=1.8,INTERIOR_DOOR_HEIGHT=2.8;
const interiorFrontSideWidth=(INTERIOR_ROOM_WIDTH-INTERIOR_DOOR_WIDTH)/2;
iBox(interiorFrontSideWidth,5,.22,interiorPalette.wall,new THREE.Vector3(-(INTERIOR_DOOR_WIDTH+interiorFrontSideWidth)/2,2.5,INTERIOR_FRONT_Z));
iBox(interiorFrontSideWidth,5,.22,interiorPalette.wall,new THREE.Vector3((INTERIOR_DOOR_WIDTH+interiorFrontSideWidth)/2,2.5,INTERIOR_FRONT_Z));
iBox(INTERIOR_DOOR_WIDTH,5-INTERIOR_DOOR_HEIGHT,.22,interiorPalette.wall,new THREE.Vector3(0,INTERIOR_DOOR_HEIGHT+(5-INTERIOR_DOOR_HEIGHT)/2,INTERIOR_FRONT_Z));
iBox(.16,INTERIOR_DOOR_HEIGHT+.15,.34,interiorPalette.trim,new THREE.Vector3(-INTERIOR_DOOR_WIDTH/2,INTERIOR_DOOR_HEIGHT/2,INTERIOR_FRONT_Z-.03));
iBox(.16,INTERIOR_DOOR_HEIGHT+.15,.34,interiorPalette.trim,new THREE.Vector3(INTERIOR_DOOR_WIDTH/2,INTERIOR_DOOR_HEIGHT/2,INTERIOR_FRONT_Z-.03));
iBox(INTERIOR_DOOR_WIDTH+.16,.16,.34,interiorPalette.trim,new THREE.Vector3(0,INTERIOR_DOOR_HEIGHT,INTERIOR_FRONT_Z-.03));
const interiorDoorPivot=new THREE.Group(); interiorDoorPivot.position.set(-INTERIOR_DOOR_WIDTH/2,.05,INTERIOR_FRONT_Z+.02); interiorDoorPivot.rotation.y=-Math.PI*.39; interiorRoom.add(interiorDoorPivot);
iBox(INTERIOR_DOOR_WIDTH-.12,INTERIOR_DOOR_HEIGHT-.12,.16,interiorPalette.wood,new THREE.Vector3((INTERIOR_DOOR_WIDTH-.12)/2,(INTERIOR_DOOR_HEIGHT-.12)/2,0),interiorDoorPivot);
iBox(1.08,.07,.04,interiorPalette.trim,new THREE.Vector3(.84,1.9,-.1),interiorDoorPivot);
iBox(1.08,.07,.04,interiorPalette.trim,new THREE.Vector3(.84,.78,-.1),interiorDoorPivot);
iMesh(new THREE.SphereGeometry(.09,12,10),0xf6ca4d,new THREE.Vector3(1.42,1.38,-.12),interiorDoorPivot);

const doorwayGarden=new THREE.Group(); interiorScene.add(doorwayGarden);
const outsideLawn=iMesh(new THREE.CylinderGeometry(6.2,6.45,.28,48),interiorPalette.lawn,new THREE.Vector3(0,-.16,9),doorwayGarden); outsideLawn.scale.z=.72;
for(let index=0;index<6;index++){
  const pathStone=iMesh(new THREE.SphereGeometry(.48-index*.025,16,10),interiorPalette.path,new THREE.Vector3(Math.sin(index*.6)*.22,.04,5.85+index*.75),doorwayGarden);
  pathStone.scale.set(1.12,.18,.76); pathStone.rotation.y=index*.2;
}
iCylinder(.18,.23,1.35,interiorPalette.wood,new THREE.Vector3(1.65,.63,7.25),doorwayGarden);
iMesh(new THREE.SphereGeometry(.9,18,14),interiorPalette.leaf,new THREE.Vector3(1.65,1.65,7.25),doorwayGarden);
iMesh(new THREE.SphereGeometry(.62,18,14),0x6c9f60,new THREE.Vector3(1.15,1.48,7.18),doorwayGarden);
iMesh(new THREE.SphereGeometry(.6,18,14),0x6c9f60,new THREE.Vector3(2.15,1.5,7.2),doorwayGarden);
iCylinder(.1,.13,1.05,interiorPalette.wood,new THREE.Vector3(-1.45,.46,7.05),doorwayGarden);
iBox(.78,.65,.35,interiorPalette.blue,new THREE.Vector3(-1.45,1.12,7.05),doorwayGarden);
iBox(.85,.12,.45,interiorPalette.roof,new THREE.Vector3(-1.45,1.48,7.05),doorwayGarden);

const interiorFurniture=new THREE.Group(); interiorScene.add(interiorFurniture);
function markInteriorItem(group,type){ group.userData.interiorType=type; group.userData.radius=INTERIOR_ITEMS[type].radius; group.traverse(child=>{ if(child.isMesh) child.userData.interiorRoot=group; }); return group; }
function createInteriorItem(type){
  const group=new THREE.Group(); interiorFurniture.add(group);
  if(type==='sofa'){
    iBox(2.25,.54,.9,interiorPalette.blue,new THREE.Vector3(0,.38,0),group);
    iBox(2.25,.88,.28,0x4f8ea1,new THREE.Vector3(0,.78,-.34),group);
    iBox(.28,.7,1.02,0x4f8ea1,new THREE.Vector3(-1.13,.48,0),group); iBox(.28,.7,1.02,0x4f8ea1,new THREE.Vector3(1.13,.48,0),group);
    iBox(.78,.17,.55,0xaed6d8,new THREE.Vector3(-.48,.72,-.02),group); iBox(.78,.17,.55,0xaed6d8,new THREE.Vector3(.48,.72,-.02),group);
  } else if(type==='rug'){
    const rug=iMesh(new THREE.CylinderGeometry(1.55,1.55,.055,40),interiorPalette.roof,new THREE.Vector3(0,.035,0),group); rug.scale.z=.68;
    const inner=iMesh(new THREE.TorusGeometry(.99,.055,8,36),interiorPalette.path,new THREE.Vector3(0,.073,0),group); inner.rotation.x=Math.PI/2; inner.scale.z=.68;
  } else if(type==='lamp'){
    iCylinder(.34,.42,.12,interiorPalette.wood,new THREE.Vector3(0,.06,0),group); iCylinder(.045,.045,1.85,interiorPalette.wood,new THREE.Vector3(0,.98,0),group);
    const shade=iMesh(new THREE.ConeGeometry(.5,.62,24,1,true),interiorPalette.path,new THREE.Vector3(0,1.82,0),group); shade.rotation.x=Math.PI;
    const glow=new THREE.PointLight(0xffc861,10,4,1.8); glow.position.set(0,1.65,.05); group.add(glow);
  } else if(type==='plant'){
    iCylinder(.38,.29,.62,interiorPalette.pot,new THREE.Vector3(0,.31,0),group); iCylinder(.055,.07,.86,interiorPalette.leaf,new THREE.Vector3(0,1.02,0),group);
    [[-.28,1.15,-.08,.45],[.27,1.34,.02,-.42],[-.1,1.58,0,.18],[.32,1.02,.05,-.6]].forEach(([x,y,z,r],index)=>{ const leaf=iMesh(new THREE.SphereGeometry(.34,16,12),index%2?0x6c9f60:interiorPalette.leaf,new THREE.Vector3(x,y,z),group); leaf.scale.set(.55,1,.32); leaf.rotation.z=r; });
  } else if(type==='shelf'){
    iBox(1.55,.12,.5,interiorPalette.wood,new THREE.Vector3(0,.18,0),group); iBox(1.55,.12,.5,interiorPalette.wood,new THREE.Vector3(0,1.05,0),group); iBox(1.55,.12,.5,interiorPalette.wood,new THREE.Vector3(0,1.9,0),group);
    iBox(.13,2.05,.5,0x805038,new THREE.Vector3(-.7,1,0),group); iBox(.13,2.05,.5,0x805038,new THREE.Vector3(.7,1,0),group);
    iBox(.22,.56,.3,interiorPalette.roof,new THREE.Vector3(-.36,1.39,0),group); iBox(.18,.45,.3,interiorPalette.blue,new THREE.Vector3(-.1,1.34,0),group); iBox(.25,.63,.3,interiorPalette.trim,new THREE.Vector3(.18,1.43,0),group);
  }
  return markInteriorItem(group,type);
}
function createDoorwayInteriorItem(type){
  const group=new THREE.Group(); doorwayInteriorFurniture.add(group);
  const miniBox=(x,y,z,color,px=0,py=0,pz=0)=>box(x,y,z,color,new THREE.Vector3(px,py,pz),group);
  const miniCylinder=(rt,rb,h,color,px=0,py=0,pz=0)=>cylinder(rt,rb,h,color,new THREE.Vector3(px,py,pz),group);
  if(type==='sofa'){
    miniBox(.36,.09,.15,palette.blue,0,.055,0);
    miniBox(.36,.14,.05,0x4f8ea1,0,.13,-.055);
    miniBox(.05,.12,.17,0x4f8ea1,-.18,.08,0); miniBox(.05,.12,.17,0x4f8ea1,.18,.08,0);
    miniBox(.12,.035,.09,0xaed6d8,-.075,.115,0); miniBox(.12,.035,.09,0xaed6d8,.075,.115,0);
  } else if(type==='rug'){
    const rug=mesh(new THREE.CylinderGeometry(.25,.25,.018,28),mat(palette.roof),new THREE.Vector3(0,.012,0),group); rug.scale.z=.68;
  } else if(type==='lamp'){
    miniCylinder(.055,.065,.025,palette.wood,0,.015,0); miniCylinder(.009,.009,.31,palette.wood,0,.17,0);
    const shade=mesh(new THREE.ConeGeometry(.08,.1,16,1,true),mat(palette.path),new THREE.Vector3(0,.31,0),group); shade.rotation.x=Math.PI;
  } else if(type==='plant'){
    miniCylinder(.06,.047,.1,palette.pot,0,.05,0); miniCylinder(.009,.011,.13,palette.leaf,0,.15,0);
    [[-.045,.2,0],[.042,.225,0],[-.01,.255,0],[.05,.18,0]].forEach(([x,y,z],index)=>{ const leaf=sphere(.05,index%2?0x6c9f60:palette.leaf,new THREE.Vector3(x,y,z),group); leaf.scale.set(.55,1,.4); });
  } else if(type==='shelf'){
    [0,.14,.28].forEach(y=>miniBox(.25,.022,.08,palette.wood,0,y+.02,0));
    miniBox(.022,.34,.08,0x805038,-.112,.17,0); miniBox(.022,.34,.08,0x805038,.112,.17,0);
    miniBox(.035,.09,.05,palette.roof,-.055,.215,0); miniBox(.03,.075,.05,palette.blue,0,.208,0); miniBox(.04,.1,.05,palette.trim,.05,.22,0);
  }
  return group;
}
function syncDoorwayInterior(){
  while(doorwayInteriorFurniture.children.length) doorwayInteriorFurniture.remove(doorwayInteriorFurniture.children[0]);
  Object.entries(INTERIOR_ITEMS).forEach(([type,item])=>{
    const saved=interiorLayout[type];
    if(!saved?.placed||!isInteriorItemUnlocked(type)) return;
    const x=Number.isFinite(saved.x)?saved.x:item.start[0],z=Number.isFinite(saved.z)?saved.z:item.start[1];
    const miniature=createDoorwayInteriorItem(type);
    miniature.position.set(THREE.MathUtils.clamp(x,-5.3,5.3)*.075,.17,-.42+(THREE.MathUtils.clamp(z,-4.55,4.55)+4.55)*.202);
  });
}
const interiorObjects=new Map();
function saveInteriorLayout(){ persistLocal(INTERIOR_LAYOUT_KEY,JSON.stringify(interiorLayout)); }
function renderInteriorOptions(){
  interiorOptions.innerHTML=Object.entries(INTERIOR_ITEMS).map(([type,item])=>{
    const placed=Boolean(interiorLayout[type]?.placed),unlocked=isInteriorItemUnlocked(type);
    const state=!unlocked?`${item.unlockBunch}번째 송이`:placed?'배치됨':'꺼내기';
    return `<button class="interior-option${unlocked?' unlocked':' locked'}" data-interior-item="${type}" type="button" ${placed||!unlocked||isSharedHome?'disabled':''}><i aria-hidden="true"></i><span>${item.label}<small>${state}</small></span></button>`;
  }).join('');
}
function setInteriorSelection(group){
  interiorObjects.forEach(item=>item.traverse(child=>{ if(child.isMesh&&child.material?.emissive){ child.material.emissive.setHex(0); child.material.emissiveIntensity=0; } }));
  selectedInteriorItem=group||null;
  if(group) group.traverse(child=>{ if(child.isMesh&&child.material?.emissive){ child.material.emissive.setHex(0x5b3218); child.material.emissiveIntensity=.13; } });
  storeInteriorItemButton.hidden=!group||isSharedHome;
}
function placeInteriorItem(type){
  if(isSharedHome||interiorObjects.has(type)||!isInteriorItemUnlocked(type)) return;
  const group=createInteriorItem(type); const [x,z]=INTERIOR_ITEMS[type].start; group.position.set(x,0,z); interiorObjects.set(type,group);
  interiorLayout[type]={placed:true,x,z}; saveInteriorLayout(); renderInteriorOptions(); setInteriorSelection(group);
}
function rebuildInterior(){
  while(interiorFurniture.children.length) interiorFurniture.remove(interiorFurniture.children[0]);
  interiorObjects.clear();
  Object.entries(INTERIOR_ITEMS).forEach(([type,item])=>{ const saved=interiorLayout[type]; if(!saved?.placed||!isInteriorItemUnlocked(type)) return; const group=createInteriorItem(type); group.position.set(Number.isFinite(saved.x)?saved.x:item.start[0],0,Number.isFinite(saved.z)?saved.z:item.start[1]); interiorObjects.set(type,group); });
  setInteriorSelection(null); renderInteriorOptions();
}
let selectedInteriorItem=null,draggingInteriorItem=null,interiorMoved=false,rotatingInterior=false,interiorRotateStartX=0;
let interiorOrbitAngle=Number(sharedHome?.interiorViewAngle??interiorLayout.viewAngle)||0,interiorOrbitTargetAngle=interiorOrbitAngle,interiorRotateStartAngle=interiorOrbitAngle;
let interiorZoom=THREE.MathUtils.clamp(Number(sharedHome?.interiorViewZoom??interiorLayout.viewZoom)||1,.8,1.9),interiorZoomTarget=interiorZoom,interiorZoomSaveTimer=null;
const interiorRaycaster=new THREE.Raycaster(),interiorPointer=new THREE.Vector2(),interiorDragPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0),interiorDragPoint=new THREE.Vector3(),interiorDragOffset=new THREE.Vector3(),interiorLastValid=new THREE.Vector3();
function setInteriorRay(event){ const rect=interiorCanvas.getBoundingClientRect(); interiorPointer.x=((event.clientX-rect.left)/rect.width)*2-1; interiorPointer.y=-((event.clientY-rect.top)/rect.height)*2+1; interiorRaycaster.setFromCamera(interiorPointer,interiorCamera); }
function interiorItemAt(event){ setInteriorRay(event); const hit=interiorRaycaster.intersectObjects([...interiorObjects.values()],true)[0]; return hit?.object?.userData?.interiorRoot||null; }
function interiorGroundAt(event){ setInteriorRay(event); return interiorRaycaster.ray.intersectPlane(interiorDragPlane,interiorDragPoint)?interiorDragPoint:null; }
function validInteriorPosition(group,x,z){
  const radius=group.userData.radius||.5;
  if(x-radius<-5.45||x+radius>5.45||z-radius<-4.55||z+radius>4.55) return false;
  if(group.userData.interiorType==='rug') return true;
  return [...interiorObjects.values()].every(other=>other===group||other.userData.interiorType==='rug'||Math.hypot(x-other.position.x,z-other.position.z)>radius+(other.userData.radius||.5)*.74);
}
interiorCanvas.addEventListener('pointerdown',event=>{
  const group=interiorItemAt(event); setInteriorSelection(group);
  if(!group){ rotatingInterior=true; interiorRotateStartX=event.clientX; interiorRotateStartAngle=interiorOrbitTargetAngle; interiorCanvas.classList.add('dragging'); interiorCanvas.setPointerCapture(event.pointerId); return; }
  if(isSharedHome){ showCaptureNotice('친구의 거실이에요','빈 공간을 끌어 360° 둘러볼 수 있어요.'); return; }
  const point=interiorGroundAt(event); if(!point) return;
  draggingInteriorItem=group; interiorMoved=false; interiorDragOffset.set(group.position.x-point.x,0,group.position.z-point.z); interiorLastValid.copy(group.position); interiorCanvas.classList.add('dragging'); interiorCanvas.setPointerCapture(event.pointerId);
});
interiorCanvas.addEventListener('pointermove',event=>{
  if(rotatingInterior){ interiorOrbitTargetAngle=interiorRotateStartAngle+(event.clientX-interiorRotateStartX)*.009; return; }
  if(!draggingInteriorItem) return;
  const point=interiorGroundAt(event); if(!point) return;
  const x=THREE.MathUtils.clamp(point.x+interiorDragOffset.x,-5.3,5.3),z=THREE.MathUtils.clamp(point.z+interiorDragOffset.z,-4.4,4.4);
  if(validInteriorPosition(draggingInteriorItem,x,z)){ draggingInteriorItem.position.set(x,0,z); interiorLastValid.copy(draggingInteriorItem.position); }
  interiorMoved=true;
});
function finishInteriorDrag(){
  if(rotatingInterior){ rotatingInterior=false; interiorLayout.viewAngle=interiorOrbitTargetAngle; saveInteriorLayout(); interiorCanvas.classList.remove('dragging'); return; }
  if(!draggingInteriorItem) return;
  draggingInteriorItem.position.copy(interiorLastValid);
  const type=draggingInteriorItem.userData.interiorType; interiorLayout[type]={placed:true,x:draggingInteriorItem.position.x,z:draggingInteriorItem.position.z}; saveInteriorLayout();
  draggingInteriorItem=null; interiorCanvas.classList.remove('dragging');
}
interiorCanvas.addEventListener('pointerup',finishInteriorDrag);
interiorCanvas.addEventListener('pointercancel',finishInteriorDrag);
interiorCanvas.addEventListener('wheel',event=>{
  event.preventDefault();
  interiorZoomTarget=THREE.MathUtils.clamp(interiorZoomTarget+event.deltaY*.0017,.8,1.9);
  clearTimeout(interiorZoomSaveTimer);
  interiorZoomSaveTimer=setTimeout(()=>{ interiorLayout.viewZoom=interiorZoomTarget; saveInteriorLayout(); },140);
},{passive:false});
interiorOptions.addEventListener('click',event=>{ const button=event.target.closest('[data-interior-item]'); if(button) placeInteriorItem(button.dataset.interiorItem); });
storeInteriorItemButton.addEventListener('click',()=>{
  if(!selectedInteriorItem||isSharedHome) return;
  const type=selectedInteriorItem.userData.interiorType; interiorFurniture.remove(selectedInteriorItem); interiorObjects.delete(type); interiorLayout[type]={placed:false}; saveInteriorLayout(); setInteriorSelection(null); renderInteriorOptions();
});
function resizeInterior(){ const width=interiorCanvas.clientWidth,height=interiorCanvas.clientHeight; if(!width||!height) return; interiorRenderer.setSize(width,height,false); interiorCamera.aspect=width/height; interiorCamera.updateProjectionMatrix(); }
function interiorFrame(){
  if(interiorView.classList.contains('open')){
    resizeInterior();
    interiorOrbitAngle+=(interiorOrbitTargetAngle-interiorOrbitAngle)*.11;
    interiorZoom+=(interiorZoomTarget-interiorZoom)*.12;
    const narrow=interiorCanvas.clientWidth<760;
    interiorCamera.fov=(narrow?54:48)*interiorZoom;
    interiorCamera.updateProjectionMatrix();
    interiorCamera.position.set(Math.sin(interiorOrbitAngle)*(narrow?4.35:4.8),narrow?3.8:3.55,Math.cos(interiorOrbitAngle)*(narrow?3.75:4.2)-.15);
    interiorCamera.lookAt(0,1.2,-.2);
    interiorRenderer.render(interiorScene,interiorCamera);
  }
  requestAnimationFrame(interiorFrame);
}
function enterInterior(){
  if(completedBunches<INTERIOR_UNLOCK_BUNCHES) return;
  interiorHouseName.textContent=`${houseName}네 집`;
  rebuildInterior();
  interiorView.classList.add('open'); interiorView.setAttribute('aria-hidden','false'); document.body.classList.add('interior-open'); resizeInterior();
  showCaptureNotice('거실 문이 열렸어요!','빈 공간은 360°로 끌고, 마우스 휠로 더 넓게 축소해 볼 수 있어요.');
}
function leaveInterior(){ interiorView.classList.remove('open'); interiorView.setAttribute('aria-hidden','true'); document.body.classList.remove('interior-open'); setInteriorSelection(null); doorOpen=false; doorTargetRotation=0; warmInterior.visible=false; }
document.querySelector('#leave-interior').addEventListener('click',leaveInterior);
document.addEventListener('keydown',event=>{ if(event.key==='Escape'&&interiorView.classList.contains('open')) leaveInterior(); });
rebuildInterior();
requestAnimationFrame(interiorFrame);

function homeImageFileName(){
  const now=new Date();
  const stamp=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('')+'-'+[String(now.getHours()).padStart(2,'0'),String(now.getMinutes()).padStart(2,'0')].join('');
  return `my-little-home-${stamp}.png`;
}
function captureHomeImage(){
  renderer.render(scene,camera);
  const verticalMargin=Math.round(canvas.width*.12);
  const snapshot=document.createElement('canvas'); snapshot.width=canvas.width; snapshot.height=canvas.height+verticalMargin*2;
  const context=snapshot.getContext('2d'); context.fillStyle='#f5cd58'; context.fillRect(0,0,snapshot.width,snapshot.height); context.drawImage(canvas,0,verticalMargin);
  return new Promise((resolve,reject)=>snapshot.toBlob(blob=>blob?resolve(blob):reject(new Error('capture failed')),'image/png'));
}
function downloadHomeImage(blob,fileName){
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a'); link.href=url; link.download=fileName; link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function showCaptureNotice(title,description){
  const message=toast.querySelector('p');
  toast.querySelector('span').textContent='✦';
  message.replaceChildren();
  const heading=document.createElement('b'); heading.textContent=title;
  message.append(heading,document.createTextNode(description));
  toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),3200);
}
let capturedImageBlob=null, capturedImageUrl='', capturedImageName='';
async function openCapturePreview(){
  try {
    capturedImageBlob=await captureHomeImage();
    capturedImageName=homeImageFileName();
    if(capturedImageUrl) URL.revokeObjectURL(capturedImageUrl);
    capturedImageUrl=URL.createObjectURL(capturedImageBlob);
    capturedHomeImage.src=capturedImageUrl;
    captureBackdrop.classList.add('open'); captureBackdrop.setAttribute('aria-hidden','false');
    setTimeout(()=>saveCapturedImageButton.focus(),160);
  } catch { showCaptureNotice('이미지를 만들지 못했어요.','잠시 후 다시 시도해 주세요.'); }
}
function closeCapturePreview(){ captureBackdrop.classList.remove('open'); captureBackdrop.setAttribute('aria-hidden','true'); }
function saveCapturedImage(){
  if(!capturedImageBlob) return;
  downloadHomeImage(capturedImageBlob,capturedImageName);
  showCaptureNotice('사진을 저장했어요!','다운로드한 PNG 파일을 확인해 보세요.');
}
async function shareCapturedImage(){
  if(!capturedImageBlob) return;
  try {
    const file=new File([capturedImageBlob],capturedImageName,{type:'image/png'});
    if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){
      await navigator.share({ title:'나의 오늘의 집', text:'오늘의 잘한 일로 꾸민 나의 작은 집이에요.', files:[file] });
      showCaptureNotice('사진을 공유했어요!','따뜻한 오늘을 함께 나눴어요.');
      return;
    }
    downloadHomeImage(file,capturedImageName);
    showCaptureNotice('공유용 이미지를 저장했어요!','이 기기에서는 저장한 파일로 공유할 수 있어요.');
  } catch(error) {
    if(error?.name!=='AbortError') showCaptureNotice('공유를 준비하지 못했어요.','잠시 후 다시 시도해 주세요.');
  }
}
function shareBaseUrl(){
  return (location.hostname==='127.0.0.1'||location.hostname==='localhost')
    ? 'https://soo7894.github.io/podoal-home/'
    : `${location.origin}${location.pathname}`;
}
function readCachedShareLink(signature){
  try {
    const cached=JSON.parse(localStorage.getItem(SHARE_LINK_CACHE_KEY)||'null');
    return cached?.signature===signature&&typeof cached.url==='string'?cached.url:'';
  } catch { return ''; }
}
function cacheShareLink(signature,url){
  try { localStorage.setItem(SHARE_LINK_CACHE_KEY,JSON.stringify({signature,url})); } catch {}
}
async function currentSharedHomeUrl(){
  const snapshot=packSharedHome();
  const signature=JSON.stringify(snapshot);
  const cached=readCachedShareLink(signature);
  if(cached) return cached;
  const response=await fetch(SHARE_ENDPOINT,{
    method:'POST',
    headers:{apikey:SHARE_PUBLISHABLE_KEY,'Content-Type':'application/json'},
    body:JSON.stringify({state:snapshot}),
  });
  const payload=await response.json().catch(()=>null);
  if(!response.ok||typeof payload?.id!=='string') throw new Error('share-link-failed');
  const url=`${shareBaseUrl()}${SHARE_ID_PREFIX}${payload.id}`;
  cacheShareLink(signature,url);
  return url;
}
function homeShareText(){
  const thisWeekStart=dateFromString(localDateString());
  thisWeekStart.setDate(thisWeekStart.getDate()-(thisWeekStart.getDay()+6)%7);
  const thisWeekCount=memories.filter(memory=>dateFromString(memoryWeekKey(memory.date))>=thisWeekStart).length;
  return thisWeekCount?`이번 주 ${thisWeekCount}번의 작은 기록으로 꾸민 ${houseName}네 집이에요. 따뜻하게 둘러봐 주세요.`:`${houseName}네 작은 집에 놀러 와 주세요.`;
}
async function shareHomeLink(){
  showCaptureNotice('공유 링크를 만들고 있어요.','잠시만 기다려 주세요.');
  try {
    const url=await currentSharedHomeUrl();
    if(navigator.share){
      try {
        await navigator.share({title:'나의 오늘의 집',text:homeShareText(),url});
        showCaptureNotice('집 링크를 공유했어요!','친구가 같은 배치와 각도로 집을 볼 수 있어요.');
        return;
      } catch(error) { if(error?.name==='AbortError') return; }
    }
    if(navigator.clipboard?.writeText){
      await navigator.clipboard.writeText(url);
      showCaptureNotice('집 링크를 복사했어요!','친구에게 붙여넣어 보내 보세요.');
      return;
    }
    window.prompt('아래 링크를 복사해 친구에게 보내세요.',url);
  } catch(error) {
    showCaptureNotice('공유 링크를 만들지 못했어요.','인터넷 연결을 확인한 뒤 다시 눌러 주세요.');
  }
}
openHomeCaptureButton.addEventListener('click',openCapturePreview);
shareHomeLinkButton.addEventListener('click',shareHomeLink);
closeCaptureButton.addEventListener('click',closeCapturePreview);
captureBackdrop.addEventListener('click',event=>{ if(event.target===captureBackdrop) closeCapturePreview(); });
saveCapturedImageButton.addEventListener('click',saveCapturedImage);
shareCapturedImageButton.addEventListener('click',shareCapturedImage);

function formatMemoryTimestamp(value){
  const date=new Date(value);
  if(Number.isNaN(date.getTime())) return '기록 시간 없음';
  const hour=date.getHours();
  const period=hour<12?'오전':'오후';
  const displayHour=hour%12||12;
  return `${date.getMonth()+1}월 ${date.getDate()}일 ${period} ${displayHour}:${String(date.getMinutes()).padStart(2,'0')}`;
}
function grapeDotsHTML(count,animateLast=false){
  return Array.from({length:GRAPES_PER_BUNCH},(_,index)=>`<i class="grape-dot${index<count?' filled':''}${animateLast&&index===count-1?' just-added':''}" aria-hidden="true"></i>`).join('');
}
function saveGrapeProgress(){
  persistLocal(GRAPE_PROGRESS_KEY,String(grapeProgress));
  persistLocal(COMPLETED_BUNCHES_KEY,String(completedBunches));
  persistLocal(GRAPE_MIGRATION_KEY,'1');
  persistLocal(GRAPE_SIZE_MIGRATION_KEY,'1');
}

function renderRecords(){
  const total = memories.length;
  countEl.innerHTML=`${grapeProgress} <small>/ ${GRAPES_PER_BUNCH}</small>`;
  grapeBunch.innerHTML=grapeDotsHTML(grapeProgress);
  grapeBunch.setAttribute('aria-label',`포도알 ${GRAPES_PER_BUNCH}개 중 ${grapeProgress}개`);
  const remaining=GRAPES_PER_BUNCH-grapeProgress;
  grapeNextCopy.textContent=grapeProgress?`${remaining}개의 잘한 일을 더 찾으면 새로운 장식이 와요.`:'새로운 포도송이를 천천히 채워 볼까요?';
  const interiorStatus=completedBunches>=INTERIOR_UNLOCK_BUNCHES?'거실이 열렸어요':`거실까지 ${INTERIOR_UNLOCK_BUNCHES-completedBunches}송이`;
  completedBunchesEl.textContent=`완성한 포도송이 ${completedBunches}개 · ${interiorStatus}`;
  const decorCount=memories.filter(memory=>memory.decor&&memory.decor!=='rest').length;
  previewCount.textContent=`기록 ${String(total).padStart(2,'0')}개 · 장식 ${String(decorCount).padStart(2,'0')}개`;
  if(memories[0]) todayPreview.innerHTML=memories[0].text.replace(/(.{17})/g,'$1<br>');
  const shown = memories.slice(0,3).map(m=>`<li><span class="memory-dot ${m.kind==='rest'?'rest':m.decor||'grape'}">${m.kind==='rest'?'☁':m.decor?DECOR_INFO[m.decor]?.icon||'✦':'🍇'}</span><div><b>${escapeHTML(m.text)}</b><small>${formatMemoryTimestamp(m.date)}</small></div></li>`).join('');
  recentList.innerHTML=shown||'<li class="recent-empty"><span class="memory-dot">✦</span><div><b>오늘의 첫 장면을 남겨 보세요</b><small>한 줄이면 충분해요</small></div></li>';
  inventoryCount.textContent=memories.filter(memory=>memory.decor&&memory.rewardStored).length;
}
function escapeHTML(text){ const el=document.createElement('div');el.textContent=text;return el.innerHTML; }
renderRecords();

function themePrompts(){ return ROUTINE_THEMES[routineTheme].prompts; }
function themePromptForToday(){
  const today=new Date();
  return themePrompts()[(today.getFullYear()+today.getMonth()+today.getDate())%themePrompts().length];
}
function latestMemory(){ return memories.reduce((latest,memory)=>!latest||new Date(memory.date)>new Date(latest.date)?memory:latest,null); }
function renderRoutine(){
  const theme=ROUTINE_THEMES[routineTheme];
  const latest=latestMemory();
  const today=localDateString();
  routineThemeName.textContent=theme.label;
  dailyPrompt.textContent=themePromptForToday();
  themeOptions.innerHTML=Object.entries(ROUTINE_THEMES).map(([key,item])=>`<button class="theme-option${key===routineTheme?' selected':''}" type="button" data-theme="${key}" aria-pressed="${key===routineTheme}">${item.chip}</button>`).join('');
  const prompts=themePrompts().slice(0,2);
  quickPromptList.innerHTML=prompts.map(prompt=>`<button type="button" data-quick-prompt="${prompt}">${prompt.length>17?`${prompt.slice(0,17)}…`:prompt}</button>`).join('');
  entryQuickPrompts.innerHTML=prompts.map(prompt=>`<button type="button" data-quick-prompt="${prompt}">${prompt}</button>`).join('');
  if(!latest) returnMessage.textContent='시작이 늦어도 괜찮아요. 오늘의 한 줄이 첫 장면이 됩니다.';
  else {
    const gap=Math.floor((dateFromString(today)-dateFromString(localDateString(new Date(latest.date))))/86400000);
    returnMessage.textContent=gap>1?`${gap}일 만에 돌아왔어요. 오늘은 한 줄만 남겨도 충분해요.`:gap===1?'어제의 나와 오늘의 나를 다정하게 이어 볼까요?':'오늘도 이 집에 따뜻함을 하나 놓아 볼까요?';
  }
}
renderRoutine();

const PRAISE_MESSAGES={
  care:['나를 돌보는 선택을 해냈네요. 오늘의 나에게 다정한 박수를 보내요.','작은 돌봄도 분명한 잘함이에요. 오늘을 잘 챙겼어요.'],
  growth:['한 걸음 나아간 오늘의 내가 멋져요. 작은 시작도 충분히 반짝여요.','어제보다 조금 자란 순간을 발견했네요. 정말 잘했어요.'],
  relation:['따뜻한 마음을 건넨 순간이네요. 그 마음이 오늘을 더 환하게 만들었어요.','누군가와 이어진 오늘의 용기가 참 다정해요.'],
  rest:['멈추고 쉬어가는 것도 나를 지키는 멋진 선택이에요.','오늘의 쉼이 내일의 나를 도와줄 거예요. 충분히 잘했어요.']
};
function praiseFor(memory){
  const messages=PRAISE_MESSAGES[memory.kind==='rest'?'rest':memory.theme]||PRAISE_MESSAGES.care;
  return messages[memories.length%messages.length];
}
function nextGiftType(){
  const owned=new Set(memories.map(memory=>memory.decor).filter(decor=>decor&&decor!=='rest'));
  const unowned=SHARE_DECOR_TYPES.filter(type=>!owned.has(type));
  const pool=unowned.length?unowned:SHARE_DECOR_TYPES;
  return pool[Math.floor(Math.random()*pool.length)];
}
function closeReward(){
  rewardBackdrop.classList.remove('open');
  rewardBackdrop.setAttribute('aria-hidden','true');
  pendingRewardMemoryDate=null;
}
function openGrapeReward(memory,bunchCompleted){
  pendingRewardMemoryDate=memory.date;
  document.querySelector('#reward-title').innerHTML=bunchCompleted?'포도송이가<br /><em>통통하게 완성됐어요!</em>':'오늘의 포도알이<br /><em>톡! 붙었어요</em>';
  rewardPraise.textContent=praiseFor(memory);
  rewardBunch.innerHTML=grapeDotsHTML(bunchCompleted?GRAPES_PER_BUNCH:grapeProgress,true);
  const interiorGift=bunchCompleted?interiorGiftForBunch(completedBunches):null;
  const progressCopy=bunchCompleted&&completedBunches===INTERIOR_UNLOCK_BUNCHES?'6개의 잘한 내가 담기며, 집 안의 거실도 열렸어요!':bunchCompleted?'6개의 잘한 내가 한 송이에 담겼어요.':`이번 포도송이 ${grapeProgress} / ${GRAPES_PER_BUNCH}`;
  rewardProgressText.innerHTML=`${progressCopy}${interiorGift?`<em>거실 선물 도착 · ${interiorGift[1].label}</em>`:''}`;
  rewardGift.hidden=!bunchCompleted;
  rewardContinueButton.hidden=bunchCompleted;
  rewardStoreButton.hidden=!bunchCompleted;
  rewardPlaceButton.hidden=!bunchCompleted;
  if(bunchCompleted){
    const info=DECOR_INFO[memory.decor];
    rewardGiftImage.src=decorThumbnail(memory.decor);
    rewardGiftImage.alt=`${info.label} 장식`;
    rewardGiftName.textContent=info.label;
  }
  rewardBackdrop.classList.add('open');
  rewardBackdrop.setAttribute('aria-hidden','false');
  setTimeout(()=>bunchCompleted?rewardPlaceButton.focus():rewardContinueButton.focus(),180);
}
function placeReward(memory,animate=true){
  if(!memory?.decor||memory.decor==='rest'||!memory.rewardStored) return;
  memory.rewardStored=false;
  saveAllData();
  const activeCount=memories.filter(item=>item.decor&&item.decor!=='rest'&&!item.rewardStored).length;
  addDecoration(memory.decor,Math.max(0,activeCount-1),animate,decorationMemoryText(memory),`memory-${memory.date}`,memory.flowerColor);
  renderRecords();
}
function renderInventory(){
  const stored=memories.filter(memory=>memory.decor&&memory.decor!=='rest'&&memory.rewardStored);
  inventoryList.innerHTML=stored.length?stored.map(memory=>{
    const info=DECOR_INFO[memory.decor];
    const count=memory.rewardMemoryDates?.length||1;
    return `<article class="inventory-item"><img src="${decorThumbnail(memory.decor)}" alt="" /><div><b>${info.label}</b><small>${count}개의 잘한 일이 담긴 장식</small></div>${isSharedHome?'':`<button type="button" data-place-reward="${memory.date}">집에 놓기</button>`}</article>`;
  }).join(''):'<p class="inventory-empty">보관 중인 장식이 없어요.<br />포도알 6개를 모으면 새로운 장식이 찾아옵니다.</p>';
}
function openInventory(){
  renderInventory();
  inventoryBackdrop.classList.add('open');
  inventoryBackdrop.setAttribute('aria-hidden','false');
}
function closeInventory(){ inventoryBackdrop.classList.remove('open'); inventoryBackdrop.setAttribute('aria-hidden','true'); }
rewardContinueButton.addEventListener('click',closeReward);
rewardStoreButton.addEventListener('click',()=>{ closeReward(); showCaptureNotice('장식을 보관했어요','언제든 장식 보관함에서 집에 놓을 수 있어요.'); });
rewardPlaceButton.addEventListener('click',()=>{ const memory=memories.find(item=>item.date===pendingRewardMemoryDate); placeReward(memory); closeReward(); showCaptureNotice('새 장식을 집에 놓았어요','장식을 끌어서 원하는 곳으로 옮겨 보세요.'); });
document.querySelector('#close-grape-reward').addEventListener('click',closeReward);
rewardBackdrop.addEventListener('click',event=>{ if(event.target===rewardBackdrop) closeReward(); });
document.querySelector('#open-inventory').addEventListener('click',openInventory);
document.querySelector('#close-inventory').addEventListener('click',closeInventory);
inventoryBackdrop.addEventListener('click',event=>{ if(event.target===inventoryBackdrop) closeInventory(); });
inventoryList.addEventListener('click',event=>{ const button=event.target.closest('[data-place-reward]'); if(!button) return; const memory=memories.find(item=>item.date===button.dataset.placeReward); placeReward(memory); renderInventory(); showCaptureNotice('장식을 집에 놓았어요','장식을 끌어서 원하는 곳으로 옮겨 보세요.'); });

function memoryWeekKey(value){
  const date=new Date(value);
  return Number.isNaN(date.getTime())?'':localDateString(date);
}
function renderWeekSummary(){
  const today=dateFromString(localDateString());
  const monday=new Date(today);
  monday.setDate(today.getDate()-(today.getDay()+6)%7);
  const weekday=['월','화','수','목','금','토','일'];
  weekSummary.innerHTML=`<div class="week-days">${Array.from({length:7},(_,index)=>{
    const day=new Date(monday); day.setDate(monday.getDate()+index);
    const key=localDateString(day);
    const count=memories.filter(memory=>memoryWeekKey(memory.date)===key).length;
    return `<div class="week-day${key===localDateString()?' today':''}"><small>${weekday[index]}</small><b>${count}</b></div>`;
  }).join('')}</div>`;
}
function renderWeeklyLetter(){
  const today=dateFromString(localDateString());
  const monday=new Date(today); monday.setDate(today.getDate()-(today.getDay()+6)%7);
  const week=memories.filter(memory=>dateFromString(memoryWeekKey(memory.date))>=monday);
  const activeDays=new Set(week.map(memory=>memoryWeekKey(memory.date))).size;
  const restCount=week.filter(memory=>memory.kind==='rest').length;
  const highlight=week.find(memory=>memory.kind!=='rest');
  weeklyLetter.innerHTML=week.length
    ? `<strong>이번 주, ${activeDays}일 동안 나를 챙겼어요.</strong><p>${highlight?`가장 반짝인 순간: “${escapeHTML(highlight.text)}”`:'잠시 쉬어 간 것도 소중한 기록이에요.'}${restCount?` · 휴식 ${restCount}일`:''}</p>`
    : '<strong>아직 비어 있는 이번 주예요.</strong><p>오늘의 한 줄부터 가볍게 시작해 볼까요?</p>';
}
function renderManager(){
  renderWeekSummary();
  renderWeeklyLetter();
  managerList.innerHTML=memories.length?memories.map(memory=>`<article class="manager-item"><div><b>${escapeHTML(memory.text)}</b><small>${formatMemoryTimestamp(memory.date)}</small></div>${isSharedHome?'':`<div class="manager-item-actions"><button type="button" data-edit-memory="${memory.date}">수정</button><button class="delete-memory" type="button" data-delete-memory="${memory.date}">삭제</button></div>`}</article>`).join(''):'<p class="manager-empty">아직 기록한 잘한 일이 없어요.</p>';
}
function saveAllData(){
  persistLocal(STORAGE_KEY,JSON.stringify(memories));
  persistLocal(DECOR_LAYOUT_KEY,JSON.stringify(decorLayout));
  persistLocal(STREAK_START_KEY,streakStartDate);
  persistLocal(HOUSE_NAME_KEY,houseName);
  persistLocal(INTERIOR_LAYOUT_KEY,JSON.stringify(interiorLayout));
  saveGrapeProgress();
}
function openManager(){
  editingMemoryDate=null;
  managerEditor.hidden=true;
  renderManager();
  managerBackdrop.classList.add('open');
  managerBackdrop.setAttribute('aria-hidden','false');
}
function closeManager(){
  managerBackdrop.classList.remove('open');
  managerBackdrop.setAttribute('aria-hidden','true');
  editingMemoryDate=null;
}
function openMemoryEditor(date){
  const memory=memories.find(item=>item.date===date);
  if(!memory) return;
  editingMemoryDate=date;
  editMemoryText.value=memory.text;
  managerEditor.hidden=false;
  editMemoryText.focus();
}
function saveMemoryEdit(){
  const memory=memories.find(item=>item.date===editingMemoryDate);
  const text=editMemoryText.value.trim();
  if(!memory||!text) return editMemoryText.focus();
  memory.text=text;
  saveAllData();
  rebuildDecorations();
  renderRecords();
  renderRoutine();
  renderManager();
  managerEditor.hidden=true;
  editingMemoryDate=null;
}
function deleteMemory(date){
  memories=memories.filter(memory=>memory.date!==date);
  delete decorLayout[`memory-${date}`];
  saveAllData();
  rebuildDecorations();
  renderRecords();
  renderRoutine();
  renderManager();
}
function resetHome(){
  if(isSharedHome){ showCaptureNotice('공유받은 집이에요','처음부터 시작하기는 내 집에서만 사용할 수 있어요.'); return; }
  if(!confirm('기록, 장식, 시작일, 집 이름을 모두 지우고 처음부터 시작할까요?')) return;
  memories=[];
  decorLayout={};
  interiorLayout={};
  streakStartDate='';
  houseName='우리';
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(DECOR_LAYOUT_KEY);
  localStorage.removeItem(STREAK_START_KEY);
  localStorage.removeItem(HOUSE_NAME_KEY);
  localStorage.removeItem(ROUTINE_THEME_KEY);
  localStorage.removeItem(GRAPE_PROGRESS_KEY);
  localStorage.removeItem(COMPLETED_BUNCHES_KEY);
  localStorage.removeItem(GRAPE_MIGRATION_KEY);
  localStorage.removeItem(GRAPE_SIZE_MIGRATION_KEY);
  localStorage.removeItem(INTERIOR_LAYOUT_KEY);
  selectedDecor='flower';
  routineTheme='care';
  grapeProgress=0;
  completedBunches=0;
  interiorOrbitAngle=0;
  interiorOrbitTargetAngle=0;
  interiorZoom=1;
  interiorZoomTarget=1;
  houseNameText.textContent=`${houseName}네 집`;
  houseNameInput.value=houseName;
  interiorHouseName.textContent=`${houseName}네 집`;
  drawNameplate();
  renderDecorOptions();
  rebuildDecorations();
  rebuildInterior();
  renderRecords();
  renderRoutine();
  updateStreak();
  updateHouseName();
  showCaptureNotice('처음 상태로 돌아왔어요!','이제 새로운 잘한 일부터 차곡차곡 기록해 보세요.');
}

function localDateString(date = new Date()){
  const offset = date.getTimezoneOffset()*60000;
  return new Date(date.getTime()-offset).toISOString().slice(0,10);
}
function dateFromString(value){
  const [year,month,day] = value.split('-').map(Number);
  return new Date(year,month-1,day);
}
function streakDays(startDate){
  const today = dateFromString(localDateString());
  return Math.max(1,Math.floor((today-dateFromString(startDate))/86400000)+1);
}
function formatStartDate(value){
  const date=dateFromString(value);
  return `${date.getFullYear()}년 ${date.getMonth()+1}월 ${date.getDate()}일`;
}
function updateStreak(){
  if(!streakStartDate){
    streakNumber.textContent='시작일';
    streakCopy.textContent='을 정해 주세요';
    streakButton.classList.add('needs-setup');
    streakButton.setAttribute('aria-label','따뜻하게 살기 시작한 날 정하기');
    return;
  }
  const days=streakDays(streakStartDate);
  streakNumber.textContent=days;
  streakCopy.textContent='일째 따뜻하게 살고 있어요';
  streakButton.classList.remove('needs-setup');
  streakButton.setAttribute('aria-label',`${formatStartDate(streakStartDate)}부터 ${days}일째. 시작일 확인 또는 변경`);
}
function updateStartDateNote(){
  if(!startDateInput.value){ startDateNote.textContent=''; return; }
  startDateNote.textContent=`${formatStartDate(startDateInput.value)}부터 오늘로 ${streakDays(startDateInput.value)}일째예요.`;
}
function openStreakModal(){
  if(isSharedHome){ showCaptureNotice('공유받은 집이에요','기록 시작일은 원래 모습 그대로 보기 전용으로 열려 있어요.'); return; }
  const hasStart=Boolean(streakStartDate);
  startDateInput.max=localDateString();
  startDateInput.value=streakStartDate||localDateString();
  streakTitle.innerHTML=hasStart?'언제부터<br /><em>시작했나요?</em>':'언제부터<br /><em>따뜻하게 살까요?</em>';
  streakDescription.textContent=hasStart?'처음 시작한 날을 확인하거나 바꿀 수 있어요.':'따뜻하게 살기로 한 첫날을 기록해 보세요.';
  saveStartDate.innerHTML=hasStart?'시작일 저장하기 <span>→</span>':'이날부터 시작하기 <span>→</span>';
  updateStartDateNote();
  streakBackdrop.classList.add('open');
  streakBackdrop.setAttribute('aria-hidden','false');
  setTimeout(()=>startDateInput.focus(),180);
}
function closeStreakModal(){ streakBackdrop.classList.remove('open'); streakBackdrop.setAttribute('aria-hidden','true'); }
streakButton.addEventListener('click',openStreakModal);
document.querySelector('#close-streak').addEventListener('click',closeStreakModal);
streakBackdrop.addEventListener('click',event=>{ if(event.target===streakBackdrop) closeStreakModal(); });
startDateInput.addEventListener('change',updateStartDateNote);
saveStartDate.addEventListener('click',()=>{
  if(!startDateInput.value){ startDateInput.focus(); return; }
  streakStartDate=startDateInput.value;
  persistLocal(STREAK_START_KEY,streakStartDate);
  updateStreak();
  closeStreakModal();
});
updateStreak();

function saveHouseName(){
  if(isSharedHome) return;
  const nextName=houseNameInput.value.trim().replace(/네\s*집$/,'').trim();
  if(nextName) houseName=nextName;
  houseNameText.textContent=`${houseName}네 집`;
  houseNameInput.value=houseName;
  interiorHouseName.textContent=`${houseName}네 집`;
  persistLocal(HOUSE_NAME_KEY,houseName);
  drawNameplate();
  houseNameEditor.classList.remove('editing');
}
houseNameButton.addEventListener('click',()=>{ if(isSharedHome){ showCaptureNotice('공유받은 집이에요','집 이름은 원래 모습 그대로 보기 전용으로 열려 있어요.'); return; } houseNameInput.value=houseName; houseNameEditor.classList.add('editing'); houseNameInput.focus(); houseNameInput.select(); });
houseNameInput.addEventListener('keydown',e=>{ if(e.key==='Enter') saveHouseName(); if(e.key==='Escape') houseNameEditor.classList.remove('editing'); });
houseNameInput.addEventListener('blur',saveHouseName);

function openModal(){ if(isSharedHome){ showCaptureNotice('공유받은 집이에요','기록과 장식은 원래 모습 그대로 보기 전용으로 열려 있어요.'); return; } renderRoutine(); modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); setTimeout(()=>input.focus(),180); }
function closeModal(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }
document.querySelector('#open-entry').addEventListener('click',openModal);
document.querySelector('#card-entry').addEventListener('click',openModal);
document.querySelector('#close-entry').addEventListener('click',closeModal);
modal.addEventListener('click',e=>{ if(e.target===modal) closeModal(); });
decorOptions.addEventListener('click',event=>{ const button=event.target.closest('.decor-option'); if(!button) return; selectedDecor=button.dataset.decor; renderDecorOptions(); });
function recordMemory(text,kind='win'){
  const memory={text,decor:kind==='rest'?'rest':null,kind:kind==='rest'?'rest':undefined,date:new Date().toISOString(),theme:routineTheme};
  memories.unshift(memory);
  grapeProgress+=1;
  let bunchCompleted=false;
  if(grapeProgress>=GRAPES_PER_BUNCH){
    bunchCompleted=true;
    grapeProgress=0;
    completedBunches+=1;
    memory.decor=nextGiftType();
    memory.flowerColor=memory.decor==='flower'?randomFlowerColor():null;
    memory.rewardStored=true;
    memory.rewardMemoryDates=memories.slice(0,GRAPES_PER_BUNCH).map(item=>item.date);
  }
  if(!streakStartDate){
    streakStartDate=localDateString(new Date(memory.date));
    persistLocal(STREAK_START_KEY,streakStartDate);
    updateStreak();
  }
  saveAllData();
  if(bunchCompleted) rebuildInterior();
  renderRecords();
  renderRoutine();
  return {memory,bunchCompleted};
}
document.querySelector('#save-memory').addEventListener('click',()=>{
  const text=input.value.trim();
  if(!text){ input.focus(); input.placeholder='오늘의 잘한 일을 한 줄로 적어 주세요 :)'; return; }
  const result=recordMemory(text);
  input.value='';
  closeModal();
  openGrapeReward(result.memory,result.bunchCompleted);
});
input.addEventListener('keydown',e=>{ if(e.key==='Enter') document.querySelector('#save-memory').click(); });
function useQuickPrompt(prompt){
  openModal();
  input.value=prompt.replace(/[?？]$/,'');
  input.focus();
  input.setSelectionRange(input.value.length,input.value.length);
}
quickPromptList.addEventListener('click',event=>{ const button=event.target.closest('[data-quick-prompt]'); if(button) useQuickPrompt(button.dataset.quickPrompt); });
entryQuickPrompts.addEventListener('click',event=>{ const button=event.target.closest('[data-quick-prompt]'); if(button) useQuickPrompt(button.dataset.quickPrompt); });
themeOptions.addEventListener('click',event=>{
  const button=event.target.closest('[data-theme]');
  if(!button||isSharedHome) return;
  routineTheme=button.dataset.theme;
  persistLocal(ROUTINE_THEME_KEY,routineTheme);
  renderRoutine();
});
function saveRestDay(){
  if(isSharedHome){ showCaptureNotice('공유받은 집이에요','휴식 기록은 내 집에서만 남길 수 있어요.'); return; }
  const today=localDateString();
  if(memories.some(memory=>memory.kind==='rest'&&memoryWeekKey(memory.date)===today)){
    showCaptureNotice('오늘의 휴식을 이미 남겼어요','오늘은 그 자체로 충분히 잘하고 있어요.');
    return;
  }
  const result=recordMemory('오늘은 충분히 쉬었다','rest');
  openGrapeReward(result.memory,result.bunchCompleted);
}
saveRestDayButton.addEventListener('click',saveRestDay);
openWeeklyReflectionButton.addEventListener('click',()=>{ openManager(); setTimeout(()=>weeklyLetter.scrollIntoView({block:'center'}),100); });
soundButton.addEventListener('click',()=>{
  const soundOn=soundButton.getAttribute('aria-pressed')!=='true';
  soundButton.setAttribute('aria-pressed',String(soundOn));
  soundButton.setAttribute('aria-label',soundOn?'소리 끄기':'소리 켜기');
  soundButton.dataset.tooltip=soundOn?'소리 끄기':'소리 켜기';
});
resetHomeButton.addEventListener('click',resetHome);

document.querySelector('#open-manager').addEventListener('click',openManager);
document.querySelector('#close-manager').addEventListener('click',closeManager);
managerBackdrop.addEventListener('click',event=>{ if(event.target===managerBackdrop) closeManager(); });
managerList.addEventListener('click',event=>{
  const edit=event.target.closest('[data-edit-memory]');
  const remove=event.target.closest('[data-delete-memory]');
  if(edit) openMemoryEditor(edit.dataset.editMemory);
  if(remove&&confirm('이 기록과 연결된 장식을 삭제할까요?')) deleteMemory(remove.dataset.deleteMemory);
});
document.querySelector('#save-memory-edit').addEventListener('click',saveMemoryEdit);
document.querySelector('#cancel-memory-edit').addEventListener('click',()=>{ editingMemoryDate=null; managerEditor.hidden=true; });

function openGuide(){ guideBackdrop.classList.add('open'); guideBackdrop.setAttribute('aria-hidden','false'); }
function closeGuide(){ guideBackdrop.classList.remove('open'); guideBackdrop.setAttribute('aria-hidden','true'); persistLocal(GUIDE_SEEN_KEY,'true'); }
document.querySelector('#open-guide').addEventListener('click',openGuide);
document.querySelector('#close-guide').addEventListener('click',closeGuide);
document.querySelector('#finish-guide').addEventListener('click',closeGuide);
guideBackdrop.addEventListener('click',event=>{ if(event.target===guideBackdrop) closeGuide(); });
if(!localStorage.getItem(GUIDE_SEEN_KEY)) setTimeout(openGuide,550);
