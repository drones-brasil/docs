import fs from 'node:fs';
import path from 'node:path';

import {parse as parseYaml} from 'yaml';

type Author = {
  name: string;
  email: string;
  linkedin: string;
  university: string;
  photoUrl?: string;
};

type AuthorsYaml = {
  authors: Record<string, Author>;
};

type NavDocRef = {docId: string};
type NavCategory = {id: string; title: string; children: NavNode[]};
type NavNode = NavDocRef | NavCategory;
type NavigationYaml = {tree: NavCategory[]};

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

function writeFileEnsured(filePath: string, content: string) {
  fs.mkdirSync(path.dirname(filePath), {recursive: true});
  fs.writeFileSync(filePath, content, 'utf8');
}

function toSidebarItems(nodes: NavNode[]): any[] {
  return nodes.map((node) => {
    if (isDocRef(node)) return node.docId;
    const childItems = toSidebarItems(node.children ?? []);
    const base: any = {
      type: 'category',
      label: node.title,
      items: childItems,
    };

    // Docusaurus requires categories to have items; for empty categories we add a generated index link
    // so the sidebar entry is still navigable.
    if (childItems.length === 0) {
      base.link = {
        type: 'generated-index',
        title: node.title,
        description: `Conteúdos em ${node.title}.`,
        slug: `/${node.id}`,
      };
    }

    return base;
  });
}

function assertNavigation(nav: NavigationYaml) {
  if (!nav || !Array.isArray(nav.tree)) {
    throw new Error('content/navigation.yml must have a top-level "tree" array.');
  }
}

function assertAuthors(auth: AuthorsYaml) {
  if (!auth || typeof auth.authors !== 'object' || !auth.authors) {
    throw new Error('content/authors.yml must have a top-level "authors" map.');
  }
}

function generateSidebars(nav: NavigationYaml) {
  const sidebarItems = toSidebarItems(nav.tree);
  const out = `import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This file is generated. Source of truth: content/navigation.yml

const sidebars: SidebarsConfig = {
  tutorialSidebar: ${JSON.stringify(sidebarItems, null, 2)},
};

export default sidebars;
`;
  writeFileEnsured(path.join(repoRoot(), 'web', 'sidebars.ts'), out);
}

function generateAuthorsModule(auth: AuthorsYaml) {
  const out = `export type Author = {
  name: string;
  email: string;
  linkedin: string;
  university: string;
  photoUrl?: string;
};

// This file is generated. Source of truth: content/authors.yml
export const AUTHORS: Record<string, Author> = ${JSON.stringify(auth.authors, null, 2)} as const;
`;
  writeFileEnsured(path.join(repoRoot(), 'web', 'src', 'generated', 'authors.ts'), out);
}

function main() {
  const root = repoRoot();
  const navPath = path.join(root, 'content', 'navigation.yml');
  const authorsPath = path.join(root, 'content', 'authors.yml');

  if (!fs.existsSync(navPath)) throw new Error(`Missing ${navPath}`);
  if (!fs.existsSync(authorsPath)) throw new Error(`Missing ${authorsPath}`);

  const nav = readYamlFile<NavigationYaml>(navPath);
  const authors = readYamlFile<AuthorsYaml>(authorsPath);

  assertNavigation(nav);
  assertAuthors(authors);

  generateSidebars(nav);
  generateAuthorsModule(authors);

  // eslint-disable-next-line no-console
  console.log('Generated sidebars.ts and src/generated/authors.ts');
}

main();

