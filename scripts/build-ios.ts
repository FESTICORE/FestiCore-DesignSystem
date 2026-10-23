import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import StyleDictionary from 'style-dictionary';

const root = path.resolve(import.meta.dirname, '..');
const tokenRoot = path.join(root, 'tokens');
const outputRoot = path.join(root, 'generated/ios');
const reference = /^\{([^{}]+)\}$/;
type Token = { $type: string; $value: unknown };
type Theme = {
  raw: Record<string, unknown>;
  all: Map<string, Token>;
  enabled: Set<string>;
  resolved: Map<string, any>;
};
type SwiftOutputs = Map<string, string>;

function fail(message) { throw new Error(message); }
function parseUniqueJSON(file) {
  const source = fs.readFileSync(file, 'utf8');
  let offset = 0;
  function spaces() { while (/\s/.test(source[offset] ?? '')) offset++; }
  function quoted() {
    const start = offset++;
    while (offset < source.length) {
      if (source[offset] === '\\') { offset += 2; continue; }
      if (source[offset++] === '"') return JSON.parse(source.slice(start, offset));
    }
    fail(`Invalid JSON string: ${file}`);
  }
  function value() {
    spaces();
    if (source[offset] === '{') {
      offset++;
      spaces();
      const keys = new Set();
      while (source[offset] !== '}' && offset < source.length) {
        if (source[offset] !== '"') fail(`Invalid JSON object: ${file}`);
        const key = quoted();
        if (keys.has(key)) fail(`Duplicate JSON key: ${key} in ${file}`);
        keys.add(key);
        spaces();
        if (source[offset++] !== ':') fail(`Invalid JSON object: ${file}`);
        value();
        spaces();
        if (source[offset] !== ',') break;
        offset++;
        spaces();
      }
      if (source[offset++] !== '}') fail(`Invalid JSON object: ${file}`);
    } else if (source[offset] === '[') {
      offset++;
      spaces();
      while (source[offset] !== ']' && offset < source.length) {
        value();
        spaces();
        if (source[offset] !== ',') break;
        offset++;
      }
      if (source[offset++] !== ']') fail(`Invalid JSON array: ${file}`);
    } else if (source[offset] === '"') quoted();
    else {
      const start = offset;
      while (offset < source.length && !/[\s,\]}]/.test(source[offset])) offset++;
      if (start === offset) fail(`Invalid JSON value: ${file}`);
    }
    spaces();
  }
  value();
  return JSON.parse(source);
}
function leafEntries(node, prefix = [], result = new Map()) {
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    if (/[.{}]/.test(key)) fail(`Invalid token path segment: ${key}`);
    const next = [...prefix, key];
    if (value && typeof value === 'object' && '$value' in value) {
      const name = next.join('.');
      if (result.has(name)) fail(`Duplicate token: ${name}`);
      result.set(name, value);
    }
    else if (value && typeof value === 'object' && !Array.isArray(value)) leafEntries(value, next, result);
    else fail(`Invalid token node: ${next.join('.')}`);
  }
  return result;
}
function setPath(object, keys, value) {
  let cursor = object;
  for (const key of keys.slice(0, -1)) cursor = cursor[key] ??= {};
  cursor[keys.at(-1)] = value;
}
function loadTheme(theme: 'light' | 'dark', sets = parseUniqueJSON(path.join(tokenRoot, '$themes.json'))): Theme {
  const selected = sets.find(item => item.id === theme)?.selectedTokenSets as Record<string, string> | undefined;
  if (!selected) fail(`Missing theme: ${theme}`);
  const all = new Map<string, Token>();
  const enabled = new Set<string>();
  for (const [set, mode] of Object.entries(selected)) {
    if (!['source', 'enabled', 'disabled'].includes(mode)) fail(`Invalid set mode: ${set} ${mode}`);
    if (mode === 'disabled') continue;
    if (!/^[a-z0-9.-]+(?:\/[a-z0-9.-]+)*$/.test(set) || set.split('/').some(part => part === '.' || part === '..')) fail(`Unsafe token set: ${set}`);
    const file = path.resolve(tokenRoot, `${set}.json`);
    if (!file.startsWith(`${path.resolve(tokenRoot)}${path.sep}`)) fail(`Unsafe token set: ${set}`);
    const entries = leafEntries(parseUniqueJSON(file));
    for (const [name, token] of entries) {
      if (all.has(name)) fail(`Duplicate token: ${name} in ${theme}`);
      if (typeof token.$type !== 'string') fail(`Missing type: ${name}`);
      all.set(name, token);
      if (mode === 'enabled') enabled.add(name);
    }
  }
  const visiting = new Set<string>();
  const resolved = new Map<string, any>();
  function resolve(name) {
    if (resolved.has(name)) return resolved.get(name);
    if (visiting.has(name)) fail(`Circular alias: ${name}`);
    const token = all.get(name);
    if (!token) fail(`Unresolved alias: ${name}`);
    visiting.add(name);
    function valueOf(value) {
      if (typeof value === 'string') {
        const match = value.match(reference);
        if (match) {
          const target = all.get(match[1]);
          if (!target) fail(`Unresolved alias: ${match[1]}`);
          if (target.$type !== token.$type && token.$type !== 'typography') fail(`Invalid alias type: ${name} -> ${match[1]}`);
          return resolve(match[1]);
        }
        if (value.includes('{') || value.includes('}')) fail(`Unsupported alias expression: ${name}`);
      }
      if (Array.isArray(value)) return value.map(valueOf);
      if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, part]) => [key, valueOf(part)]));
      return value;
    }
    const value = valueOf(token.$value);
    visiting.delete(name);
    resolved.set(name, value);
    return value;
  }
  for (const name of all.keys()) resolve(name);
  const raw: Record<string, unknown> = {};
  for (const [name, token] of all) setPath(raw, name.split('.'), token);
  return { raw, all, enabled, resolved };
}
const exported = (theme, group) => [...theme.enabled].filter(name => name.startsWith(`${group}.`)).sort();
function samePathsAndValues(light, dark, group) {
  const a = exported(light, group), b = exported(dark, group);
  if (JSON.stringify(a) !== JSON.stringify(b)) fail(`${group} paths differ between themes`);
  if (group !== 'color') for (const name of a) if (JSON.stringify(light.resolved.get(name)) !== JSON.stringify(dark.resolved.get(name))) fail(`${group} value differs: ${name}`);
  return a;
}
function swiftName(name, prefix) {
  const parts = name.slice(prefix.length + 1).split('.');
  return parts.map((part, index) => {
    const words = part.split('-');
    return index === 0 ? words.join('') : words.map(word => word[0].toUpperCase() + word.slice(1)).join('');
  }).join('');
}
function assertNames(names, group, prefix) {
  const seen = new Set();
  for (const name of names) {
    const swift = swiftName(name, prefix);
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(swift) || seen.has(swift)) fail(`${group} Swift name collision/invalid name: ${name} -> ${swift}`);
    seen.add(swift);
  }
}
function number(value, label) {
  if (typeof value !== 'number' || !Number.isFinite(value)) fail(`Invalid number: ${label}`);
  return value;
}
function dimension(value, label) {
  if (typeof value !== 'string' || !/^-?\d+(?:\.\d+)?px$/.test(value)) fail(`Invalid px dimension: ${label}`);
  return number(Number(value.slice(0, -2)), label);
}
function format(value) { return Number(value.toFixed(10)).toString(); }
function hexColor(value, label) {
  if (typeof value !== 'string' || !/^#[0-9A-Fa-f]{6}(?:[0-9A-Fa-f]{2})?$/.test(value)) fail(`Invalid hex color: ${label}`);
  const hex = value.slice(1).toUpperCase();
  const alpha = hex.length === 8 ? `, alpha: 0x${hex.slice(6, 8)}` : '';
  return `UIColor.festiCore(hex: 0x${hex.slice(0, 6)}${alpha})`;
}
function collectOutput(outputs: SwiftOutputs, relative: string, content: string) {
  outputs.set(relative, content);
}
function swiftHeader(filename) {
  return [
    '//',
    `//  ${filename}`,
    '//  FestiCoreDesignKit',
    '//',
    '//  Created by FestiCore-DesignSystem generator.',
    '//',
    '',
  ];
}
function clearGeneratedOutput() {
  if (process.env.FESTICORE_OUTPUT_ROOT) fail('FESTICORE_OUTPUT_ROOT is not supported');
  const marker = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  if (marker.name !== 'festicore-design-system') fail('Unsafe output root: project marker mismatch');
  const parent = path.dirname(outputRoot);
  fs.mkdirSync(parent, { recursive: true });
  if (fs.realpathSync(parent) !== path.join(fs.realpathSync(root), 'generated')) fail('Unsafe output root: generated directory is redirected');
  const current = fs.lstatSync(outputRoot, { throwIfNoEntry: false });
  if (current && !current.isDirectory()) fail('Unsafe output root: expected directory');
  fs.rmSync(outputRoot, { recursive: true, force: true });
}
function generateColors(light, dark, names, outputs) {
  const uiLines = [...swiftHeader('UIColors.swift'), 'import UIKit', '', 'public extension UIColor {'];
  const colorLines = [...swiftHeader('Colors.swift'), 'import SwiftUI', '', 'public extension Color {'];
  const shapeLines = [...swiftHeader('ShapeStyle+.swift'), 'import SwiftUI', '', 'public extension ShapeStyle where Self == Color {'];
  for (const name of names) {
    const symbol = swiftName(name, 'color');
    const lightHex = light.resolved.get(name), darkHex = dark.resolved.get(name);
    if (light.all.get(name).$type !== 'color' || dark.all.get(name).$type !== 'color') fail(`Invalid color type: ${name}`);
    const l = hexColor(lightHex, name), d = hexColor(darkHex, name);
    if (lightHex.toUpperCase() === darkHex.toUpperCase()) {
      uiLines.push(`  static let ${symbol} = ${l}`, '');
    } else {
      uiLines.push(`  static let ${symbol} = UIColor { traits in`, `    traits.userInterfaceStyle == .dark ? ${d} : ${l}`, '  }', '');
    }
    colorLines.push(`  static var ${symbol}: Color { Color(uiColor: UIColor.${symbol}) }`);
    shapeLines.push(`  static var ${symbol}: Color { Color.${symbol} }`);
  }
  uiLines.push(
    '}', '',
    'private extension UIColor {',
    '  static func festiCore(hex: UInt32, alpha: UInt8 = 0xFF) -> UIColor {',
    '    UIColor(',
    '      red: CGFloat((hex >> 16) & 0xFF) / 255,',
    '      green: CGFloat((hex >> 8) & 0xFF) / 255,',
    '      blue: CGFloat(hex & 0xFF) / 255,',
    '      alpha: CGFloat(alpha) / 255',
    '    )',
    '  }',
    '}', ''
  );
  colorLines.push('}', '');
  shapeLines.push('}', '');
  collectOutput(outputs, 'Sources/UIColors.swift', uiLines.join('\n'));
  collectOutput(outputs, 'Sources/Colors.swift', colorLines.join('\n'));
  collectOutput(outputs, 'Sources/ShapeStyle+.swift', shapeLines.join('\n'));
}
function generateLayout(light, spacing, radius, disabledOpacity, outputs) {
  const lines = [...swiftHeader('FestiCoreLayout.swift'), 'import CoreGraphics', '', 'public enum FestiCoreSpacing {'];
  for (const name of spacing) {
    if (light.all.get(name).$type !== 'dimension') fail(`Invalid spacing type: ${name}`);
    lines.push(`  public static let ${swiftName(name, 'spacing')}: CGFloat = ${format(dimension(light.resolved.get(name), name))}`);
  }
  lines.push('}', '', 'public enum FestiCoreRadius {');
  for (const name of radius) {
    if (light.all.get(name).$type !== 'dimension') fail(`Invalid radius type: ${name}`);
    lines.push(`  public static let ${swiftName(name, 'radius')}: CGFloat = ${format(dimension(light.resolved.get(name), name))}`);
  }
  lines.push('}', '', '// 비활성 요소 전체에 적용한다. pressed·active는 semantic interaction 색을 사용한다.', 'public enum FestiCoreState {', `  public static let disabledOpacity: CGFloat = ${format(number(disabledOpacity, 'state.disabled'))}`, '}', '');
  collectOutput(outputs, 'Sources/FestiCoreLayout.swift', lines.join('\n'));
}
function generateTypography(light, names, outputs) {
  const lines = [...swiftHeader('FestiCoreTypography.swift'), 'import UIKit', '', 'public struct FestiCoreTextStyle {',
    '  public let size: CGFloat', '  public let weight: UIFont.Weight', '  public let lineHeight: CGFloat', '  public let letterSpacing: CGFloat', '  public let fontFamily: String', '',
    '  // 실제 서체와 줄 간격은 앱에 번들된 폰트로 계산한다.',
    '  public init(size: CGFloat, weight: UIFont.Weight, lineHeight: CGFloat, letterSpacing: CGFloat, fontFamily: String) {',
    '    self.size = size', '    self.weight = weight', '    self.lineHeight = lineHeight', '    self.letterSpacing = letterSpacing', '    self.fontFamily = fontFamily', '  }', '}', '', '@MainActor public enum FestiCoreTypography {'];
  const families = ['base', 'point'];
  for (const group of families) {
    const value = light.resolved.get(`font-family.${group}`);
    if (!Array.isArray(value) || typeof value[0] !== 'string' || !value[0]) fail(`Invalid font family: ${group}`);
    lines.push(`  public static let ${group}FontFamily = ${JSON.stringify(value[0])}`);
  }
  lines.push('  // letterSpacing은 em × fontSize로 계산한 pt 값이다.');
  for (const name of names) {
    if (light.all.get(name).$type !== 'typography') fail(`Invalid typography type: ${name}`);
    const style = light.resolved.get(name);
    const size = dimension(style.fontSize, `${name}.fontSize`);
    const weight = number(style.fontWeight, `${name}.fontWeight`);
    if (![400,500,700].includes(weight)) fail(`Unsupported font weight: ${name}`);
    const family = style.fontFamily;
    const familyGroup = families.find(group => JSON.stringify(light.resolved.get(`font-family.${group}`)) === JSON.stringify(family));
    if (!familyGroup) fail(`Unsupported family: ${name}`);
    const height = number(style.lineHeight, `${name}.lineHeight`);
    if (height <= 0) fail(`Invalid line height: ${name}`);
    if (typeof style.letterSpacing !== 'string' || !/^-?\d+(?:\.\d+)?em$/.test(style.letterSpacing)) fail(`Invalid letter spacing: ${name}`);
    const kern = number(Number(style.letterSpacing.slice(0, -2)) * size, `${name}.letterSpacing`);
    const enumWeight = {400:'regular',500:'medium',700:'bold'}[weight];
    lines.push(`  public static let ${swiftName(name, 'text-style')} = FestiCoreTextStyle(size: ${format(size)}, weight: .${enumWeight}, lineHeight: ${format(height)}, letterSpacing: ${format(kern)}, fontFamily: ${familyGroup}FontFamily)`);
  }
  lines.push('}', '');
  collectOutput(outputs, 'Sources/FestiCoreTypography.swift', lines.join('\n'));
}
export async function buildIOS() {
  if (process.env.FESTICORE_OUTPUT_ROOT) fail('FESTICORE_OUTPUT_ROOT is not supported');
  const light = loadTheme('light'), dark = loadTheme('dark');
  // 테마별 DTCG 별칭 해석 결과를 Style Dictionary와 대조한다.
  for (const theme of [light, dark]) {
    const sd = new StyleDictionary({ tokens: theme.raw, usesDtcg: true, platforms: { ios: { transforms: [] } } });
    const dictionary = await sd.getPlatformTokens('ios');
    for (const [name, expected] of theme.resolved) {
      const actual = dictionary.tokenMap.get(`{${name}}`)?.$value;
      if (JSON.stringify(actual) !== JSON.stringify(expected)) fail(`Style Dictionary resolution differs: ${name}`);
      theme.resolved.set(name, actual);
    }
  }
  const colors = samePathsAndValues(light, dark, 'color');
  if (colors.some(name => name.startsWith('color.atomic.'))) fail('Atomic color is enabled for output');
  const spacing = samePathsAndValues(light, dark, 'spacing');
  const radius = samePathsAndValues(light, dark, 'radius');
  const state = samePathsAndValues(light, dark, 'state');
  if (!state.includes('state.disabled')) fail('Missing state.disabled');
  const typography = samePathsAndValues(light, dark, 'text-style');
  for (const [group, names] of [['color',colors],['spacing',spacing],['radius',radius],['text-style',typography]]) assertNames(names, group, group);
  const snapshot = JSON.parse(fs.readFileSync(path.join(root, 'tests/fixtures/public-color-names.json'), 'utf8'));
  if (JSON.stringify(colors.map(name => swiftName(name, 'color')).sort()) !== JSON.stringify(snapshot)) fail('Public color names differ from iOS API snapshot');
  const outputs = new Map();
  generateColors(light, dark, colors, outputs);
  generateLayout(light, spacing, radius, light.resolved.get('state.disabled'), outputs);
  generateTypography(light, typography, outputs);
  clearGeneratedOutput();
  for (const [relative, content] of outputs) {
    const dest = path.join(outputRoot, relative);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, content);
  }
  return { colors: colors.length, spacing: spacing.length, radius: radius.length, typography: typography.length };
}
if (process.argv[1] && fs.realpathSync(path.resolve(process.argv[1])) === fs.realpathSync(fileURLToPath(import.meta.url))) {
  buildIOS().then(counts => console.log(`Generated iOS tokens: ${JSON.stringify(counts)}`)).catch(error => { console.error(error); process.exitCode = 1; });
}
