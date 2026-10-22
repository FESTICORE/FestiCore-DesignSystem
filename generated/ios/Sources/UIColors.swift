//
//  UIColors.swift
//  FestiCoreDesignKit
//
//  Created by FestiCore-DesignSystem generator.
//

import UIKit

public extension UIColor {
  static let accentBackgroundBlue = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0x3D7BFF, alpha: 0x1A) : UIColor.festiCore(hex: 0xEFF5FF)
  }

  static let accentBackgroundGreen = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0x2FBF5B, alpha: 0x1A) : UIColor.festiCore(hex: 0xE6FBEB)
  }

  static let accentBackgroundLime = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0xC6FF34, alpha: 0x1A) : UIColor.festiCore(hex: 0xF2F8E1)
  }

  static let accentBackgroundOrange = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0xFF9A2E, alpha: 0x1A) : UIColor.festiCore(hex: 0xFFF2E5)
  }

  static let accentBackgroundPink = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0xFF6FC8, alpha: 0x1A) : UIColor.festiCore(hex: 0xFFEFF8)
  }

  static let accentBackgroundPurple = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0x7F3AEF, alpha: 0x1A) : UIColor.festiCore(hex: 0xF6F2FF)
  }

  static let accentBackgroundRed = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0xFF4D3D, alpha: 0x1A) : UIColor.festiCore(hex: 0xFFF1EF)
  }

  static let accentBackgroundYellow = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0xFFD93D, alpha: 0x1A) : UIColor.festiCore(hex: 0xF9F5DF)
  }

  static let accentForegroundBlue = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0x3D7BFF) : UIColor.festiCore(hex: 0x1F4FCC)
  }

  static let accentForegroundGreen = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0x2FBF5B) : UIColor.festiCore(hex: 0x157A36)
  }

  static let accentForegroundLime = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0xC6FF34) : UIColor.festiCore(hex: 0x4E7300)
  }

  static let accentForegroundOrange = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0xFF9A2E) : UIColor.festiCore(hex: 0xA65000)
  }

  static let accentForegroundPink = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0xFF6FC8) : UIColor.festiCore(hex: 0xB8237F)
  }

  static let accentForegroundPurple = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0x7F3AEF) : UIColor.festiCore(hex: 0x5B21C4)
  }

  static let accentForegroundRed = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0xFF4D3D) : UIColor.festiCore(hex: 0xC21F12)
  }

  static let accentForegroundYellow = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0xFFD93D) : UIColor.festiCore(hex: 0x7A6000)
  }

  static let accentPointBlue = UIColor.festiCore(hex: 0x3D7BFF)

  static let accentPointGreen = UIColor.festiCore(hex: 0x2FBF5B)

  static let accentPointLime = UIColor.festiCore(hex: 0xC6FF34)

  static let accentPointOrange = UIColor.festiCore(hex: 0xFF9A2E)

  static let accentPointPink = UIColor.festiCore(hex: 0xFF6FC8)

  static let accentPointPurple = UIColor.festiCore(hex: 0x7F3AEF)

  static let accentPointRed = UIColor.festiCore(hex: 0xFF4D3D)

  static let accentPointYellow = UIColor.festiCore(hex: 0xFFD93D)

  static let backgroundAlternative = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0x000000) : UIColor.festiCore(hex: 0xE9E9EE)
  }

  static let backgroundElevated = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0x1C1C20) : UIColor.festiCore(hex: 0xFFFFFF)
  }

  static let backgroundNavigation = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0x1C1C20) : UIColor.festiCore(hex: 0xFFFFFF)
  }

  static let backgroundNormal = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0x111113) : UIColor.festiCore(hex: 0xF3F3F6)
  }

  static let fillNormal = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0xFFFFFF, alpha: 0x1A) : UIColor.festiCore(hex: 0xF2F2F4)
  }

  static let fillSelected = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0x5C5C66) : UIColor.festiCore(hex: 0xFFFFFF)
  }

  static let fillStrong = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0xFFFFFF, alpha: 0x33) : UIColor.festiCore(hex: 0xE4E4E8)
  }

  static let interactionActive = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0xFFFFFF, alpha: 0x0D) : UIColor.festiCore(hex: 0x111113, alpha: 0x0D)
  }

  static let interactionPressed = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0xFFFFFF, alpha: 0x1A) : UIColor.festiCore(hex: 0x111113, alpha: 0x1A)
  }

  static let inverseBackground = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0xFFFFFF) : UIColor.festiCore(hex: 0x111113)
  }

  static let inverseLabel = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0x111113) : UIColor.festiCore(hex: 0xFFFFFF)
  }

  static let labelAssistive = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0xA9A9B1) : UIColor.festiCore(hex: 0x8A8A93)
  }

  static let labelDisable = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0x2A2A30) : UIColor.festiCore(hex: 0xC9C9CF)
  }

  static let labelNeutral = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0xC9C9CF) : UIColor.festiCore(hex: 0x5C5C66)
  }

  static let labelNormal = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0xFFFFFF) : UIColor.festiCore(hex: 0x111113)
  }

  static let labelStrong = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0xFFFFFF) : UIColor.festiCore(hex: 0x000000)
  }

  static let lineNormal = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0x2A2A30) : UIColor.festiCore(hex: 0xE4E4E8)
  }

  static let lineStrong = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0x5C5C66) : UIColor.festiCore(hex: 0xC9C9CF)
  }

  static let materialDimmer = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0x000000, alpha: 0xB2) : UIColor.festiCore(hex: 0x000000, alpha: 0x80)
  }

  static let materialGlass = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0x000000, alpha: 0x33) : UIColor.festiCore(hex: 0xFFFFFF, alpha: 0x33)
  }

  static let primaryNormal = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0xC6FF34) : UIColor.festiCore(hex: 0x111113)
  }

  static let primaryOnPrimary = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0x111113) : UIColor.festiCore(hex: 0xFFFFFF)
  }

  static let secondaryNormal = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0xB28BFF) : UIColor.festiCore(hex: 0x7F3AEF)
  }

  static let secondaryOnSecondary = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0x111113) : UIColor.festiCore(hex: 0xFFFFFF)
  }

  static let staticalphaBlack20 = UIColor.festiCore(hex: 0x000000, alpha: 0x33)

  static let staticalphaBlack40 = UIColor.festiCore(hex: 0x000000, alpha: 0x66)

  static let staticalphaBlack60 = UIColor.festiCore(hex: 0x000000, alpha: 0x99)

  static let staticalphaBlack80 = UIColor.festiCore(hex: 0x000000, alpha: 0xCC)

  static let staticalphaWhite20 = UIColor.festiCore(hex: 0xFFFFFF, alpha: 0x33)

  static let staticalphaWhite40 = UIColor.festiCore(hex: 0xFFFFFF, alpha: 0x66)

  static let staticalphaWhite60 = UIColor.festiCore(hex: 0xFFFFFF, alpha: 0x99)

  static let staticalphaWhite80 = UIColor.festiCore(hex: 0xFFFFFF, alpha: 0xCC)

  static let staticBlack = UIColor.festiCore(hex: 0x000000)

  static let staticInk = UIColor.festiCore(hex: 0x111113)

  static let staticLime = UIColor.festiCore(hex: 0xC6FF34)

  static let staticPurpleTint = UIColor.festiCore(hex: 0xF6F2FF)

  static let staticWhite = UIColor.festiCore(hex: 0xFFFFFF)

  static let statusCautionary = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0xFF9F0A) : UIColor.festiCore(hex: 0xFF9500)
  }

  static let statusInfo = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0x0A84FF) : UIColor.festiCore(hex: 0x007AFF)
  }

  static let statusNegative = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0xFF453A) : UIColor.festiCore(hex: 0xFF3B30)
  }

  static let statusPositive = UIColor { traits in
    traits.userInterfaceStyle == .dark ? UIColor.festiCore(hex: 0x30D158) : UIColor.festiCore(hex: 0x34C759)
  }

}

private extension UIColor {
  static func festiCore(hex: UInt32, alpha: UInt8 = 0xFF) -> UIColor {
    UIColor(
      red: CGFloat((hex >> 16) & 0xFF) / 255,
      green: CGFloat((hex >> 8) & 0xFF) / 255,
      blue: CGFloat(hex & 0xFF) / 255,
      alpha: CGFloat(alpha) / 255
    )
  }
}
