import fs from 'node:fs';
import path from 'node:path';

import {parse as parseYaml} from 'yaml';

type AuthorsYaml = {
  authors: Record<string, unknown>;
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

function main() {
  const root = repoRoot();
  const navPath = path.join(root, 'content', 'navigation.yml');
  const authorsPath = path.join(root, 'content', 'authors.yml');

  const nav = readYamlFile<NavigationYaml>(navPath);
  const authors = readYamlFile<AuthorsYaml>(authorsPath);

  const authorIds = new Set(Object.keys(authors?.authors ?? {}));
  if (authorIds.size === 0) {
    throw new Error('authors.yml has no authors.');
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

  // eslint-disable-next-line no-console
  console.log('Content validation OK');
}

main();

