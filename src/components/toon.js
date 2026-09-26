import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Schodkowe cieniowanie w stylu anime: cień / półton / światło
function makeGradientMap(steps) {
  const data = new Uint8Array(steps.length * 4);
  steps.forEach((v, i) => data.set([v, v, v, 255], i * 4));
  const tex = new THREE.DataTexture(data, steps.length, 1, THREE.RGBAFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

// Obwódka: kopia siatki odwrócona tyłem i "napompowana" wzdłuż normalnych.
// Grubość liczona w przestrzeni widoku, więc jest stała na ekranie niezależnie od zoomu.
function makeOutlineMaterial(color, thickness) {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide,
    transparent: true,
    uniforms: {
      color: { value: new THREE.Color(color) },
      thickness: { value: thickness },
      opacity: { value: 1 }
    },
    vertexShader: /* glsl */ `
      uniform float thickness;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vec3 n = normalize(normalMatrix * normal);
        mv.xyz += n * thickness * -mv.z;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 color;
      uniform float opacity;
      void main() {
        gl_FragColor = vec4(color, opacity);
      }
    `
  });
}

// Gładkie normalne bez szwów – inaczej obwódka pęka na ostrych krawędziach
function smoothOutlineGeometry(geometry) {
  const src = geometry.attributes.position;
  const pos = new Float32Array(src.count * 3);
  for (let i = 0; i < src.count; i++) {
    pos[i * 3] = src.getX(i);
    pos[i * 3 + 1] = src.getY(i);
    pos[i * 3 + 2] = src.getZ(i);
  }
  let g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  if (geometry.index) g.setIndex(geometry.index.clone());
  g.computeBoundingBox();
  const size = g.boundingBox.getSize(new THREE.Vector3()).length();
  g = mergeVertices(g, size * 1e-4);
  g.computeVertexNormals();
  return g;
}

const DEFAULTS = {
  ink: '#061a1e',
  fill: '#ffffff',
  shell: '#ffffff',
  shellOpacity: 0.3,
  outline: 0.006,
  steps: [185, 235, 255]
};

export function applyToon(root, options = {}) {
  const o = { ...DEFAULTS, ...options };
  const gradientMap = makeGradientMap(o.steps);
  const meshes = [];
  root.traverse(m => m.isMesh && meshes.push(m));

  meshes.forEach(mesh => {
    const name = (mesh.material?.name || '').toLowerCase();
    const isShell = name.includes('foil') || mesh.material?.transmission > 0 || mesh.material?.opacity < 1;
    const isInk = name.includes('black');

    let mat;
    if (isInk) {
      mat = new THREE.MeshBasicMaterial({ color: o.ink });
    } else if (isShell) {
      mat = new THREE.MeshToonMaterial({
        color: o.shell,
        gradientMap,
        transparent: true,
        depthWrite: false
      });
      mat.userData.baseOpacity = o.shellOpacity;
      mesh.renderOrder = 0;

      // Przejście tylko z głębią: zasłania obwódkę wewnątrz sylwetki przezroczystej obudowy,
      // dzięki czemu kontur zostaje wyłącznie na krawędzi
      const depthOnly = new THREE.Mesh(
        mesh.geometry,
        new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: true, transparent: true })
      );
      depthOnly.userData.isHelper = true;
      depthOnly.renderOrder = -2;
      mesh.add(depthOnly);
    } else {
      mat = new THREE.MeshToonMaterial({ color: o.fill, gradientMap });
    }
    mat.opacity = mat.userData.baseOpacity ?? 1;
    mesh.material = mat;
    // Litery (także w trakcie fade-in, gdy są przezroczyste) rysujemy przed obudową i jej głębią
    if (!isShell) mesh.renderOrder = -3;

    // Obwódka tylko wokół zewnętrznej sylwetki (obudowy); kontury liter daje czarna warstwa modelu
    if (isShell || meshes.length === 1) {
      const outline = new THREE.Mesh(smoothOutlineGeometry(mesh.geometry), makeOutlineMaterial(o.ink, o.outline));
      outline.userData.isOutline = true;
      outline.renderOrder = -1;
      mesh.add(outline);
    }
  });
}

// Ustawia przezroczystość przy fade-in, z zachowaniem bazowej przezroczystości materiału
export function setToonOpacity(root, v) {
  root.traverse(m => {
    if (!m.isMesh) return;
    if (m.userData.isHelper) return;
    if (m.userData.isOutline) m.material.uniforms.opacity.value = v;
    else m.material.opacity = v * (m.material.userData.baseOpacity ?? 1);
  });
}
