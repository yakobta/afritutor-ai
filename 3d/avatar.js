// 3d/avatar.js
// Low-poly elder avatar for the conversational AI
import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

export function createElderAvatar(){
  const g = new THREE.Group();
  // body
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.9,2,4,8), new THREE.MeshStandardMaterial({color:0x2b5360})); body.position.y = 1; g.add(body);
  // head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.6,16,12), new THREE.MeshStandardMaterial({color:0xffe0c9})); head.position.y = 3; g.add(head);
  // hat / wise cloth
  const hat = new THREE.Mesh(new THREE.ConeGeometry(1.1,0.8,12), new THREE.MeshStandardMaterial({color:0x7b3b8f})); hat.position.y = 3.6; hat.rotation.x = Math.PI; g.add(hat);
  // mouth (simple plane for lip-sync)
  const mouth = new THREE.Mesh(new THREE.PlaneGeometry(0.4,0.12), new THREE.MeshBasicMaterial({color:0x331111})); mouth.position.set(0,2.75,0.55); g.add(mouth);
  g.userData.mouth = mouth;

  // small idle animation
  g.tick = (t)=>{ g.position.y = Math.sin(t*0.9)*0.02; head.rotation.y = Math.sin(t*0.3)*0.06; };

  return g;
}
