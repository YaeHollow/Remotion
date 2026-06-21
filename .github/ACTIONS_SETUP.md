# GitHub Actions Setup Guide

## ✅ Automatic Video Rendering

GitHub Actions is now configured to automatically render your Remotion video when you push to the repository.

---

## 🚀 How It Works

### Automatic Rendering (On Every Push)
1. **Push to `main` branch** → Workflow triggers automatically
2. **Video renders** (takes 5-10 minutes)
3. **Artifact uploaded** to Actions (30-day retention)
4. **GitHub Release created** with video attached
5. **Commit comment added** with download links

### Manual Rendering (On Demand)
1. Go to **Actions** tab in your GitHub repo
2. Select **"Render Remotion Video"** workflow
3. Click **"Run workflow"**
4. Choose `Create a GitHub release` (optional)
5. Click **"Run workflow"**

---

## 📥 Download the Video

### Option 1: From Releases
```bash
# Latest release with video
https://github.com/YaeHollow/Remotion/releases/latest
```
Click on `video.mp4` to download.

### Option 2: From Actions Artifacts
1. Go to **Actions** tab
2. Click the completed workflow run
3. Scroll to **Artifacts** section
4. Download `remotion-video` (contains `video.mp4`)

### Option 3: Clone & Build Locally
```bash
git clone https://github.com/YaeHollow/Remotion.git
cd Remotion
npm install
npm run build
# Video is at: out/video.mp4
```

---

## 🔧 Workflow Details

### Triggers
- **On Push**: Automatically renders when you push code to `main`
- **Manual**: Use `workflow_dispatch` to render on-demand from Actions tab

### What It Does
```
✅ Checks out code
✅ Sets up Node.js 20
✅ Installs dependencies (with npm cache)
✅ Renders video to out/video.mp4
✅ Uploads artifact (30-day retention)
✅ Creates GitHub Release with video
✅ Comments on commit with download links
```

### Timeout
60 minutes (should complete in 10-15 minutes on GitHub's infrastructure)

---

## 📊 Viewing Build Status

### In Your Repository
1. Click the **Actions** tab
2. Select **"Render Remotion Video"**
3. See all workflow runs with status (✅ Success or ❌ Failed)

### On Commit
- Green checkmark ✅ = Video rendered successfully
- Red X ❌ = Build failed (check Actions tab for logs)

---

## 🎬 Environment Variables

The workflow sets:
- `CI=true` - Tells Remotion we're in CI environment
- Uses GitHub's built-in `GITHUB_TOKEN` for releases

---

## 📝 File: `.github/workflows/render.yml`

This is the workflow configuration. It:
- Runs on `push` to `main`
- Supports manual trigger (`workflow_dispatch`)
- Uses npm cache for faster builds
- Uploads artifacts
- Creates releases automatically
- Comments on commits with status

---

## 🚨 Troubleshooting

### Workflow Won't Run
**Check:**
- Did you push to `main` branch?
- Does `.github/workflows/render.yml` exist?
- Check **Actions** tab for error messages

### Video Build Fails
**Common causes:**
- Node.js version mismatch (uses 20)
- Missing dependencies (npm ci should fix this)
- Remotion compilation error (check TypeScript)

**Fix:**
1. Check the full log in Actions tab
2. Run locally: `npm run build`
3. Fix any issues in `src/scenes/`
4. Push to trigger workflow again

### Release Not Created
**Possible issue:** `GITHUB_TOKEN` permissions
- GitHub automatically provides this, should work out of the box
- If not, you may need to adjust repo permissions

---

## 💡 Tips

### Faster Builds
- Artifacts are cached in GitHub's runners
- Subsequent builds will be faster
- npm cache means dependencies download once

### Video Quality
- Currently renders at 1920×1080, 30fps
- Edit `src/Root.tsx` to change resolution/fps
- Rebuild workflow to see changes

### Version Tracking
- Each release tagged as `render-{run-number}`
- You can go back to any previous render
- Keep useful builds, delete outdated ones

---

## 🔄 Workflow Example

When you push code:

```
User pushes to main
        ↓
GitHub detects push
        ↓
Render Remotion Video workflow triggers
        ↓
GitHub spins up Ubuntu runner
        ↓
Node 20 installed, deps cached
        ↓
npm ci (clean install)
        ↓
npm run build (5-10 min)
        ↓
Video rendered: out/video.mp4
        ↓
Artifact uploaded (30-day retention)
        ↓
Release created with tag
        ↓
Commit commented with links
        ↓
✅ Workflow complete!
```

---

## 🎁 Using the Video

Once you have `video.mp4`:

- **Share on social media** (YouTube, Vimeo, TikTok)
- **Embed in documentation** (README, website)
- **Distribute** to team members
- **Archive** for future reference

---

## 📋 Next Steps

1. **Commit & Push**
   ```bash
   git add .
   git commit -m "Add GitHub Actions rendering workflow"
   git push origin main
   ```

2. **Watch the Workflow**
   - Go to Actions tab on GitHub
   - Watch the render process
   - Video appears in Releases when done

3. **Download & Enjoy!**
   - Get video from Releases
   - Or download from Actions artifacts

---

**Happy rendering! 🎬**

The video will now automatically build every time you push to main.
