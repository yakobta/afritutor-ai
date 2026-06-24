// 3d/uiPanels/composerPanel.js
// A 3D composer panel that wires a hidden DOM textarea to a 3D canvas texture.
import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { renderTextPanelToTexture } from '../3d/domToTexture.js';

export class ComposerPanel{
  constructor(scene, onSend){
    this.scene = scene; this.onSend = onSend;
    this.title = 'Compose'; this.body = 'Type a message...';
    this.mesh = this._createMesh(); this.mesh.position.set(0, -1.6, -2.2);
    scene.add(this.mesh);

    // create hidden textarea overlay to accept input (keyboard focus on click)
    this.input = document.createElement('textarea'); this.input.className = 'hidden-composer';
    Object.assign(this.input.style,{position:'fixed',left:'-9999px',top:'-9999px',opacity:0}); document.body.appendChild(this.input);

    // wire send key (Enter)
    this.input.addEventListener('keydown', (e)=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); this._send(); } else { setTimeout(()=>this._updateTexture(),0); }});

    // click to focus
    this.mesh.userData = {type:'composer'};
    this.mesh.callback = ()=>{ this._focusInput(); };
  }

  _createMesh(){
    const tex = renderTextPanelToTexture(this.title, this.body);
    const geom = new THREE.PlaneGeometry(4, 4*0.5);
    const mat = new THREE.MeshBasicMaterial({map:tex, transparent:true});
    const mesh = new THREE.Mesh(geom, mat);
    mesh.renderOrder = 500;
    return mesh;
  }

  _updateTexture(){
    const tex = renderTextPanelToTexture(this.title, this.input.value || this.body, 512,256);
    this.mesh.material.map = tex; this.mesh.material.needsUpdate = true;
  }

  _focusInput(){ this.input.focus(); }

  _send(){ const text = (this.input.value||'').trim(); if(!text) return; if(this.onSend) this.onSend(text); this.input.value=''; this._updateTexture(); }

  destroy(){ if(this.mesh) this.scene.remove(this.mesh); if(this.input) this.input.remove(); }
}
