# Vercel Deployment Guide

> **Next Step**: Connect GitHub repository to Vercel for live deployments

---

## 🚀 Quick Deploy (Recommended)

### Option 1: Vercel GitHub App (No Tokens Required)

**Benefits**:
- Automatic Preview deployments on PRs
- Automatic Production deployments on main branch
- No tokens to manage
- Built-in deployment comments on PRs

**Steps**:

1. **Visit Vercel Import**
   ```
   https://vercel.com/new
   ```

2. **Import Git Repository**
   - Click "Add New" → "Project"
   - Select "Import Git Repository"
   - Choose: `onesam-jpg/ai-augmented-nextjs-framework`

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Environment Variables** (Optional)
   - `CONTACT_WEBHOOK_URL` - Webhook URL for contact form submissions
   - `NEXT_TELEMETRY_DISABLED` - Set to `1` (optional)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for initial build
   - Get Production URL: `https://[project-name].vercel.app`

---

## 🔧 Configuration Details

### Build Settings
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "outputDirectory": ".next"
}
```

### Environment Variables

| Variable | Purpose | Required | Example |
|----------|---------|----------|---------|
| `CONTACT_WEBHOOK_URL` | Forward contact submissions to webhook | No | `https://hooks.slack.com/services/...` |
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry | No | `1` |

---

## 🔄 Deployment Workflow

### Automatic Deployments

**Production** (main branch):
```bash
git push origin main
# → Triggers Vercel production deployment
# → Live at https://[project-name].vercel.app
```

**Preview** (PRs and branches):
```bash
git checkout -b feature/new-feature
git push origin feature/new-feature
# → Triggers Vercel preview deployment
# → Live at https://[project-name]-[branch-hash].vercel.app
```

### GitHub Actions Integration

Our workflow (`.github/workflows/nextjs-e2e.yml`) runs E2E tests:
- ✅ Vercel deploys happen in parallel
- ✅ Tests run as status checks
- ✅ Merge blocked if tests fail (when branch protection enabled)

**Workflow**:
```
1. Push to branch
2. GitHub Actions: Run E2E tests
3. Vercel: Deploy preview
4. Both complete → Merge allowed
```

---

## 🛡️ Branch Protection (Recommended)

After connecting Vercel, set up branch protection:

1. Go to GitHub: **Settings** → **Branches**
2. Add rule for `main` branch:
   - ✅ Require status checks to pass
   - ✅ Require: `E2E (Playwright)`
   - ✅ Require approvals (optional)
   - ✅ Require linear history (optional)

3. Result: Can't merge to main unless tests pass

---

## 📊 Deployment Status

### Current State
- ⏳ Repository: https://github.com/onesam-jpg/ai-augmented-nextjs-framework
- ⏳ Vercel: Not connected yet
- ✅ Build: Passing locally
- 🟡 CI/CD: Running (some test failures)

### Next Actions
1. Connect Vercel via GitHub App
2. Wait for initial production deployment
3. Test production URL
4. Create a test PR to verify preview deployments
5. Enable branch protection

---

## 🔍 Troubleshooting

### Build Fails on Vercel

**Check**:
```bash
# Test locally first
npm install
npm run build

# If it works locally, check Vercel logs
vercel logs [deployment-url]
```

**Common Issues**:
- Missing environment variables
- Build command mismatch
- Wrong Node version (we need Node 20+)

### Tests Fail on Vercel Preview

Vercel doesn't run our E2E tests - GitHub Actions does.
- Check GitHub Actions tab for test failures
- Vercel only builds and deploys

### Preview URL Not Working

- Wait 2-3 minutes after push
- Check Vercel dashboard for deployment status
- Verify GitHub App permissions

---

## 🎯 Success Criteria

After Vercel connection, you should have:

- ✅ Production deployment live
- ✅ Preview deployments on every PR
- ✅ Deployment comments on PRs from Vercel bot
- ✅ Branch protection requiring tests to pass
- ✅ Contact form working (test with real submission)

---

## 📝 Post-Deployment Testing

### Test Checklist
```bash
# 1. Test Production URL
curl https://[your-project].vercel.app

# 2. Test contact form
# → Fill form on live site
# → Check webhook (if configured)

# 3. Test preview deployment
git checkout -b test-preview
# → Make small change
git push origin test-preview
# → Wait for preview URL in PR

# 4. Verify GitHub Actions
# → Check Actions tab for E2E results
```

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel CLI Docs**: https://vercel.com/docs/cli
- **Next.js on Vercel**: https://vercel.com/docs/frameworks/nextjs
- **GitHub App**: https://vercel.com/docs/deployments/git/vercel-for-github

---

**Last Updated**: 2025-10-08
**Status**: Ready to deploy
**Estimated Time**: 5 minutes
