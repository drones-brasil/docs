## Deploy (GCP) — Site estático

### Visão geral
- Build do site: `web/build/`
- Upload para um bucket do Cloud Storage
- (Opcional, recomendado) Cloud CDN + HTTPS Load Balancer na frente

### Passo a passo (POC)
1) Defina um projeto e faça login:
```bash
gcloud auth login
gcloud config set project <PROJECT_ID>
```

2) Crie um bucket (um por ambiente):
```bash
export BUCKET_NAME="<seu-bucket-unico>"
gsutil mb -p "<PROJECT_ID>" -l "us-central1" "gs://${BUCKET_NAME}"
gsutil uniformbucketlevelaccess set on "gs://${BUCKET_NAME}"
```

3) Build local:
```bash
pnpm -C web install
pnpm -C web build
```

4) Upload do build:
```bash
gsutil -m rsync -r -d "web/build" "gs://${BUCKET_NAME}"
```

### Próximo passo (produção)
Colocar um HTTPS Load Balancer com Cloud CDN apontando para o bucket.
Isso permite TLS gerenciado, headers, cache e domínio próprio.

