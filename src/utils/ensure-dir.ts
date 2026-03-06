import { mkdir } from 'node:fs/promises';

export async function ensureDir(directory: string): Promise<void> {
  await mkdir(directory, { recursive: true });
}
