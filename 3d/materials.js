// 3d/materials.js
// Kitenge-inspired holographic material factory
import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

export function createKitengeMaterial(){
  // create a dynamic canvas texture with a kitenge-like gradient pattern
  const c = document.createElement('canvas'); c.width = 512; c.height = 64; const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0,0,512,0);
  g.addColorStop(0,'#ffb347'); g.addColorStop(0.3,'#ff7b8a'); g.addColorStop(0.6,'#9b59b6'); g.addColorStop(1,'#54a0ff');
  ctx.fillStyle = g; ctx.fillRect(0,0,512,64);
  // overlay subtle pattern
  ctx.globalAlpha = 0.09; ctx.fillStyle='#000'; for(let i=0;i<12;i++){ ctx.fillRect(i*48,0,8,64); }

  const tex = new THREE.CanvasTexture(c); tex.encoding = THREE.sRGBEncoding; tex.wrapS = THREE.RepeatWrapping; tex.repeat.x = 2;
  const mat = new THREE.MeshStandardMaterial({map:tex, roughness:0.45, metalness:0.1, transparent:true});
  return mat;
}
