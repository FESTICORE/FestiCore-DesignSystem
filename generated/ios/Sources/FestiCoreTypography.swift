//
//  FestiCoreTypography.swift
//  FestiCoreDesignKit
//
//  Created by FestiCore-DesignSystem generator.
//

import UIKit

public struct FestiCoreTextStyle {
  public let size: CGFloat
  public let weight: UIFont.Weight
  public let lineHeight: CGFloat
  public let letterSpacing: CGFloat
  public let fontFamily: String

  // 실제 서체와 줄 간격은 앱에 번들된 폰트로 계산한다.
  public init(size: CGFloat, weight: UIFont.Weight, lineHeight: CGFloat, letterSpacing: CGFloat, fontFamily: String) {
    self.size = size
    self.weight = weight
    self.lineHeight = lineHeight
    self.letterSpacing = letterSpacing
    self.fontFamily = fontFamily
  }
}

@MainActor public enum FestiCoreTypography {
  public static let baseFontFamily = "Pretendard"
  public static let pointFontFamily = "Bagel Fat One"
  // letterSpacing은 em × fontSize로 계산한 pt 값이다.
  public static let baseBodyBold = FestiCoreTextStyle(size: 17, weight: .bold, lineHeight: 1.529, letterSpacing: 0, fontFamily: baseFontFamily)
  public static let baseBodyMedium = FestiCoreTextStyle(size: 17, weight: .medium, lineHeight: 1.529, letterSpacing: 0, fontFamily: baseFontFamily)
  public static let baseBodyRegular = FestiCoreTextStyle(size: 17, weight: .regular, lineHeight: 1.529, letterSpacing: 0, fontFamily: baseFontFamily)
  public static let baseCalloutBold = FestiCoreTextStyle(size: 16, weight: .bold, lineHeight: 1.5, letterSpacing: 0.0912, fontFamily: baseFontFamily)
  public static let baseCalloutMedium = FestiCoreTextStyle(size: 16, weight: .medium, lineHeight: 1.5, letterSpacing: 0.0912, fontFamily: baseFontFamily)
  public static let baseCalloutRegular = FestiCoreTextStyle(size: 16, weight: .regular, lineHeight: 1.5, letterSpacing: 0.0912, fontFamily: baseFontFamily)
  public static let baseCaption1Bold = FestiCoreTextStyle(size: 12, weight: .bold, lineHeight: 1.333, letterSpacing: 0.3024, fontFamily: baseFontFamily)
  public static let baseCaption1Medium = FestiCoreTextStyle(size: 12, weight: .medium, lineHeight: 1.333, letterSpacing: 0.3024, fontFamily: baseFontFamily)
  public static let baseCaption1Regular = FestiCoreTextStyle(size: 12, weight: .regular, lineHeight: 1.333, letterSpacing: 0.3024, fontFamily: baseFontFamily)
  public static let baseCaption2Bold = FestiCoreTextStyle(size: 11, weight: .bold, lineHeight: 1.273, letterSpacing: 0.3421, fontFamily: baseFontFamily)
  public static let baseCaption2Medium = FestiCoreTextStyle(size: 11, weight: .medium, lineHeight: 1.273, letterSpacing: 0.3421, fontFamily: baseFontFamily)
  public static let baseCaption2Regular = FestiCoreTextStyle(size: 11, weight: .regular, lineHeight: 1.273, letterSpacing: 0.3421, fontFamily: baseFontFamily)
  public static let baseFootnoteBold = FestiCoreTextStyle(size: 13, weight: .bold, lineHeight: 1.385, letterSpacing: 0.2522, fontFamily: baseFontFamily)
  public static let baseFootnoteMedium = FestiCoreTextStyle(size: 13, weight: .medium, lineHeight: 1.385, letterSpacing: 0.2522, fontFamily: baseFontFamily)
  public static let baseFootnoteRegular = FestiCoreTextStyle(size: 13, weight: .regular, lineHeight: 1.385, letterSpacing: 0.2522, fontFamily: baseFontFamily)
  public static let baseHeadlineBold = FestiCoreTextStyle(size: 17, weight: .bold, lineHeight: 1.412, letterSpacing: 0, fontFamily: baseFontFamily)
  public static let baseHeadlineMedium = FestiCoreTextStyle(size: 17, weight: .medium, lineHeight: 1.412, letterSpacing: 0, fontFamily: baseFontFamily)
  public static let baseHeadlineRegular = FestiCoreTextStyle(size: 17, weight: .regular, lineHeight: 1.412, letterSpacing: 0, fontFamily: baseFontFamily)
  public static let baseLargeTitleBold = FestiCoreTextStyle(size: 34, weight: .bold, lineHeight: 1.294, letterSpacing: -0.884, fontFamily: baseFontFamily)
  public static let baseLargeTitleMedium = FestiCoreTextStyle(size: 34, weight: .medium, lineHeight: 1.294, letterSpacing: -0.884, fontFamily: baseFontFamily)
  public static let baseLargeTitleRegular = FestiCoreTextStyle(size: 34, weight: .regular, lineHeight: 1.294, letterSpacing: -0.884, fontFamily: baseFontFamily)
  public static let baseSubheadlineBold = FestiCoreTextStyle(size: 15, weight: .bold, lineHeight: 1.467, letterSpacing: 0.144, fontFamily: baseFontFamily)
  public static let baseSubheadlineMedium = FestiCoreTextStyle(size: 15, weight: .medium, lineHeight: 1.467, letterSpacing: 0.144, fontFamily: baseFontFamily)
  public static let baseSubheadlineRegular = FestiCoreTextStyle(size: 15, weight: .regular, lineHeight: 1.467, letterSpacing: 0.144, fontFamily: baseFontFamily)
  public static let baseTitle1Bold = FestiCoreTextStyle(size: 28, weight: .bold, lineHeight: 1.357, letterSpacing: -0.6608, fontFamily: baseFontFamily)
  public static let baseTitle1Medium = FestiCoreTextStyle(size: 28, weight: .medium, lineHeight: 1.357, letterSpacing: -0.6608, fontFamily: baseFontFamily)
  public static let baseTitle1Regular = FestiCoreTextStyle(size: 28, weight: .regular, lineHeight: 1.357, letterSpacing: -0.6608, fontFamily: baseFontFamily)
  public static let baseTitle2Bold = FestiCoreTextStyle(size: 22, weight: .bold, lineHeight: 1.364, letterSpacing: -0.4268, fontFamily: baseFontFamily)
  public static let baseTitle2Medium = FestiCoreTextStyle(size: 22, weight: .medium, lineHeight: 1.364, letterSpacing: -0.4268, fontFamily: baseFontFamily)
  public static let baseTitle2Regular = FestiCoreTextStyle(size: 22, weight: .regular, lineHeight: 1.364, letterSpacing: -0.4268, fontFamily: baseFontFamily)
  public static let baseTitle3Bold = FestiCoreTextStyle(size: 20, weight: .bold, lineHeight: 1.4, letterSpacing: -0.24, fontFamily: baseFontFamily)
  public static let baseTitle3Medium = FestiCoreTextStyle(size: 20, weight: .medium, lineHeight: 1.4, letterSpacing: -0.24, fontFamily: baseFontFamily)
  public static let baseTitle3Regular = FestiCoreTextStyle(size: 20, weight: .regular, lineHeight: 1.4, letterSpacing: -0.24, fontFamily: baseFontFamily)
  public static let pointDisplay = FestiCoreTextStyle(size: 40, weight: .regular, lineHeight: 1.2, letterSpacing: -0.4, fontFamily: pointFontFamily)
  public static let pointHeading = FestiCoreTextStyle(size: 20, weight: .regular, lineHeight: 1.2, letterSpacing: 0, fontFamily: pointFontFamily)
  public static let pointLabel = FestiCoreTextStyle(size: 14, weight: .regular, lineHeight: 1.286, letterSpacing: 0.14, fontFamily: pointFontFamily)
  public static let pointTitle = FestiCoreTextStyle(size: 28, weight: .regular, lineHeight: 1.214, letterSpacing: -0.14, fontFamily: pointFontFamily)
}
