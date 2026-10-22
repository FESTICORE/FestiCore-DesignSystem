import fs from 'node:fs';
import path from 'node:path';
import StyleDictionary from 'style-dictionary';

const root = path.resolve(import.meta.dirname, '..');
const tokenRoot = process.env.FESTICORE_TOKEN_ROOT ?? path.join(root, 'tokens');
const outputRoot = process.env.FESTICORE_OUTPUT_ROOT ?? path.join(root, 'generated/ios');
const reference = /^\{([^{}]+)\}$/;

function fail(message) { throw new Error(message); }
function leafEntries(node, prefix = [], result = new Map()) {
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    const next = [...prefix, key];
    if (value && typeof value === 'object' && '$value' in value) result.set(next.join('.'), value);
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
function loadTheme(theme, sets = JSON.parse(fs.readFileSync(path.join(tokenRoot, '$themes.json'), 'utf8'))) {
  const selected = sets.find(item => item.id === theme)?.selectedTokenSets;
  if (!selected) fail(`Missing theme: ${theme}`);
  const all = new Map();
  const enabled = new Set();
  for (const [set, mode] of Object.entries(selected)) {
    if (!['source', 'enabled', 'disabled'].includes(mode)) fail(`Invalid set mode: ${set} ${mode}`);
    if (mode === 'disabled') continue;
    if (!/^[a-z0-9/.-]+$/.test(set)) fail(`Unsafe token set: ${set}`);
    const file = path.join(tokenRoot, `${set}.json`);
    const entries = leafEntries(JSON.parse(fs.readFileSync(file, 'utf8')));
    for (const [name, token] of entries) {
      if (all.has(name)) fail(`Duplicate token: ${name} in ${theme}`);
      if (typeof token.$type !== 'string') fail(`Missing type: ${name}`);
      all.set(name, token);
      if (mode === 'enabled') enabled.add(name);
    }
  }
  const visiting = new Set();
  const resolved = new Map();
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
  const raw = /** @type {Record<string, any>} */ ({});
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
function rgba(value, label) {
  if (typeof value !== 'string' || !/^#[0-9A-Fa-f]{6}(?:[0-9A-Fa-f]{2})?$/.test(value)) fail(`Invalid hex color: ${label}`);
  const hex = value.slice(1);
  return [0, 2, 4].map(i => format(parseInt(hex.slice(i, i + 2), 16) / 255)).concat(format(hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1));
}
function write(relative, content) {
  const dest = path.join(outputRoot, relative);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content);
}
function generateColors(light, dark, names) {
  const lines = ['// Generated from FestiCore-DesignSystem tokens. Do not edit.', 'import UIKit', '', 'public enum FestiCoreColor {'];
  for (const name of names) {
    const symbol = swiftName(name, 'color');
    const lightHex = light.resolved.get(name), darkHex = dark.resolved.get(name);
    if (light.all.get(name).$type !== 'color' || dark.all.get(name).$type !== 'color') fail(`Invalid color type: ${name}`);
    const l = rgba(lightHex, name), d = rgba(darkHex, name);
    lines.push(`  public static var ${symbol}: UIColor {`, '    UIColor { traits in', `      let rgba: (CGFloat, CGFloat, CGFloat, CGFloat) = traits.userInterfaceStyle == .dark ? (${d.join(', ')}) : (${l.join(', ')})`, '      return UIColor(red: rgba.0, green: rgba.1, blue: rgba.2, alpha: rgba.3)', '    }', '  }', '');
    const asset = { colors: [
      { color: { 'color-space': 'srgb', components: Object.fromEntries(['red','green','blue','alpha'].map((key, i) => [key, l[i]])) }, idiom: 'universal' },
      { appearances: [{ appearance: 'luminosity', value: 'dark' }], color: { 'color-space': 'srgb', components: Object.fromEntries(['red','green','blue','alpha'].map((key, i) => [key, d[i]])) }, idiom: 'universal' }
    ], info: { author: 'xcode', version: 1 } };
    write(`Assets/FestiCoreColors.xcassets/${symbol}.colorset/Contents.json`, `${JSON.stringify(asset, null, 2)}\n`);
  }
  lines.push('}', '');
  write('Sources/FestiCoreColor.swift', lines.join('\n'));
  write('Assets/FestiCoreColors.xcassets/Contents.json', `${JSON.stringify({info:{author:'xcode',version:1}},null,2)}\n`);
}
function generateLayout(light, spacing, radius) {
  const lines = ['// Generated from FestiCore-DesignSystem tokens. Do not edit.', 'import CoreGraphics', '', 'public enum FestiCoreSpacing {'];
  for (const name of spacing) {
    if (light.all.get(name).$type !== 'dimension') fail(`Invalid spacing type: ${name}`);
    lines.push(`  public static let ${swiftName(name, 'spacing')}: CGFloat = ${format(dimension(light.resolved.get(name), name))}`);
  }
  lines.push('}', '', 'public enum FestiCoreRadius {');
  for (const name of radius) {
    if (light.all.get(name).$type !== 'dimension') fail(`Invalid radius type: ${name}`);
    lines.push(`  public static let ${swiftName(name, 'radius')}: CGFloat = ${format(dimension(light.resolved.get(name), name))}`);
  }
  lines.push('}', '');
  write('Sources/FestiCoreLayout.swift', lines.join('\n'));
}
function generateTypography(light, names) {
  const lines = ['// Generated from FestiCore-DesignSystem tokens. Do not edit.', 'import UIKit', '', 'public struct FestiCoreTextStyle {',
    '  public let size: CGFloat', '  public let weight: UIFont.Weight', '  public let lineHeight: CGFloat', '  public let letterSpacing: CGFloat', '  public let fontFamily: String', '',
    '  public var font: UIFont { UIFont.systemFont(ofSize: size, weight: weight) }', '  public var lineSpacing: CGFloat { max(0, size * lineHeight - font.lineHeight) }', '',
    '  public init(size: CGFloat, weight: UIFont.Weight, lineHeight: CGFloat, letterSpacing: CGFloat, fontFamily: String) {',
    '    self.size = size', '    self.weight = weight', '    self.lineHeight = lineHeight', '    self.letterSpacing = letterSpacing', '    self.fontFamily = fontFamily', '  }', '}', '', '@MainActor public enum FestiCoreTypography {'];
  const families = ['base', 'point'];
  for (const group of families) {
    const value = light.resolved.get(`font-family.${group}`);
    if (!Array.isArray(value) || typeof value[0] !== 'string' || !value[0]) fail(`Invalid font family: ${group}`);
    lines.push(`  public static let ${group}FontFamily = ${JSON.stringify(value[0])}`);
  }
  lines.push('  // Font files are not bundled. The system font is used until licensed assets are provided.');
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
  write('Sources/FestiCoreTypography.swift', lines.join('\n'));
}
export async function buildIOS() {
  const light = loadTheme('light'), dark = loadTheme('dark');
  // Style Dictionary v4 performs an independent DTCG parse/reference pass for each theme.
  for (const theme of [light, dark]) {
    const sd = new StyleDictionary({ tokens: theme.raw, usesDtcg: true, platforms: { ios: { transforms: [] } } });
    await sd.getPlatformTokens('ios');
  }
  const colors = samePathsAndValues(light, dark, 'color');
  if (colors.some(name => name.startsWith('color.atomic.'))) fail('Atomic color is enabled for output');
  const spacing = samePathsAndValues(light, dark, 'spacing');
  const radius = samePathsAndValues(light, dark, 'radius');
  const typography = samePathsAndValues(light, dark, 'text-style');
  for (const [group, names] of [['color',colors],['spacing',spacing],['radius',radius],['text-style',typography]]) assertNames(names, group, group);
  const snapshot = JSON.parse(fs.readFileSync(path.join(root, 'tests/fixtures/public-color-names.json'), 'utf8'));
  if (JSON.stringify(colors.map(name => swiftName(name, 'color')).sort()) !== JSON.stringify(snapshot)) fail('Public color names differ from iOS API snapshot');
  fs.rmSync(outputRoot, {recursive:true,force:true});
  generateColors(light, dark, colors);
  generateLayout(light, spacing, radius);
  generateTypography(light, typography);
  return { colors: colors.length, spacing: spacing.length, radius: radius.length, typography: typography.length };
}
if (process.argv[1] && path.resolve(process.argv[1]) === new URL(import.meta.url).pathname) {
  buildIOS().then(counts => console.log(`Generated iOS tokens: ${JSON.stringify(counts)}`)).catch(error => { console.error(error); process.exitCode = 1; });
}
