# 변경 이력

## 2026-10-23 — Semantic 색 소비 API

- Joongna iOS의 `.color`·`.uiColor` 사용 형태를 참고해 `FestiCoreSemanticColor`로 통합합니다. 값은 Figma DTCG의 Light/Dark hex 코드에서 생성하며 원자 팔레트·색상 에셋은 노출하지 않습니다.
- `ShapeStyle` 확장은 같은 semantic `.color`를 반환해 시스템 다크 모드를 따릅니다. 중복된 `Colors.swift`와 `UIColors.swift`는 생성하지 않습니다.

## 2026-10-23 — TypeScript iOS 생성기와 Foundation 상태

- iOS 토큰 생성기와 생성물 검증 스크립트를 TypeScript로 전환하고 Node 22 타입 검사를 유지합니다.
- `state.disabled`의 30% opacity를 Swift 상수로 생성합니다. pressed·active는 semantic interaction 색, dimmed는 semantic dimmer 색을 사용합니다.
- 생성된 타이포그래피에서 시스템 서체 및 그 기준 줄 간격을 제거합니다. iOS 앱은 번들된 Pretendard·Bagel Fat One의 실제 폰트 메트릭을 사용합니다.

## 2026-10-22 — UIColor 코드 정리

- UIKit 색상은 DDD와 같은 `static let` 및 hex 코드 형식으로 생성합니다. Light/Dark 전환과 반투명 alpha는 그대로 적용합니다.

## 2026-10-22 — iOS 컬러 코드 생성

- FestiCore의 light/dark semantic 토큰을 `UIColor`, SwiftUI `Color`, `ShapeStyle` 확장으로 생성합니다. 화면은 semantic 이름을 코드에서 직접 사용합니다.
- 기존 `FestiCoreColor` enum과 색상 `.xcassets` 생성을 제거했습니다. 원자 색은 semantic 별칭을 해석할 때만 사용합니다.
- 생성 파일에 파일명·모듈명·고정 작성자 표기를 넣고, 잘못된 토큰으로 생성이 실패하면 기존 산출물을 보존합니다.
- iOS 소비 모듈 이름을 `FestiCoreDesignKit`으로 정했습니다. 생성된 다섯 Swift 파일은 iOS 저장소에서 `Sources/Token`의 역할별 경로로 동기화합니다.

## 2026-10-22 — 토큰 자동화

- DTCG 원본의 테마, 별칭, 타입, 단위, 공개 색상 이름을 검증합니다.
- iOS semantic color, spacing, radius, typography Swift 소스를 결정적으로 생성하고 CI에서 생성물 일치를 확인합니다.

## 2026-10-22 — Foundation 토큰 0.2.0

- Paper 배경을 Mist로 통일하고 Ink 400, Fill/Selected, Static Alpha, Material/Glass, Static/Purple Tint, Margin m-2·m-6 등을 추가했습니다.
- 다크 Accent Background와 라이트 그라디언트 배경값을 조정했습니다.

## 2026-10-21 — Foundation 토큰 0.1.0

- Figma Design System v1의 Foundation 토큰을 처음 내보냈습니다.
