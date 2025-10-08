# MCP Server Security Guide

> **Critical**: Model Context Protocol (MCP) servers enable powerful agent capabilities but introduce significant security risks. This guide ensures safe implementation.

---

## ⚠️ Security Risks Overview

### Inherent MCP Server Risks

| Risk Category | Description | Severity |
|--------------|-------------|----------|
| **Full System Access** | Filesystem servers can read/write ANY file within `root` scope | 🔴 Critical |
| **Arbitrary Code Execution** | Some servers can execute shell commands or scripts | 🔴 Critical |
| **Data Exposure** | Misconfigured servers may leak sensitive data to AI models | 🟠 High |
| **Privilege Escalation** | Servers running as privileged users can modify system files | 🟠 High |
| **Network Access** | Servers may make external requests, exposing internal data | 🟡 Medium |

---

## 🛡️ Required Security Safeguards

### 1. Sandboxing (MANDATORY)

**Always run MCP servers in isolated environments:**

✅ **Approved Environments**:
- Dev Containers (Docker)
- Virtual Machines (VM)
- Sandboxed processes with limited permissions

❌ **Never Run MCP Servers**:
- Directly on host OS without containerization
- With administrator/root privileges
- In production environments without security review

**Current Setup** (`.devcontainer/devcontainer.json`):
```json
{
  "name": "ai-agent-dev-nextjs",
  "image": "mcr.microsoft.com/devcontainers/typescript-node:1-20",
  // MCP servers run inside this container, isolated from host
}
```

### 2. Least Privilege Permissions

**Principle**: Grant ONLY the minimum permissions required for functionality.

**Filesystem Server Example** (`mcp.config.json`):
```json
{
  "servers": [
    {
      "name": "fs",
      "type": "filesystem",
      "root": "/workspace/app",  // ✅ Narrow scope (not /workspace)
      "permissions": ["read"],    // ✅ Read-only if possible
      "notes": "Limited to app/ directory. Run in Dev Container only."
    }
  ]
}
```

**Permission Escalation Path**:
```
❌ Bad:  root: "/", permissions: ["read", "write", "delete"]
🟡 OK:   root: "/workspace", permissions: ["read", "write"]
✅ Best: root: "/workspace/app", permissions: ["read"]
```

### 3. Explicit Scope Documentation

**Every MCP server must document**:
- **Purpose**: Why this server is needed
- **Scope**: What files/resources it accesses
- **Permissions**: Exact capabilities granted
- **Risk Mitigation**: How risks are addressed

**Template**:
```json
{
  "name": "server-name",
  "type": "server-type",
  "root": "/specific/path",
  "permissions": ["minimal", "set"],
  "notes": "Purpose: [why]. Scope: [what]. Risk mitigation: [how]. Container-only."
}
```

### 4. Audit & Monitoring

**Recommended Practices**:
- [ ] Review MCP server logs regularly for unexpected behavior
- [ ] Set up alerts for file access outside expected paths
- [ ] Periodically audit `mcp.config.json` for permission creep
- [ ] Document all changes to MCP configuration with rationale

---

## 📋 Current MCP Configuration Review

### Filesystem Server (`fs`)

**Configuration** (`mcp.config.json`):
```json
{
  "name": "fs",
  "type": "filesystem",
  "root": "/workspace",
  "permissions": ["read", "write"],
  "notes": "Run only inside a Dev Container or VM. Use least privilege."
}
```

**Security Assessment**:
- ✅ **Sandboxing**: Runs in Dev Container (isolated from host)
- 🟡 **Permissions**: Read/write granted (consider read-only if sufficient)
- 🟡 **Scope**: `/workspace` is broad (could narrow to `/workspace/app`)
- ✅ **Documentation**: Notes include security warning

**Recommendations**:
1. **Narrow Scope** (if agents only need app code):
   ```json
   "root": "/workspace/app"
   ```

2. **Reduce Permissions** (if write access not required):
   ```json
   "permissions": ["read"]
   ```

3. **Enhanced Documentation**:
   ```json
   "notes": "Purpose: AI code analysis/editing. Scope: Next.js app only. Mitigation: Dev Container isolation + read-only outside app/. NEVER run on host OS."
   ```

---

## 🔒 Secure MCP Server Configurations

### Example 1: Read-Only Code Analysis
```json
{
  "servers": [
    {
      "name": "code-reader",
      "type": "filesystem",
      "root": "/workspace/app",
      "permissions": ["read"],
      "notes": "Purpose: Code analysis & documentation. Scope: app/ only. Read-only for safety. Container-isolated."
    }
  ]
}
```

### Example 2: Restricted Write Access
```json
{
  "servers": [
    {
      "name": "test-generator",
      "type": "filesystem",
      "root": "/workspace/tests",
      "permissions": ["read", "write"],
      "notes": "Purpose: Generate/update test files. Scope: tests/ directory only. Write access needed for test creation. Container-only."
    }
  ]
}
```

### Example 3: Multi-Server Setup
```json
{
  "servers": [
    {
      "name": "app-reader",
      "type": "filesystem",
      "root": "/workspace/app",
      "permissions": ["read"],
      "notes": "Code analysis (read-only)"
    },
    {
      "name": "test-writer",
      "type": "filesystem",
      "root": "/workspace/tests",
      "permissions": ["read", "write"],
      "notes": "Test generation (write access)"
    },
    {
      "name": "github",
      "type": "github",
      "scopes": ["repo", "issues"],
      "notes": "Repository management. OAuth token stored in container env vars only."
    }
  ]
}
```

---

## 🚨 Incident Response

### If MCP Server Compromised

1. **Immediate Actions**:
   - [ ] Stop the Dev Container (`docker stop <container-id>`)
   - [ ] Revoke MCP server tokens/credentials
   - [ ] Review MCP server logs for unauthorized access
   - [ ] Check git history for unexpected commits

2. **Assessment**:
   - [ ] Identify what files/data were accessed
   - [ ] Determine if secrets were exposed
   - [ ] Review AI model interaction logs

3. **Remediation**:
   - [ ] Narrow MCP server `root` path
   - [ ] Reduce permissions to minimum required
   - [ ] Rotate any exposed credentials
   - [ ] Update security documentation

4. **Prevention**:
   - [ ] Add MCP server monitoring
   - [ ] Implement stricter permission reviews
   - [ ] Document lessons learned

---

## 🎯 Security Checklist

### Before Adding New MCP Server
- [ ] Clearly define why this server is needed (document in `notes`)
- [ ] Determine minimum `root` path required
- [ ] Set least-privilege `permissions`
- [ ] Confirm server will run in Dev Container/VM only
- [ ] Add monitoring/logging for server activity
- [ ] Document security review in `project_plan.md`

### Periodic Review (Monthly)
- [ ] Audit all MCP servers in `mcp.config.json`
- [ ] Verify no permission escalation has occurred
- [ ] Check server logs for anomalies
- [ ] Update security documentation if risks change

### Pre-Production Deployment
- [ ] Remove or disable all MCP servers (unless production-approved)
- [ ] Verify no MCP configurations in production environment variables
- [ ] Confirm no MCP tokens/credentials in source code
- [ ] Document MCP server removal in deployment checklist

---

## 📚 Additional Resources

### MCP Security Best Practices
- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [VS Code AI Toolkit MCP Documentation](https://github.com/microsoft/vscode-ai-toolkit)
- [Container Security Best Practices](https://docs.docker.com/develop/security-best-practices/)

### Related Documentation
- `claude.md` - AI agent governance with MCP security guidelines
- `project_plan.md` - Checkpoint 4 includes MCP configuration review
- `.devcontainer/devcontainer.json` - Container isolation configuration

---

**Last Updated**: 2025-10-08
**Next Review**: Monthly (or when adding/modifying MCP servers)
**Owner**: AI-Augmented Development Team
