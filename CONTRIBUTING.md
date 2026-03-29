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
2. Use `photoUrl` externo (`https://...`)

