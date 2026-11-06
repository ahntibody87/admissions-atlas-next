(() => {
  'use strict';
  const app = document.querySelector('#app');
  const base = 'https://ahntibody87.github.io/admissions-atlas/';
  const views = ['intro', 'home', 'goals', 'archive', 'analysis', 'simulation'];
  const themeNames = {a:'깊이 있는 지도',b:'명료한 리서치',c:'담백한 아틀라스'};
  const initial = new URL(location.href).searchParams.get('theme');
  let theme = Object.hasOwn(themeNames, initial) ? initial : 'a';
  let view = '';
  let entering = false;
  let entryTimer = null;
  let touchStart = null;
  let query = '';
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const atlas = () => `<div class="atlas-art" aria-hidden="true">${window.ATAA_MAP}</div>`;
  const external = (path, text, cls='') => `<a class="${cls}" href="${base}${path}" target="_blank" rel="noopener">${text}</a>`;
  const sections = [
    {id:'goals',no:'01',name:'목표 설계',desc:'현재 성적을 이해하고, 남은 학기의 목표를 세웁니다.',meta:'수시 설계 · 정시 설계'},
    {id:'archive',no:'02',name:'자료 아카이브',desc:'대학별 자료와 권장과목을 한곳에서 찾아봅니다.',meta:'대학별 권장과목'},
    {id:'analysis',no:'03',name:'전형 분석',desc:'대학별 전형 기준과 학년도별 변화를 읽습니다.',meta:'29개 대학 · 2027–2028'},
    {id:'simulation',no:'04',name:'원서 접수<br>시뮬레이션',desc:'여섯 장의 원서, 여러 선택을 비교해 보는 공간.',meta:'준비 중'}
  ];
  function intro() { return `<section class="entrance" aria-labelledby="page-title">${atlas()}<div class="entrance-copy"><p class="eyebrow">AHNTIBODY’S ADMISSIONS ATLAS</p><h1 id="page-title" tabindex="-1">입시를 읽고,<br>나의 길을 그리다.</h1><p class="lead">목표 설계부터 전형 분석까지.<br>나에게 필요한 대입 정보를 연결합니다.</p><button class="entry-action" type="button" id="enter">나의 입시 지도 펼치기 <span class="arrow" aria-hidden="true">↗</span></button></div><span class="entrance-mark" aria-hidden="true">ATAA</span><div class="entrance-foot"><small>네 개의 영역, 하나의 입시 지도.<br>진로 탐색을 표현한 개념 지도입니다.</small><span class="scroll-cue"><i aria-hidden="true"></i>한 번 스크롤하거나 화면을 눌러 시작</span></div></section>`; }
  function home() { return `<div class="page-wrap"><section class="home-intro"><div><p class="eyebrow">YOUR NEXT CHAPTER</p><h1 id="page-title" tabindex="-1">나의 입시,<br>어디부터 살펴볼까요?</h1><p class="lead">현재의 성적에서 앞으로의 선택까지.<br>필요한 정보부터 차근차근 연결해 보세요.</p></div><div class="mini-atlas">${atlas()}<span class="map-caption">ATAA / 나의 입시 지도</span></div></section><section aria-labelledby="menu-title"><div class="section-top"><h2 id="menu-title">입시 탐색의 네 가지 영역</h2><span>원하는 영역에서 시작하세요</span></div><div class="menu-grid">${sections.map(s=>`<a class="menu-card" href="#${s.id}"><span class="index">${s.no}</span><h2>${s.name}</h2><p>${s.desc}</p><span class="card-end"><span${s.id==='simulation'?' class="soon"':''}>${s.meta}</span><b aria-hidden="true">↗</b></span></a>`).join('')}</div></section><section class="updates" aria-labelledby="updates-title"><h2 id="updates-title">최근 반영된 내용</h2><div class="updates-list">${external('grades/#semester','<span>목표 설계 · 10.29</span>학기별 목표 성적 시뮬레이션 ↗')}${external('regular/','<span>목표 설계 · 10.29</span>정시 성적 분석과 목표 설정 ↗')}${external('archive/subjects/','<span>자료 아카이브 · 10.23</span>47개 대학 권장과목 찾기 ↗')}</div></section></div>`; }
  function heading(no, en, title, description, edition='') { return `<nav class="breadcrumb" aria-label="현재 위치"><a href="#home">홈</a><span aria-hidden="true">/</span><span>${title}</span></nav><section class="page-heading"><div><p class="eyebrow">${no} / ${en}</p><h1 id="page-title" tabindex="-1">${title}</h1><p>${description}</p></div>${edition?`<span class="edition">${edition}</span>`:''}</section>`; }
  function analysis() { return `<div class="page-wrap">${heading('03','ADMISSIONS ANALYSIS','전형 분석','대학별 전형 기준과 모집인원, 학년도별 변화를 정리합니다.<br>대학을 선택해 필요한 내용을 확인하세요.','2027 — 2028학년도')}<div class="directory-toolbar"><label class="search-field" for="university-search"><span>대학 찾기</span><input type="search" id="university-search" placeholder="대학 이름을 입력하세요" autocomplete="off" value="${escape(query)}"></label><p class="result-count" id="result-count" role="status" aria-live="polite"></p></div><div class="list-head" aria-hidden="true"><span>대학명</span><span>캠퍼스</span><span>모집단위</span><span>상세 자료</span></div><section id="university-list" aria-label="대학별 전형 분석 목록"></section><div class="data-note"><p>기존 ATAA 공개 자료 기준입니다. 모집단위 수는 제공 자료의 비교 범위이며 대학 전체 학과 수와 다를 수 있습니다. 상세 자료는 현재 운영 사이트에서 새 창으로 열립니다.</p><span>자료 확인 2026.10.22</span></div></div>`; }
  function renderUniversities() {
    const normalize = s => s.replace(/\s/g,'').toLowerCase();
    const found = window.ATAA_UNIVERSITIES.filter(u => normalize(u.name+' '+u.alias).includes(normalize(query)));
    document.querySelector('#result-count').textContent = `${found.length} / ${window.ATAA_UNIVERSITIES.length}개 대학`;
    document.querySelector('#university-list').innerHTML = found.length ? found.map(u=>external(`analysis/${u.slug}/`,`<div class="uni-name"><small>${String(window.ATAA_UNIVERSITIES.indexOf(u)+1).padStart(2,'0')}</small><h2>${escape(u.name)}</h2></div><span class="uni-campus">${escape(u.campus)}</span><span class="uni-count"><strong>${u.count}</strong>개</span><span class="uni-link">기존 자료 <b aria-hidden="true">↗</b></span>`,'university-row')).join('') : '<p class="empty-result">검색 결과가 없습니다. 대학 이름을 다시 확인해 주세요.</p>';
  }
  function goals() { return `<div class="page-wrap">${heading('01','GOAL PLANNING','목표 설계','지금의 성적을 이해하고, 다음 학기의 목표를 세웁니다.')}<section class="tool-list" aria-label="목표 설계 도구">${external('grades/','<p class="eyebrow">EARLY ADMISSION</p><h2>수시 설계</h2><p>내신 환산 분석기 · 목표 성적 시뮬레이션 · 내신 비교표.<br>남은 학기에 필요한 성적을 함께 살펴봅니다.</p><span>현재 운영 중인 도구 열기 ↗</span>','tool-card')}${external('regular/','<p class="eyebrow">REGULAR ADMISSION</p><h2>정시 설계</h2><p>점수와 틀린 개수에서 출발해,<br>몇 문제를 더 맞혔을 때의 변화를 확인합니다.</p><span>현재 운영 중인 도구 열기 ↗</span>','tool-card')}</section></div>`; }
  function archive() { return `<div class="page-wrap">${heading('02','RESOURCE ARCHIVE','자료 아카이브','출처와 학년도를 확인하고, 나에게 필요한 자료를 찾습니다.')}<section class="tool-list" aria-label="공개 자료">${external('archive/subjects/','<p class="eyebrow">2028 / SUBJECT GUIDE</p><h2>대학별 권장과목 찾기</h2><p>47개 대학의 모집단위별 핵심·권장과목을<br>검색하고 비교합니다.</p><span>현재 운영 중인 자료 열기 ↗</span>','tool-card')}</section></div>`; }
  function simulation() { return `<div class="page-wrap">${heading('04','APPLICATION SIMULATION','원서 접수 시뮬레이션','나의 지원 선택을 한눈에 펼쳐 보고 비교하는 공간.')}<section class="simulation-empty"><div><span class="soon">준비 중</span><h2>여섯 장의 원서,<br>충분히 고민할 수 있도록.</h2><p>수시 등급컷과 정시 배치표 등을 참고해<br>지원 조합을 직접 비교하는 기능을 준비하고 있습니다.<br>아직 원서 입력과 합격 가능성 계산은 제공하지 않습니다.</p><a class="simple-link" href="#analysis">먼저 대학별 전형 살펴보기 →</a></div><div class="application-slots" aria-label="향후 수시 지원 여섯 개 선택을 표시할 자리">${[1,2,3,4,5,6].map(n=>`<span>0${n}</span>`).join('')}</div></section></div>`; }
  const renderers={intro,home,analysis,goals,archive,simulation};
  function render(shouldFocus=true) {
    clearTimeout(entryTimer);
    entering=false;
    document.body.classList.remove('entering');
    const hash=location.hash.slice(1);
    view=views.includes(hash)?hash:'intro';
    document.body.dataset.view=view;
    document.body.dataset.theme=theme;
    app.innerHTML=renderers[view]();
    document.title=`ATAA · ${theme.toUpperCase()} ${themeNames[theme]} — ${view==='intro'?'입장':view==='home'?'메인':sections.find(s=>s.id===view).name.replace('<br>',' ')}`;
    document.querySelectorAll('[data-theme-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.themeChoice===theme)));
    document.querySelectorAll('#site-nav a').forEach(a=>{a.removeAttribute('aria-current');if(a.hash===`#${view}`)a.setAttribute('aria-current','page');});
    document.querySelectorAll('[data-preview]').forEach(a=>{a.removeAttribute('aria-current');if(a.dataset.preview===view)a.setAttribute('aria-current','page');});
    document.querySelector('#site-nav').classList.remove('open');
    document.querySelector('.menu-toggle').setAttribute('aria-expanded','false');
    if(view==='analysis') { renderUniversities(); document.querySelector('#university-search').addEventListener('input',e=>{query=e.target.value;renderUniversities();}); }
    if(view==='intro') { document.querySelector('.entrance').addEventListener('click',enter); }
    window.scrollTo({top:0,behavior:'instant'});
    if(shouldFocus)document.querySelector('#page-title').focus({preventScroll:true});
  }
  function enter() {
    if(view!=='intro'||entering||document.querySelector('dialog[open]')||document.querySelector('#site-nav.open'))return;
    entering=true;
    document.body.classList.add('entering');
    entryTimer=setTimeout(()=>{location.hash='home';},matchMedia('(prefers-reduced-motion: reduce)').matches?0:450);
  }
  document.querySelectorAll('[data-theme-choice]').forEach(b=>b.addEventListener('click',()=>{
    theme=b.dataset.themeChoice;
    const url=new URL(location.href);url.searchParams.set('theme',theme);
    history.replaceState(null,'',url);
    render(false);
  }));
  document.querySelector('.menu-toggle').addEventListener('click',e=>{
    const open=document.querySelector('#site-nav').classList.toggle('open');
    e.currentTarget.setAttribute('aria-expanded',String(open));
  });
  const dialog=document.querySelector('#review-dialog');
  document.querySelector('.skip').addEventListener('click',e=>{e.preventDefault();document.querySelector('#page-title').focus();});
  document.querySelector('#review-help').addEventListener('click',()=>dialog.showModal());
  window.addEventListener('hashchange',()=>render());
  window.addEventListener('popstate',()=>{const next=new URL(location.href).searchParams.get('theme');theme=Object.hasOwn(themeNames,next)?next:'a';render();});
  window.addEventListener('wheel',e=>{
    if(view==='intro'&&!dialog.open&&!document.querySelector('#site-nav.open')&&!e.ctrlKey&&e.deltaY>0) {
      if(e.target.closest('.review-bar,.preview-nav,.site-header'))return;
      e.preventDefault();enter();
    } else if(entering) e.preventDefault();
  },{passive:false});
  app.addEventListener('touchstart',e=>{touchStart=e.touches[0]?.clientY??null;},{passive:true});
  app.addEventListener('touchend',e=>{
    if(view==='intro'&&touchStart!==null&&touchStart-(e.changedTouches[0]?.clientY??touchStart)>25)enter();
    touchStart=null;
  },{passive:true});
  window.addEventListener('keydown',e=>{
    if(view==='intro'&&['ArrowDown','PageDown',' '].includes(e.key)&&!dialog.open&&!e.target.closest('button,a,input,select,textarea')) {e.preventDefault();enter();}
    if(e.key==='Escape'){document.querySelector('#site-nav').classList.remove('open');document.querySelector('.menu-toggle').setAttribute('aria-expanded','false');}
  });
  render(false);
})();
