// 3d/domToTexture.js
// Utilities to render simple HTML-like content (title + body) to a canvas texture
import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

export function renderTextPanelToTexture(title, body, width=512, height=256){
  const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height; const ctx = canvas.getContext('2d');
  // glass background
  ctx.fillStyle = 'rgba(16,18,28,0.6)'; ctx.fillRect(0,0,width,height);
  // kitenge header
  const g = ctx.createLinearGradient(0,0,width,0); g.addColorStop(0,'#ffb347'); g.addColorStop(0.3,'#ff7b8a'); g.addColorStop(0.6,'#9b59b6'); g.addColorStop(1,'#54a0ff');
  ctx.fillStyle = g; ctx.fillRect(0,0, width, 48);
  // title
  ctx.font = '26px sans-serif'; ctx.fillStyle = 'white'; ctx.fillText(title, 16, 34);
  // body
  ctx.font = '16px sans-serif'; ctx.fillStyle = 'rgba(230,238,248,0.95)'; wrapText(ctx, body, 16, 78, width - 32, 20);

  const tex = new THREE.CanvasTexture(canvas); tex.encoding = THREE.sRGBEncoding; tex.needsUpdate = true;
  return tex;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight){
  const words = text.split(' '); let line='';
  for(let n=0;n<words.length;n++){
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if(testWidth > maxWidth && n>0){ ctx.fillText(line,x,y); line = words[n] + ' '; y += lineHeight; }
    else { line = testLine; }
  }
  ctx.fillText(line,x,y);
}
