import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

describe('package metadata', () => {
  it('declares the canonical GitHub repository URL for npm provenance', async () => {
    const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

    expect(packageJson.repository).toEqual({
      type: 'git',
      url: 'https://github.com/pjstack-dev/md-code-image-cli',
    });
  });
});
