import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export async function bumpPatchVersion({
  packageJsonPath = path.resolve('package.json'),
  packageLockPath = path.resolve('package-lock.json'),
  baseVersion,
} = {}) {
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
  const packageLock = JSON.parse(await readFile(packageLockPath, 'utf8'));
  const nextVersion = incrementPatch(baseVersion ?? packageJson.version);

  packageJson.version = nextVersion;
  packageLock.version = nextVersion;

  if (packageLock.packages?.['']) {
    packageLock.packages[''].version = nextVersion;
  }

  await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
  await writeFile(packageLockPath, `${JSON.stringify(packageLock, null, 2)}\n`);

  return nextVersion;
}

function incrementPatch(version) {
  const [major, minor, patch] = version.split('.').map(Number);

  return `${major}.${minor}.${patch + 1}`;
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const baseVersionIndex = process.argv.indexOf('--base-version');
  const version = await bumpPatchVersion({
    baseVersion: baseVersionIndex >= 0 ? process.argv[baseVersionIndex + 1] : undefined,
  });
  process.stdout.write(`${version}\n`);
}
