# FESTICORE Design System — Foundation Tokens

FESTICORE 앱(iOS 우선, Android 확장)의 **Foundation 디자인 토큰**입니다. 컴포넌트는 포함하지 않습니다.
원본은 Figma `festival` 파일의 **Design System** 페이지 변수·스타일이며, 값을 바꿀 때는 Figma를 먼저 고친 뒤 이 JSON을 갱신합니다.

- 형식: [W3C Design Tokens (DTCG)](https://www.designtokens.org/tr/drafts/format/) — `$type` / `$value` / `$description`
- 참조: `{color.atomic.lime.500}` 처럼 중괄호 경로로 다른 토큰을 가리킵니다.
- Tokens Studio(`$metadata.json`, `$themes.json` 포함)와 Style Dictionary v4에서 바로 읽을 수 있습니다.

## 파일 구조

| 파일 | 내용 | 모드 |
| --- | --- | --- |
| `tokens/color/atomic.json` | 원색 팔레트: Common, Base(mist·mist 200), Ink(100~900), Lime·Purple·Red·Orange·Green·Blue·Pink·Yellow(100/500/700), System(iOS 시스템 색 light/dark), Opacity(White·Black·Ink 900·Ink 500 × 5~90%, 각 색 500 × 10%) | 공통 |
| `tokens/color/semantic.light.json` | 화면에서 쓰는 색: primary, secondary, label, background, line, fill, status, accent, static, static-alpha, inverse, material, interaction → atomic 참조 | Light (기본) |
| `tokens/color/semantic.dark.json` | 위와 같은 키, 다크 모드 값 | Dark |
| `tokens/foundation.json` | spacing(margin `m-*`: 2·4·6~24, padding `p-*`: 4~24), radius(`r-*`: 4~24), opacity(`o-5`~`o-90`), state(pressed·active·disabled·dimmed), breakpoint | 공통 |
| `tokens/typography.json` | font-family(base·point=Pretendard), font-weight(400·500·700), font-size, text-style(base 11단계 × bold/medium/regular, point 4단계) | 공통 |
| `tokens/gradient.json` | bottom-cta, scroll-fade-top, scroll-fade-bottom (light/dark) | light/dark |
| `tokens/safe-area.json` | 기기별 상·하단 Safe Area 참고값 | 공통 |

## 사용 규칙

- **화면 코드는 semantic 색만 씁니다.** atomic은 semantic이 참조하는 원재료입니다.
- **static / static-alpha**는 라이트·다크 모두 같은 값입니다. 이미지 위 요소, 브랜드 고정색(라임 깃발 원, Login Tag 등)에만 씁니다.
- **Light가 기본 테마**, Dark는 `semantic.dark.json`으로 교체합니다(키 동일).
- **단위:** 1pt(iOS) = 1dp/sp(Android) = 1px(토큰). `dimension` 값은 `px`로 적었지만 앱에서는 pt/dp로 읽습니다.
- **lineHeight**는 배수(예: `1.529` = 152.9%), **letterSpacing**은 `em`(예: `-0.026em` = -2.6%)입니다.
  - iOS: `lineHeight × fontSize`로 lineSpacing을 계산하고, `kern = letterSpacing(em) × fontSize`.
  - Android: `lineHeight × fontSize`(sp), `letterSpacing`은 em 그대로.
- **굵기**는 400/500/700만 씁니다(SemiBold 미사용).
- **state**: pressed·active는 *오버레이*(color.interaction.*), disabled는 *요소 opacity*, dimmed는 *배경 scrim*(color.material.dimmer)입니다.
- **safe-area**는 디자인 참고값입니다. 실제 앱은 `safeAreaInsets`(iOS) / `WindowInsets`(Android) 런타임 값을 씁니다. iPhone Air(68)와 iPhone Duo 값은 확인이 필요합니다.
- 폰트: Pretendard(OFL). 앱에 번들해야 합니다. point 스타일은 별도 크기·자간·행간을 유지합니다.

## iOS 토큰 생성

Node 버전은 `.nvmrc`에 고정한다. `npm ci` 후 `npm run build`로 `generated/ios/Sources/`의 Swift API를 갱신한다. 각 테마의 DTCG 입력을 Style Dictionary v4가 해석하고, 검증기와 Swift 작성기가 그 결과를 직렬화한다. 색상은 light/dark hex를 가진 `FestiCoreSemanticColor` 하나에서 `.color`·`.uiColor`로 사용한다. `ShapeStyle` 확장도 같은 `.color`를 가리켜 시스템 다크 모드에 반응하며 색상 에셋은 만들지 않는다. `npm test`는 별칭·테마·단위·공개 API 이름을 검사하고 `npm run check`는 커밋된 생성물과 원본의 일치를 확인한다. 디자인 토큰 변경 PR에는 생성물도 함께 커밋한다.

생성기는 Node 22에서 직접 실행하는 TypeScript이며 `npm run typecheck`로 형식을 검사한다. 생성 대상은 semantic color, spacing, radius, 비활성 상태 opacity, typography다. 원자 색은 별칭 해석에만 쓰며 gradient, breakpoint, 그 밖의 opacity/state, safe-area는 출력하지 않는다. `generated/ios/Sources`의 네 Swift 파일은 FestiCore-iOS의 `FestiCoreDesignKit/Sources/Token`에 역할별로 동기화한다. DesignSystem 저장소는 폰트 파일을 배포하지 않고, iOS 디자인 모듈이 Pretendard를 리소스로 등록한다. 생성된 `FestiCoreTextStyle`은 37개 토큰을 enum case로 제공하며 등록된 서체의 실제 메트릭을 기준으로 iOS 모듈이 행간을 계산한다. 손으로 작성한 SwiftUI 확장 파일은 생성 대상이 아니다.

`FestiCoreTextStyle.fontFamily`가 반환하는 `PretendardFontFamily`는 Attendance와 같은 대문자 case를 사용한다. 현재 토큰에서 참조하는 case는 `.Regular`, `.Medium`, `.Bold`이며, iOS 모듈은 생성 Swift와 서체 타입을 함께 컴파일해 계약을 확인한다.

```swift
Text("축제")
  .foregroundStyle(.labelNormal)
  .background(FestiCoreSemanticColor.backgroundNormal.color)
```

Figma에서 값을 고친 뒤 이 저장소의 JSON을 갱신하고 생성물을 함께 제출한다. 이후 iOS 저장소의 별도 동기화 워크플로가 커밋 SHA에 묶인 파일을 가져와 PR을 만든다.

## 변경 이력

상세 변경 내용은 [CHANGELOG.md](CHANGELOG.md)에서도 확인할 수 있다.

| 날짜 | 버전 | 내용 |
| --- | --- | --- |
| 2026-10-27 | Pretendard case 명명 | `FestiCoreTextStyle.fontFamily`의 `.Regular`·`.Medium`·`.Bold`를 Attendance 표기와 통일 |
| 2026-10-27 | Pretendard 타이포그래피 | point 서체를 Pretendard로 통일하고, iOS 텍스트 스타일을 enum case API로 변경 |
| 2026-10-23 | Semantic 색 API | Joongna의 `.color`·`.uiColor` 사용 형태를 참고해 코드형 hex Light/Dark 색을 단일 타입으로 생성. ShapeStyle은 같은 동적 색 사용 |
| 2026-10-23 | TypeScript 생성기 | iOS 생성기와 검증 스크립트를 TypeScript로 전환. 비활성 opacity를 토큰에서 생성하고 실제 번들 서체 기반 줄 간격 계산 규칙을 반영 |
| 2026-10-22 | UIColor 코드 정리 | DDD 방식의 `static let`과 hex 값으로 UIKit 색상 코드를 단순화. Light/Dark 동적 색상과 alpha 유지 |
| 2026-10-22 | iOS 코드 컬러 | FestiCore semantic light/dark 색을 `UIColor`·`Color`·`ShapeStyle` 확장 코드로 생성. `FestiCoreColor` enum과 색상 `.xcassets` 제거, `FestiCoreDesignKit`의 `Sources/Token`으로 동기화. 생성 실패 시 기존 산출물 보존 |
| 2026-10-22 | iOS 토큰 자동화 | DTCG 테마·별칭·타입 검증, semantic color·spacing·radius·typography Swift 생성과 CI 생성물 일치 검사 |
| 2026-10-22 | 0.2.0 | 배경 Paper 삭제 → Mist로 통일, 100단계 색 밝게 조정, Ink 400 추가(다크 Label/Assistive), 다크 Fill 반투명화 + Fill/Selected, 다크 Accent Background를 500의 10% 틴트로, Static Alpha(Black·White 20~80)·Material/Glass·Static/Purple Tint 추가, Margin m-2·m-6 추가, 그라디언트 라이트 배경색 Mist로 |
| 2026-10-21 | 0.1.0 | Figma Design System v1에서 Foundation 토큰 첫 내보내기 |
