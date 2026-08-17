import type { CHCountry } from "@/types/communityHub";
import { FEATURED_COUNTRIES } from "@/types/communityHub";
import { useEffect, useRef, useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────
interface EarthGlobeProps {
  size?: number;
  rotationSpeed?: number;
  interactive?: boolean;
  onCountryClick?: (country: CHCountry) => void;
  className?: string;
}

type THREEType = typeof import("three");

interface MarkerData {
  country: CHCountry;
  /** THREE.js world-space position (on sphere surface) */
  x3: number;
  y3: number;
  z3: number;
  /** 2-D screen position (updated each frame) */
  sx: number;
  sy: number;
  visible: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function latLngToVec3(
  lat: number,
  lng: number,
  radius: number,
): { x: number; y: number; z: number } {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return {
    x: -(radius * Math.sin(phi) * Math.cos(theta)),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  };
}

/** Build a procedural Earth-like canvas texture (blue ocean + green land hints) */
function buildProceduralTexture(): HTMLCanvasElement {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) return c;

  // Ocean base
  const ocean = ctx.createLinearGradient(0, 0, 0, size);
  ocean.addColorStop(0, "#0a2340");
  ocean.addColorStop(0.5, "#0d2f55");
  ocean.addColorStop(1, "#061828");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, size, size);

  // Continental blobs — rough approximations
  ctx.fillStyle = "rgba(34,90,45,0.85)";
  // North America
  ctx.beginPath();
  ctx.ellipse(130, 180, 80, 90, -0.3, 0, Math.PI * 2);
  ctx.fill();
  // South America
  ctx.beginPath();
  ctx.ellipse(165, 340, 45, 75, 0.2, 0, Math.PI * 2);
  ctx.fill();
  // Europe
  ctx.beginPath();
  ctx.ellipse(270, 160, 35, 40, 0, 0, Math.PI * 2);
  ctx.fill();
  // Africa
  ctx.beginPath();
  ctx.ellipse(278, 300, 50, 80, 0, 0, Math.PI * 2);
  ctx.fill();
  // Asia
  ctx.beginPath();
  ctx.ellipse(370, 190, 110, 70, -0.1, 0, Math.PI * 2);
  ctx.fill();
  // Australia
  ctx.beginPath();
  ctx.ellipse(410, 360, 40, 35, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Ice caps
  ctx.fillStyle = "rgba(200,220,240,0.6)";
  ctx.fillRect(0, 0, size, 28);
  ctx.fillRect(0, size - 22, size, 22);

  // Subtle grid lines (longitude/latitude)
  ctx.strokeStyle = "rgba(100,160,255,0.08)";
  ctx.lineWidth = 1;
  for (let i = 0; i < size; i += size / 12) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();
  }

  return c;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function EarthGlobe({
  size = 540,
  rotationSpeed = 0.0007,
  interactive = false,
  onCountryClick,
  className,
}: EarthGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // Mutable refs — updated every frame without triggering re-renders
  const markersRef = useRef<MarkerData[]>([]);
  const markerElemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const rendererRef = useRef<{
    camera: InstanceType<THREEType["PerspectiveCamera"]>;
    renderer: InstanceType<THREEType["WebGLRenderer"]>;
    earthGroup: InstanceType<THREEType["Group"]>;
    scene: InstanceType<THREEType["Scene"]>;
    THREE: THREEType;
  } | null>(null);
  const hoveredRef = useRef<string | null>(null);

  // Responsive size
  const isMobile = size <= 320;

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const THREE = await import("three");
        if (!mounted || !mountRef.current) return;

        const container = mountRef.current;
        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(size, size);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.z = 6;

        // ── Star field ──────────────────────────────────────────────────────
        const starGeo = new THREE.BufferGeometry();
        const starCount = 1400;
        const starPos = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount * 3; i++) {
          starPos[i] = (Math.random() - 0.5) * 200;
        }
        starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
        scene.add(
          new THREE.Points(
            starGeo,
            new THREE.PointsMaterial({
              color: 0xffffff,
              size: 0.4,
              sizeAttenuation: true,
              transparent: true,
              opacity: 0.75,
            }),
          ),
        );

        // ── Earth group ──────────────────────────────────────────────────────
        const earthGroup = new THREE.Group();
        earthGroup.rotation.z = THREE.MathUtils.degToRad(23.5);
        scene.add(earthGroup);

        // ── Earth mesh ───────────────────────────────────────────────────────
        const earthRadius = 2;
        const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);

        // Try to load real texture; fall back to procedural canvas texture
        const loader = new THREE.TextureLoader();
        loader.crossOrigin = "anonymous";

        let dayTex: InstanceType<THREEType["Texture"]>;
        try {
          dayTex = await new Promise<InstanceType<THREEType["Texture"]>>(
            (resolve, reject) =>
              loader.load(
                "https://unpkg.com/three-globe@2.30.0/example/img/earth-blue-marble.jpg",
                resolve,
                undefined,
                reject,
              ),
          );
        } catch {
          // Procedural fallback — always looks great
          const canvas = buildProceduralTexture();
          dayTex = new THREE.CanvasTexture(canvas);
        }

        if (mounted) setLoading(false);

        // Night texture (optional — graceful ignore on failure)
        let nightTex: InstanceType<THREEType["Texture"]> | null = null;
        try {
          nightTex = await new Promise<InstanceType<THREEType["Texture"]>>(
            (resolve, reject) =>
              loader.load(
                "https://unpkg.com/three-globe@2.30.0/example/img/earth-night.jpg",
                resolve,
                undefined,
                reject,
              ),
          );
        } catch {
          // ignore
        }

        const earthMat = new THREE.MeshPhongMaterial({
          map: dayTex,
          ...(nightTex
            ? {
                emissiveMap: nightTex,
                emissive: new THREE.Color(0x0a1a33),
                emissiveIntensity: 0.4,
              }
            : {}),
          specular: new THREE.Color(0x224466),
          shininess: 14,
        });
        earthGroup.add(new THREE.Mesh(earthGeo, earthMat));

        // ── Atmosphere ───────────────────────────────────────────────────────
        const atmGeo = new THREE.SphereGeometry(earthRadius * 1.015, 64, 64);
        const atmMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(0x4a90e2),
          transparent: true,
          opacity: 0.15,
          side: THREE.FrontSide,
        });
        earthGroup.add(new THREE.Mesh(atmGeo, atmMat));

        // ── Lights ───────────────────────────────────────────────────────────
        scene.add(new THREE.AmbientLight(0x334477, 0.4));
        const sun = new THREE.DirectionalLight(0xffffff, 0.9);
        sun.position.set(5, 3, 5);
        scene.add(sun);

        // ── HTML Overlay markers ─────────────────────────────────────────────
        if (interactive) {
          const markerRadius = earthRadius * 1.01;
          markersRef.current = FEATURED_COUNTRIES.map((c) => {
            const { x, y, z } = latLngToVec3(c.lat, c.lng, markerRadius);
            return {
              country: c,
              x3: x,
              y3: y,
              z3: z,
              sx: 0,
              sy: 0,
              visible: false,
            };
          });
        }

        rendererRef.current = { camera, renderer, earthGroup, scene, THREE };

        // ── Animation loop ────────────────────────────────────────────────────
        function animate() {
          if (!mounted) return;
          animFrameRef.current = requestAnimationFrame(animate);
          earthGroup.rotation.y += rotationSpeed;

          // Update HTML marker positions each frame
          if (interactive && markersRef.current.length > 0) {
            const domEl = renderer.domElement;
            const rect = domEl.getBoundingClientRect();

            markersRef.current.forEach((m, i) => {
              // Transform the 3D point through earthGroup's current rotation
              const vec = new THREE.Vector3(m.x3, m.y3, m.z3);
              // Apply earthGroup matrix (rotation.z + rotation.y)
              vec.applyEuler(earthGroup.rotation);

              // Project to NDC
              const projected = vec.project(camera);

              // Behind camera = hidden
              const behind = projected.z > 1;

              const sx = (projected.x * 0.5 + 0.5) * rect.width;
              const sy = (-projected.y * 0.5 + 0.5) * rect.height;

              m.sx = sx;
              m.sy = sy;
              m.visible = !behind;

              const el = markerElemsRef.current[i];
              if (el) {
                el.style.left = `${sx}px`;
                el.style.top = `${sy}px`;
                el.style.opacity = behind ? "0" : "1";
                el.style.pointerEvents = behind ? "none" : "auto";
              }
            });
          }

          renderer.render(scene, camera);
        }
        animate();
      } catch (_err) {
        if (mounted) setLoading(false);
      }
    }

    init();

    return () => {
      mounted = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (rendererRef.current) {
        const { renderer } = rendererRef.current;
        renderer.dispose();
        if (mountRef.current?.contains(renderer.domElement)) {
          mountRef.current.removeChild(renderer.domElement);
        }
      }
      markersRef.current = [];
    };
  }, [size, rotationSpeed, interactive]);

  function handleMarkerClick(country: CHCountry) {
    onCountryClick?.(country);
  }

  function handleMarkerEnter(countryName: string) {
    hoveredRef.current = countryName;
    setHoveredCountry(countryName);
  }

  function handleMarkerLeave() {
    hoveredRef.current = null;
    setHoveredCountry(null);
  }

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* Three.js canvas mount */}
      <div
        ref={mountRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          overflow: "hidden",
        }}
      />

      {/* HTML overlay for markers */}
      {interactive && (
        <div
          ref={overlayRef}
          aria-label="Interactive globe — click a country to explore"
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          {FEATURED_COUNTRIES.map((country, i) => (
            <button
              key={country.name}
              type="button"
              ref={(el) => {
                markerElemsRef.current[i] = el as HTMLDivElement | null;
              }}
              style={{
                position: "absolute",
                transform: "translate(-50%, -50%)",
                pointerEvents: "auto",
                cursor: "pointer",
                zIndex: 10,
                background: "none",
                border: "none",
                padding: 0,
              }}
              onClick={() => handleMarkerClick(country)}
              onMouseEnter={() => handleMarkerEnter(country.name)}
              onMouseLeave={handleMarkerLeave}
              aria-label={`Explore opportunities in ${country.name}`}
              data-ocid={`ch.globe.marker.${country.name.toLowerCase().replace(/\s+/g, "_")}`}
            >
              {/* Pulse ring */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: "-8px",
                  borderRadius: "50%",
                  border: "1.5px solid var(--ch-accent)",
                  opacity: hoveredCountry === country.name ? 0 : 0.7,
                  animation: "ch-pulse-ring 2.2s ease-out infinite",
                  animationDelay: `${i * 0.44}s`,
                }}
              />
              {/* Second ring — staggered */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: "-4px",
                  borderRadius: "50%",
                  border: "1px solid rgba(42,94,255,0.5)",
                  animation: "ch-pulse-ring 2.2s ease-out infinite",
                  animationDelay: `${i * 0.44 + 0.8}s`,
                }}
              />
              {/* Core dot */}
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background:
                    hoveredCountry === country.name
                      ? "var(--ch-accent)"
                      : "#ffffff",
                  boxShadow:
                    hoveredCountry === country.name
                      ? "0 0 12px var(--ch-accent-glow), 0 0 4px var(--ch-accent)"
                      : "0 0 6px rgba(255,255,255,0.6)",
                  transition: "background 0.2s, box-shadow 0.2s",
                }}
              />
              {/* Hover label chip */}
              {hoveredCountry === country.name && (
                <div
                  role="tooltip"
                  style={{
                    position: "absolute",
                    bottom: "calc(100% + 10px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(12,15,23,0.96)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid var(--ch-border-hover)",
                    borderRadius: "20px",
                    padding: "6px 14px",
                    fontSize: "0.8rem",
                    fontFamily: "DM Sans, sans-serif",
                    fontWeight: 500,
                    color: "var(--ch-text-primary)",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    boxShadow: "0 4px 20px rgba(42,94,255,0.25)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    animation: "ch-hero-reveal 0.2s var(--ease-smooth) both",
                    zIndex: 50,
                  }}
                >
                  <span style={{ fontSize: "1rem" }}>{country.flag}</span>
                  <span>{country.name}</span>
                  <span
                    style={{
                      fontSize: "0.62rem",
                      color: "var(--ch-text-accent)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Explore
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Loading shimmer — circular */}
      {loading && (
        <div
          aria-hidden="true"
          data-ocid="ch.globe.loading_state"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            overflow: "hidden",
            background: "var(--ch-bg-card)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, var(--ch-bg-card) 25%, var(--ch-bg-elevated) 50%, var(--ch-bg-card) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer-sweep 1.8s infinite",
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 2,
              width: isMobile ? 40 : 56,
              height: isMobile ? 40 : 56,
              borderRadius: "50%",
              border: "2px solid var(--ch-border)",
              borderTopColor: "var(--ch-accent)",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      )}

      {/* Under-earth glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-80px",
          left: "50%",
          transform: "translateX(-50%)",
          width: size * 1.5,
          height: 200,
          background:
            "radial-gradient(ellipse at center, rgba(42,94,255,0.12) 0%, rgba(42,94,255,0.04) 40%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
