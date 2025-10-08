#!/usr/bin/env bash
set -euo pipefail

if command -v node >/dev/null 2>&1; then
  corepack enable || true
  corepack prepare pnpm@9 --activate || true
  npm i -g vercel@latest || true
fi

# Node project install (prefer lockfiles)
if [ -f pnpm-lock.yaml ] && command -v pnpm >/dev/null 2>&1; then
  pnpm install --frozen-lockfile || pnpm install
elif [ -f package-lock.json ] && command -v npm >/dev/null 2>&1; then
  npm ci || npm install
elif [ -f yarn.lock ] && command -v yarn >/dev/null 2>&1; then
  yarn install --frozen-lockfile || yarn install
elif [ -f package.json ] && command -v npm >/dev/null 2>&1; then
  npm install
fi

# Optional Python (only if present)
if command -v python >/dev/null 2>&1; then
  python -m pip install --upgrade pip || true
  if [ -f requirements.txt ]; then
    pip install -r requirements.txt || true
  fi
fi

echo "Dev container postCreate complete (Node/Next.js ready)."
