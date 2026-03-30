import fs from 'node:fs';
import path from 'node:path';

import {parse as parseYaml} from 'yaml';
import {optimizePhotos} from './optimize-photos';

type Author = {
  name: string;
  email: string;
  linkedin: string;
  teamId: string;
};

type AuthorsYaml = {
  authors: Record<string, Author>;
};

type Team = {
  name: string;
  university: string;
  linkedin?: string;
  gitOrgUrl?: string;
};

type TeamsYaml = {
  teams: Record<string, Team>;
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

function assertTeams(t: TeamsYaml) {
  if (!t || typeof t.teams !== 'object' || !t.teams) {
    throw new Error('content/teams.yml must have a top-level "teams" map.');
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
  teamId: string;
};

// This file is generated. Source of truth: content/authors.yml
export const AUTHORS: Record<string, Author> = ${JSON.stringify(auth.authors, null, 2)} as const;
`;
  writeFileEnsured(path.join(repoRoot(), 'web', 'src', 'generated', 'authors.ts'), out);
}

function generateTeamsModule(t: TeamsYaml) {
  const out = `export type Team = {
  name: string;
  university: string;
  linkedin?: string;
  gitOrgUrl?: string;
};

// This file is generated. Source of truth: content/teams.yml
export const TEAMS: Record<string, Team> = ${JSON.stringify(t.teams, null, 2)} as const;
`;
  writeFileEnsured(path.join(repoRoot(), 'web', 'src', 'generated', 'teams.ts'), out);
}

async function main() {
  const root = repoRoot();
  const navPath = path.join(root, 'content', 'navigation.yml');
  const authorsPath = path.join(root, 'content', 'authors.yml');
  const teamsPath = path.join(root, 'content', 'teams.yml');

  if (!fs.existsSync(navPath)) throw new Error(`Missing ${navPath}`);
  if (!fs.existsSync(authorsPath)) throw new Error(`Missing ${authorsPath}`);
  if (!fs.existsSync(teamsPath)) throw new Error(`Missing ${teamsPath}`);

  const nav = readYamlFile<NavigationYaml>(navPath);
  const authors = readYamlFile<AuthorsYaml>(authorsPath);
  const teams = readYamlFile<TeamsYaml>(teamsPath);

  assertNavigation(nav);
  assertAuthors(authors);
  assertTeams(teams);

  generateSidebars(nav);
  generateAuthorsModule(authors);
  generateTeamsModule(teams);

  const photos = await optimizePhotos({repoRoot: root});

  // eslint-disable-next-line no-console
  console.log(
    `Generated sidebars/authors/teams and optimized photos: authors p=${photos.authors.processed}/s=${photos.authors.skipped}/r=${photos.authors.removed}; teams p=${photos.teams.processed}/s=${photos.teams.skipped}/r=${photos.teams.removed}; universities p=${photos.universities.processed}/s=${photos.universities.skipped}/r=${photos.universities.removed}`,
  );
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

