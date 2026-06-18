// 3d/scene.js
// Primary 3D scene entrypoint for AfriTutor Metaverse
// - Builds an African savanna hub
// - Floating interactive lesson orbs, Baobab Tree menu
// - Holographic UI panels rendered as 3D planes
// - WASD / pointer navigation and click interactions
// - Day/night cycle and lightweight particle weather

import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.158.0/examples/jsm/controls/PointerLockControls.js';

import { createKitengeMaterial } from './materials.js';
import { createHologramPanel } from './ui3d.js';
import { createElderAvatar } from './avatar.js';

const canvas = document.getElementById('bg-canvas');
if(!canvas){ console.warn('No canvas found for 3D scene'); }

let renderer, scene, camera, controls, raycaster, mouse;
let interactiveObjects = [];
let dayTime = 0; // 0..1
let is3DEnabled = true;

function init(){
  // Renderer
  renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;

  // Scene + Camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0, 4, 12);

  // Controls (pointer lock for immersive movement)
  controls = new PointerLockControls(camera, renderer.domElement);
  // add basic fly/walk velocity state
  controls.getObject().position.set(0,2,12);

  // Lights
  const hemi = new THREE.HemisphereLight(0xfff8e8, 0x081820, 0.9);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff1c9, 0.6);
  sun.position.set(30,50,10); scene.add(sun);

  // Ground (savanna-like)
  const groundMat = new THREE.MeshStandardMaterial({color:0x6b3b18, roughness:1});
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(400,400,4,4), groundMat);
  ground.rotation.x = -Math.PI/2; ground.position.y = -1; scene.add(ground);

  // Create baobab menu
  const baobab = createBaobab(); scene.add(baobab);

  // Floating orbs (subjects)
  const subjects = ['Biology','Agriculture','Coding','Culture','Languages','Math'];
  subjects.forEach((title,i)=>{
    const orb = createFloatingOrb(title, i); scene.add(orb.mesh);
    interactiveObjects.push(orb.mesh);
  });

  // Elder avatar (assistant)
  const elder = createElderAvatar(); elder.position.set(-6,0, -4); scene.add(elder);
  interactiveObjects.push(elder);

  // Knowledge tree (grows with progress)
  const tree = createKnowledgeTree(); tree.position.set(8,0,-6); scene.add(tree);

  // Particles / weather
  const particles = createParticles(); scene.add(particles);

  // Raycaster & mouse
  raycaster = new THREE.Raycaster(); mouse = new THREE.Vector2();
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('click', onClick);
  window.addEventListener('resize', onResize);

  // UI toggle
  document.getElementById('toggle-3d')?.addEventListener('click', toggle3D);
  document.getElementById('enter-xr')?.addEventListener('click', () => { enterXR(); });

  // Start render loop
  animate();
}

function createBaobab(){
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(1.8,2.2,8,10), new THREE.MeshStandardMaterial({color:0x553322}));
  trunk.position.y = 3; group.add(trunk);
  const leaves = new THREE.Mesh(new THREE.SphereGeometry(6,16,12), new THREE.MeshStandardMaterial({color:0x2b6d2b, transparent:true, opacity:0.95}));
  leaves.position.y = 8; group.add(leaves);

  // Add holographic menu panels attached to tree
  const panel = createHologramPanel('Baobab Menu','Walk to any subject orb or say: "Open Biology"');
  panel.position.set(3,4,0); group.add(panel);

  return group;
}

function createFloatingOrb(title, index){
  const g = new THREE.Group();
  const mat = createKitengeMaterial();
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.2,24,18), mat);
  sphere.position.y = 2 + Math.sin(index*0.8)*0.6; sphere.position.x = Math.cos(index/subjectsCount(index))*6 * (1+index*0.06);
  sphere.position.z = Math.sin(index/subjectsCount(index))*6 * (1+index*0.04);

  g.add(sphere);
  // label using sprite
  const canvas = document.createElement('canvas'); canvas.width=256; canvas.height=64; const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(255,255,255,0.02)'; ctx.fillRect(0,0,256,64);
  ctx.font = '28px sans-serif'; ctx.fillStyle='white'; ctx.fillText(title,18,40);
  const tex = new THREE.CanvasTexture(canvas); tex.encoding = THREE.sRGBEncoding;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({map:tex, transparent:true})); sprite.scale.set(4,1.1,1); sprite.position.set(0,-1.6,0);
  g.add(sprite);

  // attach click data
  sphere.userData = {type:'orb',title};

  // simple floating animation parameters
  g.userData = {floatOffset:Math.random()*Math.PI*2};

  return {mesh:g,title};
}

function subjectsCount(i){ return Math.max(1,6 - Math.floor(i/2)); }

function createKnowledgeTree(){
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.6,0.8,4,8), new THREE.MeshStandardMaterial({color:0x4b2b1e})); trunk.position.y = 2; g.add(trunk);
  const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(2.8,0), new THREE.MeshStandardMaterial({color:0x37966f})); crown.position.y = 5; g.add(crown);
  g.userData.growth = 0.2;
  return g;
}

function createParticles(){
  const count = 400;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count*3);
  for(let i=0;i<count;i++){ pos[i*3]= (Math.random()-0.5)*120; pos[i*3+1]=Math.random()*10; pos[i*3+2]=(Math.random()-0.5)*120; }
  geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  const mat = new THREE.PointsMaterial({color:0xffd6a5,size:0.6,transparent:true,opacity:0.7});
  return new THREE.Points(geo,mat);
}

function onPointerMove(e){
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
}

function onClick(){
  raycaster.setFromCamera(mouse,camera);
  const intersects = raycaster.intersectObjects(interactiveObjects, true);
  if(intersects.length>0){
    const obj = intersects[0].object;
    let u = obj.userData;
    if(!u && obj.parent) u = obj.parent.userData;
    if(u && u.type==='orb' && u.title){
      // enter subject
      enterSubject(u.title);
    } else {
      // maybe clicked the elder avatar
      console.log('Clicked object',obj); // placeholder
    }
  }
}

function enterSubject(title){
  console.log('Entering subject',title);
  const panel = createHologramPanel(`Entering ${title}`, `Loading micro-lesson for ${title}...`);
  panel.position.copy(camera.position).add(new THREE.Vector3(0, -1, -3).applyQuaternion(camera.quaternion));
  scene.add(panel);
  setTimeout(()=>{ scene.remove(panel); }, 3000);
}

async function enterXR(){
  // basic WebXR entrypoint if available
  if(navigator.xr){
    try{
      const session = await navigator.xr.requestSession('immersive-vr');
      console.log('XR session started',session);
    }catch(e){console.warn('XR entry failed',e);} 
  } else {
    alert('WebXR not available on this device/browser.');
  }
}

function toggle3D(){ is3DEnabled = !is3DEnabled; canvas.style.display = is3DEnabled ? 'block' : 'none'; document.getElementById('toggle-3d').setAttribute('aria-pressed', String(is3DEnabled)); }

function onResize(){ camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); }

function animate(){
  requestAnimationFrame(animate);
  const t = performance.now()*0.001; dayTime = (Math.sin(t*0.05)*0.5)+0.5;
  // sun intensity cycles
  const sunIntensity = 0.3 + dayTime*0.9;
  scene.traverse(obj=>{ if(obj.isLight && obj.type==='DirectionalLight') obj.intensity = sunIntensity; });

  // float orbs
  scene.traverse(obj=>{
    if(obj.type==='Group' && obj.userData && typeof obj.userData.floatOffset==='number'){
      obj.position.y = 2 + Math.sin(t + obj.userData.floatOffset) * 0.6;
      obj.rotation.y += 0.002;
    }
    // grow knowledge tree
    if(obj.userData && obj.userData.growth!==undefined){
      const g = obj.userData.growth; obj.scale.setScalar(0.6+g);
    }
  });

  // raycaster prep
  raycaster.setFromCamera(mouse,camera);

  renderer.render(scene,camera);
}

// Initialize safely
try{ init(); }catch(e){ console.error('3D scene initialization failed',e); }

export { scene, camera };
