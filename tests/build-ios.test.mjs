import assert from 'node:assert/strict';
import { test } from 'node:test';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
function fixture(repoName = 'repo') {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'festicore-tokens-'));
  const repo = path.join(dir, repoName);
  const tokens = path.join(repo, 'tokens');
  const output = path.join(repo, 'generated/ios');
  fs.mkdirSync(path.join(repo, 'tests/fixtures'), { recursive: true });
  fs.cpSync(path.join(root, 'tokens'), tokens, { recursive: true });
  fs.cpSync(path.join(root, 'scripts'), path.join(repo, 'scripts'), { recursive: true });
  fs.copyFileSync(path.join(root, 'package.json'), path.join(repo, 'package.json'));
  fs.copyFileSync(path.join(root, 'tests/fixtures/public-color-names.json'), path.join(repo, 'tests/fixtures/public-color-names.json'));
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(repo, 'node_modules'));
  return { dir, repo, tokens, output };
}
function run(f) {
  return spawnSync(process.execPath, [path.join(f.repo, 'scripts/build-ios.ts')], { encoding: 'utf8' });
}
function edit(f, filename, change) {
  const file = path.join(f.tokens, filename);
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  change(json);
  fs.writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
}
function cleanup(f) { fs.rmSync(f.dir, { recursive: true, force: true }); }
function snapshot(directory) {
  const files = new Map();
  function visit(current, relative = '') {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const name = path.join(relative, entry.name);
      if (entry.isDirectory()) visit(path.join(current, entry.name), name);
      else files.set(name, fs.readFileSync(path.join(current, entry.name)));
    }
  }
  visit(directory);
  return files;
}
function expectFailure(change, message) {
  const f = fixture();
  try {
    change(f);
    const result = run(f);
    assert.notEqual(result.status, 0, 'Invalid tokens unexpectedly built');
    assert.match(result.stderr, message);
  } finally { cleanup(f); }
}

test('light/dark semantic colors are deterministic without assets', () => {
  const f = fixture();
  try {
    let result = run(f);
    assert.equal(result.status, 0, result.stderr);
    const semantic = fs.readFileSync(path.join(f.output, 'Sources/FestiCoreSemanticColor.swift'), 'utf8');
    const shape = fs.readFileSync(path.join(f.output, 'Sources/ShapeStyle+.swift'), 'utf8');
    const layout = fs.readFileSync(path.join(f.output, 'Sources/FestiCoreLayout.swift'), 'utf8');
    const typography = fs.readFileSync(path.join(f.output, 'Sources/FestiCoreTypography.swift'), 'utf8');
    for (const [filename, content] of [['FestiCoreSemanticColor.swift', semantic], ['ShapeStyle+.swift', shape], ['FestiCoreLayout.swift', layout], ['FestiCoreTypography.swift', typography]]) {
      assert.ok(content.includes(`//  ${filename}\n//  FestiCoreDesignKit\n`));
      assert.match(content, /Created by FestiCore-DesignSystem generator\./);
    }
    assert.match(semantic, /public struct FestiCoreSemanticColor: Sendable/);
    assert.match(semantic, /public var color: Color \{ Color\(uiColor: uiColor\) \}/);
    assert.match(semantic, /public var uiColor: UIColor/);
    assert.match(semantic, /traits\.userInterfaceStyle == \.dark/);
    assert.match(semantic, /UIColor\(hex: isDark \? darkHex : lightHex/);
    assert.match(semantic, /static let primaryNormal = FestiCoreSemanticColor\(lightHex: 0x[0-9A-F]{6}/);
    assert.match(semantic, /darkHex: 0x3D7BFF, darkAlpha: 0x1A/);
    assert.match(shape, /static var primaryNormal: Color \{ FestiCoreSemanticColor\.primaryNormal\.color \}/);
    assert.doesNotMatch(semantic, /atomic|public extension Color|public extension ShapeStyle/);
    assert.match(typography, /public enum FestiCoreTextStyle: Sendable/);
    assert.match(typography, /case baseBodyRegular/);
    assert.match(typography, /case pointDisplay/);
    assert.match(typography, /public var fontFamily: PretendardFontFamily/);
    assert.match(typography, /case \.baseLargeTitleBold: return -0\.884/);
    assert.match(typography, /case \.pointDisplay: return 40/);
    assert.match(typography, /case \.pointDisplay: return -0\.4/);
    assert.doesNotMatch(typography, /Bagel|pointFontFamily|public enum FestiCoreTypography/);
    assert.doesNotMatch(typography, /UIFont\.systemFont|public var lineSpacing/);
    assert.match(layout, /disabledOpacity: CGFloat = 0\.3/);
    const names = JSON.parse(fs.readFileSync(path.join(root, 'tests/fixtures/public-color-names.json'), 'utf8'));
    for (const symbol of names) {
      assert.match(semantic, new RegExp(`static let ${symbol} = FestiCoreSemanticColor\\(`));
      assert.match(shape, new RegExp(`static var ${symbol}: Color \\{ FestiCoreSemanticColor\\.${symbol}\\.color \\}`));
    }
    assert.equal(fs.existsSync(path.join(f.output, 'Assets')), false);
    const layoutSymbols = [...layout.matchAll(/public static let (\w+): CGFloat/g)].map(match => match[1]);
    assert.deepEqual(layoutSymbols.sort(), [
      'marginM2','marginM4','marginM6','marginM8','marginM12','marginM16','marginM20','marginM24',
      'paddingP4','paddingP8','paddingP12','paddingP16','paddingP20','paddingP24',
      'r4','r8','r12','r16','r20','r24','disabledOpacity'
    ].sort());
    assert.equal([...typography.matchAll(/^  case \w+$/gm)].length, 37);
    assert.doesNotMatch(layout + typography, /public static let (?:opacity|breakpoint|safeArea|gradient)/i);
    const before = semantic + shape + layout + typography;
    result = run(f);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(['FestiCoreSemanticColor.swift', 'ShapeStyle+.swift', 'FestiCoreLayout.swift', 'FestiCoreTypography.swift'].map(filename => fs.readFileSync(path.join(f.output, 'Sources', filename), 'utf8')).join(''), before);
    assert.equal(fs.existsSync(path.join(f.output, 'Sources/Colors.swift')), false);
    assert.equal(fs.existsSync(path.join(f.output, 'Sources/FestiCoreGradient.swift')), false);
  } finally { cleanup(f); }
});

test('unresolved and circular aliases fail', () => {
  const f = fixture();
  try {
    edit(f, 'color/semantic.light.json', json => { json.color.primary.normal.$value = '{color.atomic.missing}'; });
    assert.match(run(f).stderr, /Unresolved alias/);
    edit(f, 'color/semantic.light.json', json => { json.color.primary.normal.$value = '{color.atomic.common.white}'; });
    edit(f, 'color/atomic.json', json => {
      json.color.atomic.common.white.$value = '{color.atomic.common.black}';
      json.color.atomic.common.black.$value = '{color.atomic.common.white}';
    });
    assert.match(run(f).stderr, /Circular alias/);
  } finally { cleanup(f); }
});

test('theme path mismatch and shared typography value mismatch fail', () => {
  const f = fixture();
  try {
    edit(f, 'color/semantic.dark.json', json => { delete json.color.primary.normal; });
    assert.match(run(f).stderr, /color paths differ/);
    edit(f, 'color/semantic.dark.json', json => { json.color.primary.normal = { $type: 'color', $value: '#C6FF34' }; });
    fs.copyFileSync(path.join(f.tokens, 'typography.json'), path.join(f.tokens, 'typography.dark.json'));
    edit(f, 'typography.dark.json', json => { json['text-style'].base.body.regular.$value.lineHeight = 1.6; });
    edit(f, '$themes.json', json => {
      delete json.find(theme => theme.id === 'dark').selectedTokenSets.typography;
      json.find(theme => theme.id === 'dark').selectedTokenSets['typography.dark'] = 'enabled';
    });
    assert.match(run(f).stderr, /text-style value differs/);
  } finally { cleanup(f); }
});

test('invalid units, output names and enabled atomic colors fail', () => {
  const f = fixture();
  try {
    edit(f, 'typography.json', json => { json['text-style'].base.body.regular.$value.letterSpacing = '2%'; });
    assert.match(run(f).stderr, /Invalid letter spacing/);
    edit(f, 'typography.json', json => { json['text-style'].base.body.regular.$value.letterSpacing = '0em'; });
    for (const theme of ['light','dark']) edit(f, `color/semantic.${theme}.json`, json => { json.color.primary.onPrimary = { $type: 'color', $value: '#FFFFFF' }; });
    assert.match(run(f).stderr, /Swift name collision/);
    for (const theme of ['light','dark']) edit(f, `color/semantic.${theme}.json`, json => { delete json.color.primary.onPrimary; });
    edit(f, '$themes.json', json => { for (const theme of json) theme.selectedTokenSets['color/atomic'] = 'enabled'; });
    assert.match(run(f).stderr, /Atomic color is enabled/);
  } finally { cleanup(f); }
});

test('invalid typography leaves the previous generated output unchanged', () => {
  const f = fixture();
  try {
    const first = run(f);
    assert.equal(first.status, 0, first.stderr);
    fs.writeFileSync(path.join(f.output, 'keep.txt'), 'keep');
    const before = snapshot(f.output);
    edit(f, 'typography.json', json => { json['text-style'].base.body.regular.$value.letterSpacing = '2%'; });
    const invalid = run(f);
    assert.notEqual(invalid.status, 0);
    assert.match(invalid.stderr, /Invalid letter spacing/);
    assert.deepEqual(snapshot(f.output), before);
  } finally { cleanup(f); }
});

test('build CLI runs from a path with spaces and non-ASCII characters', () => {
  const f = fixture('space path 한국어');
  try {
    const result = run(f);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Generated iOS tokens/);
    assert.equal(fs.existsSync(path.join(f.output, 'Sources/FestiCoreSemanticColor.swift')), true);
  } finally { cleanup(f); }
});

test('duplicate token paths and duplicate keys inside JSON fail', () => {
  expectFailure(f => {
    fs.writeFileSync(path.join(f.tokens, 'duplicate.json'), JSON.stringify({ color: { primary: { normal: { $type: 'color', $value: '#FFFFFF' } } } }));
    edit(f, '$themes.json', json => { json[0].selectedTokenSets.duplicate = 'enabled'; });
  }, /Duplicate token: color\.primary\.normal/);
  expectFailure(f => {
    const file = path.join(f.tokens, 'color/semantic.light.json');
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('"normal": {', '"normal": {"$type":"color","$value":"#FFFFFF"}, "normal": {'));
  }, /Duplicate JSON key: normal/);
  expectFailure(f => edit(f, 'color/semantic.light.json', json => {
    json.color['primary.normal'] = { $type: 'color', $value: '#FFFFFF' };
  }), /Invalid token path segment: primary\.normal/);
  expectFailure(f => edit(f, 'color/semantic.light.json', json => {
    json.color['{primary}'] = { $type: 'color', $value: '#FFFFFF' };
  }), /Invalid token path segment/);
});

test('invalid color, dimension and typography values fail', () => {
  expectFailure(f => edit(f, 'color/atomic.json', json => { json.color.atomic.common.white.$value = '#GGG'; }), /Invalid hex color/);
  expectFailure(f => edit(f, 'foundation.json', json => { json.spacing.margin['m-2'].$value = '2pt'; }), /Invalid px dimension/);
  expectFailure(f => edit(f, 'typography.json', json => { json['font-weight'].bold.$value = 600; }), /Unsupported font weight/);
  expectFailure(f => edit(f, 'typography.json', json => { json['text-style'].base.body.regular.$value.lineHeight = '150%'; }), /Invalid number: .*lineHeight/);
  expectFailure(f => edit(f, 'typography.json', json => { json['text-style'].base.body.regular.$value.fontFamily = ['Unknown Font']; }), /Unsupported family alias/);
});

test('equal base and point families keep distinct token cases', () => {
  const f = fixture();
  try {
    const tokens = JSON.parse(fs.readFileSync(path.join(f.tokens, 'typography.json'), 'utf8'));
    assert.deepEqual(tokens['font-family'].point.$value, tokens['font-family'].base.$value);
    const result = run(f);
    assert.equal(result.status, 0, result.stderr);
    const output = fs.readFileSync(path.join(f.output, 'Sources/FestiCoreTypography.swift'), 'utf8');
    assert.match(output, /case pointDisplay/);
    assert.match(output, /case pointTitle/);
    assert.match(output, /case pointHeading/);
    assert.match(output, /case pointLabel/);
    assert.match(output, /public var fontFamily: PretendardFontFamily/);
  } finally { cleanup(f); }
});

test('typography family must use its own group alias', () => {
  expectFailure(f => edit(f, 'typography.json', json => { json['text-style'].base.body.regular.$value.fontFamily = '{font-family.point}'; }), /Unsupported family alias/);
  expectFailure(f => edit(f, 'typography.json', json => { json['text-style'].point.display.$value.fontFamily = '{font-family.base}'; }), /Unsupported family alias/);
  expectFailure(f => edit(f, 'typography.json', json => { json['text-style'].point.display.$value.fontFamily = 'Pretendard'; }), /Unsupported family alias/);
});

test('token set path traversal fails before reading a file', () => {
  expectFailure(f => edit(f, '$themes.json', json => { json[0].selectedTokenSets['../../outside'] = 'enabled'; }), /Unsafe token set/);
});

test('output overrides and redirected generated folders cannot delete data', () => {
  const f = fixture();
  try {
    const protectedFile = path.join(f.dir, 'keep.txt');
    fs.writeFileSync(protectedFile, 'keep');
    const env = { ...process.env, FESTICORE_OUTPUT_ROOT: f.dir };
    const build = spawnSync(process.execPath, [path.join(f.repo, 'scripts/build-ios.ts')], { encoding: 'utf8', env });
    assert.notEqual(build.status, 0);
    assert.match(build.stderr, /FESTICORE_OUTPUT_ROOT is not supported/);
    const check = spawnSync(process.execPath, [path.join(root, 'scripts/check-ios.ts')], { encoding: 'utf8', env, cwd: f.dir });
    assert.notEqual(check.status, 0);
    assert.match(check.stderr, /FESTICORE_OUTPUT_ROOT is not supported/);
    assert.equal(fs.readFileSync(protectedFile, 'utf8'), 'keep');
    const outside = path.join(f.dir, 'outside');
    fs.mkdirSync(path.join(outside, 'ios'), { recursive: true });
    fs.writeFileSync(path.join(outside, 'ios', 'keep.txt'), 'keep');
    fs.symlinkSync(outside, path.join(f.repo, 'generated'));
    const redirected = run(f);
    assert.notEqual(redirected.status, 0);
    assert.match(redirected.stderr, /Unsafe output root/);
    assert.equal(fs.readFileSync(path.join(outside, 'ios', 'keep.txt'), 'utf8'), 'keep');
  } finally { cleanup(f); }
});
