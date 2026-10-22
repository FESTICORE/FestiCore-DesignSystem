import assert from 'node:assert/strict';
import { test } from 'node:test';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const script = path.join(root, 'scripts/build-ios.mjs');
function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'festicore-tokens-'));
  const tokens = path.join(dir, 'tokens');
  const output = path.join(dir, 'generated');
  fs.cpSync(path.join(root, 'tokens'), tokens, { recursive: true });
  return { dir, tokens, output };
}
function run(f) {
  return spawnSync(process.execPath, [script], {
    encoding: 'utf8', env: { ...process.env, FESTICORE_TOKEN_ROOT: f.tokens, FESTICORE_OUTPUT_ROOT: f.output }
  });
}
function edit(f, filename, change) {
  const file = path.join(f.tokens, filename);
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  change(json);
  fs.writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
}
function cleanup(f) { fs.rmSync(f.dir, { recursive: true, force: true }); }
function expectFailure(change, message) {
  const f = fixture();
  try {
    change(f);
    const result = run(f);
    assert.notEqual(result.status, 0, 'Invalid tokens unexpectedly built');
    assert.match(result.stderr, message);
  } finally { cleanup(f); }
}

test('light/dark Swift API and assets are deterministic, source tokens stay internal', () => {
  const f = fixture();
  try {
    let result = run(f);
    assert.equal(result.status, 0, result.stderr);
    const color = fs.readFileSync(path.join(f.output, 'Sources/FestiCoreColor.swift'), 'utf8');
    const typography = fs.readFileSync(path.join(f.output, 'Sources/FestiCoreTypography.swift'), 'utf8');
    assert.match(color, /public static var primaryNormal: UIColor/);
    assert.match(color, /traits\.userInterfaceStyle == \.dark/);
    assert.doesNotMatch(color, /atomic/);
    assert.match(typography, /letterSpacing: -0\.884/);
    assert.match(typography, /fontFamily: baseFontFamily/);
    assert.equal(fs.readdirSync(path.join(f.output, 'Assets/FestiCoreColors.xcassets')).filter(name => name.endsWith('.colorset')).length, 65);
    const before = color + typography;
    result = run(f);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(fs.readFileSync(path.join(f.output, 'Sources/FestiCoreColor.swift'), 'utf8') + fs.readFileSync(path.join(f.output, 'Sources/FestiCoreTypography.swift'), 'utf8'), before);
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

test('build CLI runs from a path with spaces and non-ASCII characters', () => {
  const f = fixture();
  try {
    const repo = path.join(f.dir, 'space path 한국어');
    fs.mkdirSync(path.join(repo, 'tests/fixtures'), { recursive: true });
    fs.cpSync(path.join(root, 'scripts'), path.join(repo, 'scripts'), { recursive: true });
    fs.cpSync(f.tokens, path.join(repo, 'tokens'), { recursive: true });
    fs.copyFileSync(path.join(root, 'tests/fixtures/public-color-names.json'), path.join(repo, 'tests/fixtures/public-color-names.json'));
    fs.symlinkSync(path.join(root, 'node_modules'), path.join(repo, 'node_modules'));
    const result = spawnSync(process.execPath, [path.join(repo, 'scripts/build-ios.mjs')], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Generated iOS tokens/);
    assert.equal(fs.existsSync(path.join(repo, 'generated/ios/Sources/FestiCoreColor.swift')), true);
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
});

test('invalid color, dimension and typography values fail', () => {
  expectFailure(f => edit(f, 'color/atomic.json', json => { json.color.atomic.common.white.$value = '#GGG'; }), /Invalid hex color/);
  expectFailure(f => edit(f, 'foundation.json', json => { json.spacing.margin['m-2'].$value = '2pt'; }), /Invalid px dimension/);
  expectFailure(f => edit(f, 'typography.json', json => { json['font-weight'].bold.$value = 600; }), /Unsupported font weight/);
  expectFailure(f => edit(f, 'typography.json', json => { json['text-style'].base.body.regular.$value.lineHeight = '150%'; }), /Invalid number: .*lineHeight/);
  expectFailure(f => edit(f, 'typography.json', json => { json['text-style'].base.body.regular.$value.fontFamily = ['Unknown Font']; }), /Unsupported family/);
});

test('token set path traversal fails before reading a file', () => {
  expectFailure(f => edit(f, '$themes.json', json => { json[0].selectedTokenSets['../../outside'] = 'enabled'; }), /Unsafe token set/);
});
