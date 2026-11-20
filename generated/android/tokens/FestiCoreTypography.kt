//
//  FestiCoreTypography.kt
//  FestiCoreDesignKit
//
//  Created by FestiCore-DesignSystem generator.
//

package io.festicore.ui.designkit.tokens

import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp

// 서체는 Pretendard다. lineHeight는 원본 배수 × fontSize(sp), letterSpacing은 원본 em 값이다.
enum class FestiCoreTextStyle(
    val size: TextUnit,
    val fontWeight: FontWeight,
    val lineHeight: TextUnit,
    val letterSpacing: TextUnit,
) {
    baseBodyBold(size = 17.sp, fontWeight = FontWeight.Bold, lineHeight = 25.993.sp, letterSpacing = 0.em),
    baseBodyMedium(size = 17.sp, fontWeight = FontWeight.Medium, lineHeight = 25.993.sp, letterSpacing = 0.em),
    baseBodyRegular(size = 17.sp, fontWeight = FontWeight.Normal, lineHeight = 25.993.sp, letterSpacing = 0.em),
    baseCalloutBold(size = 16.sp, fontWeight = FontWeight.Bold, lineHeight = 24.sp, letterSpacing = 0.0057.em),
    baseCalloutMedium(size = 16.sp, fontWeight = FontWeight.Medium, lineHeight = 24.sp, letterSpacing = 0.0057.em),
    baseCalloutRegular(size = 16.sp, fontWeight = FontWeight.Normal, lineHeight = 24.sp, letterSpacing = 0.0057.em),
    baseCaption1Bold(size = 12.sp, fontWeight = FontWeight.Bold, lineHeight = 15.996.sp, letterSpacing = 0.0252.em),
    baseCaption1Medium(size = 12.sp, fontWeight = FontWeight.Medium, lineHeight = 15.996.sp, letterSpacing = 0.0252.em),
    baseCaption1Regular(size = 12.sp, fontWeight = FontWeight.Normal, lineHeight = 15.996.sp, letterSpacing = 0.0252.em),
    baseCaption2Bold(size = 11.sp, fontWeight = FontWeight.Bold, lineHeight = 14.003.sp, letterSpacing = 0.0311.em),
    baseCaption2Medium(size = 11.sp, fontWeight = FontWeight.Medium, lineHeight = 14.003.sp, letterSpacing = 0.0311.em),
    baseCaption2Regular(size = 11.sp, fontWeight = FontWeight.Normal, lineHeight = 14.003.sp, letterSpacing = 0.0311.em),
    baseFootnoteBold(size = 13.sp, fontWeight = FontWeight.Bold, lineHeight = 18.005.sp, letterSpacing = 0.0194.em),
    baseFootnoteMedium(size = 13.sp, fontWeight = FontWeight.Medium, lineHeight = 18.005.sp, letterSpacing = 0.0194.em),
    baseFootnoteRegular(size = 13.sp, fontWeight = FontWeight.Normal, lineHeight = 18.005.sp, letterSpacing = 0.0194.em),
    baseHeadlineBold(size = 17.sp, fontWeight = FontWeight.Bold, lineHeight = 24.004.sp, letterSpacing = 0.em),
    baseHeadlineMedium(size = 17.sp, fontWeight = FontWeight.Medium, lineHeight = 24.004.sp, letterSpacing = 0.em),
    baseHeadlineRegular(size = 17.sp, fontWeight = FontWeight.Normal, lineHeight = 24.004.sp, letterSpacing = 0.em),
    baseLargeTitleBold(size = 34.sp, fontWeight = FontWeight.Bold, lineHeight = 43.996.sp, letterSpacing = (-0.026).em),
    baseLargeTitleMedium(size = 34.sp, fontWeight = FontWeight.Medium, lineHeight = 43.996.sp, letterSpacing = (-0.026).em),
    baseLargeTitleRegular(size = 34.sp, fontWeight = FontWeight.Normal, lineHeight = 43.996.sp, letterSpacing = (-0.026).em),
    baseSubheadlineBold(size = 15.sp, fontWeight = FontWeight.Bold, lineHeight = 22.005.sp, letterSpacing = 0.0096.em),
    baseSubheadlineMedium(size = 15.sp, fontWeight = FontWeight.Medium, lineHeight = 22.005.sp, letterSpacing = 0.0096.em),
    baseSubheadlineRegular(size = 15.sp, fontWeight = FontWeight.Normal, lineHeight = 22.005.sp, letterSpacing = 0.0096.em),
    baseTitle1Bold(size = 28.sp, fontWeight = FontWeight.Bold, lineHeight = 37.996.sp, letterSpacing = (-0.0236).em),
    baseTitle1Medium(size = 28.sp, fontWeight = FontWeight.Medium, lineHeight = 37.996.sp, letterSpacing = (-0.0236).em),
    baseTitle1Regular(size = 28.sp, fontWeight = FontWeight.Normal, lineHeight = 37.996.sp, letterSpacing = (-0.0236).em),
    baseTitle2Bold(size = 22.sp, fontWeight = FontWeight.Bold, lineHeight = 30.008.sp, letterSpacing = (-0.0194).em),
    baseTitle2Medium(size = 22.sp, fontWeight = FontWeight.Medium, lineHeight = 30.008.sp, letterSpacing = (-0.0194).em),
    baseTitle2Regular(size = 22.sp, fontWeight = FontWeight.Normal, lineHeight = 30.008.sp, letterSpacing = (-0.0194).em),
    baseTitle3Bold(size = 20.sp, fontWeight = FontWeight.Bold, lineHeight = 28.sp, letterSpacing = (-0.012).em),
    baseTitle3Medium(size = 20.sp, fontWeight = FontWeight.Medium, lineHeight = 28.sp, letterSpacing = (-0.012).em),
    baseTitle3Regular(size = 20.sp, fontWeight = FontWeight.Normal, lineHeight = 28.sp, letterSpacing = (-0.012).em),
    pointDisplay(size = 40.sp, fontWeight = FontWeight.Normal, lineHeight = 48.sp, letterSpacing = (-0.01).em),
    pointHeading(size = 20.sp, fontWeight = FontWeight.Normal, lineHeight = 24.sp, letterSpacing = 0.em),
    pointLabel(size = 14.sp, fontWeight = FontWeight.Normal, lineHeight = 18.004.sp, letterSpacing = 0.01.em),
    pointTitle(size = 28.sp, fontWeight = FontWeight.Normal, lineHeight = 33.992.sp, letterSpacing = (-0.005).em),
}
