// 3d/mobile-controls.js
// Virtual joystick for touch controls; emits 'joystick-move' custom events with {x,y}

export function createVirtualJoystick(){
  // simple on-screen joystick
  const container = document.createElement('div'); container.id='vj-container';
  Object.assign(container.style,{position:'fixed',left:'18px',bottom:'18px',width:'120px',height:'120px',borderRadius:'60px',background:'rgba(0,0,0,0.12)',zIndex:9999});
  const knob = document.createElement('div'); Object.assign(knob.style,{position:'absolute',left:'30px',top:'30px',width:'60px',height:'60px',borderRadius:'30px',background:'rgba(255,255,255,0.06)'});
  container.appendChild(knob); document.body.appendChild(container);

  let active=false, startX=0, startY=0;
  container.addEventListener('touchstart',(e)=>{ e.preventDefault(); active=true; const t=e.touches[0]; startX=t.clientX; startY=t.clientY; });
  container.addEventListener('touchmove',(e)=>{ if(!active) return; const t=e.touches[0]; const dx = (t.clientX - startX)/40; const dy = (t.clientY - startY)/40; // normalized
    knob.style.transform = `translate(${Math.max(-30,Math.min(30,dx*30))}px, ${Math.max(-30,Math.min(30,dy*30))}px)`;
    window.dispatchEvent(new CustomEvent('joystick-move',{detail:{x:dx,y:dy}}));
  });
  container.addEventListener('touchend',(e)=>{ active=false; knob.style.transform='translate(0px,0px)'; window.dispatchEvent(new CustomEvent('joystick-move',{detail:{x:0,y:0}})); });

  return container;
}
