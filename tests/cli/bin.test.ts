import { mkdtemp, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import { afterEach, describe, expect, it } from 'vitest';

const execFileAsync = promisify(execFile);
const tempDirs: string[] = [];

describe('cli bin wrapper', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
  });

  it('runs the CLI when invoked through the bin entry', async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), 'md-code-image-cli-bin-'));
    const outputDir = path.join(directory, 'images');
    tempDirs.push(directory);

    const { stdout } = await execFileAsync(
      'node',
      ['--import', 'tsx', 'src/cli/bin.ts', 'fixtures/sample.md', '--out', outputDir],
      {
        cwd: path.resolve('.'),
      },
    );

    const files = (await readdir(outputDir)).sort();

    expect(stdout).toContain('Processed 2 code blocks');
    expect(files).toEqual(['code-01-ts.png', 'code-02-bash.png']);
  });
});
