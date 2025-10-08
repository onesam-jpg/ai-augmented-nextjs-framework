#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="${SCRIPT_DIR%/scripts}"
cd "$ROOT_DIR"

echo "== AI Agentic Next.js • Guided Deployment =="
echo "This script will help you login to Vercel, link the project, pull envs, and optionally deploy."

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || { echo "Missing required command: $1"; return 1; }
}

if ! need_cmd node; then
  echo "Please install Node.js (v18.17+)."; exit 1
fi

if ! command -v vercel >/dev/null 2>&1; then
  echo "Vercel CLI not found. Installing globally..."
  npm i -g vercel@latest || { echo "Failed to install Vercel CLI. Install manually with 'npm i -g vercel' and re-run."; exit 1; }
fi

read -rp "Do you want to login to Vercel now? [y/N]: " LOGIN_VERCEL || true
if [[ "${LOGIN_VERCEL,,}" == "y" ]]; then
  vercel login || true
fi

if [[ ! -f .vercel/project.json ]]; then
  echo "Linking or creating a Vercel project..."
  vercel link || vercel || true
fi

ORG_ID=$(node -e "try{console.log(require('./.vercel/project.json').orgId||'')}catch(e){process.exit(0)}")
PROJECT_ID=$(node -e "try{console.log(require('./.vercel/project.json').projectId||'')}catch(e){process.exit(0)}")

echo "Detected Vercel orgId: ${ORG_ID:-<none>}"
echo "Detected Vercel projectId: ${PROJECT_ID:-<none>}"

if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  read -rp "Enter VERCEL_TOKEN (from https://vercel.com/account/tokens): " VERCEL_TOKEN_INPUT || true
  export VERCEL_TOKEN="${VERCEL_TOKEN_INPUT:-}"
fi

if [[ -z "$VERCEL_TOKEN" ]]; then
  echo "VERCEL_TOKEN is required to proceed. Exiting."; exit 1
fi

echo "Pulling Vercel Preview environment (if configured)..."
vercel pull --yes --environment=preview --token="$VERCEL_TOKEN" || echo "(Skipping env pull)"

read -rp "Do you want to set GitHub repo secrets with gh CLI now? [y/N]: " SET_GH || true
if [[ "${SET_GH,,}" == "y" ]]; then
  if command -v gh >/dev/null 2>&1; then
    read -rp "Enter GitHub repo (owner/name): " GH_REPO || true
    if [[ -n "$GH_REPO" ]]; then
      gh secret set VERCEL_TOKEN -R "$GH_REPO" -b"$VERCEL_TOKEN" || true
      if [[ -n "$ORG_ID" ]]; then gh secret set VERCEL_ORG_ID -R "$GH_REPO" -b"$ORG_ID" || true; fi
      if [[ -n "$PROJECT_ID" ]]; then gh secret set VERCEL_PROJECT_ID -R "$GH_REPO" -b"$PROJECT_ID" || true; fi
      echo "GitHub secrets attempted. Verify in repo settings."
    else
      echo "No repo provided; skipping gh secrets."
    fi
  else
    echo "GitHub CLI (gh) not found. Skipping secrets. Install from https://cli.github.com/."
  fi
fi

read -rp "Deploy a Preview now? [Y/n]: " DO_PREVIEW || true
if [[ -z "$DO_PREVIEW" || "${DO_PREVIEW,,}" == "y" ]]; then
  echo "Building with Next.js..."
  if command -v pnpm >/dev/null 2>&1 && [[ -f pnpm-lock.yaml ]]; then pnpm install --frozen-lockfile || pnpm install; else npm install; fi
  if command -v pnpm >/dev/null 2>&1; then pnpm build; else npm run build; fi
  echo "Deploying preview..."
  PREVIEW_URL=$(vercel deploy --prebuilt --token="$VERCEL_TOKEN")
  echo "Preview deployed: $PREVIEW_URL"
fi

read -rp "Deploy to Production now? [y/N]: " DO_PROD || true
if [[ "${DO_PROD,,}" == "y" ]]; then
  echo "Building production output..."
  vercel build --prod --token="$VERCEL_TOKEN"
  echo "Deploying production..."
  PROD_URL=$(vercel deploy --prebuilt --prod --token="$VERCEL_TOKEN")
  echo "Production deployed: $PROD_URL"
fi

echo "Done. You can re-run this script anytime from scripts/deploy.sh"

