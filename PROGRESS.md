# Recovery log · 2026-11-08

- Target only: ahntibody87/admissions-atlas-next. Existing production repositories untouched.
- Current task directory started empty. Found OneDrive/문서/ChatGPT/ATAA/admissions-atlas-next and copied it including Git to work/recovered-local without changing its source.
- Recovered local HEAD = remote HEAD = 3e124e2, clean working tree. Commit 41f6fd1 is absent from local objects and remote GitHub commit endpoint. No campus assets in available original.
- Previous chat 깃허브 사이트 수정 aanvragen was read via read_thread; it reports systemError and only 5 conversational turns, without later tool/file output. Cloud /workspace/scratch path is not mounted here. Later uncommitted files cannot currently be recovered.
- Reimplementation proceeds in work/remote-baseline, a separate full Git clone. Baseline actual university data and font retained.
- Reference opened in browser; observed central portrait media expanding into wide frame on one scroll.
- Replacement source: Pexels 29418761, Usman AbdulrasheedGambo. Source and license checked; no reference-site media copied.

## 구현 및 로컬 검증

- 지도·시안 비교 UI 제거, 확정된 네 메뉴와 흰색·파랑 내부 화면 구현. 04 준비 중 유지.
- 캠퍼스 실사 영상: 12초, 1600×900, 24fps, H.264, 약 3.1MB. 표지 및 이용 조건 기록.
- PC 1280×720 브라우저: 재생·일시정지, 한 번 스크롤·클릭, 세로 창 → 실제 전체 화면(측정 1280×720) → 메뉴 전환 확인.
- 모바일 390×844 브라우저: 입장 탭·확대 화면, 메뉴 열기와 이동, 대학 검색, 각 내부 화면 확인. 가로 넘침 없음. 실제 휴대폰 하드웨어 검사는 수행하지 않음.
- 브라우저 테스트 fixture: 합성 위로 쓸기, 연속 입력 시 1회 전환, 전체 화면 후 전환, 내부 스크롤 해제, 키보드 Enter 모두 통과. 최초 검사에서 첫 렌더 직후 확대와 제목 포커스 입력 보완 후 재검사 통과.
- 자동재생 거부 및 영상 404를 의도적으로 발생시킨 검사에서 표지·안내·입장 모두 통과. reduced-motion은 matchMedia 모의 분기에서 자동재생 정지·즉시 입장 확인, CSS reduced-motion 규칙 확인. 운영체제 설정을 직접 바꾸는 검사는 수행하지 않음.
- 정상 로컬 페이지 브라우저 오류/경고 없음. 실패 fixture의 의도한 404는 정상 페이지 오류와 구분.
- 기존 대학 목록 29개 이름/캠퍼스/수치/별칭/slug 모두 원본과 일치 확인. 외부 상세 자료·도구 URL 33개 모두 HTTP 200.
- node --run check 통과 (이 PC에 npm 실행기가 없어 동일 package.json check 스크립트를 Node로 실행). MP4 전체 디코딩 검사 통과.
- 최초 4173 로컬 연결은 브라우저 접근 시간초과. 호스트 권한으로 4183 서버를 열어 실제 화면 검증 완료. 코드 오류와 구분.
- work/recovered-local은 원본 복구 보관용. 구현은 별도 clone인 work/remote-baseline에 저장. 원본 OneDrive 및 운영 저장소 수정 없음.

## 원격 반영

아래 단계는 실제 결과 확인 후 추가 기록.

### 원격·Pages 확인

- 구현 커밋 ffabaefbe009a549158a1e9ccdee5c9b9e8bbc2c: 일반 Git push 성공. GitHub 연결 도구로 원격 main SHA 일치 확인.
- Pages 배포 실행 42469638472: completed / success 확인. https://github.com/ahntibody87/admissions-atlas-next/actions/runs/42469638472
- 공개 https://ahntibody87.github.io/admissions-atlas-next/ 에서 새 입장 화면, 실사 영상 실제 재생(readyState 4, 1600px), 표지와 Pretendard 로딩 확인.
- 공개 PC 1280×720에서 한 번 스크롤 → 확대 → 내부 메뉴 확인. 공개 모바일 390×844에서 Enter 입장, 모바일 메뉴, 서울대 검색(1/29), 실제 운영 대학 상세 URL, 가로 넘침 없음 확인. 정상 공개 페이지 오류/경고 0건.
- 로컬 및 공개 화면 증거는 이 작업의 outputs에 저장. 모바일 크기 브라우저 검증이며 실제 iOS/Android 기기 검사는 아님.
- 재실행 시 지도가 복원되지 않도록 이전 prepare-assets.cjs의 지도 생성도 제거. 데이터 추출과 폰트 복사만 유지, 구문 검사에 포함.

## 2026-11-08 두 번째 디자인 수정

- 이용 조건이 기록된 캠퍼스 표지를 흐린 배경으로 재사용. 문 형태 영상 창 확대, ATAA 크기 축소·영상 하단 배치, 지정 문구·상단 영문 이름 적용.
- 직접 작성한 나침반 SVG를 입장·내부 로고로 사용. 32px PNG, ICO(16/32/48), Apple Touch 180px 아이콘 추가.
- 오른쪽 아래 플랫폼 소개: 사용자 지정 두 문단과 24px 문단 간격, 네이티브 dialog의 키보드·닫기·모달 동작. 영상 컨트롤은 작은 별도 아이콘으로 유지.
- 첫 입력 후 확대 영상을 유지. 두 번째 입력에서 실제 아래 홈으로 부드럽게 스크롤하며 내비게이션을 점진적으로 표시. 영상 요소를 교체하지 않음. 관성 입력·긴 스와이프의 잔여 입력 방지.
- 홈·내부 4개 화면의 공통 폭과 내비게이션 위치 통일. PC1280×720에서 홈·최근 반영·하단이 한 화면(footer bottom=720)에 들어옴.
- 홈 및 내부 화면의 콘텐츠 좌우 경계 모두 56.921875 / 1208.078125px. 네 내비게이션 글자의 x/width 값이 5개 화면에서 전부 동일함을 브라우저 DOM으로 측정.
- 요청 문구 대입 나침반 / CONTENTS / 목표 설계 / 01·02 설명 / 대학별 권장과목 등 / 29개 대학 반영, 문자열·문단 구분 점검. 실제 대학 목록 29개는 원본과 일치.
- 기존 운영 홈 최근 반영 3개 항목과 해당 날짜 보존. LAST UPDATED는 리뉴얼 수정일 2026-11-08, AHNTIBODY 서명 복원.
- PC1280×720·모바일390×844에서 입장·소개·홈 연결·모바일 메뉴·대학 검색 검증. 가로 넘침 없음. 정상 페이지 오류/경고 없음.
- 브라우저 fixture 36개 검사 통과: 첫 합성 스와이프 후 전체 영상 유지, 다음 스와이프 후 홈, 영상 DOM 유지, 메뉴 표시, 모달 입력 차단, 자동재생 거부·미디어404·reduced-motion 모의 분기 등. 실제 휴대폰과 OS 설정 변경 검사는 아님.
- 확대 중 집중된 요소 때문에 생긴 내부 스크롤 오프셋은 overflow:clip으로 수정. 모바일 로고에 남아 있던 작은 글씨 규칙도 수정 후 화면 확인.
- node --run check 및 git diff --check로 구문·공백 검사. 테스트 fixture는 work로 이동하고 배포 소스에서 제외. 변경 전 소스도 work에 보존.
- 이 수정본의 원격 커밋·배포 실행 결과 및 공개 화면 검증은 작업 outputs의 후속 검증 기록에서 확인.

## 2026-11-08 확대 화면 내비게이션·홈 여백 보정

- 확대를 시작하면 로고와 네 메뉴를 즉시 표시. 첫 화면에서는 입장용 로고를 유지. 확대 후 내비게이션은 사용 가능하며 흰 배경 불투명도를 스크롤 비율에 따라 .82 → 1로 강화. 아래 메뉴 보기와 플랫폼 소개 유지.
- PC 홈을 화면 높이에 맞춘 세로 배치로 변경. 제목 크기·메뉴 높이·최근 반영 간격을 함께 조절하여 큰 화면 하단에만 남던 빈 공간을 분산하고 균형 조정.
- 개인 맞춤형 진학 지도 플랫폼으로 소개 문구 교체, 기존 사이트 새 창 안내 줄 제거.
- 로컬 PC1280×720: 확대 상태 헤더 opacity=1, inert=false, 배경 alpha=.82, 영상 재생 확인. 홈 배경 alpha=1, footer bottom=720 확인.
- 로컬 PC2560×1280: 큰 화면에서 전체 홈·하단 표시, 최근 반영 bottom=1115 / footer top=1224. 가로 넘침 없음.
- 모바일390×844: 확대 화면에서 메뉴 열기·전형 분석 이동·서울대 검색 1/29 확인. 오류/경고 없음.
- 변경 전 app.js/style.css를 work에 보존. 공개 배포 결과는 outputs의 v3 검증 기록에 기록.

## 2026-11-08 입장 제목·브랜드 정렬 및 내부 카드 복원

- 영상 위 ATAA 제거. 학생 맞춤형 / 진학 지도 플랫폼 두 줄 중앙 제목, 더 큰 왼쪽 아래 입장 버튼. 확대 후 하단 스크롤 안내와 플랫폼 소개 크기 확대. 기준 위치 유지.
- 입장 전후 같은 header-inner·나침반 SVG·파랑·글자 크기 사용. 영문명도 공통 콘텐츠의 오른쪽 끝에 배치. 레퍼런스의 중앙 타이포그래피와 실제 기존 운영 사이트의 카드 구성을 브라우저에서 확인한 뒤 적용.
- 입장 전후 로고 검증: PC1280×720 x=56.921875,y=21.5,width=130.890625,height=39 모두 동일. 모바일390×844 x=24,y=20,width=115.546875,height=34 모두 동일. 큰 화면2560×1280 x=624.5,y=21.5,width=130.890625,height=39 모두 동일. 큰 화면 영문명 right=1920.5로 왼쪽/오른쪽 여백 624.5 일치.
- 확대 헤더 흰 배경 alpha=.56 → 홈 alpha=1. 이전 .82보다 스크롤 전후 차이 확대. 재생·두 단계 입장·소개 모달 유지.
- 홈 영어 라벨·학생 맞춤형 진학 지도 플랫폼·02 한 번에 찾아보세요. 반영 및 이전 문구 잔존 검사.
- 전형 분석: 기존 운영 사이트의 그라데이션 카드·캠퍼스·학년도·대학 약칭·설명·하단 링크·상하 안내 문단 복원. 약칭 29개는 원본 HTML에서 추출. 대학 데이터는 원본과 동일, 가짜 숫자 추가 없음.
- 01 목표 설계·02 입시 자료도 동일 카드 시스템으로 정리, 실제 도구와 자료 링크 유지. 04는 준비 중.
- PC: 대학 29/29, 공백 포함 서울대 별칭 1/29, 빈 결과, 원자료 링크 확인. 내부 제목과 로고 좌측56.921875px 일치. 모바일4개 내부 화면 모두 좌측24px 일치·가로 넘침 없음·정상 오류/경고0.
- PC2560×1280 홈 footer bottom=1280 확인. 모바일 소개 모달·확대 헤더·제목·버튼 화면 확인. 실제 휴대폰 하드웨어 검사는 아님.
- 구문·공백 검사, 대학 데이터 원본 일치 검사, 요청 문구·원본29개 대학 약칭 검사 수행. 변경 전 소스 work에 보존. 공개 배포 결과는 outputs의 4차수정-검증기록에 기록.
