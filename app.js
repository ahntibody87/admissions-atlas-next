(() => {
  'use strict';
  const app = document.querySelector('#app');
  const base = 'https://ahntibody87.github.io/admissions-atlas/';
  const views = ['intro','home','goals','archive','analysis','simulation'];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let view = '', entering = false, entryTimer = null, touchStart = null, query = '';
  let manuallyPaused = false;
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const external = (path, text, cls='') => `<a class="${cls}" href="${base}${path}" target="_blank" rel="noopener">${text}</a>`;
  const sections = [
    {id:'goals',no:'01',name:'목표 설계',desc:'현재 내신과 수능 성적의 위치를 토대로 목표와 준비 방향을 설정할 수 있습니다.',meta:'수시 설계 · 정시 설계'},
    {id:'archive',no:'02',name:'입시 자료',desc:'공개된 중요 입시 정보와 데이터를 주제별로 한 번에 찾아볼 수 있습니다.',meta:'대학별 권장과목 등'},
    {id:'analysis',no:'03',name:'전형 분석',desc:'대학별 전형 기준과 학년도별 변화를 확인합니다.',meta:'29개 대학'},
    {id:'simulation',no:'04',name:'원서 접수 시뮬레이션',desc:'지원 조합을 비교하는 기능을 준비하고 있습니다.',meta:'준비 중'}
  ];
  const brand = () => '<img src="assets/compass.svg" alt="" width="40" height="40"><span>ATAA</span>';
  function intro() { return `<section class="entrance" aria-labelledby="page-title">
    <div class="entrance-top"><a class="brand" href="#intro" aria-label="ATAA 입장 화면">${brand()}</a><span>AHNTIBODY'S ADMISSIONS ATLAS</span></div>
    <button class="entry-surface" id="enter" type="button" aria-label="캠퍼스 영상 전체 화면으로 보기">
      <span class="video-window"><img class="campus-poster" src="assets/campus.jpg" alt="" fetchpriority="high"><video id="campus-video" muted loop playsinline preload="metadata" poster="assets/campus.jpg" aria-hidden="true"><source src="assets/campus.mp4" type="video/mp4"></video>
      <span class="entrance-copy"><span class="intro-label">맞춤형 대입 준비 나침반</span><span class="intro-title" id="page-title" role="heading" aria-level="1" tabindex="-1">ATAA</span><span class="enter-label">입장하기 <span aria-hidden="true">↗</span></span></span></span>
    </button>
    <button class="video-control" id="video-toggle" type="button" aria-controls="campus-video" aria-label="영상 재생"><span aria-hidden="true">▶</span></button>
    <div class="entrance-bottom"><button class="scroll-entry" id="scroll-entry" type="button">한 번 스크롤하거나 눌러서 입장 <span aria-hidden="true">↓</span></button><button id="about-button" type="button" aria-haspopup="dialog">플랫폼 소개 <span aria-hidden="true">＋</span></button></div>
    <p class="media-status" id="media-status" role="status"></p>
  </section><section id="home-panel" class="home-panel" aria-label="입시 메뉴 홈" hidden inert>${home(true)}</section>`; }
  function home(embedded=false) { return `<div class="page-wrap home-layout"><section class="home-intro"><p class="eyebrow">대입 나침반</p><h1 id="${embedded?'home-title':'page-title'}" tabindex="-1">필요한 입시 정보를<br>한곳에서 확인하세요.</h1><p class="lead">성적 분석과 목표 설정, 대학별 자료와 전형 비교.</p></section><section aria-labelledby="menu-title"><div class="section-top"><h2 id="menu-title">CONTENTS</h2><span>원하는 항목을 선택하세요</span></div><div class="menu-grid">${sections.map(s=>`<a class="menu-card" href="#${s.id}"><span class="index">${s.no}</span><h2>${s.name}</h2><p>${s.desc}</p><span class="card-end"><span${s.id==='simulation'?' class="soon"':''}>${s.meta}</span><b aria-hidden="true">↗</b></span></a>`).join('')}</div></section><section class="updates" aria-labelledby="updates-title"><h2 id="updates-title">최근 반영</h2><div class="updates-list">${external('grades/#semester','<span><time datetime="2026-10-29">2026.10.29</time></span>학기별 목표 성적 시뮬레이션 개편 ↗')}${external('regular/','<span><time datetime="2026-10-23">2026.10.23</time></span>정시 성적 분석과 목표 설정 추가 ↗')}${external('archive/subjects/','<span><time datetime="2026-10-23">2026.10.23</time></span>47개 대학 권장과목 찾기 추가 ↗')}</div></section><p class="home-note">자료와 계산 도구는 기존 ATAA에서 새 창으로 열립니다.</p></div>`; }

  function heading(no, en, title, description, edition='') { return `<nav class="breadcrumb" aria-label="현재 위치"><a href="#home">홈</a><span aria-hidden="true">/</span><span>${title}</span></nav><section class="page-heading"><div><p class="eyebrow">${no}</p><h1 id="page-title" tabindex="-1">${title}</h1><p>${description}</p></div>${edition?`<span class="edition">${edition}</span>`:''}</section>`; }
  function analysis() { return `<div class="page-wrap">${heading('03','ADMISSIONS ANALYSIS','전형 분석','대학별 전형 기준과 모집인원, 학년도별 변화를 정리합니다.<br>대학을 선택해 필요한 내용을 확인하세요.','2027 — 2028학년도')}<div class="directory-toolbar"><label class="search-field" for="university-search"><span>대학 찾기</span><input type="search" id="university-search" placeholder="대학 이름을 입력하세요" autocomplete="off" value="${escape(query)}"></label><p class="result-count" id="result-count" role="status" aria-live="polite"></p></div><div class="list-head" aria-hidden="true"><span>대학명</span><span>캠퍼스</span><span>모집단위</span><span>상세 자료</span></div><section id="university-list" aria-label="대학별 전형 분석 목록"></section><div class="data-note"><p>기존 ATAA 공개 자료 기준입니다. 모집단위 수는 제공 자료의 비교 범위이며 대학 전체 학과 수와 다를 수 있습니다. 상세 자료는 현재 운영 사이트에서 새 창으로 열립니다.</p><span>자료 확인 2026.10.22</span></div></div>`; }
  function renderUniversities() {
    const normalize = s => s.replace(/\s/g,'').toLowerCase();
    const found = window.ATAA_UNIVERSITIES.filter(u => normalize(u.name+' '+u.alias).includes(normalize(query)));
    document.querySelector('#result-count').textContent = `${found.length} / ${window.ATAA_UNIVERSITIES.length}개 대학`;
    document.querySelector('#university-list').innerHTML = found.length ? found.map(u=>external(`analysis/${u.slug}/`,`<div class="uni-name"><small>${String(window.ATAA_UNIVERSITIES.indexOf(u)+1).padStart(2,'0')}</small><h2>${escape(u.name)}</h2></div><span class="uni-campus">${escape(u.campus)}</span><span class="uni-count"><strong>${u.count}</strong>개</span><span class="uni-link">기존 자료 <b aria-hidden="true">↗</b></span>`,'university-row')).join('') : '<p class="empty-result">검색 결과가 없습니다. 대학 이름을 다시 확인해 주세요.</p>';
  }
  function goals() { return `<div class="page-wrap">${heading('01','GOAL PLANNING','목표 설계','지금의 성적을 이해하고, 다음 학기의 목표를 세웁니다.')}<section class="tool-list" aria-label="목표 설계 도구">${external('grades/','<p class="eyebrow">내신 성적</p><h2>수시 설계</h2><p>내신 환산 분석기 · 목표 성적 시뮬레이션 · 내신 비교표.<br>남은 학기에 필요한 성적을 함께 살펴봅니다.</p><span>현재 운영 중인 도구 열기 ↗</span>','tool-card')}${external('regular/','<p class="eyebrow">수능 성적</p><h2>정시 설계</h2><p>점수와 틀린 개수에서 출발해,<br>몇 문제를 더 맞혔을 때의 변화를 확인합니다.</p><span>현재 운영 중인 도구 열기 ↗</span>','tool-card')}</section></div>`; }
  function archive() { return `<div class="page-wrap">${heading('02','RESOURCE ARCHIVE','입시 자료','출처와 학년도를 확인하고, 나에게 필요한 자료를 찾습니다.')}<section class="tool-list" aria-label="공개 자료">${external('archive/subjects/','<p class="eyebrow">2028학년도</p><h2>대학별 권장과목 찾기</h2><p>47개 대학의 모집단위별 핵심·권장과목을<br>검색하고 비교합니다.</p><span>현재 운영 중인 자료 열기 ↗</span>','tool-card')}</section></div>`; }
  function simulation() { return `<div class="page-wrap">${heading('04','APPLICATION SIMULATION','원서 접수 시뮬레이션','지원 조합을 비교하는 기능을 준비하고 있습니다.')}<section class="simulation-empty"><div><span class="soon">준비 중</span><h2>원서 접수 시뮬레이션</h2><p>수시 등급컷과 정시 배치표 등을 참고해<br>지원 조합을 직접 비교하는 기능을 준비하고 있습니다.<br>아직 원서 입력과 합격 가능성 계산은 제공하지 않습니다.</p><a class="simple-link" href="#analysis">먼저 대학별 전형 살펴보기 →</a></div></section></div>`; }

  const renderers={intro,home,analysis,goals,archive,simulation};
  const header=document.querySelector('.site-header');
  const dialog=document.querySelector('#about-dialog');
  let stage='portrait', readyAt=0, finishExpansion=null, touchConsumed=false, scrollLockUntil=0;
  function closeMenu() {
    document.querySelector('#site-nav').classList.remove('open');
    document.querySelector('.menu-toggle').setAttribute('aria-expanded','false');
  }
  function syncNavigation() {
    const landing=document.querySelector('.entrance');
    if(landing&&stage==='home'&&Math.abs(window.scrollY-document.querySelector('#home-panel').offsetTop)<1)scrollLockUntil=0;
    const progress=landing?Math.max(0,Math.min(1,(window.scrollY/landing.offsetHeight-.12)/.5)):1;
    header.style.setProperty('--nav-opacity',progress);
    header.inert=progress<.85;
    document.querySelectorAll('#site-nav a').forEach(a=>{a.removeAttribute('aria-current');if(a.hash===`#${view}`)a.setAttribute('aria-current','page');});
  }
  function render(shouldFocus=true) {
    clearTimeout(entryTimer);finishExpansion=null;entering=false;touchStart=null;touchConsumed=false;scrollLockUntil=0;
    document.querySelector('video')?.pause();
    document.body.classList.remove('entering','expanded','landing-ready');
    const hash=location.hash.slice(1);view=views.includes(hash)?hash:'intro';
    stage=view==='intro'?'portrait':'home';
    document.body.dataset.view=view;document.body.dataset.stage=stage;
    document.body.classList.toggle('landing-session',view==='intro');
    app.innerHTML=renderers[view]();
    document.title=`ATAA · ${view==='intro'?'입장':view==='home'?'대입 나침반':sections.find(s=>s.id===view).name}`;
    closeMenu();
    if(view==='analysis') {renderUniversities();document.querySelector('#university-search').addEventListener('input',e=>{query=e.target.value;renderUniversities();});}
    if(view==='intro') {
      document.querySelector('#enter').addEventListener('click',()=>stage==='expanded'||stage==='home'?goHome():enter());
      document.querySelector('#scroll-entry').addEventListener('click',()=>stage==='expanded'||stage==='home'?goHome():enter());
      document.querySelector('#about-button').addEventListener('click',()=>dialog.showModal());
      setupVideo();
    }
    window.scrollTo({top:0,behavior:'instant'});syncNavigation();
    if(shouldFocus)document.querySelector('#page-title').focus({preventScroll:true});
  }
  function setupVideo() {
    const video=document.querySelector('#campus-video'),toggle=document.querySelector('#video-toggle'),status=document.querySelector('#media-status');
    const sync=()=>{const name=video.paused?'영상 재생':'영상 일시정지';toggle.setAttribute('aria-label',name);toggle.title=name;toggle.innerHTML=`<span aria-hidden="true">${video.paused?'▶':'Ⅱ'}</span>`;};
    const play=()=>video.play().then(()=>{status.textContent='';}).catch(()=>{if(!video.hidden)status.textContent='표지로 보고 있습니다. 재생 버튼을 누르거나 그대로 입장할 수 있습니다.';sync();});
    video.addEventListener('play',sync);video.addEventListener('pause',sync);
    const failed=()=>{video.hidden=true;toggle.disabled=true;toggle.setAttribute('aria-label','영상 재생 불가');status.textContent='영상을 불러오지 못했습니다. 표지를 눌러 입장할 수 있습니다.';};
    video.addEventListener('error',failed);video.querySelector('source').addEventListener('error',failed);
    video.addEventListener('loadeddata',()=>video.classList.add('ready'));
    toggle.addEventListener('click',()=>{if(video.paused){manuallyPaused=false;play();}else{manuallyPaused=true;video.pause();}});
    if(!motion.matches&&!manuallyPaused)play();else sync();
  }
  function enter() {
    if(stage!=='portrait'||entering||dialog.open)return;
    entering=true;stage='expanding';document.body.dataset.stage=stage;
    const frame=document.querySelector('.video-window');frame.getBoundingClientRect();
    document.body.classList.add('entering');
    const finish=()=>{
      if(stage!=='expanding')return;
      clearTimeout(entryTimer);finishExpansion=null;entering=false;stage='expanded';readyAt=performance.now()+450;
      document.body.dataset.stage=stage;document.body.classList.add('expanded','landing-ready');
      const panel=document.querySelector('#home-panel');panel.hidden=false;panel.inert=false;
      document.querySelector('#enter').setAttribute('aria-label','입시 메뉴로 이동');
      document.querySelector('#scroll-entry').innerHTML='아래로 스크롤해 메뉴 보기 <span aria-hidden="true">↓</span>';
    };
    finishExpansion=finish;
    if(motion.matches){finish();return;}
    const onEnd=e=>{if(e.target===frame&&e.propertyName==='width'){frame.removeEventListener('transitionend',onEnd);finish();}};
    frame.addEventListener('transitionend',onEnd);
    entryTimer=setTimeout(()=>{frame.removeEventListener('transitionend',onEnd);finish();},1400);
  }
  function goHome() {
    if((stage!=='expanded'&&!(stage==='home'&&document.querySelector('.entrance')))||dialog.open)return;
    stage='home';view='home';document.body.dataset.stage=stage;document.body.dataset.view='home';
    document.title='ATAA · 대입 나침반';scrollLockUntil=motion.matches?0:performance.now()+900;
    // Preserve the exact video element and its playback position while scrolling.
    history.replaceState(null,'','#home');
    const panel=document.querySelector('#home-panel');
    window.scrollTo({top:panel.offsetTop,behavior:motion.matches?'instant':'smooth'});
    document.querySelector('#home-title').focus({preventScroll:true});
  }
  document.querySelector('.menu-toggle').addEventListener('click',e=>{const open=document.querySelector('#site-nav').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',String(open));});
  document.querySelector('.skip').addEventListener('click',e=>{e.preventDefault();if(stage==='expanded')goHome();else(document.querySelector('#home-title')||document.querySelector('#page-title')).focus();});
  window.addEventListener('hashchange',()=>{
    if(location.hash==='#home'&&document.querySelector('.entrance')&&stage==='expanded')goHome();
    else render();
  });
  window.addEventListener('scroll',syncNavigation,{passive:true});
  window.addEventListener('resize',syncNavigation,{passive:true});
  window.addEventListener('wheel',e=>{
    if(dialog.open||e.ctrlKey||e.deltaY<=0)return;
    if(stage==='home'&&performance.now()<scrollLockUntil){e.preventDefault();return;}
    if(stage==='portrait'||stage==='expanding'){e.preventDefault();enter();return;}
    if(stage==='expanded'){
      e.preventDefault();const now=performance.now();
      // Inertial events from the first gesture must not trigger the second step.
      if(now<readyAt){readyAt=Math.max(readyAt,now+180);return;}
      goHome();
    }
  },{passive:false});
  app.addEventListener('touchstart',e=>{touchConsumed=false;touchStart=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});
  app.addEventListener('touchmove',e=>{
    if(touchConsumed){e.preventDefault();return;}
    if(dialog.open||!touchStart||e.touches.length!==1||!['portrait','expanding','expanded'].includes(stage))return;
    const dy=touchStart.y-e.touches[0].clientY,dx=touchStart.x-e.touches[0].clientX;
    if(dy>25&&dy>Math.abs(dx)){e.preventDefault();const current=stage;touchStart=null;touchConsumed=true;if(current==='expanded')goHome();else enter();}
  },{passive:false});
  for(const type of ['touchend','touchcancel'])app.addEventListener(type,()=>{touchStart=null;touchConsumed=false;},{passive:true});
  window.addEventListener('keydown',e=>{
    if(e.key==='Escape')closeMenu();
    if(dialog.open)return;
    if(['ArrowDown','PageDown',' ','Enter'].includes(e.key)&&(!e.target.closest('button,a,input,select,textarea')||e.target.id==='page-title'||e.target.id==='enter')){
      if(stage==='portrait'||stage==='expanding'){e.preventDefault();enter();}
      else if(stage==='expanded'){e.preventDefault();goHome();}
    }
  });
  document.addEventListener('visibilitychange',()=>{const video=document.querySelector('video');if(!video)return;if(document.hidden)video.pause();else if(!motion.matches&&!manuallyPaused)video.play().catch(()=>{});});
  motion.addEventListener('change',()=>{if(motion.matches){document.querySelector('video')?.pause();finishExpansion?.();}});
  render(false);
})();
