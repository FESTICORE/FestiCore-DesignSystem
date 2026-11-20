import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { buildAndroid } from './build-android.ts';

if (process.env.FESTICORE_OUTPUT_ROOT) throw new Error('FESTICORE_OUTPUT_ROOT is not supported by check');
const root = path.resolve(import.meta.dirname, '..');
function git(args: string[]) {
  const result = spawnSync('git', args, { encoding: 'utf8', cwd: root });
  if (result.status !== 0) throw new Error(result.stderr || 'git failed');
  return result.stdout.trim();
}
await buildAndroid();
// 인덱스(커밋할 내용)와 비교한다. CI에서는 인덱스가 곧 커밋이고, 로컬에서는 생성물을 스테이징한 뒤 커밋 전에 확인할 수 있다.
const changed = git(['diff', '--name-only', '--', 'generated/android']);
const untracked = git(['ls-files', '--others', '--exclude-standard', '--', 'generated/android']);
if (changed || untracked) {
  console.error('Generated Android token files differ from the staged/committed output:\n' + [changed, untracked].filter(Boolean).join('\n'));
  process.exitCode = 1;
}
