# Remotion Scenes Documentation

## Scene Overview

Each scene is a complete Three.js composition with specific visual requirements and animations. Total runtime: 65 seconds at 30fps.

---

## Scene 1: Hook (0:00–0:05)

**Duration:** 5 seconds (150 frames)  
**File:** [src/scenes/Hook.tsx](src/scenes/Hook.tsx)

### Description
A low-poly Earth sphere lit by directional light to simulate sun glare. The camera performs a dynamic dolly zoom from a wide orbital view down into an extreme close-up of an empty ocean patch.

### Key Features
- **Geometry:** Spheregeometry with Phong material (1e90ff ocean blue)
- **Lighting:** Single directional light (5, 3, 5) at 1.5 intensity + ambient fallback
- **Animation:** 
  - Camera distance: 8 → 0.5 (zooming in from orbit to ocean surface)
  - Camera height: 3 → 0 (descending to sea level)
  - Easing: Bezier curve (0.25, 0.46, 0.45, 0.94) for fast-then-decelerate dolly
- **Canvas:** 1920×1080, 30fps
- **Frame Rate:** 30 FPS

### Technical Implementation
```tsx
const easedProgress = Easing.bezier(0.25, 0.46, 0.45, 0.94)(progress);
const cameraDistance = THREE.MathUtils.lerp(8, 0.5, easedProgress);
const cameraHeight = THREE.MathUtils.lerp(3, 0, easedProgress);
```

### End State
Frame fills with deep blue ocean, no land visible, immersive close-up view.

---

## Scene 2: Map Overlay (0:05–0:15)

**Duration:** 10 seconds (300 frames)  
**File:** [src/scenes/MapOverlay.tsx](src/scenes/MapOverlay.tsx)

### Description
A flat-shaded 3D globe with three pin markers placed at real-world coordinates (Ducie Island, Motu Nui, Maher Island). Animated dashed lines extend from each pin to Point Nemo, drawn progressively with staggered timing.

### Key Locations
- **Ducie Island:** -24.6728°, -124.7868°
- **Motu Nui:** -27.1127°, -109.3497°
- **Maher Island:** -48.877°, 166.2847°
- **Point Nemo:** -48.8771°, 123.3923° (center convergence point)

### Key Features
- **Geometry:** 
  - Globe: Sphere geometry (64 subdivisions) with Phong material
  - Pins: Cone geometries (0.1 radius, 0.4 height) positioned at lat/long → XYZ
- **Animation:**
  - Lines drawn progressively over 10s with staggered starts
  - Progress offset: 0s, 1.5s, 3s for three lines
  - Dashed line effect with `Line` component
- **Labels:** "2,688 km" distance labels fade in per line
- **Lighting:** Directional light (5, 3, 5) at 1.2 intensity + ambient

### Technical Implementation
```tsx
const latLongToXYZ = (lat, lon, radius) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
};
```

---

## Scene 3: Triangle Diagram (0:15–0:30)

**Duration:** 15 seconds (450 frames)  
**File:** [src/scenes/TriangleDiagram.tsx](src/scenes/TriangleDiagram.tsx)

### Description
An exploded 3D triangle with low-poly island icons at each corner. The entire triangle slowly rotates around the Y-axis (one full 360° rotation over 15s). Camera orbits with scripted motion (non-interactive). A title card appears at 6.67s (frame 200).

### Key Features
- **Geometry:**
  - Island icons: Tetrahedron geometry at each vertex
  - Glowing edges: Green lines connecting vertices
  - Center marker: Yellow emissive sphere
- **Animation:**
  - Triangle rotation: Linear 360° per 15s (rotation.y += 2π * progress)
  - Camera orbit: Parametric path around scene
    - X: sin(cameraAngle) × 3
    - Z: cos(cameraAngle) × 3 + 2
  - Orbit angle: 0 → π/2 over 15s (quarter circle)
- **Title Card:**
  - Appears at frame 200 (6.67s)
  - Fades in over 1 second
  - Text: "Calculated in 1992 via GIS"
  - Background: Semi-transparent dark overlay
- **Colors:**
  - Islands: Green (#90ee90) with flatShading
  - Edges: Green (#00ff00), line width 3
  - Center: Yellow (#ffff00)

### Technical Implementation
```tsx
const rotation = (frame / totalFrames) * Math.PI * 2;
const cameraAngle = (frame / totalFrames) * Math.PI * 0.5;
state.camera.position.x = Math.sin(cameraAngle) * 3;
state.camera.position.z = Math.cos(cameraAngle) * 3 + 2;
```

---

## Scene 4: Spacecraft Cemetery (0:30–0:45)

**Duration:** 15 seconds (450 frames)  
**File:** [src/scenes/SpacecraftCemetery.tsx](src/scenes/SpacecraftCemetery.tsx)

### Description
A dark, atmospheric scene of a low-poly satellite model falling toward a dark ocean plane. Particle trail effects simulate a deorbit streak. Camera maintains a static wide shot with subtle zoom-in. Atmospheric fog adds depth.

### Key Features
- **Satellite Model:**
  - Main body: Box geometry (0.4 × 0.2 × 0.2), gray metallic
  - Solar panels: Two flat boxes (1.2 × 0.05 × 0.3), blue metallic
  - Antenna: Cylinder (0.4 height), gray
- **Animation:**
  - Satellite Y position: 3 → -4.5 (linear fall over 15s)
  - Rotation: Applied during fall (rotation.x/y += progress × π/2)
  - Camera zoom: Static wide shot (5, 0, 6)
- **Particle Trail:**
  - 100 particles arranged in helix pattern
  - Red emissive color (#ff6b6b)
  - Positioned around falling satellite
- **Wireframe Floor:**
  - Dark green (#003300) plane at Y = -5
  - Grid pattern for depth reference
- **Atmospheric Effects:**
  - Fog: Black, near=0.1, far=15
  - Ambient light: 0.3 intensity
  - Directional light: 0.8 intensity
- **Color Grading:** Dark, low-key lighting

### Technical Implementation
```tsx
const satelliteY = THREE.MathUtils.lerp(3, -4.5, progress);
const rotation = progress * Math.PI * 0.5;
<fog attach="fog" args={['#000', 0.1, 15]} />
```

---

## Scene 5: Sparse Ocean (0:45–0:55)

**Duration:** 10 seconds (300 frames)  
**File:** [src/scenes/SparseOcean.tsx](src/scenes/SparseOcean.tsx)

### Description
An animated procedural ocean plane with subtle vertex-displaced sine wave shader. Camera pans just above the surface. Very sparse particle system (12 fish sprites) drifts slowly to emphasize emptiness. Desaturated blue color palette.

### Key Features
- **Ocean Plane:**
  - Plane geometry (30×30, 100×100 subdivisions)
  - Vertex displacement shader: sine wave animation
  - Wave formula: `sin(x*0.3 + frame*0.02) * cos(z*0.3 + frame*0.01) * 0.1`
  - Color: Dark ocean blue (#0a3d62)
- **Camera Motion:**
  - Pans just above surface (Y ≈ 0.5)
  - Horizontal movement: `sin(progress * π * 2) * 3` (circular)
  - Slight vertical bob: `sin(progress * π) * 0.3`
  - Depth change: 5 → 3 units forward over 10s
- **Particle System (Fish):**
  - 12 simple fish sprites
  - Box geometry (1 × 0.3 × 0.5) + tetrahedron tail
  - Color: Blue (#4a90e2)
  - Motion: Drifting with sine wave and forward movement
  - Speed variation: 0.3–0.6 units per frame
- **Post-Processing:**
  - Fog: #0a1a2a, near=5, far=30
  - Ambient light: Blue-tinted (#88ccff)
  - Desaturated appearance from low saturation materials
- **Atmosphere:**
  - Deep blue background
  - Muted colors emphasize emptiness
  - Subtle fog for distance

### Technical Implementation
```tsx
// Vertex displacement
for (let i = 0; i < positions.length; i += 3) {
  const wave = Math.sin(x*0.3 + frame*0.02) * Math.cos(z*0.3 + frame*0.01) * 0.1;
  positions[i + 1] = originalY + wave;
}

// Camera panning
state.camera.position.x = Math.sin(progress * Math.PI * 2) * 3;
state.camera.position.z = 5 - progress * 2;
```

---

## Scene 6: Closer (0:55–1:05)

**Duration:** 10 seconds (300 frames)  
**File:** [src/scenes/Closer.tsx](src/scenes/Closer.tsx)

### Description
The reverse of Scene 1: camera pulls back from extreme ocean close-up to a full globe view. Simultaneously, the 3D scene crossfades into a flat 2D world map overlay with Point Nemo marked. Final card displays: "Closer to space than to land."

### Key Features
- **3D Scene:**
  - Earth sphere same as Scene 1
  - Camera zoom-out: 0.5 → 8 (reverse of Hook)
  - Camera height: 0 → 3 (reverse of Hook)
  - Easing: Same Bezier curve (fast-then-slow)
  - Canvas fades out as overlay fades in
- **2D Map Overlay:**
  - SVG-based world map representation
  - Point Nemo marked at center (600, 400)
  - Glowing red circle marker: `stroke="#ff00ff"`, `fill="#ff00ff"`
  - Pulsing animation: Opacity varies with `Math.sin(time/200)`
  - Yellow text label: "Point Nemo"
  - Background: Linear gradient (dark blue tones)
- **Crossfade Transition:**
  - Canvas opacity: 1 → 0 (linear over 10s)
  - Map opacity: 0 → 1 (linear over 10s)
  - Synchronized frame-based interpolation
- **Final Card:**
  - Text: "Closer to space than to land."
  - Position: Bottom of screen
  - Styling: White text, bold, semi-transparent background
  - Appears as map fully fades in

### Technical Implementation
```tsx
const canvasOpacity = Math.max(1 - progress, 0);
const mapOpacity = Math.min(progress, 1);

// SVG pulsing marker
opacity={Math.sin((new Date().getTime() / 200) % Math.PI) * 0.5 + 0.5}
```

---

## Global Configuration

### Canvas Settings (All Scenes)
- **Resolution:** 1920×1080
- **Frame Rate:** 30 FPS
- **Background:** Black (#000) for most scenes, gradient for Scene 6

### Lighting Strategy
- **Scene 1:** Warm directional + cool ambient
- **Scene 2:** Balanced directional + ambient
- **Scene 3:** Dual key lights with orbital camera
- **Scene 4:** Dark, moody low-key lighting + fog
- **Scene 5:** Cool ambient with minimal key light
- **Scene 6:** Smooth lighting transition during crossfade

### Materials Used
- **Phong:** For reflective surfaces (Earth)
- **Standard:** For matte/organic surfaces (islands, satellites)
- **Points:** For particle systems (trails, fish)

---

## Animation Principles

1. **Easing:** Bezier curves for smooth motion starts and stops
2. **Frame-based:** All animations tied to `useCurrentFrame()` for sync
3. **Interpolation:** Linear `THREE.MathUtils.lerp()` for smooth transitions
4. **Staggering:** Sequential line animations (Scene 2)
5. **Crossfading:** Opacity-based transitions (Scene 6)

---

## Performance Considerations

- **Geometry Subdivision:** Balanced between quality (32–100 segments) and performance
- **Particle Counts:** 100 for trails, 12 for ocean fish (sparse by design)
- **Fog Usage:** Reduces rendering of distant geometry
- **Lighting:** Directional + ambient (minimal computational cost)
- **Total Lines of Code:** 749 lines across 6 scenes + Root composition

---

## Future Enhancements

- Add post-processing (bloom, color grading) for stylized look
- Implement procedural terrain generation for islands
- Add water caustics via shader
- Animate text labels with better timing
- Add ambient sound design sync points
