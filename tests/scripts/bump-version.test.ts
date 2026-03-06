import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { bumpPatchVersion } from '../../scripts/bump-version.mjs';

const tempDirs: string[] = [];

describe('bumpPatchVersion', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
  });

  it('increments package.json and package-lock.json patch versions together', async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), 'md-code-image-cli-release-'));
    const packageJsonPath = path.join(directory, 'package.json');
    const packageLockPath = path.join(directory, 'package-lock.json');
    tempDirs.push(directory);

    await writeFile(
      packageJsonPath,
      JSON.stringify(
        {
          name: 'md-code-image-cli',
          version: '0.1.1',
        },
        null,
        2,
      ) + '\n',
    );

    await writeFile(
      packageLockPath,
      JSON.stringify(
        {
          name: 'md-code-image-cli',
          version: '0.1.1',
          lockfileVersion: 3,
          packages: {
            '': {
              name: 'md-code-image-cli',
              version: '0.1.1',
            },
          },
        },
        null,
        2,
      ) + '\n',
    );

    const nextVersion = await bumpPatchVersion({
      packageJsonPath,
      packageLockPath,
    });

    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
    const packageLock = JSON.parse(await readFile(packageLockPath, 'utf8'));

    expect(nextVersion).toBe('0.1.2');
    expect(packageJson.version).toBe('0.1.2');
    expect(packageLock.version).toBe('0.1.2');
    expect(packageLock.packages[''].version).toBe('0.1.2');
  });

  it('can bump from an explicit base version instead of the file version', async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), 'md-code-image-cli-release-'));
    const packageJsonPath = path.join(directory, 'package.json');
    const packageLockPath = path.join(directory, 'package-lock.json');
    tempDirs.push(directory);

    await writeFile(
      packageJsonPath,
      `${JSON.stringify({ name: 'md-code-image-cli', version: '0.1.1' }, null, 2)}\n`,
    );

    await writeFile(
      packageLockPath,
      `${JSON.stringify(
        {
          name: 'md-code-image-cli',
          version: '0.1.1',
          lockfileVersion: 3,
          packages: {
            '': {
              name: 'md-code-image-cli',
              version: '0.1.1',
            },
          },
        },
        null,
        2,
      )}\n`,
    );

    const nextVersion = await bumpPatchVersion({
      packageJsonPath,
      packageLockPath,
      baseVersion: '0.1.7',
    });

    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
    const packageLock = JSON.parse(await readFile(packageLockPath, 'utf8'));

    expect(nextVersion).toBe('0.1.8');
    expect(packageJson.version).toBe('0.1.8');
    expect(packageLock.version).toBe('0.1.8');
    expect(packageLock.packages[''].version).toBe('0.1.8');
  });
});
