import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { exportPng } from '../../src/exporter/export-png.js';

const tempDirs: string[] = [];

describe('exportPng', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true })));
  });

  it('writes png bytes to disk', async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), 'md-code-image-cli-'));
    const outputPath = path.join(directory, 'code-01-ts.png');
    tempDirs.push(directory);

    const result = await exportPng({
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="#000"/></svg>',
      outputPath,
      width: 20,
      height: 20,
      scale: 2,
    });

    const file = await readFile(outputPath);

    expect(result.byteLength).toBeGreaterThan(8);
    expect(file.byteLength).toBe(result.byteLength);
    expect(file.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  });
});
