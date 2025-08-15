# 🚀 OmniTask Deployment Monitoring Guide

## ✅ Pre-Deployment Checklist
- [x] Optimized Dockerfile with multi-stage build (commit 294222fc)
- [x] Added `output: 'standalone'` to next.config.mjs (commit 1068d14c)
- [x] Changes pushed to main branch
- [x] Ready for Coolify deployment

## 📊 Build Monitoring Checklist

### 1. **Start Deployment in Coolify**
- Go to your Coolify dashboard
- Navigate to OmniTask application
- Click "Deploy" to trigger new build

### 2. **Monitor Build Progress** ⏱️
Track these key stages and their approximate timing:

| Stage | Description | Expected Time | Status |
|-------|-------------|---------------|---------|
| **Git Clone** | Repository checkout | 10-30s | ⏳ |
| **Dependencies Install** | `pnpm install --filter=@omnirealm/omni-task...` | 2-4min | ⏳ |
| **Build Process** | `pnpm run build` | 3-6min | ⏳ |
| **Docker Layers** | Copying files to production image | 30-60s | ⏳ |
| **Container Start** | Application startup | 10-20s | ⏳ |

**⚠️ CRITICAL TIMEOUT POINTS:**
- Dependencies: If > 5min → pnpm/network issue
- Build: If > 8min → TypeScript/build optimization needed
- Total: If > 12min → Coolify timeout likely

### 3. **Watch for These Error Patterns**

#### Common Timeout Indicators:
```
✗ Error: Process killed (timeout)
✗ Build cancelled due to timeout
✗ Container build timeout exceeded
✗ npm ERR! network timeout
```

#### Build Issues to Monitor:
```
✗ TypeScript compilation errors
✗ Module resolution failures
✗ Out of memory errors
✗ Disk space issues
```

### 4. **Log Analysis Points**

#### Successful Build Markers:
```
✅ pnpm install completed successfully
✅ Next.js build successful
✅ Standalone server.js generated
✅ Container built successfully
✅ Application started on port 3002
```

#### Problem Indicators:
```
❌ ECONNRESET during install
❌ Module not found errors
❌ Out of memory (heap limit)
❌ Build process killed
```

## 🔧 Timeout Troubleshooting Steps

### If Build Times Out During Dependencies (2-5min mark):
1. **Check Coolify Server Settings** → Build timeout configuration
2. **Verify pnpm cache** → May need cache clearing
3. **Network issues** → Check server connectivity

### If Build Times Out During Next.js Build (5-10min mark):
1. **Memory issues** → Check server resources
2. **TypeScript complexity** → May need `ignoreBuildErrors: true` adjustment
3. **Webpack optimization** → Bundle size analysis needed

### If Container Fails to Start:
1. **Missing standalone output** → Check next.config.mjs
2. **Port conflicts** → Verify PORT=3002 is available
3. **Environment variables** → Check required env vars

## 📈 Performance Metrics to Track

| Metric | Target | Action if Exceeded |
|--------|--------|-------------------|
| **Total Build Time** | < 10min | Optimize dependencies/build |
| **Dependencies Install** | < 4min | Check network/cache |
| **Next.js Build** | < 6min | Analyze bundle size |
| **Docker Layer Copy** | < 2min | Optimize Dockerfile |
| **Container Start** | < 30s | Check app startup |

## 🛠️ Immediate Actions if Timeout Occurs

### Option 1: Increase Coolify Timeout
1. Go to Coolify Server Settings
2. Look for "Build Timeout" or "Deploy Timeout"
3. Increase from default (usually 10min) to 15-20min

### Option 2: Create nixpacks.toml for Better pnpm Support
```toml
[build]
cmd = "pnpm install --filter=@omnirealm/omni-task... && pnpm --filter=@omnirealm/omni-task run build"

[start]
cmd = "cd dev/apps/omni-task && node server.js"

[variables]
NODE_ENV = "production"
PORT = "3002"
```

### Option 3: Simplify Build Strategy
Switch to simpler non-standalone build if needed.

## 📝 Monitoring Commands

While deployment is running, you can use these commands locally:

```bash
# Check recent commits
git log --oneline -5

# Verify Docker build locally (optional)
cd /home/greg/projets
docker build -t omnitask-test -f dev/apps/omni-task/Dockerfile .

# Monitor system resources
htop
df -h
```

## 🎯 Success Criteria

✅ **Deployment Successful** when you see:
- Build completed in < 15 minutes
- No timeout errors in logs
- Application accessible on assigned URL
- Health check passes
- Port 3002 responding correctly

---

**Next Steps After Successful Deploy:**
1. Test application functionality
2. Monitor performance metrics
3. Set up automated health checks
4. Document any optimizations made