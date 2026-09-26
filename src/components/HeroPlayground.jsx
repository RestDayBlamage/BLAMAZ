/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree, invalidate } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { makeGradientMap, makeOutlineMaterial } from './toon';

// Kształty do zabawy w hero: odbijają się od napisu i od siebie, kursor je rozpycha.
// Fizyka 2D w płaszczyźnie z = 0 (tam stoi napis), napis przybliżony łańcuchem okręgów.

const INK = '#061a1e';
// 'glass' = półprzezroczysty jak obudowa napisu (zamiast czarnego)
const COLORS = ['#f000ef', '#ffffff', 'glass', '#f6f4f0'];
const GLASS_OPACITY = 0.3;

// Łańcuch okręgów wzdłuż napisu, we współrzędnych lokalnych grupy logo (napis ma ~0.99 x 0.135)
const LOGO_R = 0.075;
const LOGO_PTS = Array.from({ length: 13 }, (_, i) => new THREE.Vector3(-0.43 + i * (0.86 / 12), 0.0065, 0));

const DAMPING = 0.985;
const RESTITUTION = 0.85;
const HOVER_RADIUS = 0.18;
const HOVER_FORCE = 4.5;
const SLEEP_SPEED = 0.003;

// Organiczna "bioniczna" bryła: kula falowana gładkimi sinusami, znormalizowana do promienia 1
function makeBlob(seed, amp) {
  const g = new THREE.SphereGeometry(1, 48, 32);
  g.deleteAttribute('uv');
  g.deleteAttribute('normal');
  const merged = mergeVertices(g);
  const p = merged.attributes.position;
  const v = new THREE.Vector3();
  let max = 0;
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n =
      1 +
      amp * Math.sin(v.x * 2.3 + seed) * Math.cos(v.y * 1.7 + seed * 0.7) +
      amp * 0.6 * Math.sin(v.z * 3.1 + seed * 1.9);
    v.multiplyScalar(n);
    max = Math.max(max, v.length());
    p.setXYZ(i, v.x, v.y, v.z);
  }
  merged.scale(1 / max, 1 / max, 1 / max);
  merged.computeVertexNormals();
  return merged;
}

// Prosty deterministyczny random, żeby układ startowy był zawsze taki sam
function rng(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

function makeBodies(count, scale) {
  const rand = rng(7);
  return Array.from({ length: count }, (_, i) => {
    const kind = ['ball', 'wheel', 'blob', 'bean'][i % 4];
    const r = scale * (kind === 'wheel' ? 0.055 + rand() * 0.02 : 0.035 + rand() * 0.045);
    // Start nad i pod napisem, z lekkim pchnięciem – wpadają i układają się
    const side = i % 2 ? 1 : -1;
    return {
      kind,
      r,
      // Przesunięcie co 4 elementy, żeby każdy kształt występował w każdym kolorze
      color: COLORS[(i + Math.floor(i / 4)) % COLORS.length],
      p: new THREE.Vector2(-0.8 + rand() * 1.6, side * (0.22 + rand() * 0.2)),
      v: new THREE.Vector2((rand() - 0.5) * 0.6, -side * (0.1 + rand() * 0.3)),
      spin: 0
    };
  });
}

export default function HeroPlayground({ count = 12, scale = 1, outline = 0.0045 }) {
  const { camera, gl, scene, size } = useThree();
  const bodies = useMemo(() => makeBodies(count, scale), [count, scale]);
  const meshes = useRef([]);
  const logo = useRef(null);
  const pointer = useRef({ x: 0, y: 0, px: 0, py: 0, inside: false, moved: false });
  const tmp = useMemo(() => new THREE.Vector3(), []);

  const assets = useMemo(() => {
    const gradientMap = makeGradientMap([150, 220, 255]);
    const outlineMat = makeOutlineMaterial(INK, outline);
    const geo = {
      ball: new THREE.SphereGeometry(1, 32, 16),
      wheel: new THREE.TorusGeometry(0.72, 0.28, 16, 40),
      blob: makeBlob(1.3, 0.22),
      bean: makeBlob(4.1, 0.3)
    };
    const mats = Object.fromEntries(
      COLORS.map(c => [
        c,
        c === 'glass'
          ? new THREE.MeshToonMaterial({ color: '#ffffff', gradientMap, transparent: true, opacity: GLASS_OPACITY, depthWrite: false })
          : new THREE.MeshToonMaterial({ color: c, gradientMap })
      ])
    );
    // Przejście tylko z głębią dla szklanych kształtów – kontur zostaje wyłącznie na krawędzi (jak przy napisie)
    const depthMat = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: true, transparent: true });
    return { geo, mats, outlineMat, depthMat };
  }, [outline]);

  useEffect(
    () => () => {
      Object.values(assets.geo).forEach(g => g.dispose());
      Object.values(assets.mats).forEach(m => m.dispose());
      assets.outlineMat.dispose();
      assets.depthMat.dispose();
    },
    [assets]
  );

  // Pozycja kursora (w NDC) nad płótnem – hover rozpycha kształty
  useEffect(() => {
    const el = gl.domElement;
    const move = e => {
      const rect = el.getBoundingClientRect();
      const p = pointer.current;
      p.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      p.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      if (!p.inside) p.fresh = true;
      p.inside = true;
      p.moved = true;
      invalidate();
    };
    const leave = () => (pointer.current.inside = false);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [gl]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    // Widoczny obszar w płaszczyźnie z = 0 (kamera patrzy prosto na środek)
    const halfH = camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const halfW = halfH * (size.width / size.height);

    // Aktualne okręgi napisu w świecie (napis można obracać i odbijać nim kształty)
    if (!logo.current) logo.current = scene.getObjectByName('bm-logo');
    const logoCircles = [];
    if (logo.current) {
      logo.current.updateWorldMatrix(true, false);
      for (const lp of LOGO_PTS) {
        tmp.copy(lp).applyMatrix4(logo.current.matrixWorld);
        logoCircles.push(tmp.x, tmp.y);
      }
    }

    const ptr = pointer.current;
    const cx = ptr.x * halfW;
    const cy = ptr.y * halfH;
    if (ptr.fresh) {
      ptr.px = cx;
      ptr.py = cy;
      ptr.fresh = false;
    }
    const cvx = (cx - ptr.px) / dt;
    const cvy = (cy - ptr.py) / dt;
    ptr.px = cx;
    ptr.py = cy;

    let awake = false;
    const steps = 2;
    const h = dt / steps;

    for (let s = 0; s < steps; s++) {
      for (const b of bodies) {
        // Hover: odpychanie od kursora + kopnięcie w kierunku ruchu myszy
        if (ptr.inside) {
          const dx = b.p.x - cx;
          const dy = b.p.y - cy;
          const d = Math.hypot(dx, dy);
          const reach = HOVER_RADIUS + b.r;
          if (d < reach && d > 1e-5) {
            const k = (1 - d / reach) * HOVER_FORCE * h;
            b.v.x += (dx / d) * k + (ptr.moved ? cvx * k * 0.15 : 0);
            b.v.y += (dy / d) * k + (ptr.moved ? cvy * k * 0.15 : 0);
          }
        }

        b.v.multiplyScalar(Math.pow(DAMPING, h * 60));
        b.p.x += b.v.x * h;
        b.p.y += b.v.y * h;

        // Ściany karty hero
        if (b.p.x < -halfW + b.r) { b.p.x = -halfW + b.r; b.v.x = Math.abs(b.v.x) * RESTITUTION; }
        if (b.p.x > halfW - b.r) { b.p.x = halfW - b.r; b.v.x = -Math.abs(b.v.x) * RESTITUTION; }
        if (b.p.y < -halfH + b.r) { b.p.y = -halfH + b.r; b.v.y = Math.abs(b.v.y) * RESTITUTION; }
        if (b.p.y > halfH - b.r) { b.p.y = halfH - b.r; b.v.y = -Math.abs(b.v.y) * RESTITUTION; }

        // Kolizja z napisem (nieruchoma masa – kształt się odbija)
        for (let i = 0; i < logoCircles.length; i += 2) {
          const dx = b.p.x - logoCircles[i];
          const dy = b.p.y - logoCircles[i + 1];
          const d = Math.hypot(dx, dy);
          const min = b.r + LOGO_R;
          if (d < min && d > 1e-6) {
            const nx = dx / d;
            const ny = dy / d;
            b.p.x += nx * (min - d);
            b.p.y += ny * (min - d);
            const vn = b.v.x * nx + b.v.y * ny;
            if (vn < 0) {
              b.v.x -= (1 + RESTITUTION) * vn * nx;
              b.v.y -= (1 + RESTITUTION) * vn * ny;
            }
          }
        }
      }

      // Kolizje kształt–kształt (masa ~ pole)
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i];
          const b = bodies[j];
          const dx = b.p.x - a.p.x;
          const dy = b.p.y - a.p.y;
          const d = Math.hypot(dx, dy);
          const min = a.r + b.r;
          if (d >= min || d < 1e-6) continue;
          const nx = dx / d;
          const ny = dy / d;
          const ma = a.r * a.r;
          const mb = b.r * b.r;
          const overlap = min - d;
          a.p.x -= nx * overlap * (mb / (ma + mb));
          a.p.y -= ny * overlap * (mb / (ma + mb));
          b.p.x += nx * overlap * (ma / (ma + mb));
          b.p.y += ny * overlap * (ma / (ma + mb));
          const rel = (b.v.x - a.v.x) * nx + (b.v.y - a.v.y) * ny;
          if (rel < 0) {
            const j2 = (-(1 + RESTITUTION) * rel) / (1 / ma + 1 / mb);
            a.v.x -= (j2 / ma) * nx;
            a.v.y -= (j2 / ma) * ny;
            b.v.x += (j2 / mb) * nx;
            b.v.y += (j2 / mb) * ny;
          }
        }
      }
    }
    ptr.moved = false;

    bodies.forEach((b, i) => {
      const m = meshes.current[i];
      if (!m) return;
      m.position.set(b.p.x, b.p.y, 0);
      // Toczenie: obrót zależny od prędkości poziomej
      b.spin -= (b.v.x / b.r) * dt;
      if (b.kind === 'wheel') {
        m.rotation.set(0.35, 0.25, b.spin);
      } else {
        m.rotation.set(b.v.y * 2, 0, b.spin);
      }
      if (b.v.lengthSq() > SLEEP_SPEED * SLEEP_SPEED) awake = true;
    });

    // Renderujemy tylko gdy coś się rusza – spokojna scena nie zużywa baterii
    if (awake || ptr.inside) invalidate();
  });

  return (
    <group>
      {bodies.map((b, i) => (
        <mesh
          key={i}
          ref={el => (meshes.current[i] = el)}
          geometry={assets.geo[b.kind]}
          material={assets.mats[b.color]}
          scale={b.r}
        >
          <mesh geometry={assets.geo[b.kind]} material={assets.outlineMat} renderOrder={b.color === 'glass' ? -1 : 0} />
          {b.color === 'glass' && <mesh geometry={assets.geo[b.kind]} material={assets.depthMat} renderOrder={-2} />}
        </mesh>
      ))}
    </group>
  );
}
