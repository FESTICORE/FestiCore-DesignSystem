# iOS 디자인 토큰 자동화 설계 (#1)

## 목표

`tokens/`의 DTCG 원본을 검증하고 light/dark iOS Swift 토큰과 색상 에셋을 결정적으로 생성한다. PR에서 생성물 차이를 검사하고, `main` 변경 뒤 FestiCore-iOS의 디자인 모듈에 변경 PR이 자동으로 열린다.

## 원칙과 경계

- `FestiCore-DesignSystem`의 JSON을 원본으로 유지한다. Joongna/design-system과 SWYP-design-tokens의 Style Dictionary v4 검증·생성·CI 구조를 참고하되, 다른 앱의 Figma 파일 ID·이미지·폰트·비밀값은 복사하지 않는다.
- `$themes.json`의 light/dark 토큰 세트 목록으로 두 개의 독립된 토큰 트리를 만든다. `enabled` 세트만 출력하고 `source` 세트는 별칭 해석에만 사용하며 `disabled` 세트는 무시한다. 같은 트리 안의 중복 경로, 미해결·순환 별칭, 잘못된 타입·색·치수·타이포 값은 빌드 실패로 처리한다. 두 테마의 semantic color 경로 집합은 정확히 같아야 하며, 누락 경로가 있으면 실패한다.
- 색상은 현재 iOS의 `FestiCoreColor` 이름과 light/dark 동적 `UIColor` 동작을 유지한다. spacing/radius와 typography는 현재 `FestiCoreSpacing`, `FestiCoreRadius`, `FestiCoreTypography`/`FestiCoreTextStyle` API를 유지한다. 화면에서는 SwiftUI modifier 체이닝을 사용하고, 생성기는 수작업 SwiftUI 확장 파일을 덮어쓰지 않는다.
- 원본의 typography family 정보는 보존한다. 실제 Pretendard·Bagel Fat One 폰트 파일이 아직 없으므로 첫 family를 선택하고 시스템 폰트로 대체한다. `px`는 iOS `pt`, 자간의 `em`은 글자 크기와 곱한 `pt`, 배수형 line height는 글자 크기와 곱한 `pt`로 변환한다. SwiftUI `lineSpacing`은 목표 행 높이에서 폰트 기본 행 높이를 뺀다. `%` 등 지원하지 않는 단위는 실패한다. safe-area는 런타임 값 대신 사용하지 않는다.
- 이번 iOS 출력은 semantic color, spacing, radius, typography로 한정한다. `source` 원자 색은 semantic 별칭 해석에만 쓰며 출력하지 않는다. gradient, breakpoint, opacity/state, safe-area는 원본에 보존하고 iOS 생성 대상에서 제외한다. 따라서 theme별 dimmed opacity 차이는 별도 후속 설계로 다룬다.
- spacing, radius, typography는 테마에 관계없는 공통 값이다. 두 트리에서 별칭을 해석한 뒤 경로와 값이 완전히 같은지 검사하고 한 번만 출력한다. 테마별 값 차이, 변환된 Swift 이름 충돌, 공개 `FestiCoreColor` 이름 목록의 스냅샷 이탈은 테스트 실패로 처리한다.
- 생성 산출물은 `generated/ios/`에 저장한다. `npm run build`는 이 폴더를 지운 뒤 각 테마의 DTCG 입력을 Style Dictionary v4로 해석하고, 검증기와 전용 Swift/에셋 작성기가 결과를 직렬화한다. 숫자 자릿수·키 순서를 고정하고 타임스탬프는 넣지 않는다. `npm run check`는 재생성 후 `git status --porcelain -- generated/ios`가 비어 있어야 성공하며 추가·누락 파일도 실패한다. 잘못된 fixture, theme 경로 불일치, source 미출력, `em`/배수 단위와 제외 범위를 테스트한다. Node 버전은 `.nvmrc`/`engines`와 CI에서 고정한다.
- `FestiCore-DesignSystem` PR CI는 typecheck, 테스트, build/check를 수행한다. `main` 반영 시 iOS 저장소가 공개 원본을 주기적으로 확인한다. `main` SHA를 한 번 확정하고 그 SHA의 원본 JSON과 `generated/ios/`만 내려받아 iOS의 전용 `Generated/` 폴더와 스냅샷에 그대로 복사한다. iOS에서 npm으로 다시 생성하지 않는다. 스냅샷에 `.source-sha`를 기록한다. 경로·확장자를 검증하고 다운로드한 내용은 실행하지 않는다.
- 동기화 워크플로는 고정 브랜치 `chore/design-tokens-sync`를 갱신하고 기존 PR을 재사용한다. 열린 PR 또는 `develop`의 `.source-sha`를 비교해 중복·구버전 갱신을 막으며 `concurrency: { group: design-token-sync, cancel-in-progress: false }`로 직렬화한다. iOS `GITHUB_TOKEN`으로 만든 PR은 PR 이벤트 CI를 자동으로 시작하지 않으므로, 동기화 워크플로에서 `./make generate`와 디자인/Stage 테스트 및 커버리지 검증을 먼저 수행하고 그 결과를 PR 본문·아티팩트에 기록한다. 검증 실패 시 PR을 열지 않는다. 읽기 작업의 기본 권한은 `{}`이고 PR 작성 job에만 `contents`/`pull-requests: write`를 준다. Actions는 커밋 SHA로 고정한다. 수동 `workflow_dispatch`도 제공한다.
- 테스트 job은 검증된 `Generated/`·원본 스냅샷과 SHA를 아티팩트로 올리고 digest를 기록한다. PR 작성 job은 digest와 `.source-sha`를 다시 확인한 뒤 동일한 트리만 커밋한다. 검사 결과는 PR head SHA에 동일한 필수 check 이름으로 기록하고 재푸시할 때 다시 실행한다. 실패하면 기존 동기화 PR에 실패 SHA와 Actions 링크를 댓글로 남긴다. 압축 파일은 예상 경로 아래의 일반 파일만 허용하고 심볼릭 링크, 하드 링크, 절대 경로 및 `..` 경로를 거부한다.

## 순서와 검증

1. `feature/design-token-automation` 브랜치에서 검증기·생성기·fixture 테스트와 npm lockfile을 추가한다. `npm ci && npm run typecheck && npm test && npm run check`를 통과시킨다.
2. DesignSystem PR CI를 추가하고 `main`에 PR을 제출한다. CI 성공 후 병합한다.
3. FestiCore-iOS에 지정 SHA의 원본·생성물 fetch, 검증, 전용 폴더 교체 및 PR 워크플로를 추가한다. 동기화 workflow 안에서 `./make generate`, 디자인 모듈 테스트, 전체 Stage 테스트와 커버리지를 확인하고 최초 동기화 PR을 실제로 열어 결과를 검증한 뒤 이슈 #1을 닫는다.

## 제약과 리스크

- GitHub schedule은 정시 실행을 보장하지 않는다. 수동 `workflow_dispatch`는 즉시 검증 경로다. Figma publish 실시간 웹훅은 Figma 인증·중계 서비스가 제공되지 않았으므로 이번 자동화에서 제외한다.
- 공개 원본이라 fetch에 PAT가 필요 없지만, GitHub 저장소의 Actions 설정이 `GITHUB_TOKEN`의 PR 생성을 허용해야 한다. 제한되어 있으면 워크플로 실패로 남기고 설정 또는 별도 권한이 필요하다.
- iOS 생성 코드가 기존 스냅샷과 의미상 다르게 나오면 차이를 먼저 검토하고, 원본 토큰이나 변환 규칙 중 어느 쪽을 고칠지 결정한다.
