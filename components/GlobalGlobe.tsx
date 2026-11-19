'use client';

import { useEffect, useRef, useState } from 'react';
import { useScroll, useReducedMotion } from 'motion/react';
import { Compass, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CityHub {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  isHQ?: boolean;
}

const CITY_HUBS: CityHub[] = [
  { id: 'pei', name: 'Charlottetown', country: 'Canada (HQ)', lat: 46.2382, lng: -63.1311, isHQ: true },
  { id: 'toronto', name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832 },
  { id: 'vancouver', name: 'Vancouver', country: 'Canada', lat: 49.2827, lng: -123.1207 },
  { id: 'ny', name: 'New York', country: 'USA', lat: 40.7128, lng: -74.006 },
  { id: 'sf', name: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194 },
  { id: 'london', name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
  { id: 'frankfurt', name: 'Frankfurt', country: 'Germany', lat: 50.1109, lng: 8.6821 },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { id: 'sydney', name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
];

// Region camera targets (yaw in radians, pitch in radians)
const REGION_PRESETS: Record<string, { label: string; yaw: number; pitch: number }> = {
  hq: { label: 'PEI (HQ)', yaw: 1.1, pitch: 0.35 },
  americas: { label: 'Americas', yaw: 1.6, pitch: 0.25 },
  europe: { label: 'Europe', yaw: -0.1, pitch: 0.35 },
  apac: { label: 'Asia-Pac', yaw: -2.3, pitch: 0.2 },
};

// Procedural high-resolution landmass generator using land coordinates
function generateLandmassPoints(): { lat: number; lng: number }[] {
  const points: { lat: number; lng: number }[] = [];

  // Bounding boxes of major continental masses [minLat, maxLat, minLng, maxLng, stepLat, stepLng, probability]
  const landmasses: [number, number, number, number, number, number, number][] = [
    // North America (Canada, Alaska, US, Mexico)
    [25, 70, -140, -55, 3.2, 4.0, 0.78],
    [15, 32, -115, -85, 3.5, 4.5, 0.72],
    // South America
    [-55, 12, -80, -35, 3.5, 4.5, 0.75],
    // Europe & UK
    [36, 70, -10, 40, 3.0, 3.8, 0.82],
    // Scandinavia
    [55, 71, 5, 30, 2.8, 3.5, 0.75],
    // Africa
    [-35, 37, -18, 50, 3.6, 4.2, 0.74],
    // Asia (Middle East, India, China, Russia, SE Asia)
    [10, 72, 40, 145, 3.2, 4.0, 0.76],
    [5, 28, 68, 90, 3.0, 3.8, 0.8], // India
    [20, 45, 95, 125, 3.0, 3.8, 0.82], // East China
    // Japan
    [30, 45, 128, 145, 2.5, 3.0, 0.7],
    // Australia & New Zealand
    [-42, -12, 112, 154, 3.5, 4.2, 0.72],
    [-47, -35, 166, 178, 2.5, 3.0, 0.65],
    // Greenland
    [60, 82, -55, -20, 3.5, 5.0, 0.6],
  ];

  for (const [minLat, maxLat, minLng, maxLng, stepLat, stepLng, prob] of landmasses) {
    for (let lat = minLat; lat <= maxLat; lat += stepLat) {
      for (let lng = minLng; lng <= maxLng; lng += stepLng) {
        // Pseudo-random deterministic noise based on coordinates
        const hash = Math.sin(lat * 12.9898 + lng * 78.233) * 43758.5453;
        const rand = hash - Math.floor(hash);
        if (rand < prob) {
          // slight jitter for natural organic look
          const jitterLat = lat + (rand - 0.5) * (stepLat * 0.4);
          const jitterLng = lng + ((hash * 13) % 1 - 0.5) * (stepLng * 0.4);
          points.push({ lat: jitterLat, lng: jitterLng });
        }
      }
    }
  }

  // Ensure Charlottetown, PEI is accurately present!
  points.push({ lat: 46.2382, lng: -63.1311 });
  points.push({ lat: 44.6488, lng: -63.5752 }); // Halifax

  return points;
}

export function GlobalGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Scroll tracking to rotate globe with page scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const [activeRegion, setActiveRegion] = useState<string>('hq');
  const [localTime, setLocalTime] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);

  // Rotation angles in radians
  const anglesRef = useRef({
    yaw: 1.1, // Initial yaw pointing towards Canada / PEI
    pitch: 0.32,
    targetYaw: 1.1,
    targetPitch: 0.32,
    scrollOffset: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragStartYaw: 0,
    dragStartPitch: 0,
    velocityYaw: 0,
    velocityPitch: 0,
  });

  // Keep live Atlantic local time
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-CA', {
          timeZone: 'America/Halifax',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
        setLocalTime(formatter.format(now));
      } catch {
        setLocalTime(new Date().toLocaleTimeString());
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update target angles when clicking region presets
  const selectRegion = (regionKey: string) => {
    setActiveRegion(regionKey);
    const preset = REGION_PRESETS[regionKey];
    if (preset) {
      anglesRef.current.targetYaw = preset.yaw;
      anglesRef.current.targetPitch = preset.pitch;
    }
  };

  // Main 3D Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const landPoints = generateLandmassPoints();
    let animationFrameId: number;
    let lastTime = performance.now();
    let packetProgress = 0;

    // Detect dark mode from document class
    const isDarkMode = () => document.documentElement.classList.contains('dark');

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = rect.width;
      const height = rect.height;

      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      // Globe radius responsive to container size
      const radius = Math.min(width, height) * 0.40;

      // Physics / rotation updates
      const angles = anglesRef.current;

      // Scroll effect: add dynamic rotation proportional to scroll progress
      const scrollVal = scrollYProgress.get() || 0;
      const scrollRotation = scrollVal * Math.PI * 1.8;

      if (!angles.isDragging) {
        // Auto-rotation idle drift when not interacting
        if (!reduceMotion && !isHovered) {
          angles.targetYaw += 0.0035;
        }

        // Smooth tween to target angles
        angles.yaw += (angles.targetYaw - angles.yaw) * 0.08 + angles.velocityYaw;
        angles.pitch += (angles.targetPitch - angles.pitch) * 0.08 + angles.velocityPitch;
        angles.velocityYaw *= 0.92;
        angles.velocityPitch *= 0.92;
      }

      const currentYaw = angles.yaw + scrollRotation;
      const currentPitch = Math.max(-0.7, Math.min(0.7, angles.pitch));

      const dark = isDarkMode();
      const primaryColor = dark ? 'rgba(237, 128, 100, ' : 'rgba(184, 77, 55, ';
      const inkColor = dark ? 'rgba(240, 239, 231, ' : 'rgba(27, 38, 32, ';
      const signalColor = 'rgba(200, 217, 147, ';

      // 1. Draw atmospheric glow / outer aura
      const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.82, cx, cy, radius * 1.18);
      glowGrad.addColorStop(0, dark ? 'rgba(237, 128, 100, 0.06)' : 'rgba(184, 77, 55, 0.04)');
      glowGrad.addColorStop(0.5, dark ? 'rgba(200, 217, 147, 0.04)' : 'rgba(227, 233, 207, 0.15)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.18, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw globe sphere base disk with subtle depth gradient
      const sphereGrad = ctx.createRadialGradient(
        cx - radius * 0.25,
        cy - radius * 0.3,
        radius * 0.1,
        cx,
        cy,
        radius
      );
      if (dark) {
        sphereGrad.addColorStop(0, 'rgba(32, 43, 36, 0.95)');
        sphereGrad.addColorStop(0.7, 'rgba(23, 31, 25, 0.98)');
        sphereGrad.addColorStop(1, 'rgba(17, 24, 19, 1)');
      } else {
        sphereGrad.addColorStop(0, 'rgba(255, 254, 250, 0.98)');
        sphereGrad.addColorStop(0.7, 'rgba(245, 243, 237, 0.95)');
        sphereGrad.addColorStop(1, 'rgba(232, 230, 222, 0.98)');
      }
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Globe border ring
      ctx.strokeStyle = dark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(27, 38, 32, 0.12)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 3D coordinate projection helper
      const project = (lat: number, lng: number, altitude = 1): { x: number; y: number; z: number; visible: boolean } => {
        const phi = (lat * Math.PI) / 180;
        const lambda = (lng * Math.PI) / 180;
        const r = radius * altitude;

        // Cartesian 3D coordinates
        const x0 = r * Math.cos(phi) * Math.sin(lambda);
        const y0 = -r * Math.sin(phi);
        const z0 = r * Math.cos(phi) * Math.cos(lambda);

        // Yaw rotation around Y
        const cosY = Math.cos(currentYaw);
        const sinY = Math.sin(currentYaw);
        const x1 = x0 * cosY + z0 * sinY;
        const z1 = -x0 * sinY + z0 * cosY;

        // Pitch rotation around X
        const cosP = Math.cos(currentPitch);
        const sinP = Math.sin(currentPitch);
        const y2 = y0 * cosP - z1 * sinP;
        const z2 = y0 * sinP + z1 * cosP;

        // Subtle perspective projection
        const dist = 750;
        const k = dist / (dist - z2);
        const screenX = cx + x1 * k;
        const screenY = cy + y2 * k;

        return {
          x: screenX,
          y: screenY,
          z: z2,
          visible: z2 > -radius * 0.15,
        };
      };

      // 3. Draw latitude & longitude grid rings (parallels and meridians)
      ctx.lineWidth = 0.7;
      // Parallels
      const latitudes = [-60, -30, 0, 30, 60];
      for (const lat of latitudes) {
        ctx.beginPath();
        let started = false;
        for (let lng = -180; lng <= 180; lng += 8) {
          const pt = project(lat, lng);
          if (pt.visible) {
            if (!started) {
              ctx.moveTo(pt.x, pt.y);
              started = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            started = false;
          }
        }
        ctx.strokeStyle = dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(27, 38, 32, 0.06)';
        ctx.stroke();
      }

      // Meridians
      for (let lng = -180; lng < 180; lng += 45) {
        ctx.beginPath();
        let started = false;
        for (let lat = -80; lat <= 80; lat += 6) {
          const pt = project(lat, lng);
          if (pt.visible) {
            if (!started) {
              ctx.moveTo(pt.x, pt.y);
              started = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            started = false;
          }
        }
        ctx.strokeStyle = dark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(27, 38, 32, 0.05)';
        ctx.stroke();
      }

      // 4. Draw dotted landmass continents
      for (let i = 0; i < landPoints.length; i++) {
        const pt = project(landPoints[i].lat, landPoints[i].lng);
        if (pt.visible) {
          // Front-facing opacity fade
          const depthNorm = Math.max(0, (pt.z + radius * 0.1) / (radius * 1.1));
          const alpha = 0.15 + depthNorm * 0.75;
          const dotSize = 1.1 + depthNorm * 1.2;

          ctx.fillStyle = inkColor + alpha + ')';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 5. Draw connection arcs from Charlottetown (HQ) to global tech hubs
      const hq = CITY_HUBS[0];
      const hqPt = project(hq.lat, hq.lng);

      packetProgress = (packetProgress + delta * 0.42) % 1;

      for (let i = 1; i < CITY_HUBS.length; i++) {
        const target = CITY_HUBS[i];
        const targetPt = project(target.lat, target.lng);

        // Generate interpolated points along the great circle
        const steps = 32;
        const arcPoints: { x: number; y: number; z: number; visible: boolean }[] = [];

        for (let step = 0; step <= steps; step++) {
          const t = step / steps;
          // Spherical linear interpolation between HQ and Target
          const lat = hq.lat + (target.lat - hq.lat) * t;
          let lngDiff = target.lng - hq.lng;
          if (lngDiff > 180) lngDiff -= 360;
          if (lngDiff < -180) lngDiff += 360;
          const lng = hq.lng + lngDiff * t;

          // Parabolic lift arc above sphere
          const altitude = 1.0 + Math.sin(t * Math.PI) * 0.22;
          arcPoints.push(project(lat, lng, altitude));
        }

        // Draw arc segments that are visible
        ctx.beginPath();
        let started = false;
        let visibleCount = 0;
        for (const pt of arcPoints) {
          if (pt.visible) {
            visibleCount++;
            if (!started) {
              ctx.moveTo(pt.x, pt.y);
              started = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            started = false;
          }
        }

        if (visibleCount > 2) {
          ctx.strokeStyle = primaryColor + (dark ? '0.35)' : '0.28)');
          ctx.lineWidth = 1.3;
          ctx.setLineDash([3, 3]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw moving light pulse / packet along this arc
          const packetIndex = Math.min(
            steps,
            Math.floor(((packetProgress + i * 0.12) % 1) * steps)
          );
          const packetPt = arcPoints[packetIndex];
          if (packetPt && packetPt.visible) {
            const glowSize = 3.2;
            ctx.fillStyle = signalColor + '0.95)';
            ctx.beginPath();
            ctx.arc(packetPt.x, packetPt.y, glowSize, 0, Math.PI * 2);
            ctx.fill();

            // Packet trail
            ctx.fillStyle = primaryColor + '0.8)';
            ctx.beginPath();
            ctx.arc(packetPt.x, packetPt.y, glowSize * 0.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 6. Draw City Hubs and Radar Ping Beacons
      const nowMs = performance.now();
      for (const hub of CITY_HUBS) {
        const pt = project(hub.lat, hub.lng);
        if (pt.visible) {
          const depthAlpha = Math.max(0.2, (pt.z + radius * 0.1) / (radius * 1.1));

          if (hub.isHQ) {
            // Charlottetown HQ prominent beacon
            const pingRadius = ((nowMs * 0.04) % 18) + 3;
            const pingAlpha = Math.max(0, 1 - pingRadius / 21) * depthAlpha;

            // Ping wave 1
            ctx.strokeStyle = primaryColor + pingAlpha + ')';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pingRadius, 0, Math.PI * 2);
            ctx.stroke();

            // Ping wave 2
            const ping2Radius = (((nowMs * 0.04) + 9) % 18) + 3;
            const ping2Alpha = Math.max(0, 1 - ping2Radius / 21) * depthAlpha;
            ctx.strokeStyle = signalColor + ping2Alpha + ')';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, ping2Radius, 0, Math.PI * 2);
            ctx.stroke();

            // Center beacon dot
            ctx.fillStyle = primaryColor + '1)';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
            ctx.fill();

            // Label pill for HQ
            if (depthAlpha > 0.4) {
              ctx.font = 'bold 10px JetBrains Mono, monospace';
              ctx.textAlign = 'left';
              const text = 'CHARLOTTETOWN (HQ)';
              const textWidth = ctx.measureText(text).width;

              ctx.fillStyle = dark ? 'rgba(23, 31, 25, 0.9)' : 'rgba(255, 254, 250, 0.92)';
              ctx.strokeStyle = primaryColor + '0.6)';
              ctx.lineWidth = 1;
              ctx.fillRect(pt.x + 8, pt.y - 14, textWidth + 10, 18);
              ctx.strokeRect(pt.x + 8, pt.y - 14, textWidth + 10, 18);

              ctx.fillStyle = primaryColor + '1)';
              ctx.fillText(text, pt.x + 13, pt.y - 1);
            }
          } else {
            // Destination city node
            ctx.fillStyle = signalColor + (0.8 * depthAlpha) + ')';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 2.8, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = dark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [reduceMotion, isHovered, scrollYProgress]);

  // Touch and Mouse Drag Handlers for Free 3D Orbiting
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const angles = anglesRef.current;
    angles.isDragging = true;
    angles.dragStartX = e.clientX;
    angles.dragStartY = e.clientY;
    angles.dragStartYaw = angles.yaw;
    angles.dragStartPitch = angles.pitch;
    angles.velocityYaw = 0;
    angles.velocityPitch = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const angles = anglesRef.current;
    if (!angles.isDragging) return;

    const dx = e.clientX - angles.dragStartX;
    const dy = e.clientY - angles.dragStartY;

    const newYaw = angles.dragStartYaw + dx * 0.007;
    const newPitch = Math.max(-0.6, Math.min(0.6, angles.dragStartPitch + dy * 0.007));

    angles.velocityYaw = (newYaw - angles.yaw) * 0.5;
    angles.velocityPitch = (newPitch - angles.pitch) * 0.5;

    angles.yaw = newYaw;
    angles.pitch = newPitch;
    angles.targetYaw = newYaw;
    angles.targetPitch = newPitch;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const angles = anglesRef.current;
    angles.isDragging = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-[620px] select-none"
    >
      {/* Outer Modern Card Container */}
      <div className="relative overflow-hidden rounded-sm border border-border/70 bg-card text-card-foreground shadow-sm">
        {/* Top Telemetry Header Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-border/60 bg-muted/30 px-3.5 py-2.5 font-mono text-[11px] sm:px-4">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            <span className="font-semibold uppercase tracking-[0.1em] text-foreground">
              Global Operations
            </span>
            <span className="hidden text-muted-foreground sm:inline">·</span>
            <span className="hidden text-muted-foreground sm:inline">PEI & Worldwide</span>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="hidden font-mono tracking-wider md:inline">
              AST {localTime || '--:--:--'}
            </span>
            <span className="inline-flex items-center gap-1 border border-border/80 bg-background/80 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              <Radio size={10} className="animate-pulse" /> Live Network
            </span>
          </div>
        </div>

        {/* 3D Canvas Viewport */}
        <div
          className="relative flex aspect-square max-h-[380px] w-full items-center justify-center overflow-hidden sm:aspect-[4/3] sm:max-h-[420px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Subtle grid backdrop */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:18px_18px]"
            aria-hidden="true"
          />

          <canvas
            ref={canvasRef}
            className="relative z-10 size-full cursor-grab active:cursor-grabbing touch-pan-y"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            role="img"
            aria-label="Interactive 3D rotating globe showing Charlottetown, PEI connected to clients across Canada and worldwide"
          />

          {/* Floating HQ Coordinates Badge */}
          <div className="pointer-events-none absolute left-3 top-3 z-20 hidden rounded-sm border border-border/70 bg-background/85 px-2.5 py-1.5 backdrop-blur-sm sm:block">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">
              HQ Charlottetown, PEI
            </div>
            <div className="font-mono text-[9px] text-muted-foreground">
              46.2382° N, 63.1311° W
            </div>
          </div>

          {/* Drag instruction pill */}
          <div className="pointer-events-none absolute bottom-3 left-3 z-20 hidden items-center gap-1.5 rounded-sm border border-border/60 bg-background/70 px-2 py-1 font-mono text-[10px] text-muted-foreground backdrop-blur-sm sm:flex">
            <Compass size={11} className="text-primary" />
            <span>Drag to rotate · Scroll reacts</span>
          </div>
        </div>

        {/* Region Quick-Focus Navigation Tabs */}
        <div className="flex border-t border-border/60 bg-muted/20">
          {Object.entries(REGION_PRESETS).map(([key, preset]) => {
            const isActive = activeRegion === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => selectRegion(key)}
                className={cn(
                  'flex-1 border-r border-border/60 py-2 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors last:border-r-0',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Global Delivery Stats Bar */}
        <div className="grid grid-cols-3 border-t border-border/60 bg-card/90 text-center font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
          <div className="border-r border-border/60 px-2 py-2.5 sm:px-3">
            <span className="block font-bold text-foreground">Local</span>
            <span>PEI & Atlantic</span>
          </div>
          <div className="border-r border-border/60 px-2 py-2.5 sm:px-3">
            <span className="block font-bold text-foreground">National</span>
            <span>Coast to Coast</span>
          </div>
          <div className="px-2 py-2.5 sm:px-3">
            <span className="block font-bold text-foreground">Worldwide</span>
            <span>Remote-First</span>
          </div>
        </div>
      </div>
    </div>
  );
}
