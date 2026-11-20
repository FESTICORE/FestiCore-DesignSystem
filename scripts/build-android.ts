import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  dimension,
  fail,
  format,
  loadValidatedTokens,
  number,
  swiftName,
} from "./build-ios.ts";

const root = path.resolve(import.meta.dirname, "..");
const outputRoot = path.join(root, "generated/android");
const packageName = "io.festicore.ui.designkit.tokens";

function kotlinHeader(filename: string) {
  return [
    "//",
    `//  ${filename}`,
    "//  FestiCoreDesignKit",
    "//",
    "//  Created by FestiCore-DesignSystem generator.",
    "//",
    "",
    `package ${packageName}`,
    "",
  ];
}
// #RRGGBB(AA) → Compose Color(0xAARRGGBB)
export function composeColor(value: unknown, label: string) {
  if (
    typeof value !== "string" ||
    !/^#[0-9A-Fa-f]{6}(?:[0-9A-Fa-f]{2})?$/.test(value)
  )
    fail(`Invalid hex color: ${label}`);
  const hex = (value as string).slice(1).toUpperCase();
  const alpha = hex.length === 8 ? hex.slice(6, 8) : "FF";
  return `Color(0x${alpha}${hex.slice(0, 6)})`;
}
function kotlinNumber(value: number) {
  const text = format(value);
  return value < 0 ? `(${text})` : text;
}
function generateColors(light, dark, names: string[]) {
  const lines = [
    ...kotlinHeader("FestiCoreSemanticColor.kt"),
    "import androidx.compose.foundation.isSystemInDarkTheme",
    "import androidx.compose.runtime.Composable",
    "import androidx.compose.runtime.Immutable",
    "import androidx.compose.runtime.ReadOnlyComposable",
    "import androidx.compose.ui.graphics.Color",
    "",
    "// 화면에는 semantic 색만 노출한다. 값은 Light/Dark 토큰에서 생성되고 시스템 다크 모드에 반응한다.",
    "@Immutable",
    "class FestiCoreSemanticColor private constructor(",
    "    val light: Color,",
    "    val dark: Color,",
    ") {",
    "    val color: Color",
    "        @Composable",
    "        @ReadOnlyComposable",
    "        get() = if (isSystemInDarkTheme()) dark else light",
    "",
    "    companion object {",
  ];
  for (const name of names) {
    if (
      light.all.get(name).$type !== "color" ||
      dark.all.get(name).$type !== "color"
    )
      fail(`Invalid color type: ${name}`);
    const l = composeColor(light.resolved.get(name), name),
      d = composeColor(dark.resolved.get(name), name);
    lines.push(
      `        val ${swiftName(name, "color")} = FestiCoreSemanticColor(light = ${l}, dark = ${d})`,
    );
  }
  lines.push("    }", "}", "");
  return lines.join("\n");
}
function generateLayout(
  light,
  spacing: string[],
  radius: string[],
  disabledOpacity: unknown,
) {
  const lines = [
    ...kotlinHeader("FestiCoreLayout.kt"),
    "import androidx.compose.ui.unit.Dp",
    "import androidx.compose.ui.unit.dp",
    "",
    "object FestiCoreSpacing {",
  ];
  for (const name of spacing) {
    if (light.all.get(name).$type !== "dimension")
      fail(`Invalid spacing type: ${name}`);
    lines.push(
      `    val ${swiftName(name, "spacing")}: Dp = ${kotlinNumber(dimension(light.resolved.get(name), name))}.dp`,
    );
  }
  lines.push("}", "", "object FestiCoreRadius {");
  for (const name of radius) {
    if (light.all.get(name).$type !== "dimension")
      fail(`Invalid radius type: ${name}`);
    lines.push(
      `    val ${swiftName(name, "radius")}: Dp = ${kotlinNumber(dimension(light.resolved.get(name), name))}.dp`,
    );
  }
  lines.push(
    "}",
    "",
    "// 비활성 요소 전체에 적용한다. pressed·active는 semantic interaction 색을 사용한다.",
    "object FestiCoreState {",
    `    const val disabledOpacity: Float = ${format(number(disabledOpacity, "state.disabled"))}f`,
    "}",
    "",
  );
  return lines.join("\n");
}
function generateTypography(light, names: string[]) {
  for (const group of ["base", "point"]) {
    const value = light.resolved.get(`font-family.${group}`);
    if (!Array.isArray(value) || value[0] !== "Pretendard")
      fail(`Invalid font family: ${group}`);
  }
  const lines = [
    ...kotlinHeader("FestiCoreTypography.kt"),
    "import androidx.compose.ui.text.font.FontWeight",
    "import androidx.compose.ui.unit.TextUnit",
    "import androidx.compose.ui.unit.em",
    "import androidx.compose.ui.unit.sp",
    "",
    "// 서체는 Pretendard다. lineHeight는 원본 배수 × fontSize(sp), letterSpacing은 원본 em 값이다.",
    "enum class FestiCoreTextStyle(",
    "    val size: TextUnit,",
    "    val fontWeight: FontWeight,",
    "    val lineHeight: TextUnit,",
    "    val letterSpacing: TextUnit,",
    ") {",
  ];
  for (const name of names) {
    if (light.all.get(name).$type !== "typography")
      fail(`Invalid typography type: ${name}`);
    const style = light.resolved.get(name);
    const size = dimension(style.fontSize, `${name}.fontSize`);
    const weight = number(style.fontWeight, `${name}.fontWeight`);
    const fontWeight = (
      { 400: "Normal", 500: "Medium", 700: "Bold" } as Record<number, string>
    )[weight];
    if (!fontWeight) fail(`Unsupported font weight: ${name}`);
    const familyGroup = name.split(".")[1];
    const rawFamily = (light.all.get(name).$value as Record<string, unknown>)
      .fontFamily;
    if (
      !["base", "point"].includes(familyGroup) ||
      rawFamily !== `{font-family.${familyGroup}}`
    )
      fail(`Unsupported family alias: ${name}`);
    const height = number(style.lineHeight, `${name}.lineHeight`);
    if (height <= 0) fail(`Invalid line height: ${name}`);
    if (
      typeof style.letterSpacing !== "string" ||
      !/^-?\d+(?:\.\d+)?em$/.test(style.letterSpacing)
    )
      fail(`Invalid letter spacing: ${name}`);
    const em = number(
      Number(style.letterSpacing.slice(0, -2)),
      `${name}.letterSpacing`,
    );
    lines.push(
      `    ${swiftName(name, "text-style")}(size = ${kotlinNumber(size)}.sp, fontWeight = FontWeight.${fontWeight}, lineHeight = ${kotlinNumber(height * size)}.sp, letterSpacing = ${kotlinNumber(em)}.em),`,
    );
  }
  lines.push("}", "");
  return lines.join("\n");
}
function clearGeneratedOutput() {
  const marker = JSON.parse(
    fs.readFileSync(path.join(root, "package.json"), "utf8"),
  );
  if (marker.name !== "festicore-design-system")
    fail("Unsafe output root: project marker mismatch");
  const parent = path.dirname(outputRoot);
  fs.mkdirSync(parent, { recursive: true });
  if (fs.realpathSync(parent) !== path.join(fs.realpathSync(root), "generated"))
    fail("Unsafe output root: generated directory is redirected");
  const current = fs.lstatSync(outputRoot, { throwIfNoEntry: false });
  if (current && !current.isDirectory())
    fail("Unsafe output root: expected directory");
  fs.rmSync(outputRoot, { recursive: true, force: true });
}
export async function buildAndroid() {
  const { light, dark, colors, spacing, radius, typography } =
    await loadValidatedTokens();
  const outputs = new Map<string, string>([
    ["tokens/FestiCoreSemanticColor.kt", generateColors(light, dark, colors)],
    [
      "tokens/FestiCoreLayout.kt",
      generateLayout(
        light,
        spacing,
        radius,
        light.resolved.get("state.disabled"),
      ),
    ],
    ["tokens/FestiCoreTypography.kt", generateTypography(light, typography)],
  ]);
  clearGeneratedOutput();
  for (const [relative, content] of outputs) {
    const dest = path.join(outputRoot, relative);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, content);
  }
  return {
    colors: colors.length,
    spacing: spacing.length,
    radius: radius.length,
    typography: typography.length,
  };
}
if (
  process.argv[1] &&
  fs.realpathSync(path.resolve(process.argv[1])) ===
    fs.realpathSync(fileURLToPath(import.meta.url))
) {
  buildAndroid()
    .then((counts) =>
      console.log(`Generated Android tokens: ${JSON.stringify(counts)}`),
    )
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
