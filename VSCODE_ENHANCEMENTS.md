# VS Code AI Enhancement Guide

> **Objective**: Maximize Claude Code's effectiveness in this VS Code environment

---

## 🎯 Current VS Code Setup

### Installed Extensions (Recommended)
```json
{
  "recommendations": [
    "GitHub.copilot",                      // ✅ AI pair programming
    "ms-vscode-remote.remote-containers",  // ✅ Dev Container support
    "dbaeumer.vscode-eslint",              // ✅ JavaScript/TypeScript linting
    "esbenp.prettier-vscode",              // ✅ Code formatting
    "bradlc.vscode-tailwindcss",           // ✅ Tailwind CSS IntelliSense
    "ms-playwright.playwright"             // ✅ E2E test runner integration
  ]
}
```

### Performance Settings
```json
{
  "editor.codeLens": false,                           // Disabled for performance
  "typescript.tsserver.maxTsServerMemory": 4096,      // 4GB for large projects
  "search.exclude": { "**/.next": true },             // Exclude build folders
  "files.watcherExclude": { "**/.next/**": true },    // Don't watch builds
  "typescript.updateImportsOnFileMove.enabled": "never"  // Prevent auto-updates
}
```

---

## 🚀 Recommended Additional Extensions

### For Enhanced AI Capabilities

**1. AI Toolkit for Visual Studio Code** (Already in devcontainer)
```
Extension ID: ms-windows-ai-studio.windows-ai-studio
```
**Benefits**:
- Model Playground for testing prompts
- Agent Builder for custom AI workflows
- Support for OpenAI, Anthropic, Ollama, Hugging Face
- RAG (Retrieval-Augmented Generation) support

**How to Use with Claude Code**:
- Test prompts in Playground before using in governance files
- Build custom agents for specific tasks (e.g., code review agent)
- Use local models for sensitive code analysis

---

**2. Continue** (Alternative AI Assistant)
```
Extension ID: continue.continue
```
**Benefits**:
- Local LLM support (Ollama, llama.cpp)
- MCP server integration
- Custom slash commands
- Inline code generation

**Complements Claude Code**:
- Use for quick inline suggestions
- Claude Code for complex multi-file tasks

---

**3. REST Client** (For testing Contact API)
```
Extension ID: humao.rest-client
```
**Benefits**:
- Test API routes without leaving VS Code
- Save request collections
- Environment variables support

**Example Usage**:
```http
### Test Contact Form API
POST http://localhost:3000/api/contact
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "message": "Testing contact form",
  "hp": ""
}
```

---

**4. GitHub Actions** (CI/CD monitoring)
```
Extension ID: github.vscode-github-actions
```
**Benefits**:
- View workflow runs in VS Code
- Trigger workflows manually
- View logs without browser

---

**5. Error Lens** (Inline error display)
```
Extension ID: usernamehm.errorlens
```
**Benefits**:
- See errors inline (no hover needed)
- Faster debugging
- Works with ESLint/TypeScript

---

### For Local LLM Integration

**6. llama.vscode** (Recommended in claude.md)
```
Extension ID: Not yet in marketplace (see GitHub: ggerganov/llama.cpp)
```
**Benefits**:
- Run LLMs locally (privacy-first)
- No API costs
- Works offline
- Integrates with llama.cpp

**Setup**:
```bash
# Install Ollama (easiest option)
# Windows: https://ollama.com/download
# Then pull a model
ollama pull codellama

# Configure in VS Code settings
{
  "llama.modelPath": "codellama",
  "llama.contextLength": 4096
}
```

---

**7. Ollama** (Local LLM runtime)
```
Not a VS Code extension - Standalone app
Download: https://ollama.com
```
**Models for Coding**:
```bash
ollama pull codellama          # 7B - Code completion
ollama pull deepseek-coder     # 33B - Advanced coding
ollama pull phind-codellama    # 34B - Code + explanations
```

**Integration with AI Toolkit**:
- Add Ollama as model provider in AI Toolkit
- Use for sensitive code analysis
- Free, runs on your machine

---

## 🔧 VS Code Features to Empower Claude Code

### 1. **Task Automation** (tasks.json)

Create `.vscode/tasks.json`:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Run E2E Tests",
      "type": "shell",
      "command": "npm run test:e2e",
      "group": "test",
      "presentation": { "reveal": "always" }
    },
    {
      "label": "Build & Test",
      "dependsOn": ["Build", "Run E2E Tests"],
      "group": "build"
    }
  ]
}
```

**Claude Code can**:
- Reference tasks in commands
- Automate test execution
- Create custom build pipelines

---

### 2. **Launch Configurations** (launch.json)

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Playwright: debug tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/playwright",
      "args": ["test", "--headed", "--debug"]
    }
  ]
}
```

**Claude Code can**:
- Debug Next.js app
- Step through E2E tests
- Set breakpoints programmatically

---

### 3. **Snippets** (User or Workspace snippets)

Create `.vscode/nextjs.code-snippets`:
```json
{
  "Next.js API Route": {
    "prefix": "napi",
    "body": [
      "import { NextRequest, NextResponse } from 'next/server';",
      "",
      "export async function GET(request: NextRequest) {",
      "  return NextResponse.json({ message: 'Hello' });",
      "}",
      "",
      "export async function POST(request: NextRequest) {",
      "  const body = await request.json();",
      "  return NextResponse.json({ received: body });",
      "}"
    ],
    "description": "Next.js 14 API route template"
  }
}
```

**Claude Code can**:
- Reference snippets in code generation
- Create custom snippets for your patterns

---

### 4. **Workspace Settings** (Multi-root)

If managing multiple projects:
```json
{
  "folders": [
    { "path": "VSCode_AI_Framework_Setup" },
    { "path": "../LifeOS_Notion_Databases" }
  ],
  "settings": {
    "search.exclude": {
      "**/.next": true,
      "**/node_modules": true
    }
  }
}
```

---

## 🤖 Claude Code Capabilities in VS Code

### What Claude Code Can Do

**File Operations**:
- ✅ Read any file (images, PDFs, notebooks, code)
- ✅ Edit files with precise string replacement
- ✅ Write new files
- ✅ Glob file searches (find by pattern)
- ✅ Grep content searches (search inside files)

**Code Execution**:
- ✅ Run bash commands
- ✅ Execute npm scripts
- ✅ Run tests
- ✅ Start dev servers (background)
- ✅ Monitor command output

**Git & GitHub**:
- ✅ Initialize repositories
- ✅ Commit with messages
- ✅ Push to remote
- ✅ Create PRs (via `gh` CLI)
- ✅ View workflow status

**Web Access**:
- ✅ Fetch URLs
- ✅ Search the web
- ✅ Read documentation

**Agent Capabilities**:
- ✅ Launch sub-agents for complex tasks
- ✅ Task tracking (TodoWrite)
- ✅ Plan mode for large changes

### What Would Make Claude Code More Powerful

**1. Extension API Access** (Future Enhancement)
- If Claude Code could call VS Code extension APIs:
  - Trigger debugger
  - Run tasks directly
  - Open files in editor
  - Show notifications

**2. Terminal Integration** (Current Limitation)
- Can run commands but can't interact with:
  - Interactive prompts (e.g., `git rebase -i`)
  - Password inputs
  - Menu selections

**Workaround**: Use non-interactive flags
```bash
# Instead of: git rebase -i
# Use: git rebase --onto <branch>
```

**3. Real-time Feedback** (Enhancement Idea)
- Watch file changes
- Auto-run tests on save
- Live lint feedback

**Current**: Claude Code runs commands on demand
**Future**: Could watch and react to changes

---

## 📋 Actionable Enhancements for This Project

### Immediate (No new extensions)

**1. Add Task Automation**
```bash
# Claude Code can create .vscode/tasks.json for:
- npm run dev (start dev server)
- npm run test:e2e (run tests)
- npm run build (production build)
- npm run lint (ESLint check)
```

**2. Add Launch Configs**
```bash
# For debugging:
- Next.js server
- Playwright tests
- TypeScript files
```

**3. Create Snippets**
```bash
# Common patterns:
- Next.js API routes
- React components
- Playwright tests
- TypeScript types
```

### Near-term (Install extensions)

**4. Add AI Toolkit**
```bash
# Install manually or via devcontainer
code --install-extension ms-windows-ai-studio.windows-ai-studio
```

**5. Add REST Client**
```bash
code --install-extension humao.rest-client
# Then test API routes in VS Code
```

**6. Add GitHub Actions Extension**
```bash
code --install-extension github.vscode-github-actions
# Monitor CI/CD without leaving VS Code
```

### Long-term (Local LLM setup)

**7. Set up Ollama**
```bash
# Download from https://ollama.com
# Install codellama model
ollama pull codellama

# Integrate with AI Toolkit
# Use for privacy-sensitive code analysis
```

---

## 🎓 Learning Resources

### VS Code + AI
- **VS Code AI Toolkit**: https://github.com/microsoft/vscode-ai-toolkit
- **Claude.ai**: https://claude.ai (for testing prompts)
- **Ollama**: https://ollama.com/library (local models)

### Agentic Workflows
- **MCP Specification**: https://modelcontextprotocol.io
- **Anthropic Claude**: https://docs.anthropic.com/claude/docs
- **GitHub Copilot Agent**: https://docs.github.com/copilot/using-github-copilot/using-github-copilot-code-review

---

## 🔍 How to Check Current Extensions

**From Claude Code**:
```bash
# List installed extensions
code --list-extensions

# Show extension details
code --show-versions
```

**From VS Code UI**:
- Press `Ctrl+Shift+X` (Windows/Linux)
- Or `Cmd+Shift+X` (Mac)
- View "Installed" tab

---

## 📊 Comparison: Claude Code vs Other AI Tools

| Feature | Claude Code | GitHub Copilot | AI Toolkit | Continue |
|---------|-------------|----------------|------------|----------|
| **Multi-file edits** | ✅ Excellent | ❌ No | ⚠️ Limited | ⚠️ Limited |
| **Planning mode** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Task tracking** | ✅ TodoWrite | ❌ No | ❌ No | ❌ No |
| **Git integration** | ✅ Full | ⚠️ Partial | ❌ No | ❌ No |
| **Local LLMs** | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| **MCP support** | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes |
| **Inline completion** | ❌ No | ✅ Best | ⚠️ Limited | ✅ Yes |
| **Code review** | ✅ Excellent | ⚠️ Basic | ⚠️ Basic | ⚠️ Basic |
| **Best for** | Complex tasks | Quick completions | Model testing | Local privacy |

**Recommendation**: Use all together
- **Claude Code**: Complex multi-file tasks, refactoring, planning
- **Copilot**: Inline completions while typing
- **AI Toolkit**: Testing prompts, model evaluation
- **Continue**: Local LLM for sensitive code

---

**Last Updated**: 2025-10-08
**Status**: Ready for enhancement
**Next**: Install AI Toolkit and create tasks.json
