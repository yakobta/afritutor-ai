// 3d/uiPanels/subjectsPanel.js
// Simple in-world subjects panel rendered to a canvas texture
import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { renderTextPanelToTexture } from '../3d/domToTexture.js';

export function createSubjectsPanel(scene, subjects = []){
  const body = subjects.map((s,i)=>`${i+1}. ${s}`).join('\n');
  const tex = renderTextPanelToTexture('Subjects', body, 512,320);
  const geom = new THREE.PlaneGeometry(5, 5 * (320/512));
  const mat = new THREE.MeshBasicMaterial({map:tex, transparent:true});
  const mesh = new THREE.Mesh(geom, mat); mesh.position.set(-6,2,-4); mesh.renderOrder = 600;
  mesh.userData = {type:'subjects'};
  scene.add(mesh);
  return mesh;
}
