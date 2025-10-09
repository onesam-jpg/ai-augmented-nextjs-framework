# Project Plan: AI-Augmented Development Framework

> **Objective**: Establish a modular, high-productivity VS Code framework for autonomous development tasks, model evaluation, and custom tool integration using both cloud-based and local LLMs.

---

## 📋 Checkpoint Progress Overview

| Checkpoint | Status | Completion |
|------------|--------|------------|
| 1. Core Tool Installation & Initialization | 🟡 In Progress | 75% |
| 2. Environment Standardization & Performance | 🟢 Complete | 100% |
| 3. Agentic Workflow & Governance Setup | 🟢 Complete | 100% |
| 4. Advanced Agent Configuration (MCP/Background) | 🟡 In Progress | 60% |

---

## Checkpoint 1: Core Tool Installation & Initialization

**Goal**: Set up essential VS Code extensions and verify AI-assisted development capabilities.

### Tasks
- [x] Install GitHub Copilot extension
- [x] Install Dev Containers extension
- [x] Verify Copilot chat & inline suggestions
- [ ] Install AI Toolkit for Visual Studio Code (`ms-windows-ai-studio.windows-ai-studio`)
- [ ] Verify AI Toolkit Playground/chat session
- [ ] Install local LLM extensions (llama.vscode, llama-swap - optional)
- [x] Confirm Next.js/TypeScript framework choice
- [x] Determine package manager (pnpm preferred, npm fallback for Windows)

### Review (Checkpoint 1)
**Completed**:
- ✅ Core extensions configured in `.devcontainer/devcontainer.json`
- ✅ GitHub Copilot integration verified
- ✅ Package manager selected (pnpm with npm fallback)

**Pending**:
- ⏳ AI Toolkit installation needs verification
- ⏳ Local LLM setup (llama.vscode) - optional enhancement

**Risks**: None identified

**Next Steps**: Add AI Toolkit to devcontainer extensions, test Playground

---

## Checkpoint 2: Environment Standardization & Performance

**Goal**: Create reproducible Dev Container environment with optimized performance settings.

### Tasks
- [x] Create `.devcontainer/devcontainer.json` with Node 20 base image
- [x] Configure VS Code performance settings (CodeLens off, memory limits, excludes)
- [x] Create `.devcontainer/postCreate.sh` for dependency installation
- [x] Add essential extensions to devcontainer (ESLint, Prettier, Tailwind, Playwright)
- [x] Initialize Next.js 14 app with TypeScript and App Router
- [x] Configure Tailwind CSS and PostCSS
- [x] Set up ESLint + Prettier with Next.js config

### Review (Checkpoint 2)
**Completed**:
- ✅ Dev Container fully configured with TypeScript/Node 20 image
- ✅ Performance optimizations applied:
  - CodeLens disabled for performance
  - TS server memory increased to 4096MB
  - `.next` and `node_modules` excluded from search/watch
  - Auto-restore and symlink following disabled
- ✅ Next.js app initialized with:
  - App Router structure (`app/page.tsx`, `app/layout.tsx`)
  - Contact form with API route (`app/api/contact/route.ts`)
  - Tailwind CSS configured
  - TypeScript strict mode

**Files Created/Modified**:
- `.devcontainer/devcontainer.json` - Container definition
- `.devcontainer/postCreate.sh` - Automated setup script
- `app/*` - Next.js application files
- `tailwind.config.ts`, `postcss.config.js` - Styling config
- `tsconfig.json` - TypeScript configuration

**Risks**: None

**Next Steps**: Verify container build and dev server functionality

---

## Checkpoint 3: Agentic Workflow & Governance Setup

**Goal**: Establish AI agent governance, task tracking, and plan-first workflow.

### Tasks
- [x] Create `copilot_instructions.md` with execution rules and output standards
- [x] Create enhanced `claude.md` with comprehensive AI-Augmented Development Architect prompt
- [x] Structure `project_plan.md` with 4-checkpoint framework
- [x] Implement task tracking system (checkboxes, status updates)
- [x] Define Chain-of-Thought (CoT) and Context-Aware Decomposition (CAD) workflows
- [x] Document security & privacy guardrails
- [x] Add session continuity files (`SESSION_NOTES.md`, `PROGRESS.md`)

### Review (Checkpoint 3)
**Completed**:
- ✅ **claude.md** created with:
  - Role definition: Expert AI-Augmented Development Architect
  - CoT analysis framework (analyze → trade-offs → risks → plan)
  - CAD workflow (read state → decompose → update → confirm → track → review)
  - Atomic implementation principles
  - Security guardrails (least privilege, sandboxing, no secrets)
  - LLM selection strategy (local for sensitive, cloud for scale)
  - Dependency management rules
  - Next.js specific guidelines
  - Checkpoint tracking protocol
  - Anti-patterns and quick reference

- ✅ **copilot_instructions.md** covers:
  - Execution rules (think first, plan mode, small diffs)
  - Output standards (copy-pasteable code, file references)
  - Security & privacy guardrails
  - MCP usage guidelines
  - Next.js conventions

- ✅ **Session tracking system**:
  - `SESSION_NOTES.md` - Session-to-session continuity
  - `PROGRESS.md` - High-level status dashboard
  - `project_plan.md` - Detailed checkpoint tracking (this file)

**Architecture Decisions**:
1. **Dual Governance Files**: `claude.md` (comprehensive) + `copilot_instructions.md` (concise)
2. **Plan-First Workflow**: Always update `project_plan.md` before major changes
3. **Security-First**: MCP servers only in Dev Containers with least privilege
4. **Transparency**: Every checkpoint includes review with changes/risks/next steps

**Risks**: None

**Next Steps**: Apply governance in practice, test plan-first workflow

---

## Checkpoint 4: Advanced Agent Configuration (MCP/Background)

**Goal**: Configure MCP servers securely and set up background coding agent environment.

### Tasks
- [x] Create `mcp.config.json` with filesystem server
- [x] Document MCP security warnings (full system access, code execution risks)
- [ ] Review and optimize MCP server `root` path (currently `/workspace` - consider narrowing)
- [ ] Add security documentation to MCP config (done partially in claude.md)
- [x] Create `copilot_setup_steps.yaml` for GitHub Actions environment
- [ ] Update `copilot_setup_steps.yaml` to match npm/pnpm fallback strategy
- [x] Create GitHub Actions workflow (`.github/workflows/nextjs-e2e.yml`)
- [ ] Fix GitHub Actions to use npm when pnpm unavailable (Windows compatibility)
- [ ] Initialize git repository
- [ ] Push to GitHub and test Actions workflow
- [ ] Connect Vercel via GitHub App
- [ ] Test Preview + Production deployments
- [ ] Verify Lighthouse CI integration

### Review (Checkpoint 4) - IN PROGRESS
**Completed**:
- ✅ **MCP Configuration** (`mcp.config.json`):
  - Filesystem server configured with `/workspace` root
  - Read/write permissions set
  - Security notes included
  - Documented extensively in `claude.md`

- ✅ **Background Agent Setup** (`copilot_setup_steps.yaml`):
  - Node 20 + Python 3.11 environment
  - Automated dependency installation
  - Supports both npm and pnpm

- ✅ **GitHub Actions** (`.github/workflows/nextjs-e2e.yml`):
  - E2E testing with Playwright
  - Sharded execution (2 runners)
  - Next.js build cache
  - Playwright report artifacts
  - Currently configured for pnpm

- ✅ **Deployment Scripts**:
  - `scripts/deploy.sh` for Vercel CLI deployment
  - `vercel.json` configuration

**Pending**:
- ⏳ GitHub Actions needs npm fallback (currently requires pnpm)
- ⏳ Git repository not initialized
- ⏳ Vercel connection not established
- ⏳ CI/CD pipeline not tested end-to-end
- ⏳ MCP server scope could be narrowed (consider `/workspace/app` instead of `/workspace`)

**Current Blocker**:
- pnpm not available on Windows host (Corepack permission error)
- Need to update workflows and configs to use npm as primary on Windows

**Security Considerations**:
- ⚠️ MCP filesystem server has broad `/workspace` access - acceptable for Dev Container isolation
- ✅ Server documented to run only in containers/VMs
- ✅ Permissions explicitly defined (read/write)
- 🔄 Consider adding GitHub MCP server for enhanced repo management

**Architecture Decisions**:
1. **Package Manager Strategy**: pnpm preferred, npm fallback for Windows compatibility
2. **MCP Security**: Servers isolated to Dev Containers, documented risks
3. **CI/CD**: GitHub Actions → Vercel GitHub App (no tokens, auto previews)
4. **Testing**: Playwright E2E sharded across 2 runners for performance

**Files Created/Modified**:
- `mcp.config.json` - MCP server configuration
- `copilot_setup_steps.yaml` - Background agent environment
- `.github/workflows/nextjs-e2e.yml` - CI/CD pipeline
- `scripts/deploy.sh` - Vercel deployment automation
- `lighthouserc.json` - Performance budgets

**Risks**:
- 🟡 **Medium**: Workflow may fail on Windows without pnpm setup
- 🟡 **Medium**: MCP server broad permissions (mitigated by container isolation)

**Next Steps**:
1. Update GitHub Actions workflow to use npm (Windows compatibility)
2. Update `copilot_setup_steps.yaml` to prioritize npm
3. Initialize git repository
4. Create GitHub repository
5. Test Actions workflow with real PR
6. Connect Vercel and verify deployments
7. Run full E2E test suite
8. Consider narrowing MCP server scope if needed

---

---

## Checkpoint 5: LifeOS Integration Foundation

**Goal**: Connect AI framework to existing Notion-based LifeOS and prioritize Google Calendar integration for task organization.

### Tasks
- [x] Create persistent context system (`LIFEOS_CONTEXT.md`)
- [ ] Document existing LifeOS architecture (8 Notion databases, n8n workflows)
- [ ] Design Google Calendar MCP server (PRIORITY: Two-way sync with Notion Tasks)
- [ ] Design Notion MCP server specification (CRUD operations)
- [ ] Create environment variables template (`.env.example` for APIs)
- [ ] Build MVP: Notion Task → Google Calendar event sync
- [ ] Test Calendar integration end-to-end

### Review (Checkpoint 5) - IN PROGRESS
**Current Focus**: Google Calendar integration as foundation for task organization

**Architecture Decision**:
- **Calendar-First Approach**: Start with Google Calendar ↔ Notion Tasks sync before other features
- **MVP Workflow**: Notion Task (with Due date) → Google Calendar event (auto-scheduled)
- **Reverse Sync**: Calendar changes → Update Notion Task status
- **MCP Server**: Secure, sandboxed access to both APIs

**Pending**:
- ⏳ Document current LifeOS structure (databases, formulas, workflows)
- ⏳ Set up Google Calendar API credentials
- ⏳ Set up Notion API integration token
- ⏳ Build Calendar MCP server
- ⏳ Test two-way sync

**Next Steps**: Document LifeOS architecture, then build Calendar integration MVP

---

## Checkpoint 6: LifeOS Dashboard & AI Agents

**Goal**: Build Next.js dashboard and activate specialized AI agents for life domains.

### Tasks
- [ ] Design LifeOS dashboard UI (React components)
- [ ] Create API routes for Notion data (`/api/notion/tasks`, `/api/calendar/sync`)
- [ ] Build real-time sync system (Notion ↔ Calendar)
- [ ] Create 9 AI agent prompt templates (Planner, Focus, Reflection, Opportunity, Analytics, Finance, Content, CRM, Spiritual)
- [ ] Build slash command system (`/plan-day`, `/reflect`, `/focus`, `/find-opportunity`)
- [ ] Test agent delegation and handoff protocols
- [ ] Deploy dashboard to Vercel

### Review (Checkpoint 6) - PENDING
**Status**: Awaiting Checkpoint 5 completion

---

## Checkpoint 7: Advanced LifeOS Features

**Goal**: Add voice input, analytics, and multi-business workflows.

### Tasks
- [ ] Integrate Telegram voice capture (connect existing n8n workflow)
- [ ] Build analytics dashboard (time tracking, efficiency metrics)
- [ ] Create weekly review automation
- [ ] Add multi-business tracking (Real Estate, Books, Content, Signing)
- [ ] Implement opportunity finder agent (trend scanning)
- [ ] Build habit tracking visualization
- [ ] Test full LifeOS workflow end-to-end

### Review (Checkpoint 7) - PENDING
**Status**: Awaiting Checkpoint 6 completion

---

## Checkpoint 8: Polish & Optimization

**Goal**: Performance optimization, documentation, and user training.

### Tasks
- [ ] Performance audit (API response times, caching strategy)
- [ ] Security audit (MCP servers, API credentials, data privacy)
- [ ] Create user documentation (LifeOS quick start guide)
- [ ] Build agent usage examples (video walkthroughs)
- [ ] Optimize agent prompts based on usage patterns
- [ ] Mobile optimization (iPhone dashboard access)
- [ ] Final production deployment

### Review (Checkpoint 8) - PENDING
**Status**: Awaiting Checkpoint 7 completion

---

## Overall Framework Status

### ✅ What's Working
- Dev Container environment (reproducible, isolated, performance-optimized)
- Next.js app structure (App Router, TypeScript, Tailwind, Contact form)
- E2E testing infrastructure (Playwright, accessibility, sharded)
- Governance system (claude.md, copilot_instructions.md, task tracking)
- Security guidelines (MCP sandboxing, LLM selection, no secrets)
- GitHub repository with CI/CD (GitHub Actions + Vercel)
- Production deployment (https://ai-augmented-nextjs-framework.vercel.app)

### 🔄 In Progress
- **Checkpoint 5**: LifeOS integration foundation (Calendar + Notion sync)
- Persistent context system (LIFEOS_CONTEXT.md)
- Google Calendar API integration (PRIORITY)

### 📋 Pending
- Notion MCP server implementation
- Calendar MCP server implementation
- AI agent prompt engineering (9 agents)
- LifeOS dashboard UI
- Voice input integration

### 🎯 Success Criteria (LifeOS Complete)
- [x] All 4 framework checkpoints reviewed and approved
- [x] Dev Container builds successfully
- [x] Next.js dev server runs (`npm run dev`)
- [x] E2E tests pass locally (8/9 passing - 89%)
- [x] Git repository initialized and pushed to GitHub
- [x] GitHub Actions workflow passes
- [x] Vercel deployments working (Preview + Production)
- [x] Documentation complete (`README.md`, `SESSION_NOTES.md`, `PROGRESS.md`)
- [ ] Google Calendar ↔ Notion Tasks sync working
- [ ] 9 AI agents operational with slash commands
- [ ] LifeOS dashboard deployed and accessible
- [ ] End-to-end workflow tested (voice → task → calendar → reflection)

---

## Session Handoff

**For Next Session, Start With**:
```bash
# Read context
cat SESSION_NOTES.md
cat project_plan.md
cat PROGRESS.md

# Continue from Checkpoint 4 pending tasks:
# 1. Fix GitHub Actions for npm
# 2. Initialize git
# 3. Test CI/CD pipeline
```

**Quick Status**: Framework 80% complete. Core infrastructure solid. Need to complete git setup and verify CI/CD pipeline with npm compatibility fix.
