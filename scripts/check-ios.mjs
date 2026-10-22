import { spawnSync } from 'node:child_process';
import { buildIOS } from './build-ios.mjs';

await buildIOS();
const result = spawnSync('git', ['status', '--porcelain', '--', 'generated/ios'], { encoding: 'utf8' });
if (result.status !== 0) throw new Error(result.stderr || 'git status failed');
if (result.stdout.trim()) {
  console.error('Generated iOS token files differ from the committed output:\n' + result.stdout);
  process.exitCode = 1;
}
