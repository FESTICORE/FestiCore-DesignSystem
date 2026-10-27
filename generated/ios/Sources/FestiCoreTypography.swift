//
//  FestiCoreTypography.swift
//  FestiCoreDesignKit
//
//  Created by FestiCore-DesignSystem generator.
//

import UIKit

public enum FestiCoreTextStyle: Sendable {
  case baseBodyBold
  case baseBodyMedium
  case baseBodyRegular
  case baseCalloutBold
  case baseCalloutMedium
  case baseCalloutRegular
  case baseCaption1Bold
  case baseCaption1Medium
  case baseCaption1Regular
  case baseCaption2Bold
  case baseCaption2Medium
  case baseCaption2Regular
  case baseFootnoteBold
  case baseFootnoteMedium
  case baseFootnoteRegular
  case baseHeadlineBold
  case baseHeadlineMedium
  case baseHeadlineRegular
  case baseLargeTitleBold
  case baseLargeTitleMedium
  case baseLargeTitleRegular
  case baseSubheadlineBold
  case baseSubheadlineMedium
  case baseSubheadlineRegular
  case baseTitle1Bold
  case baseTitle1Medium
  case baseTitle1Regular
  case baseTitle2Bold
  case baseTitle2Medium
  case baseTitle2Regular
  case baseTitle3Bold
  case baseTitle3Medium
  case baseTitle3Regular
  case pointDisplay
  case pointHeading
  case pointLabel
  case pointTitle

  public var size: CGFloat {
    switch self {
    case .baseBodyBold: return 17
    case .baseBodyMedium: return 17
    case .baseBodyRegular: return 17
    case .baseCalloutBold: return 16
    case .baseCalloutMedium: return 16
    case .baseCalloutRegular: return 16
    case .baseCaption1Bold: return 12
    case .baseCaption1Medium: return 12
    case .baseCaption1Regular: return 12
    case .baseCaption2Bold: return 11
    case .baseCaption2Medium: return 11
    case .baseCaption2Regular: return 11
    case .baseFootnoteBold: return 13
    case .baseFootnoteMedium: return 13
    case .baseFootnoteRegular: return 13
    case .baseHeadlineBold: return 17
    case .baseHeadlineMedium: return 17
    case .baseHeadlineRegular: return 17
    case .baseLargeTitleBold: return 34
    case .baseLargeTitleMedium: return 34
    case .baseLargeTitleRegular: return 34
    case .baseSubheadlineBold: return 15
    case .baseSubheadlineMedium: return 15
    case .baseSubheadlineRegular: return 15
    case .baseTitle1Bold: return 28
    case .baseTitle1Medium: return 28
    case .baseTitle1Regular: return 28
    case .baseTitle2Bold: return 22
    case .baseTitle2Medium: return 22
    case .baseTitle2Regular: return 22
    case .baseTitle3Bold: return 20
    case .baseTitle3Medium: return 20
    case .baseTitle3Regular: return 20
    case .pointDisplay: return 40
    case .pointHeading: return 20
    case .pointLabel: return 14
    case .pointTitle: return 28
    }
  }

  public var fontFamily: PretendardFontFamily {
    switch self {
    case .baseBodyBold: return .Bold
    case .baseBodyMedium: return .Medium
    case .baseBodyRegular: return .Regular
    case .baseCalloutBold: return .Bold
    case .baseCalloutMedium: return .Medium
    case .baseCalloutRegular: return .Regular
    case .baseCaption1Bold: return .Bold
    case .baseCaption1Medium: return .Medium
    case .baseCaption1Regular: return .Regular
    case .baseCaption2Bold: return .Bold
    case .baseCaption2Medium: return .Medium
    case .baseCaption2Regular: return .Regular
    case .baseFootnoteBold: return .Bold
    case .baseFootnoteMedium: return .Medium
    case .baseFootnoteRegular: return .Regular
    case .baseHeadlineBold: return .Bold
    case .baseHeadlineMedium: return .Medium
    case .baseHeadlineRegular: return .Regular
    case .baseLargeTitleBold: return .Bold
    case .baseLargeTitleMedium: return .Medium
    case .baseLargeTitleRegular: return .Regular
    case .baseSubheadlineBold: return .Bold
    case .baseSubheadlineMedium: return .Medium
    case .baseSubheadlineRegular: return .Regular
    case .baseTitle1Bold: return .Bold
    case .baseTitle1Medium: return .Medium
    case .baseTitle1Regular: return .Regular
    case .baseTitle2Bold: return .Bold
    case .baseTitle2Medium: return .Medium
    case .baseTitle2Regular: return .Regular
    case .baseTitle3Bold: return .Bold
    case .baseTitle3Medium: return .Medium
    case .baseTitle3Regular: return .Regular
    case .pointDisplay: return .Regular
    case .pointHeading: return .Regular
    case .pointLabel: return .Regular
    case .pointTitle: return .Regular
    }
  }

  public var lineHeight: CGFloat {
    switch self {
    case .baseBodyBold: return 1.529
    case .baseBodyMedium: return 1.529
    case .baseBodyRegular: return 1.529
    case .baseCalloutBold: return 1.5
    case .baseCalloutMedium: return 1.5
    case .baseCalloutRegular: return 1.5
    case .baseCaption1Bold: return 1.333
    case .baseCaption1Medium: return 1.333
    case .baseCaption1Regular: return 1.333
    case .baseCaption2Bold: return 1.273
    case .baseCaption2Medium: return 1.273
    case .baseCaption2Regular: return 1.273
    case .baseFootnoteBold: return 1.385
    case .baseFootnoteMedium: return 1.385
    case .baseFootnoteRegular: return 1.385
    case .baseHeadlineBold: return 1.412
    case .baseHeadlineMedium: return 1.412
    case .baseHeadlineRegular: return 1.412
    case .baseLargeTitleBold: return 1.294
    case .baseLargeTitleMedium: return 1.294
    case .baseLargeTitleRegular: return 1.294
    case .baseSubheadlineBold: return 1.467
    case .baseSubheadlineMedium: return 1.467
    case .baseSubheadlineRegular: return 1.467
    case .baseTitle1Bold: return 1.357
    case .baseTitle1Medium: return 1.357
    case .baseTitle1Regular: return 1.357
    case .baseTitle2Bold: return 1.364
    case .baseTitle2Medium: return 1.364
    case .baseTitle2Regular: return 1.364
    case .baseTitle3Bold: return 1.4
    case .baseTitle3Medium: return 1.4
    case .baseTitle3Regular: return 1.4
    case .pointDisplay: return 1.2
    case .pointHeading: return 1.2
    case .pointLabel: return 1.286
    case .pointTitle: return 1.214
    }
  }

  // 원본 em 값에 fontSize를 곱한 pt 값이다.
  public var letterSpacing: CGFloat {
    switch self {
    case .baseBodyBold: return 0
    case .baseBodyMedium: return 0
    case .baseBodyRegular: return 0
    case .baseCalloutBold: return 0.0912
    case .baseCalloutMedium: return 0.0912
    case .baseCalloutRegular: return 0.0912
    case .baseCaption1Bold: return 0.3024
    case .baseCaption1Medium: return 0.3024
    case .baseCaption1Regular: return 0.3024
    case .baseCaption2Bold: return 0.3421
    case .baseCaption2Medium: return 0.3421
    case .baseCaption2Regular: return 0.3421
    case .baseFootnoteBold: return 0.2522
    case .baseFootnoteMedium: return 0.2522
    case .baseFootnoteRegular: return 0.2522
    case .baseHeadlineBold: return 0
    case .baseHeadlineMedium: return 0
    case .baseHeadlineRegular: return 0
    case .baseLargeTitleBold: return -0.884
    case .baseLargeTitleMedium: return -0.884
    case .baseLargeTitleRegular: return -0.884
    case .baseSubheadlineBold: return 0.144
    case .baseSubheadlineMedium: return 0.144
    case .baseSubheadlineRegular: return 0.144
    case .baseTitle1Bold: return -0.6608
    case .baseTitle1Medium: return -0.6608
    case .baseTitle1Regular: return -0.6608
    case .baseTitle2Bold: return -0.4268
    case .baseTitle2Medium: return -0.4268
    case .baseTitle2Regular: return -0.4268
    case .baseTitle3Bold: return -0.24
    case .baseTitle3Medium: return -0.24
    case .baseTitle3Regular: return -0.24
    case .pointDisplay: return -0.4
    case .pointHeading: return 0
    case .pointLabel: return 0.14
    case .pointTitle: return -0.14
    }
  }
}
