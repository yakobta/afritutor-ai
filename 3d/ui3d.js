// 3d/ui3d.js
// Utilities to create holographic UI panels and 3D quiz objects
import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

/**
 * Create a holographic 3D panel with a title and body text.
 * @param {string} title
 * @param {string} body
 * @returns {THREE.Mesh}
 */
export function createHologramPanel(title, body){
  const w = 480, h = 200;
  const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h; const ctx = canvas.getContext('2d');
  // background glass
  ctx.fillStyle = 'rgba(16,18,28,0.55)'; ctx.fillRect(0,0,w,h);
  // kitenge header
  const g = ctx.createLinearGradient(0,0,w,0); g.addColorStop(0,'#ffb347'); g.addColorStop(0.3,'#ff7b8a'); g.addColorStop(0.6,'#9b59b6'); g.addColorStop(1,'#54a0ff');
  ctx.fillStyle = g; ctx.fillRect(0,0,w,48);
  // title
  ctx.font = '28px sans-serif'; ctx.fillStyle = 'white'; ctx.fillText(title,16,34);
  // body
  ctx.font = '18px sans-serif'; ctx.fillStyle = 'rgba(230,238,248,0.9)'; wrapText(ctx, body, 16, 80, w-32, 22);

  const tex = new THREE.CanvasTexture(canvas); tex.encoding = THREE.sRGBEncoding; tex.needsUpdate = true;
  const geom = new THREE.PlaneGeometry(6, 6 * (h/w));
  const mat = new THREE.MeshBasicMaterial({map:tex, transparent:true, opacity:0.95});
  const mesh = new THREE.Mesh(geom, mat);
  mesh.renderOrder = 999;
  return mesh;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight){
  const words = text.split(' '); let line = '';
  for(let n=0;n<words.length;n++){
    const testLine = line + words[n] + ' '; const metrics = ctx.measureText(testLine); const testWidth = metrics.width;
    if(testWidth > maxWidth && n>0){ ctx.fillText(line, x, y); line = words[n] + ' '; y += lineHeight; }
    else { line = testLine; }
  }
  ctx.fillText(line, x, y);
}
