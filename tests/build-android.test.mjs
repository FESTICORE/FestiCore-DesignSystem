import assert from 'node:assert/strict';
import { test } from 'node:test';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'festicore-android-tokens-'));
  const repo = path.join(dir, 'repo');
  fs.mkdirSync(path.join(repo, 'tests/fixtures'), { recursive: true });
  fs.cpSync(path.join(root, 'tokens'), path.join(repo, 'tokens'), { recursive: true });
  fs.cpSync(path.join(root, 'scripts'), path.join(repo, 'scripts'), { recursive: true });
  fs.copyFileSync(path.join(root, 'package.json'), path.join(repo, 'package.json'));
  fs.copyFileSync(path.join(root, 'tests/fixtures/public-color-names.json'), path.join(repo, 'tests/fixtures/public-color-names.json'));
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(repo, 'node_modules'));
  return { dir, repo, output: path.join(repo, 'generated/android/tokens') };
}
function build(f, script = 'build-android.ts') {
  return spawnSync(process.execPath, [path.join(f.repo, 'scripts', script)], { encoding: 'utf8' });
}
function read(f, file) {
  return fs.readFileSync(path.join(f.output, file), 'utf8');
}
function edit(f, filename, change) {
  const file = path.join(f.repo, 'tokens', filename);
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  change(json);
  fs.writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
}

test('Android 생성물은 세 파일이고 두 번 생성해도 같다', () => {
  const f = fixture();
  try {
    assert.equal(build(f).status, 0);
    const first = Object.fromEntries(fs.readdirSync(f.output).sort().map(name => [name, read(f, name)]));
    assert.deepEqual(Object.keys(first), ['FestiCoreLayout.kt', 'FestiCoreSemanticColor.kt', 'FestiCoreTypography.kt']);
    for (const content of Object.values(first)) assert.match(content, /^package io\.festicore\.ui\.designkit\.tokens$/m);
    assert.equal(build(f).status, 0);
    for (const [name, content] of Object.entries(first)) assert.equal(read(f, name), content);
  } finally { fs.rmSync(f.dir, { recursive: true, force: true }); }
});

test('공개 색 이름은 iOS API 스냅샷과 같고 atomic 색은 나오지 않는다', () => {
  const f = fixture();
  try {
    assert.equal(build(f).status, 0);
    const colors = read(f, 'FestiCoreSemanticColor.kt');
    const names = [...colors.matchAll(/^ {8}val (\w+) = FestiCoreSemanticColor\(/gm)].map(match => match[1]).sort();
    const snapshot = JSON.parse(fs.readFileSync(path.join(root, 'tests/fixtures/public-color-names.json'), 'utf8'));
    assert.deepEqual(names, snapshot);
    assert.doesNotMatch(colors, /atomic/i);
  } finally { fs.rmSync(f.dir, { recursive: true, force: true }); }
});

test('hex는 Compose Color(0xAARRGGBB)로 바뀐다', () => {
  const f = fixture();
  try {
    edit(f, 'color/semantic.light.json', json => { json.color.primary.normal.$value = '#11223380'; });
    edit(f, 'color/semantic.dark.json', json => { json.color.primary.normal.$value = '#c6ff34'; });
    assert.equal(build(f).status, 0);
    assert.match(read(f, 'FestiCoreSemanticColor.kt'), /val primaryNormal = FestiCoreSemanticColor\(light = Color\(0x80112233\), dark = Color\(0xFFC6FF34\)\)/);
  } finally { fs.rmSync(f.dir, { recursive: true, force: true }); }
});

test('타이포그래피는 iOS 값과 같다: lineHeight는 배수 × size(sp), letterSpacing은 em', () => {
  const f = fixture();
  try {
    assert.equal(build(f).status, 0);
    assert.equal(build(f, 'build-ios.ts').status, 0);
    const kotlin = read(f, 'FestiCoreTypography.kt');
    const swift = fs.readFileSync(path.join(f.repo, 'generated/ios/Sources/FestiCoreTypography.swift'), 'utf8');
    const swiftValue = (property, name) => {
      const block = swift.slice(swift.indexOf(`public var ${property}:`));
      return Number(block.match(new RegExp(`case \\.${name}: return (-?[\\d.]+)`))[1]);
    };
    const rows = [...kotlin.matchAll(/^ {4}(\w+)\(size = ([\d.]+)\.sp, fontWeight = FontWeight\.(\w+), lineHeight = ([\d.]+)\.sp, letterSpacing = \(?(-?[\d.]+)\)?\.em\),$/gm)];
    assert.equal(rows.length, 37);
    for (const [, name, size, weight, lineHeight, em] of rows) {
      assert.equal(Number(size), swiftValue('size', name));
      assert.ok(Math.abs(Number(em) * Number(size) - swiftValue('letterSpacing', name)) < 1e-6, name);
      assert.ok(Number(lineHeight) > Number(size), name);
      assert.ok(['Normal', 'Medium', 'Bold'].includes(weight), name);
    }
    assert.match(kotlin, /letterSpacing = \(-[\d.]+\)\.em/);
  } finally { fs.rmSync(f.dir, { recursive: true, force: true }); }
});

test('잘못된 토큰은 Android 생성도 실패하고 기존 생성물을 지우지 않는다', () => {
  const f = fixture();
  try {
    assert.equal(build(f).status, 0);
    const before = read(f, 'FestiCoreLayout.kt');
    edit(f, 'color/semantic.light.json', json => { json.color.primary.normal.$value = '{color.atomic.missing}'; });
    assert.notEqual(build(f).status, 0);
    assert.equal(read(f, 'FestiCoreLayout.kt'), before);
  } finally { fs.rmSync(f.dir, { recursive: true, force: true }); }
});
