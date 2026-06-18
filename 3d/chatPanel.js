// 3d/chatPanel.js
// Creates a 3D chat panel in the scene and updates it with messages
import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { createHologramPanel } from './ui3d.js';

export class Chat3D{
  constructor(scene, options={}){
    this.scene = scene; this.mesh = createHologramPanel('AfriTutor','Welcome to the 3D chat.');
    this.mesh.position.set(0,1.6,-3); this.scene.add(this.mesh);
    this.messages = [];
    this.canvas = null; this.texture = null;
  }

  updateMessages(messages){
    this.messages = messages.slice(-6);
    const text = this.messages.map(m=>`${m.who==='user'? 'You':'AfriTutor'}: ${m.text}`).join('\n');
    // recreate texture from text by drawing to canvas
    const w = 512, h = 256; const canvas = document.createElement('canvas'); canvas.width=w; canvas.height=h; const ctx = canvas.getContext('2d');
    ctx.fillStyle='rgba(16,18,28,0.6)'; ctx.fillRect(0,0,w,h);
    ctx.font = '18px sans-serif'; ctx.fillStyle='white'; wrapText(ctx, text, 12, 36, w-24, 22);
    const tex = new THREE.CanvasTexture(canvas); tex.encoding = THREE.sRGBEncoding; tex.needsUpdate = true;
    // apply to mesh material
    if(this.mesh && this.mesh.material){ this.mesh.material.map = tex; this.mesh.material.needsUpdate=true; }
  }
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight){
  const words = text.split(' '); let line=''; for(let n=0;n<words.length;n++){ const testLine = line + words[n] + ' '; const metrics=ctx.measureText(testLine); const testWidth=metrics.width; if(testWidth>maxWidth && n>0){ ctx.fillText(line,x,y); line = words[n] + ' '; y += lineHeight; } else { line = testLine; } } ctx.fillText(line,x,y);
}
