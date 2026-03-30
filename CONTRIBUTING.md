## Contribuindo

### Pré-requisitos
- Node 22 (ver `.nvmrc`)
- pnpm

### Rodar localmente
```bash
pnpm -C web install
pnpm -C web start
```

### Adicionar uma página
1. Crie um arquivo em `content/docs/<docId>.mdx` (use `kebab-case`).
2. Inclua front matter:
   - `title`, `summary`, `level`, `contentType`, `keywords`, `authors`
3. Se embedar YouTube:
   - use `<YouTube id="VIDEO_ID" title="..." />`
4. Coloque o `docId` na árvore em `content/navigation.yml` (pode aparecer em mais de uma seção).
5. Rode o site localmente e abra PR.

### Adicionar/editar autores
1. Edite `content/authors.yml`
2. Adicione a foto em `content/photos/authors/<authorId>.<ext>` (png/jpg/webp).
3. No build ela vira `/img/authors/<authorId>.webp` (máx. 256px).

### Logos (times e universidades)
1. Time: `content/photos/teams/<teamId>.<ext>` → `/img/teams/<teamId>.webp`
2. Universidade: `content/photos/universities/<universityId>.<ext>` → `/img/universities/<universityId>.webp`

