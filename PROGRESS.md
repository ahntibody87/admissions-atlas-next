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
