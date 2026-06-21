# Quick Start & Development Guide

## Running the Project

### Development Mode (Preview)
```bash
npm run dev
# Opens Remotion preview at http://localhost:3000
# Live reload enabled - edit scenes and see changes instantly
```

### Building the Video
```bash
npm run build
# Renders composition to out/video.mp4
# Full HD (1920×1080) at 30fps
# Total duration: 65 seconds
```

### Viewing Output
```bash
# After build completes:
ffplay out/video.mp4    # Quick preview
open out/video.mp4      # macOS
xdg-open out/video.mp4  # Linux
```

---

## Project Layout

```
src/
├── index.tsx          # Remotion entry point
├── Root.tsx           # Main composition with <Series>
└── scenes/
    ├── Hook.tsx               # Scene 1 (5s)
    ├── MapOverlay.tsx         # Scene 2 (10s)
    ├── TriangleDiagram.tsx    # Scene 3 (15s)
    ├── SpacecraftCemetery.tsx # Scene 4 (15s)
    ├── SparseOcean.tsx        # Scene 5 (10s)
    └── Closer.tsx             # Scene 6 (10s)
```

---

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `remotion` | 4.0.481 | Video composition framework |
| `@remotion/three` | 4.0.481 | Three.js integration |
| `@react-three/fiber` | 9.6.1 | React renderer for Three.js |
| `@react-three/drei` | 10.7.7 | Utility components & helpers |
| `three` | 0.184.0 | 3D graphics engine |
| `react` | 19.2.7 | UI library |
| `react-dom` | 19.2.7 | DOM utilities |

---

## Common Tasks

### Adjusting Scene Duration
Edit `src/Root.tsx` and modify `durationInFrames`:
```tsx
<Series.Sequence durationInFrames={150}>  {/* 5 seconds at 30fps */}
  <Hook />
</Series.Sequence>
```

Formula: `durationInFrames = durationInSeconds * 30`

### Changing Scene Resolution
Edit `src/Root.tsx`:
```tsx
<Composition
  width={1920}  // Change width
  height={1080} // Change height
  fps={30}      // Change frame rate
  ...
/>
```

### Modifying Colors
Each scene uses specific color codes. Update in material definitions:
```tsx
<meshPhongMaterial
  color={0x1e90ff}     // Hex color (ocean blue)
  emissive={0x0a2f51}  // Emissive glow
/>
```

### Adjusting Camera Motion
Edit camera position in `useFrame` callbacks:
```tsx
state.camera.position.set(x, y, z);
state.camera.lookAt(0, 0, 0);
```

### Adding Animations
Use `useCurrentFrame()` for timing:
```tsx
const frame = useCurrentFrame();
const totalFrames = 150;
const progress = frame / totalFrames;  // 0 → 1 over duration

const position = THREE.MathUtils.lerp(start, end, progress);
```

---

## Debugging Tips

### TypeScript Errors
```bash
npx tsc --noEmit
# Lists compilation errors - fix before building
```

### Viewing Frame Numbers
Add this in any scene:
```tsx
<Text position={[0, 0, 0]}>Frame: {useCurrentFrame()}</Text>
```

### Camera Position Verification
```tsx
useFrame((state) => {
  console.log('Camera:', state.camera.position);
});
```

### Performance Monitoring
Remotion preview shows:
- Rendering time per frame
- FPS counter
- Memory usage

### Common Issues

**Issue: Scenes not rendering**
- Check Canvas import: `import { Canvas } from '@react-three/fiber'`
- Verify geometry args: `sphereGeometry args={[radius, widthSegments, heightSegments]}`

**Issue: Animations stuttering**
- Ensure `useFrame` is performant (avoid heavy calculations)
- Check particle counts (100+ can be slow)
- Reduce geometry subdivisions if needed

**Issue: Build fails**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run build` outputs detailed errors
- Verify all imports are correct

**Issue: Colors look different**
- Use hex color codes consistently: `0xRRGGBB`
- Consider gamma correction in lighting
- Test with different viewport sizes

---

## Scene Customization Guide

### Scene 1: Hook
To add more detail:
- Increase sphere segments: `sphereGeometry args={[2, 64, 64]}`
- Add normal map: `map={oceanTexture}`
- Adjust camera speed: Modify Easing curve

### Scene 2: Map Overlay
To change pin locations:
```tsx
const NEW_LOCATION = latLongToXYZ(lat, lon, 2);
<Pin position={NEW_LOCATION} label="Label" />
```

### Scene 3: Triangle Diagram
To rotate differently:
```tsx
const rotation = (frame / totalFrames) * Math.PI * 4;  // 2 rotations
```

### Scene 4: Spacecraft Cemetery
To change satellite size:
```tsx
<boxGeometry args={[0.8, 0.4, 0.4]} />  // Bigger satellite
```

### Scene 5: Sparse Ocean
To adjust wave amplitude:
```tsx
positions[i + 1] = originalY + wave * 0.2;  // Smaller waves
```

### Scene 6: Closer
To customize final message:
```tsx
<div>Custom closing text here</div>
```

---

## Export Options

### MP4 (Default)
```bash
npm run build
# Output: out/video.mp4 (H.264 codec)
```

### Custom Export Format
Edit `src/Root.tsx` and modify the render command in package.json:
```json
"build": "remotion render index.html Main out/video.webm"
```

---

## Performance Optimization

### For Slow Machines
1. Reduce resolution: 1280×720 instead of 1920×1080
2. Lower frame rate: 24fps instead of 30fps
3. Reduce geometry complexity
4. Decrease particle counts

### For Best Quality
1. Increase geometry subdivisions
2. Add post-processing effects
3. Use higher bitrate encoding
4. Render at 4K if target is 4K

---

## Git Workflow

```bash
# Stage changes
git add .

# Commit with message
git commit -m "Update Hook scene with new Earth texture"

# Push to GitHub
git push origin main
```

Tracked files in `.gitignore`:
- `node_modules/`
- `dist/`
- `out/` (rendered videos)
- `build/`
- `.cache/`

---

## Useful Resources

- [Remotion Docs](https://www.remotion.dev)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Drei Components](https://drei.pmnd.rs)
- [Three.js Examples](https://threejs.org/examples)

---

## Support

For issues:
1. Check TypeScript errors: `npm run build`
2. Review [SCENES.md](SCENES.md) for detailed scene specs
3. Check [README.md](README.md) for setup instructions
4. Check frame/timing in Remotion preview
