import { mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { runCli } from '../../src/cli/index.js';

const tempDirs: string[] = [];

describe('runCli', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true })));
  });

  it('exports one png per code block with the expected names', async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), 'md-code-image-cli-'));
    const outputDir = path.join(directory, 'images');
    tempDirs.push(directory);

    const result = await runCli(
      [
        path.resolve('fixtures/sample.md'),
        '--out',
        outputDir,
        '--theme',
        'github-dark',
        '--line-numbers',
        '--window',
        'mac',
      ],
      {
        cwd: directory,
      },
    );

    const files = (await readdir(outputDir)).sort();

    expect(result.processed).toBe(2);
    expect(result.succeeded).toBe(2);
    expect(result.failed).toBe(0);
    expect(files).toEqual(['code-01-ts.png', 'code-02-bash.png']);
  });

  it('uses ./output as the default output directory relative to cwd', async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), 'md-code-image-cli-'));
    const markdownPath = path.join(directory, 'input.md');
    tempDirs.push(directory);

    await writeFile(markdownPath, '```js\nconsole.log(1)\n```');

    const result = await runCli([markdownPath], { cwd: directory });
    const files = await readdir(path.join(directory, 'output'));

    expect(result.succeeded).toBe(1);
    expect(files).toEqual(['code-01-js.png']);
  });

  it('continues processing when one code block export fails', async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), 'md-code-image-cli-'));
    const markdownPath = path.join(directory, 'input.md');
    const outputDir = path.join(directory, 'images');
    tempDirs.push(directory);

    await writeFile(markdownPath, '```ts\nconst a = 1\n```\n\n```bash\necho ok\n```');

    const result = await runCli(
      [markdownPath, '--out', outputDir],
      {
        cwd: directory,
        exportPngOverride: async ({ outputPath }) => {
          if (outputPath.endsWith('code-01-ts.png')) {
            throw new Error('synthetic failure');
          }

          await writeFile(outputPath, Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
          return Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
        },
      },
    );

    const files = await readdir(outputDir);
    const secondFile = await readFile(path.join(outputDir, 'code-02-bash.png'));

    expect(result.processed).toBe(2);
    expect(result.succeeded).toBe(1);
    expect(result.failed).toBe(1);
    expect(result.errors).toHaveLength(1);
    expect(files).toEqual(['code-02-bash.png']);
    expect(secondFile.byteLength).toBe(8);
  });
});
