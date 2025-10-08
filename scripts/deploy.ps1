Param(
  [switch]$Prod
)

Write-Host "== AI Agentic Next.js • Guided Deployment (PowerShell) =="

Function Need-Cmd($name) {
  if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
    Write-Error "Missing required command: $name"; exit 1
  }
}

Need-Cmd node

if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
  Write-Host "Vercel CLI not found. Installing globally..."
  npm i -g vercel@latest
}

$login = Read-Host "Do you want to login to Vercel now? [y/N]"
if ($login -match '^[yY]') { vercel login }

if (-not (Test-Path ".vercel/project.json")) {
  Write-Host "Linking or creating a Vercel project..."
  vercel link
}

$orgId = ''
$projectId = ''
if (Test-Path ".vercel/project.json") {
  $pj = Get-Content ".vercel/project.json" | ConvertFrom-Json
  $orgId = $pj.orgId
  $projectId = $pj.projectId
}

Write-Host "Detected Vercel orgId: $orgId"
Write-Host "Detected Vercel projectId: $projectId"

if (-not $env:VERCEL_TOKEN) {
  $token = Read-Host "Enter VERCEL_TOKEN (from https://vercel.com/account/tokens)"
  $env:VERCEL_TOKEN = $token
}
if (-not $env:VERCEL_TOKEN) { Write-Error "VERCEL_TOKEN is required"; exit 1 }

try { vercel pull --yes --environment=preview --token "$env:VERCEL_TOKEN" } catch {}

$setGh = Read-Host "Set GitHub repo secrets with gh CLI now? [y/N]"
if ($setGh -match '^[yY]') {
  if (Get-Command gh -ErrorAction SilentlyContinue) {
    $repo = Read-Host "Enter GitHub repo (owner/name)"
    if ($repo) {
      echo $env:VERCEL_TOKEN | gh secret set VERCEL_TOKEN -R $repo -b- | Out-Null
      if ($orgId) { echo $orgId | gh secret set VERCEL_ORG_ID -R $repo -b- | Out-Null }
      if ($projectId) { echo $projectId | gh secret set VERCEL_PROJECT_ID -R $repo -b- | Out-Null }
      Write-Host "GitHub secrets attempted. Verify in repo settings."
    }
  } else {
    Write-Host "GitHub CLI (gh) not found; skipping secrets."
  }
}

# Install deps
if (Test-Path "pnpm-lock.yaml") {
  try { corepack enable | Out-Null } catch {}
  try { corepack prepare pnpm@9 --activate | Out-Null } catch {}
  pnpm install --frozen-lockfile
} elseif (Test-Path "package-lock.json") {
  npm ci
} elseif (Test-Path "package.json") {
  npm install
}

# Build
if (Get-Command pnpm -ErrorAction SilentlyContinue) { pnpm build } else { npm run build }

if ($Prod) {
  vercel build --prod --token "$env:VERCEL_TOKEN"
  $prodUrl = vercel deploy --prebuilt --prod --token "$env:VERCEL_TOKEN"
  Write-Host "Production deployed: $prodUrl"
} else {
  $previewUrl = vercel deploy --prebuilt --token "$env:VERCEL_TOKEN"
  Write-Host "Preview deployed: $previewUrl"
}

Write-Host "Done. Re-run this script anytime from scripts/deploy.ps1"

