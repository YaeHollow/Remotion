# Remotion Project with Three.js Integration

A Remotion video composition project featuring six scenes stitched together using the `<Series>` component with React Three Fiber and Drei integration.

## Project Structure

```
Remotion/
├── src/
│   ├── index.tsx           # Entry point for Remotion
│   ├── Root.tsx            # Main composition with Series
│   └── scenes/
│       ├── Hook.tsx                # Scene 1 (5s)
│       ├── MapOverlay.tsx          # Scene 2 (10s)
│       ├── TriangleDiagram.tsx     # Scene 3 (15s)
│       ├── SpacecraftCemetery.tsx  # Scene 4 (15s)
│       ├── SparseOcean.tsx         # Scene 5 (10s)
│       └── Closer.tsx              # Scene 6 (10s)
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── remotion.config.ts      # Remotion configuration
└── .gitignore             # Git ignore rules
```

## Composition Specifications

- **Frame Rate**: 30 FPS
- **Resolution**: 1920x1080 (Full HD)
- **Total Duration**: 65 seconds (1950 frames)

### Scenes

| Scene | Duration | Frame Count |
|-------|----------|-------------|
| Hook | 5s | 150 |
| MapOverlay | 10s | 300 |
| TriangleDiagram | 15s | 450 |
| SpacecraftCemetery | 15s | 450 |
| SparseOcean | 10s | 300 |
| Closer | 10s | 300 |
| **Total** | **65s** | **1950** |

## Dependencies

- **remotion**: Video composition library
- **@remotion/three**: Three.js integration for Remotion
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Utility components for React Three Fiber
- **three**: 3D graphics library
- **react**: UI framework
- **react-dom**: React DOM utilities

## Development Scripts

```bash
# Start development preview
npm run dev

# Build video to file
npm run build

# Start development server (alias)
npm start
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development preview:
   ```bash
   npm run dev
   ```

3. Open the Remotion preview in your browser and see the scenes sequenced together.

4. Build the final video:
   ```bash
   npm run build
   ```
   This will generate `out/video.mp4`

## Scene Customization

Each scene component in `src/scenes/` can be customized independently:

- Modify the component to add 3D models, animations, or effects
- Update background colors, text, or visual elements
- Integrate Three.js and Drei components as needed

## Architecture

The main composition (`Root.tsx`) uses Remotion's `<Series>` component to sequence all scenes:

```tsx
<Series>
  <Series.Sequence durationInFrames={150}>
    <Hook />
  </Series.Sequence>
  {/* ... more scenes ... */}
</Series>
```

Each scene is a separate React component that receives its own frame context from the Series.