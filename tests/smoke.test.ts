import { describe, expect, it } from 'vitest';

import { version } from '../src/index.js';

describe('public entrypoint', () => {
  it('exports a version string', () => {
    expect(version).toBeTypeOf('string');
  });
});
