//
//  FestiCoreSemanticColor.swift
//  FestiCoreDesignKit
//
//  Created by FestiCore-DesignSystem generator.
//

import SwiftUI
import UIKit

// 화면에는 semantic 색만 노출한다. hex 값은 Light/Dark 토큰에서 생성된다.
public struct FestiCoreSemanticColor: Sendable {
  private let lightHex: UInt32
  private let lightAlpha: UInt8
  private let darkHex: UInt32
  private let darkAlpha: UInt8

  private init(lightHex: UInt32, lightAlpha: UInt8, darkHex: UInt32, darkAlpha: UInt8) {
    self.lightHex = lightHex
    self.lightAlpha = lightAlpha
    self.darkHex = darkHex
    self.darkAlpha = darkAlpha
  }

  public var color: Color { Color(uiColor: uiColor) }

  public var uiColor: UIColor {
    UIColor { traits in
      let isDark = traits.userInterfaceStyle == .dark
      return UIColor(hex: isDark ? darkHex : lightHex, alpha: isDark ? darkAlpha : lightAlpha)
    }
  }
}

public extension FestiCoreSemanticColor {
  static let accentBackgroundBlue = FestiCoreSemanticColor(lightHex: 0xEFF5FF, lightAlpha: 0xFF, darkHex: 0x3D7BFF, darkAlpha: 0x1A)
  static let accentBackgroundGreen = FestiCoreSemanticColor(lightHex: 0xE6FBEB, lightAlpha: 0xFF, darkHex: 0x2FBF5B, darkAlpha: 0x1A)
  static let accentBackgroundLime = FestiCoreSemanticColor(lightHex: 0xF2F8E1, lightAlpha: 0xFF, darkHex: 0xC6FF34, darkAlpha: 0x1A)
  static let accentBackgroundOrange = FestiCoreSemanticColor(lightHex: 0xFFF2E5, lightAlpha: 0xFF, darkHex: 0xFF9A2E, darkAlpha: 0x1A)
  static let accentBackgroundPink = FestiCoreSemanticColor(lightHex: 0xFFEFF8, lightAlpha: 0xFF, darkHex: 0xFF6FC8, darkAlpha: 0x1A)
  static let accentBackgroundPurple = FestiCoreSemanticColor(lightHex: 0xF6F2FF, lightAlpha: 0xFF, darkHex: 0x7F3AEF, darkAlpha: 0x1A)
  static let accentBackgroundRed = FestiCoreSemanticColor(lightHex: 0xFFF1EF, lightAlpha: 0xFF, darkHex: 0xFF4D3D, darkAlpha: 0x1A)
  static let accentBackgroundYellow = FestiCoreSemanticColor(lightHex: 0xF9F5DF, lightAlpha: 0xFF, darkHex: 0xFFD93D, darkAlpha: 0x1A)
  static let accentForegroundBlue = FestiCoreSemanticColor(lightHex: 0x1F4FCC, lightAlpha: 0xFF, darkHex: 0x3D7BFF, darkAlpha: 0xFF)
  static let accentForegroundGreen = FestiCoreSemanticColor(lightHex: 0x157A36, lightAlpha: 0xFF, darkHex: 0x2FBF5B, darkAlpha: 0xFF)
  static let accentForegroundLime = FestiCoreSemanticColor(lightHex: 0x4E7300, lightAlpha: 0xFF, darkHex: 0xC6FF34, darkAlpha: 0xFF)
  static let accentForegroundOrange = FestiCoreSemanticColor(lightHex: 0xA65000, lightAlpha: 0xFF, darkHex: 0xFF9A2E, darkAlpha: 0xFF)
  static let accentForegroundPink = FestiCoreSemanticColor(lightHex: 0xB8237F, lightAlpha: 0xFF, darkHex: 0xFF6FC8, darkAlpha: 0xFF)
  static let accentForegroundPurple = FestiCoreSemanticColor(lightHex: 0x5B21C4, lightAlpha: 0xFF, darkHex: 0x7F3AEF, darkAlpha: 0xFF)
  static let accentForegroundRed = FestiCoreSemanticColor(lightHex: 0xC21F12, lightAlpha: 0xFF, darkHex: 0xFF4D3D, darkAlpha: 0xFF)
  static let accentForegroundYellow = FestiCoreSemanticColor(lightHex: 0x7A6000, lightAlpha: 0xFF, darkHex: 0xFFD93D, darkAlpha: 0xFF)
  static let accentPointBlue = FestiCoreSemanticColor(lightHex: 0x3D7BFF, lightAlpha: 0xFF, darkHex: 0x3D7BFF, darkAlpha: 0xFF)
  static let accentPointGreen = FestiCoreSemanticColor(lightHex: 0x2FBF5B, lightAlpha: 0xFF, darkHex: 0x2FBF5B, darkAlpha: 0xFF)
  static let accentPointLime = FestiCoreSemanticColor(lightHex: 0xC6FF34, lightAlpha: 0xFF, darkHex: 0xC6FF34, darkAlpha: 0xFF)
  static let accentPointOrange = FestiCoreSemanticColor(lightHex: 0xFF9A2E, lightAlpha: 0xFF, darkHex: 0xFF9A2E, darkAlpha: 0xFF)
  static let accentPointPink = FestiCoreSemanticColor(lightHex: 0xFF6FC8, lightAlpha: 0xFF, darkHex: 0xFF6FC8, darkAlpha: 0xFF)
  static let accentPointPurple = FestiCoreSemanticColor(lightHex: 0x7F3AEF, lightAlpha: 0xFF, darkHex: 0x7F3AEF, darkAlpha: 0xFF)
  static let accentPointRed = FestiCoreSemanticColor(lightHex: 0xFF4D3D, lightAlpha: 0xFF, darkHex: 0xFF4D3D, darkAlpha: 0xFF)
  static let accentPointYellow = FestiCoreSemanticColor(lightHex: 0xFFD93D, lightAlpha: 0xFF, darkHex: 0xFFD93D, darkAlpha: 0xFF)
  static let backgroundAlternative = FestiCoreSemanticColor(lightHex: 0xE9E9EE, lightAlpha: 0xFF, darkHex: 0x000000, darkAlpha: 0xFF)
  static let backgroundElevated = FestiCoreSemanticColor(lightHex: 0xFFFFFF, lightAlpha: 0xFF, darkHex: 0x1C1C20, darkAlpha: 0xFF)
  static let backgroundNavigation = FestiCoreSemanticColor(lightHex: 0xFFFFFF, lightAlpha: 0xFF, darkHex: 0x1C1C20, darkAlpha: 0xFF)
  static let backgroundNormal = FestiCoreSemanticColor(lightHex: 0xF3F3F6, lightAlpha: 0xFF, darkHex: 0x111113, darkAlpha: 0xFF)
  static let fillNormal = FestiCoreSemanticColor(lightHex: 0xF2F2F4, lightAlpha: 0xFF, darkHex: 0xFFFFFF, darkAlpha: 0x1A)
  static let fillSelected = FestiCoreSemanticColor(lightHex: 0xFFFFFF, lightAlpha: 0xFF, darkHex: 0x5C5C66, darkAlpha: 0xFF)
  static let fillStrong = FestiCoreSemanticColor(lightHex: 0xE4E4E8, lightAlpha: 0xFF, darkHex: 0xFFFFFF, darkAlpha: 0x33)
  static let interactionActive = FestiCoreSemanticColor(lightHex: 0x111113, lightAlpha: 0x0D, darkHex: 0xFFFFFF, darkAlpha: 0x0D)
  static let interactionPressed = FestiCoreSemanticColor(lightHex: 0x111113, lightAlpha: 0x1A, darkHex: 0xFFFFFF, darkAlpha: 0x1A)
  static let inverseBackground = FestiCoreSemanticColor(lightHex: 0x111113, lightAlpha: 0xFF, darkHex: 0xFFFFFF, darkAlpha: 0xFF)
  static let inverseLabel = FestiCoreSemanticColor(lightHex: 0xFFFFFF, lightAlpha: 0xFF, darkHex: 0x111113, darkAlpha: 0xFF)
  static let labelAssistive = FestiCoreSemanticColor(lightHex: 0x8A8A93, lightAlpha: 0xFF, darkHex: 0xA9A9B1, darkAlpha: 0xFF)
  static let labelDisable = FestiCoreSemanticColor(lightHex: 0xC9C9CF, lightAlpha: 0xFF, darkHex: 0x2A2A30, darkAlpha: 0xFF)
  static let labelNeutral = FestiCoreSemanticColor(lightHex: 0x5C5C66, lightAlpha: 0xFF, darkHex: 0xC9C9CF, darkAlpha: 0xFF)
  static let labelNormal = FestiCoreSemanticColor(lightHex: 0x111113, lightAlpha: 0xFF, darkHex: 0xFFFFFF, darkAlpha: 0xFF)
  static let labelStrong = FestiCoreSemanticColor(lightHex: 0x000000, lightAlpha: 0xFF, darkHex: 0xFFFFFF, darkAlpha: 0xFF)
  static let lineNormal = FestiCoreSemanticColor(lightHex: 0xE4E4E8, lightAlpha: 0xFF, darkHex: 0x2A2A30, darkAlpha: 0xFF)
  static let lineStrong = FestiCoreSemanticColor(lightHex: 0xC9C9CF, lightAlpha: 0xFF, darkHex: 0x5C5C66, darkAlpha: 0xFF)
  static let materialDimmer = FestiCoreSemanticColor(lightHex: 0x000000, lightAlpha: 0x80, darkHex: 0x000000, darkAlpha: 0xB2)
  static let materialGlass = FestiCoreSemanticColor(lightHex: 0xFFFFFF, lightAlpha: 0x33, darkHex: 0x000000, darkAlpha: 0x33)
  static let primaryNormal = FestiCoreSemanticColor(lightHex: 0x111113, lightAlpha: 0xFF, darkHex: 0xC6FF34, darkAlpha: 0xFF)
  static let primaryOnPrimary = FestiCoreSemanticColor(lightHex: 0xFFFFFF, lightAlpha: 0xFF, darkHex: 0x111113, darkAlpha: 0xFF)
  static let secondaryNormal = FestiCoreSemanticColor(lightHex: 0x7F3AEF, lightAlpha: 0xFF, darkHex: 0xB28BFF, darkAlpha: 0xFF)
  static let secondaryOnSecondary = FestiCoreSemanticColor(lightHex: 0xFFFFFF, lightAlpha: 0xFF, darkHex: 0x111113, darkAlpha: 0xFF)
  static let staticalphaBlack20 = FestiCoreSemanticColor(lightHex: 0x000000, lightAlpha: 0x33, darkHex: 0x000000, darkAlpha: 0x33)
  static let staticalphaBlack40 = FestiCoreSemanticColor(lightHex: 0x000000, lightAlpha: 0x66, darkHex: 0x000000, darkAlpha: 0x66)
  static let staticalphaBlack60 = FestiCoreSemanticColor(lightHex: 0x000000, lightAlpha: 0x99, darkHex: 0x000000, darkAlpha: 0x99)
  static let staticalphaBlack80 = FestiCoreSemanticColor(lightHex: 0x000000, lightAlpha: 0xCC, darkHex: 0x000000, darkAlpha: 0xCC)
  static let staticalphaWhite20 = FestiCoreSemanticColor(lightHex: 0xFFFFFF, lightAlpha: 0x33, darkHex: 0xFFFFFF, darkAlpha: 0x33)
  static let staticalphaWhite40 = FestiCoreSemanticColor(lightHex: 0xFFFFFF, lightAlpha: 0x66, darkHex: 0xFFFFFF, darkAlpha: 0x66)
  static let staticalphaWhite60 = FestiCoreSemanticColor(lightHex: 0xFFFFFF, lightAlpha: 0x99, darkHex: 0xFFFFFF, darkAlpha: 0x99)
  static let staticalphaWhite80 = FestiCoreSemanticColor(lightHex: 0xFFFFFF, lightAlpha: 0xCC, darkHex: 0xFFFFFF, darkAlpha: 0xCC)
  static let staticBlack = FestiCoreSemanticColor(lightHex: 0x000000, lightAlpha: 0xFF, darkHex: 0x000000, darkAlpha: 0xFF)
  static let staticInk = FestiCoreSemanticColor(lightHex: 0x111113, lightAlpha: 0xFF, darkHex: 0x111113, darkAlpha: 0xFF)
  static let staticLime = FestiCoreSemanticColor(lightHex: 0xC6FF34, lightAlpha: 0xFF, darkHex: 0xC6FF34, darkAlpha: 0xFF)
  static let staticPurpleTint = FestiCoreSemanticColor(lightHex: 0xF6F2FF, lightAlpha: 0xFF, darkHex: 0xF6F2FF, darkAlpha: 0xFF)
  static let staticWhite = FestiCoreSemanticColor(lightHex: 0xFFFFFF, lightAlpha: 0xFF, darkHex: 0xFFFFFF, darkAlpha: 0xFF)
  static let statusCautionary = FestiCoreSemanticColor(lightHex: 0xFF9500, lightAlpha: 0xFF, darkHex: 0xFF9F0A, darkAlpha: 0xFF)
  static let statusInfo = FestiCoreSemanticColor(lightHex: 0x007AFF, lightAlpha: 0xFF, darkHex: 0x0A84FF, darkAlpha: 0xFF)
  static let statusNegative = FestiCoreSemanticColor(lightHex: 0xFF3B30, lightAlpha: 0xFF, darkHex: 0xFF453A, darkAlpha: 0xFF)
  static let statusPositive = FestiCoreSemanticColor(lightHex: 0x34C759, lightAlpha: 0xFF, darkHex: 0x30D158, darkAlpha: 0xFF)
}

private extension UIColor {
  convenience init(hex: UInt32, alpha: UInt8) {
    self.init(
      red: CGFloat((hex >> 16) & 0xFF) / 255,
      green: CGFloat((hex >> 8) & 0xFF) / 255,
      blue: CGFloat(hex & 0xFF) / 255,
      alpha: CGFloat(alpha) / 255
    )
  }
}
