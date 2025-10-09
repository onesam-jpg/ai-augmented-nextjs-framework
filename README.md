# AI Agentic Next.js Starter

🌐 **Live Demo**: https://ai-augmented-nextjs-framework.vercel.app

A minimal Next.js (TypeScript, App Router) landing page wired with:
- Dev Container for consistent local dev
- Tailwind CSS for styling
- Playwright E2E (Chromium/Firefox/WebKit) with GitHub annotations + HTML report
- ESLint + Prettier configured
- GitHub Actions: E2E → Vercel Preview/Production deploys
- Accessibility tests with Axe (WCAG 2A/2AA)
- Contact form (API route with server-side validation)
- Optional webhook forwarding via `CONTACT_WEBHOOK_URL` (honeypot protected)

## Run Locally (recommended Dev Container)
1) Open folder `VSCode_AI_Framework_Setup` in VS Code
2) Reopen in Container (Docker Desktop running)
3) In terminal:
   - `npm install`
   - `npm run dev`
4) Open http://localhost:3000

E2E locally:
- Install browsers (first time): `npx playwright install --with-deps`
- Run tests: `npm run test:e2e`
- Show report: `npm run e2e:report`
  - Includes a11y checks (tests/a11y.spec.ts) and contact form submit (tests/contact.spec.ts)

## GitHub + Vercel Deploys (GitHub App — no tokens)
1) Initialize and push repo (from `VSCode_AI_Framework_Setup`):
```
git init
git add .
git commit -m "init: nextjs + e2e + ci"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```
2) Connect the repo to Vercel (GitHub App):
   - Visit https://vercel.com/new and import your GitHub repo
   - Select your Team, set Framework: Next.js (auto), and create the project
   - Add any Environment Variables in Vercel (e.g., `CONTACT_WEBHOOK_URL`)

3) Open a PR to trigger deployments automatically
   - The Vercel GitHub App builds and posts a Preview URL on the PR
   - Our GitHub Actions workflow runs E2E (Playwright) as status checks

4) Protect branches
   - In GitHub → Settings → Branches → Branch protection rules → select `main`
   - Require status checks to pass → add `E2E (Playwright)`
   - Optional: require PRs before merging

5) Merge to `main` for Production
   - Vercel GitHub App will deploy Production automatically

Workflow file (tests only): `.github/workflows/nextjs-e2e.yml`

### CI Enhancements
- E2E tests sharded across 2 runners for speed.
- Lighthouse CI runs on the Preview URL and uploads reports as artifacts (warn thresholds).

### Environment
- Set `CONTACT_WEBHOOK_URL` in Vercel or local `.env` to forward contact submissions to a webhook endpoint.

## One-Command Guided Deploy (optional, CLI)
From `VSCode_AI_Framework_Setup`:
```
bash scripts/deploy.sh
```
The script will:
- Prompt for Vercel login/token
- Link or create the Vercel project, pull envs
- Optionally set GitHub repo secrets using `gh` CLI
- Build and deploy a Preview and optionally Production
Note: This CLI route is optional if you use the Vercel GitHub App for deploys.

## Files of Interest
- App: `app/page.tsx`, `app/layout.tsx`, `app/globals.css`
- Tests: `tests/smoke.spec.ts`, `playwright.config.ts`
- Accessibility: `tests/a11y.spec.ts`
- Contact form: `components/ContactForm.tsx`, `app/api/contact/route.ts`, `tests/contact.spec.ts`
- Dev Container: `.devcontainer/devcontainer.json`
- Vercel: `vercel.json`
- Tailwind: `tailwind.config.ts`, `postcss.config.js`
- Lint/Format: `.eslintrc.json`, `.prettierrc`
- Lighthouse CI: `lighthouserc.json`

## Notes
- Uses npm as package manager; pnpm available in Dev Container if preferred (adjust CI + `vercel.json`).
- For monorepos, move this folder or set Actions `working-directory` accordingly.
- MCP config and governance files live alongside for agent workflows.

## Documentation

### Life OS (Transformation System)
- **[DEPLOYMENT.md](DEPLOYMENT.md) - 🚀 START HERE: 30-minute Life OS deployment guide**
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide with templates
- [LIFEOS_COMPLETE_VISION.md](LIFEOS_COMPLETE_VISION.md) - Complete transformation roadmap
- [DATABASE_SCHEMA_COMPLETE.md](DATABASE_SCHEMA_COMPLETE.md) - All database specifications

### Framework Documentation
- [SESSION_NOTES.md](SESSION_NOTES.md) - Session continuity tracking
- [PROGRESS.md](PROGRESS.md) - Project status dashboard
- [claude.md](claude.md) - AI agent governance (300+ lines)
- [MCP_SECURITY.md](MCP_SECURITY.md) - Security guidelines
- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - Deployment guide
- [DEPLOYMENT_SUCCESS.md](DEPLOYMENT_SUCCESS.md) - Production verification report
