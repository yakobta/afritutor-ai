// three-scene.js — lightweight Three.js background scene
// Uses ES module build from unpkg CDN for quick integration without bundling

import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

const canvasId = 'bg-canvas';
const canvas = document.getElementById(canvasId);

if(!canvas || !canvas.getContext){
  console.warn('No canvas available or WebGL not supported — skipping 3D background');
} else {
  let renderer, scene, camera, clock;
  let particles;
  let pointer = {x:0,y:0};

  function init(){
    // Renderer
    renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Scene + Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 12, 40);
    scene.add(camera);

    clock = new THREE.Clock();

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.5);
    dir.position.set(5,10,7.5);
    scene.add(dir);

    // Ground plane (subtle)
    const groundGeo = new THREE.PlaneGeometry(200,200,6,6);
    const groundMat = new THREE.MeshStandardMaterial({color:0x071124,transparent:true,opacity:0.75});
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI/2; ground.position.y = -6;
    scene.add(ground);

    // Particle field for subtle motion
    const count = 1200;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for(let i=0;i<count;i++){
      positions[i*3+0] = (Math.random()-0.5) * 120; // x
      positions[i*3+1] = (Math.random()-0.2) * 20;  // y
      positions[i*3+2] = (Math.random()-0.5) * 120; // z
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions,3));
    const mat = new THREE.PointsMaterial({color:0xffd6a5,size:0.6,opacity:0.9,transparent:true});
    particles = new THREE.Points(geo,mat);
    scene.add(particles);

    // Low-poly floating shapes (cultural emblem shapes)
    const shapes = new THREE.Group();
    for(let i=0;i<40;i++){
      const geom = new THREE.BoxGeometry(2,2,2);
      const m = new THREE.MeshStandardMaterial({color: new THREE.Color().setHSL(Math.random()*0.2+0.05,0.6,0.45),roughness:0.6,metalness:0.1});
      const mesh = new THREE.Mesh(geom,m);
      mesh.position.set((Math.random()-0.5)*80, Math.random()*12 - 2, (Math.random()-0.5)*80);
      mesh.rotation.set(Math.random()*2,Math.random()*2,Math.random()*2);
      mesh.scale.setScalar(Math.random()*1.8+0.3);
      shapes.add(mesh);
    }
    scene.add(shapes);

    // Event handlers
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointerMove);
    onResize();

    animate();
  }

  function onResize(){
    const w = window.innerWidth; const h = window.innerHeight;
    renderer.setSize(w,h); camera.aspect = w/h; camera.updateProjectionMatrix();
  }

  function onPointerMove(e){
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  }

  function animate(){
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // subtle camera parallax following pointer
    camera.position.x += (pointer.x * 8 - camera.position.x) * 0.02;
    camera.position.y += (-pointer.y * 4 + 6 - camera.position.y) * 0.02;
    camera.lookAt(0,0,0);

    // particles drift
    particles.rotation.y = t * 0.02;

    // rotate shapes group subtly
    scene.traverse(obj=>{
      if(obj.isMesh && obj.geometry.type === 'BoxGeometry'){
        obj.rotation.x += 0.001 + Math.sin(t*0.5+obj.id)*0.0005;
        obj.rotation.y += 0.001 + Math.cos(t*0.3+obj.id)*0.0004;
      }
    });

    renderer.render(scene, camera);
  }

  // init but respect reduced motion preference
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(mq && mq.matches){
    // reduced motion: create a static gradient in the canvas
    try{
      const ctx = canvas.getContext('2d');
      const g = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
      g.addColorStop(0,'rgba(124,58,237,0.2)');
      g.addColorStop(1,'rgba(14,165,163,0.15)');
      ctx.fillStyle = g; ctx.fillRect(0,0,canvas.width,canvas.height);
    }catch(e){ console.warn('reduced motion fallback failed',e); }
  } else {
    init();
  }
}
