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
    {id:'goals',no:'01',name:'성적·목표 설계',desc:'내신과 수능 성적을 살펴보고 목표를 세웁니다.',meta:'수시 설계 · 정시 설계'},
    {id:'archive',no:'02',name:'입시 자료',desc:'대학별 핵심·권장과목 자료를 찾아봅니다.',meta:'대학별 권장과목'},
    {id:'analysis',no:'03',name:'전형 분석',desc:'대학별 전형 기준과 학년도별 변화를 확인합니다.',meta:'2027–2028학년도'},
    {id:'simulation',no:'04',name:'원서 접수 시뮬레이션',desc:'지원 조합을 비교하는 기능을 준비하고 있습니다.',meta:'준비 중'}
  ];
  function intro() { return `<section class="entrance" aria-labelledby="page-title">
    <div class="entrance-top"><a class="brand" href="#home" aria-label="ATAA 메인">ATAA<span>입시 정보</span></a><span>성적·목표 설계부터 전형 분석까지</span></div>
    <button class="entry-surface" id="enter" type="button" aria-label="ATAA 입장 — 캠퍼스 영상 확대 후 메뉴 열기">
      <span class="video-window"><img class="campus-poster" src="assets/campus.jpg" alt="" fetchpriority="high"><video id="campus-video" muted loop playsinline preload="metadata" poster="assets/campus.jpg" aria-hidden="true"><source src="assets/campus.mp4" type="video/mp4"></video></span>
      <span class="entrance-copy"><span class="intro-label">대입 준비를 위한 정보와 도구</span><span class="intro-title" id="page-title" role="heading" aria-level="1" tabindex="-1">ATAA</span><span class="enter-label">입장하기 <span aria-hidden="true">↗</span></span></span>
    </button>
    <div class="entrance-bottom"><span>한 번 스크롤하거나 눌러서 입장 <span aria-hidden="true">↓</span></span><button id="video-toggle" type="button" aria-controls="campus-video">영상 재생</button></div>
    <p class="media-status" id="media-status" role="status"></p>
  </section>`; }
  function home() { return `<div class="page-wrap"><section class="home-intro"><p class="eyebrow">대입 준비</p><h1 id="page-title" tabindex="-1">필요한 입시 정보를<br>한곳에서 확인하세요.</h1><p class="lead">성적 분석과 목표 설정, 대학별 자료와 전형 비교.</p></section><section aria-labelledby="menu-title"><div class="section-top"><h2 id="menu-title">입시 메뉴</h2><span>원하는 항목을 선택하세요</span></div><div class="menu-grid">${sections.map(s=>`<a class="menu-card" href="#${s.id}"><span class="index">${s.no}</span><h2>${s.name}</h2><p>${s.desc}</p><span class="card-end"><span${s.id==='simulation'?' class="soon"':''}>${s.meta}</span><b aria-hidden="true">↗</b></span></a>`).join('')}</div></section><section class="updates" aria-labelledby="updates-title"><h2 id="updates-title">바로 가기</h2><div class="updates-list">${external('grades/#semester','<span>성적·목표 설계</span>학기별 목표 성적 시뮬레이션 ↗')}${external('regular/','<span>성적·목표 설계</span>정시 성적 분석과 목표 설정 ↗')}${external('archive/subjects/','<span>입시 자료</span>대학별 권장과목 찾기 ↗')}</div></section><p class="home-note">자료와 계산 도구는 기존 ATAA에서 새 창으로 열립니다.</p></div>`; }

  function heading(no, en, title, description, edition='') { return `<nav class="breadcrumb" aria-label="현재 위치"><a href="#home">홈</a><span aria-hidden="true">/</span><span>${title}</span></nav><section class="page-heading"><div><p class="eyebrow">${no}</p><h1 id="page-title" tabindex="-1">${title}</h1><p>${description}</p></div>${edition?`<span class="edition">${edition}</span>`:''}</section>`; }
  function analysis() { return `<div class="page-wrap">${heading('03','ADMISSIONS ANALYSIS','전형 분석','대학별 전형 기준과 모집인원, 학년도별 변화를 정리합니다.<br>대학을 선택해 필요한 내용을 확인하세요.','2027 — 2028학년도')}<div class="directory-toolbar"><label class="search-field" for="university-search"><span>대학 찾기</span><input type="search" id="university-search" placeholder="대학 이름을 입력하세요" autocomplete="off" value="${escape(query)}"></label><p class="result-count" id="result-count" role="status" aria-live="polite"></p></div><div class="list-head" aria-hidden="true"><span>대학명</span><span>캠퍼스</span><span>모집단위</span><span>상세 자료</span></div><section id="university-list" aria-label="대학별 전형 분석 목록"></section><div class="data-note"><p>기존 ATAA 공개 자료 기준입니다. 모집단위 수는 제공 자료의 비교 범위이며 대학 전체 학과 수와 다를 수 있습니다. 상세 자료는 현재 운영 사이트에서 새 창으로 열립니다.</p><span>자료 확인 2026.10.22</span></div></div>`; }
  function renderUniversities() {
    const normalize = s => s.replace(/\s/g,'').toLowerCase();
    const found = window.ATAA_UNIVERSITIES.filter(u => normalize(u.name+' '+u.alias).includes(normalize(query)));
    document.querySelector('#result-count').textContent = `${found.length} / ${window.ATAA_UNIVERSITIES.length}개 대학`;
    document.querySelector('#university-list').innerHTML = found.length ? found.map(u=>external(`analysis/${u.slug}/`,`<div class="uni-name"><small>${String(window.ATAA_UNIVERSITIES.indexOf(u)+1).padStart(2,'0')}</small><h2>${escape(u.name)}</h2></div><span class="uni-campus">${escape(u.campus)}</span><span class="uni-count"><strong>${u.count}</strong>개</span><span class="uni-link">기존 자료 <b aria-hidden="true">↗</b></span>`,'university-row')).join('') : '<p class="empty-result">검색 결과가 없습니다. 대학 이름을 다시 확인해 주세요.</p>';
  }
  function goals() { return `<div class="page-wrap">${heading('01','GOAL PLANNING','성적·목표 설계','지금의 성적을 이해하고, 다음 학기의 목표를 세웁니다.')}<section class="tool-list" aria-label="성적·목표 설계 도구">${external('grades/','<p class="eyebrow">내신 성적</p><h2>수시 설계</h2><p>내신 환산 분석기 · 목표 성적 시뮬레이션 · 내신 비교표.<br>남은 학기에 필요한 성적을 함께 살펴봅니다.</p><span>현재 운영 중인 도구 열기 ↗</span>','tool-card')}${external('regular/','<p class="eyebrow">수능 성적</p><h2>정시 설계</h2><p>점수와 틀린 개수에서 출발해,<br>몇 문제를 더 맞혔을 때의 변화를 확인합니다.</p><span>현재 운영 중인 도구 열기 ↗</span>','tool-card')}</section></div>`; }
  function archive() { return `<div class="page-wrap">${heading('02','RESOURCE ARCHIVE','입시 자료','출처와 학년도를 확인하고, 나에게 필요한 자료를 찾습니다.')}<section class="tool-list" aria-label="공개 자료">${external('archive/subjects/','<p class="eyebrow">2028학년도</p><h2>대학별 권장과목 찾기</h2><p>47개 대학의 모집단위별 핵심·권장과목을<br>검색하고 비교합니다.</p><span>현재 운영 중인 자료 열기 ↗</span>','tool-card')}</section></div>`; }
  function simulation() { return `<div class="page-wrap">${heading('04','APPLICATION SIMULATION','원서 접수 시뮬레이션','지원 조합을 비교하는 기능을 준비하고 있습니다.')}<section class="simulation-empty"><div><span class="soon">준비 중</span><h2>원서 접수 시뮬레이션</h2><p>수시 등급컷과 정시 배치표 등을 참고해<br>지원 조합을 직접 비교하는 기능을 준비하고 있습니다.<br>아직 원서 입력과 합격 가능성 계산은 제공하지 않습니다.</p><a class="simple-link" href="#analysis">먼저 대학별 전형 살펴보기 →</a></div></section></div>`; }

  const renderers={intro,home,analysis,goals,archive,simulation};
  function closeMenu() {
    document.querySelector('#site-nav').classList.remove('open');
    document.querySelector('.menu-toggle').setAttribute('aria-expanded','false');
  }
  function render(shouldFocus=true) {
    clearTimeout(entryTimer); entering=false; touchStart=null;
    document.querySelector('video')?.pause();
    document.body.classList.remove('entering');
    const hash=location.hash.slice(1); view=views.includes(hash)?hash:'intro';
    document.body.dataset.view=view;
    app.innerHTML=renderers[view]();
    document.title=`ATAA · ${view==='intro'?'입장':view==='home'?'입시 정보':sections.find(s=>s.id===view).name}`;
    document.querySelectorAll('#site-nav a').forEach(a=>{a.removeAttribute('aria-current');if(a.hash===`#${view}`)a.setAttribute('aria-current','page');});
    closeMenu();
    if(view==='analysis') { renderUniversities(); document.querySelector('#university-search').addEventListener('input',e=>{query=e.target.value;renderUniversities();}); }
    if(view==='intro') {
      document.querySelector('#enter').addEventListener('click',enter);
      setupVideo();
    }
    window.scrollTo({top:0,behavior:'instant'});
    if(shouldFocus)document.querySelector('#page-title').focus({preventScroll:true});
  }
  function setupVideo() {
    const video=document.querySelector('#campus-video');
    const toggle=document.querySelector('#video-toggle');
    const status=document.querySelector('#media-status');
    const sync=()=>{toggle.textContent=video.paused?'영상 재생':'영상 일시정지';};
    const play=()=>video.play().then(()=>{status.textContent='';}).catch(()=>{status.textContent='표지로 보고 있습니다. 영상 재생 또는 입장하기를 눌러 주세요.';sync();});
    video.addEventListener('play',sync);video.addEventListener('pause',sync);
    const failed=()=>{video.hidden=true;toggle.disabled=true;status.textContent='영상을 불러오지 못했습니다. 표지를 눌러 입장할 수 있습니다.';};
    video.addEventListener('error',failed);video.querySelector('source').addEventListener('error',failed);
    video.addEventListener('loadeddata',()=>video.classList.add('ready'));
    toggle.addEventListener('click',()=>{if(video.paused){manuallyPaused=false;play();}else{manuallyPaused=true;video.pause();}});
    if(!motion.matches&&!manuallyPaused)play();
    else sync();
  }
  function enter() {
    if(view!=='intro'||entering)return;
    entering=true;
    // Establish the portrait frame before applying its expanded state.
    document.querySelector('.video-window').getBoundingClientRect();
    closeMenu();
    document.body.classList.add('entering');
    const finish=()=>{if(view!=='intro'||!entering)return;location.hash='home';};
    if(motion.matches){entryTimer=setTimeout(finish,0);return;}
    // Wait for the window itself to fill the viewport, then hold the full frame.
    const frame=document.querySelector('.video-window');
    const onEnd=e=>{if(e.target===frame&&e.propertyName==='width'){frame.removeEventListener('transitionend',onEnd);clearTimeout(entryTimer);entryTimer=setTimeout(finish,240);}};
    frame.addEventListener('transitionend',onEnd);
    entryTimer=setTimeout(finish,1500); // Background tabs or cancelled transition events.
  }
  document.querySelector('.menu-toggle').addEventListener('click',e=>{
    const open=document.querySelector('#site-nav').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',String(open));
  });
  document.querySelector('.skip').addEventListener('click',e=>{e.preventDefault();document.querySelector('#page-title').focus();});
  window.addEventListener('hashchange',()=>render());
  window.addEventListener('wheel',e=>{
    if(view==='intro'&&!e.ctrlKey&&e.deltaY>0){e.preventDefault();enter();}
  },{passive:false});
  app.addEventListener('touchstart',e=>{touchStart=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});
  app.addEventListener('touchmove',e=>{if(view==='intro'&&touchStart&&e.touches.length===1){const dy=touchStart.y-e.touches[0].clientY,dx=touchStart.x-e.touches[0].clientX;if(dy>25&&dy>Math.abs(dx)){e.preventDefault();enter();}}},{passive:false});
  app.addEventListener('touchend',()=>{touchStart=null;},{passive:true});
  app.addEventListener('touchcancel',()=>{touchStart=null;},{passive:true});
  window.addEventListener('keydown',e=>{
    if(view==='intro'&&['ArrowDown','PageDown',' ','Enter'].includes(e.key)&&(!e.target.closest('button,a,input,select,textarea')||e.target.id==='page-title')){e.preventDefault();enter();}
    if(e.key==='Escape')closeMenu();
  });
  document.addEventListener('visibilitychange',()=>{const video=document.querySelector('video');if(!video)return;if(document.hidden)video.pause();else if(!motion.matches&&!manuallyPaused)video.play().catch(()=>{});});
  motion.addEventListener('change',()=>{if(motion.matches)document.querySelector('video')?.pause();});
  render(false);
})();
