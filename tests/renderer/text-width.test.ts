import { describe, expect, it } from 'vitest';

import { measureTextColumns } from '../../src/renderer/text-width.js';

describe('measureTextColumns', () => {
  it('treats latin characters as single-width columns', () => {
    expect(measureTextColumns('const x = 1;')).toBe('const x = 1;'.length);
  });

  it('treats chinese characters as double-width columns', () => {
    expect(measureTextColumns('中文')).toBe(4);
    expect(measureTextColumns('// 中文注释')).toBe(11);
  });
});
