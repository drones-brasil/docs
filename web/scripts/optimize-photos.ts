import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

import sharp from 'sharp';

type CacheEntry = {
  sha256: string;
  outRel: string;
};

type CacheManifest = {
  version: 1;
  maxSize: 256;
  quality: 78;
  files: Record<string, CacheEntry>;
};

function sha256File(filePath: string): string {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function ensureDir(p: string) {
  fs.mkdirSync(p, {recursive: true});
}

function isSupportedExt(fileName: string): boolean {
  const ext = path.extname(fileName).toLowerCase();
  return ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp';
}

function readJsonIfExists<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function writeJson(filePath: string, value: unknown) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

async function optimizeDir(opts: {
  repoRoot: string;
  kind: 'authors' | 'teams' | 'universities';
}): Promise<{processed: number; skipped: number; removed: number}> {
  const {repoRoot, kind} = opts;
  const srcDir = path.join(repoRoot, 'content', 'photos', kind);
  const outDir = path.join(repoRoot, 'web', 'static', 'img', kind);
  const cachePath = path.join(repoRoot, 'web', '.cache', `photos-${kind}.json`);

  if (!fs.existsSync(srcDir)) {
    return {processed: 0, skipped: 0, removed: 0};
  }

  ensureDir(outDir);

  const cache =
    readJsonIfExists<CacheManifest>(cachePath) ??
    ({version: 1, maxSize: 256, quality: 78, files: {}});

  if (cache.version !== 1 || cache.maxSize !== 256 || cache.quality !== 78) {
    cache.files = {};
    cache.version = 1;
    cache.maxSize = 256;
    cache.quality = 78;
  }

  const srcFiles = fs
    .readdirSync(srcDir, {withFileTypes: true})
    .filter((d) => d.isFile() && isSupportedExt(d.name))
    .map((d) => d.name);

  const srcSet = new Set(srcFiles);

  let processed = 0;
  let skipped = 0;
  let removed = 0;

  for (const [fileName, entry] of Object.entries(cache.files)) {
    if (srcSet.has(fileName)) continue;
    const absOut = path.join(repoRoot, 'web', 'static', entry.outRel);
    if (fs.existsSync(absOut)) {
      fs.unlinkSync(absOut);
      removed++;
    }
    delete cache.files[fileName];
  }

  for (const fileName of srcFiles) {
    const absSrc = path.join(srcDir, fileName);
    const digest = sha256File(absSrc);

    const outRel = path.join('img', kind, `${path.parse(fileName).name}.webp`);
    const absOut = path.join(repoRoot, 'web', 'static', outRel);

    const prev = cache.files[fileName];
    if (prev && prev.sha256 === digest && prev.outRel === outRel && fs.existsSync(absOut)) {
      skipped++;
      continue;
    }

    await sharp(absSrc)
      .rotate()
      .resize(256, 256, {fit: 'inside', withoutEnlargement: true})
      .webp({quality: 78})
      .toFile(absOut);

    cache.files[fileName] = {sha256: digest, outRel};
    processed++;
  }

  writeJson(cachePath, cache);
  return {processed, skipped, removed};
}

export async function optimizePhotos(opts: {repoRoot: string}) {
  const authors = await optimizeDir({repoRoot: opts.repoRoot, kind: 'authors'});
  const teams = await optimizeDir({repoRoot: opts.repoRoot, kind: 'teams'});
  const universities = await optimizeDir({repoRoot: opts.repoRoot, kind: 'universities'});
  return {authors, teams, universities};
}

