#!/usr/bin/env bash
set -euo pipefail

BUCKET_NAME="${BUCKET_NAME:-}"
if [[ -z "${BUCKET_NAME}" ]]; then
  echo "Missing BUCKET_NAME. Usage: BUCKET_NAME=<bucket> ./infra/gcp/deploy_gcs.sh"
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

cd "${ROOT_DIR}/web"

pnpm install
pnpm build

echo "Syncing build/ to gs://${BUCKET_NAME} ..."
gsutil -m rsync -r -d "${ROOT_DIR}/web/build" "gs://${BUCKET_NAME}"

echo "Done."
