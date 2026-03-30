import fs from 'node:fs';
import path from 'node:path';

import {parse as parseYaml} from 'yaml';

type AuthorsYaml = {
  authors: Record<string, unknown>;
};

type TeamsYaml = {
  teams: Record<string, unknown>;
};

type NavDocRef = {docId: string};
type NavCategory = {id: string; title: string; children: NavNode[]};
type NavNode = NavDocRef | NavCategory;
type NavigationYaml = {tree: NavNode[]};

function isDocRef(node: NavNode): node is NavDocRef {
  return typeof (node as NavDocRef).docId === 'string';
}

function repoRoot(): string {
  return path.resolve(__dirname, '..', '..');
}

function readYamlFile<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, 'utf8');
  return parseYaml(raw) as T;
}

function listDocsDocs(root: string): string[] {
  const docsRoot = path.join(root, 'content', 'docs');
  const ids: string[] = [];

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.isFile() && (p.endsWith('.md') || p.endsWith('.mdx'))) {
        ids.push(path.basename(p).replace(/\.mdx?$/, ''));
      }
    }
  }

  walk(docsRoot);
  return ids;
}

function collectDocIds(nodes: NavNode[], out: string[]) {
  for (const node of nodes) {
    if (isDocRef(node)) out.push(node.docId);
    else collectDocIds(node.children ?? [], out);
  }
}

function parseFrontMatterAuthors(filePath: string): string[] {
  const raw = fs.readFileSync(filePath, 'utf8');
  if (!raw.startsWith('---')) return [];
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return [];
  const fmRaw = raw.slice(3, end);
  const fm = parseYaml(fmRaw) as any;
  const authors = fm?.authors;
  if (!authors) return [];
  if (Array.isArray(authors)) return authors.filter((a) => typeof a === 'string');
  return [];
}

function isSupportedPhotoExt(fileName: string): boolean {
  const ext = path.extname(fileName).toLowerCase();
  return ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp';
}

function listBasenamesIfDirExists(dir: string): Set<string> {
  if (!fs.existsSync(dir)) return new Set();
  const out = new Set<string>();
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    if (!entry.isFile()) continue;
    if (!isSupportedPhotoExt(entry.name)) continue;
    out.add(path.parse(entry.name).name);
  }
  return out;
}

function main() {
  const root = repoRoot();
  const navPath = path.join(root, 'content', 'navigation.yml');
  const authorsPath = path.join(root, 'content', 'authors.yml');
  const teamsPath = path.join(root, 'content', 'teams.yml');

  const nav = readYamlFile<NavigationYaml>(navPath);
  const authors = readYamlFile<AuthorsYaml>(authorsPath);
  const teams = readYamlFile<TeamsYaml>(teamsPath);

  const authorIds = new Set(Object.keys(authors?.authors ?? {}));
  if (authorIds.size === 0) {
    throw new Error('authors.yml has no authors.');
  }

  const teamIds = new Set(Object.keys(teams?.teams ?? {}));
  if (teamIds.size === 0) {
    throw new Error('teams.yml has no teams.');
  }

  const existingDocIds = new Set(listDocsDocs(root));
  const referencedDocIds: string[] = [];
  collectDocIds(nav.tree ?? [], referencedDocIds);

  const missingDocs = referencedDocIds.filter((id) => !existingDocIds.has(id));
  if (missingDocs.length > 0) {
    throw new Error(`navigation.yml references missing docs: ${missingDocs.join(', ')}`);
  }

  // Validate front matter authors exist in registry
  const docsRoot = path.join(root, 'content', 'docs');
  const badAuthors: Array<{doc: string; authors: string[]}> = [];

  for (const docId of existingDocIds) {
    const mdx = path.join(docsRoot, `${docId}.mdx`);
    const md = path.join(docsRoot, `${docId}.md`);
    const filePath = fs.existsSync(mdx) ? mdx : fs.existsSync(md) ? md : null;
    if (!filePath) continue;
    const pageAuthors = parseFrontMatterAuthors(filePath);
    const unknown = pageAuthors.filter((a) => !authorIds.has(a));
    if (unknown.length) badAuthors.push({doc: docId, authors: unknown});
  }

  if (badAuthors.length > 0) {
    const details = badAuthors
      .map((x) => `${x.doc}: ${x.authors.join(', ')}`)
      .join('\n');
    throw new Error(`Unknown authorId(s) in front matter:\n${details}`);
  }

  // Validate that each author in authors.yml references a teamId that exists in teams.yml
  const badTeams: Array<{authorId: string; teamId: string}> = [];
  for (const [authorId, author] of Object.entries(authors?.authors ?? {})) {
    const teamId = (author as any)?.teamId;
    if (typeof teamId !== 'string' || teamId.length === 0) {
      badTeams.push({authorId, teamId: String(teamId)});
      continue;
    }
    if (!teamIds.has(teamId)) {
      badTeams.push({authorId, teamId});
    }
  }
  if (badTeams.length > 0) {
    const details = badTeams.map((x) => `${x.authorId}: ${x.teamId}`).join('\n');
    throw new Error(`Unknown/invalid teamId in authors.yml:\n${details}`);
  }

  // Validate local photos presence (no external URLs):
  // - authors:        content/photos/authors/<authorId>.<ext>
  // - teams:          content/photos/teams/<teamId>.<ext>
  // - universities:   content/photos/universities/<universityId>.<ext>
  const authorPhotos = listBasenamesIfDirExists(
    path.join(root, 'content', 'photos', 'authors'),
  );
  const teamPhotos = listBasenamesIfDirExists(path.join(root, 'content', 'photos', 'teams'));
  const universityPhotos = listBasenamesIfDirExists(
    path.join(root, 'content', 'photos', 'universities'),
  );

  for (const [authorId, author] of Object.entries(authors?.authors ?? {})) {
    if ((author as any)?.photoUrl || (author as any)?.photoFile) {
      throw new Error(
        `authors.yml author "${authorId}" should not declare photoUrl/photoFile. Put a file in content/photos/authors/${authorId}.<ext> instead.`,
      );
    }
    if (!authorPhotos.has(authorId)) {
      throw new Error(
        `Missing author photo for "${authorId}". Add content/photos/authors/${authorId}.<ext>`,
      );
    }
  }

  for (const teamId of teamIds) {
    if (!teamPhotos.has(teamId)) {
      throw new Error(
        `Missing team logo for "${teamId}". Add content/photos/teams/${teamId}.<ext>`,
      );
    }
  }

  // Universities are referenced by string in teams.yml; require a logo for each unique university.
  const universityIds = new Set<string>();
  for (const t of Object.values(teams?.teams ?? {})) {
    const uni = (t as any)?.university;
    if (typeof uni === 'string' && uni.length > 0) universityIds.add(uni);
  }
  for (const uniId of universityIds) {
    // Normalize suggested id: in this repo it's already used like "ITA"
    if (!universityPhotos.has(uniId)) {
      throw new Error(
        `Missing university logo for "${uniId}". Add content/photos/universities/${uniId}.<ext>`,
      );
    }
  }

  // eslint-disable-next-line no-console
  console.log('Content validation OK');
}

main();

