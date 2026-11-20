//
//  FestiCoreSemanticColor.kt
//  FestiCoreDesignKit
//
//  Created by FestiCore-DesignSystem generator.
//

package io.festicore.ui.designkit.tokens

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.ui.graphics.Color

// 화면에는 semantic 색만 노출한다. 값은 Light/Dark 토큰에서 생성되고 시스템 다크 모드에 반응한다.
@Immutable
class FestiCoreSemanticColor private constructor(
    val light: Color,
    val dark: Color,
) {
    val color: Color
        @Composable
        @ReadOnlyComposable
        get() = if (isSystemInDarkTheme()) dark else light

    companion object {
        val accentBackgroundBlue = FestiCoreSemanticColor(light = Color(0xFFEFF5FF), dark = Color(0x1A3D7BFF))
        val accentBackgroundGreen = FestiCoreSemanticColor(light = Color(0xFFE6FBEB), dark = Color(0x1A2FBF5B))
        val accentBackgroundLime = FestiCoreSemanticColor(light = Color(0xFFF2F8E1), dark = Color(0x1AC6FF34))
        val accentBackgroundOrange = FestiCoreSemanticColor(light = Color(0xFFFFF2E5), dark = Color(0x1AFF9A2E))
        val accentBackgroundPink = FestiCoreSemanticColor(light = Color(0xFFFFEFF8), dark = Color(0x1AFF6FC8))
        val accentBackgroundPurple = FestiCoreSemanticColor(light = Color(0xFFF6F2FF), dark = Color(0x1A7F3AEF))
        val accentBackgroundRed = FestiCoreSemanticColor(light = Color(0xFFFFF1EF), dark = Color(0x1AFF4D3D))
        val accentBackgroundYellow = FestiCoreSemanticColor(light = Color(0xFFF9F5DF), dark = Color(0x1AFFD93D))
        val accentForegroundBlue = FestiCoreSemanticColor(light = Color(0xFF1F4FCC), dark = Color(0xFF3D7BFF))
        val accentForegroundGreen = FestiCoreSemanticColor(light = Color(0xFF157A36), dark = Color(0xFF2FBF5B))
        val accentForegroundLime = FestiCoreSemanticColor(light = Color(0xFF4E7300), dark = Color(0xFFC6FF34))
        val accentForegroundOrange = FestiCoreSemanticColor(light = Color(0xFFA65000), dark = Color(0xFFFF9A2E))
        val accentForegroundPink = FestiCoreSemanticColor(light = Color(0xFFB8237F), dark = Color(0xFFFF6FC8))
        val accentForegroundPurple = FestiCoreSemanticColor(light = Color(0xFF5B21C4), dark = Color(0xFF7F3AEF))
        val accentForegroundRed = FestiCoreSemanticColor(light = Color(0xFFC21F12), dark = Color(0xFFFF4D3D))
        val accentForegroundYellow = FestiCoreSemanticColor(light = Color(0xFF7A6000), dark = Color(0xFFFFD93D))
        val accentPointBlue = FestiCoreSemanticColor(light = Color(0xFF3D7BFF), dark = Color(0xFF3D7BFF))
        val accentPointGreen = FestiCoreSemanticColor(light = Color(0xFF2FBF5B), dark = Color(0xFF2FBF5B))
        val accentPointLime = FestiCoreSemanticColor(light = Color(0xFFC6FF34), dark = Color(0xFFC6FF34))
        val accentPointOrange = FestiCoreSemanticColor(light = Color(0xFFFF9A2E), dark = Color(0xFFFF9A2E))
        val accentPointPink = FestiCoreSemanticColor(light = Color(0xFFFF6FC8), dark = Color(0xFFFF6FC8))
        val accentPointPurple = FestiCoreSemanticColor(light = Color(0xFF7F3AEF), dark = Color(0xFF7F3AEF))
        val accentPointRed = FestiCoreSemanticColor(light = Color(0xFFFF4D3D), dark = Color(0xFFFF4D3D))
        val accentPointYellow = FestiCoreSemanticColor(light = Color(0xFFFFD93D), dark = Color(0xFFFFD93D))
        val backgroundAlternative = FestiCoreSemanticColor(light = Color(0xFFE9E9EE), dark = Color(0xFF000000))
        val backgroundElevated = FestiCoreSemanticColor(light = Color(0xFFFFFFFF), dark = Color(0xFF1C1C20))
        val backgroundNavigation = FestiCoreSemanticColor(light = Color(0xFFFFFFFF), dark = Color(0xFF1C1C20))
        val backgroundNormal = FestiCoreSemanticColor(light = Color(0xFFF3F3F6), dark = Color(0xFF111113))
        val fillNormal = FestiCoreSemanticColor(light = Color(0xFFF2F2F4), dark = Color(0x1AFFFFFF))
        val fillSelected = FestiCoreSemanticColor(light = Color(0xFFFFFFFF), dark = Color(0xFF5C5C66))
        val fillStrong = FestiCoreSemanticColor(light = Color(0xFFE4E4E8), dark = Color(0x33FFFFFF))
        val interactionActive = FestiCoreSemanticColor(light = Color(0x0D111113), dark = Color(0x0DFFFFFF))
        val interactionPressed = FestiCoreSemanticColor(light = Color(0x1A111113), dark = Color(0x1AFFFFFF))
        val inverseBackground = FestiCoreSemanticColor(light = Color(0xFF111113), dark = Color(0xFFFFFFFF))
        val inverseLabel = FestiCoreSemanticColor(light = Color(0xFFFFFFFF), dark = Color(0xFF111113))
        val labelAssistive = FestiCoreSemanticColor(light = Color(0xFF8A8A93), dark = Color(0xFFA9A9B1))
        val labelDisable = FestiCoreSemanticColor(light = Color(0xFFC9C9CF), dark = Color(0xFF2A2A30))
        val labelNeutral = FestiCoreSemanticColor(light = Color(0xFF5C5C66), dark = Color(0xFFC9C9CF))
        val labelNormal = FestiCoreSemanticColor(light = Color(0xFF111113), dark = Color(0xFFFFFFFF))
        val labelStrong = FestiCoreSemanticColor(light = Color(0xFF000000), dark = Color(0xFFFFFFFF))
        val lineNormal = FestiCoreSemanticColor(light = Color(0xFFE4E4E8), dark = Color(0xFF2A2A30))
        val lineStrong = FestiCoreSemanticColor(light = Color(0xFFC9C9CF), dark = Color(0xFF5C5C66))
        val materialDimmer = FestiCoreSemanticColor(light = Color(0x80000000), dark = Color(0xB2000000))
        val materialGlass = FestiCoreSemanticColor(light = Color(0x33FFFFFF), dark = Color(0x33000000))
        val primaryNormal = FestiCoreSemanticColor(light = Color(0xFF111113), dark = Color(0xFFC6FF34))
        val primaryOnPrimary = FestiCoreSemanticColor(light = Color(0xFFFFFFFF), dark = Color(0xFF111113))
        val secondaryNormal = FestiCoreSemanticColor(light = Color(0xFF7F3AEF), dark = Color(0xFFB28BFF))
        val secondaryOnSecondary = FestiCoreSemanticColor(light = Color(0xFFFFFFFF), dark = Color(0xFF111113))
        val staticalphaBlack20 = FestiCoreSemanticColor(light = Color(0x33000000), dark = Color(0x33000000))
        val staticalphaBlack40 = FestiCoreSemanticColor(light = Color(0x66000000), dark = Color(0x66000000))
        val staticalphaBlack60 = FestiCoreSemanticColor(light = Color(0x99000000), dark = Color(0x99000000))
        val staticalphaBlack80 = FestiCoreSemanticColor(light = Color(0xCC000000), dark = Color(0xCC000000))
        val staticalphaWhite20 = FestiCoreSemanticColor(light = Color(0x33FFFFFF), dark = Color(0x33FFFFFF))
        val staticalphaWhite40 = FestiCoreSemanticColor(light = Color(0x66FFFFFF), dark = Color(0x66FFFFFF))
        val staticalphaWhite60 = FestiCoreSemanticColor(light = Color(0x99FFFFFF), dark = Color(0x99FFFFFF))
        val staticalphaWhite80 = FestiCoreSemanticColor(light = Color(0xCCFFFFFF), dark = Color(0xCCFFFFFF))
        val staticBlack = FestiCoreSemanticColor(light = Color(0xFF000000), dark = Color(0xFF000000))
        val staticGray = FestiCoreSemanticColor(light = Color(0xFF8A8A93), dark = Color(0xFF8A8A93))
        val staticInk = FestiCoreSemanticColor(light = Color(0xFF111113), dark = Color(0xFF111113))
        val staticLime = FestiCoreSemanticColor(light = Color(0xFFC6FF34), dark = Color(0xFFC6FF34))
        val staticPurpleTint = FestiCoreSemanticColor(light = Color(0xFFF6F2FF), dark = Color(0xFFF6F2FF))
        val staticWhite = FestiCoreSemanticColor(light = Color(0xFFFFFFFF), dark = Color(0xFFFFFFFF))
        val statusCautionary = FestiCoreSemanticColor(light = Color(0xFFFF9500), dark = Color(0xFFFF9F0A))
        val statusInfo = FestiCoreSemanticColor(light = Color(0xFF007AFF), dark = Color(0xFF0A84FF))
        val statusNegative = FestiCoreSemanticColor(light = Color(0xFFFF3B30), dark = Color(0xFFFF453A))
        val statusPositive = FestiCoreSemanticColor(light = Color(0xFF34C759), dark = Color(0xFF30D158))
    }
}
