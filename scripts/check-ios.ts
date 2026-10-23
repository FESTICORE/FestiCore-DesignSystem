import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { buildIOS } from './build-ios.ts';

if (process.env.FESTICORE_OUTPUT_ROOT) throw new Error('FESTICORE_OUTPUT_ROOT is not supported by check');
const root = path.resolve(import.meta.dirname, '..');
await buildIOS();
const result = spawnSync('git', ['status', '--porcelain', '--', 'generated/ios'], { encoding: 'utf8', cwd: root });
if (result.status !== 0) throw new Error(result.stderr || 'git status failed');
if (result.stdout.trim()) {
  console.error('Generated iOS token files differ from the committed output:\n' + result.stdout);
  process.exitCode = 1;
}
