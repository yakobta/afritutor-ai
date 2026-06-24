// 3d/touchGestures.js
// Unified touch gesture helpers: tap, pinch, drag

export function initTouchGestures(){
  let pinchStart = null;
  window.addEventListener('touchstart', (e)=>{
    if(e.touches.length===1){ window.dispatchEvent(new CustomEvent('gesture-tap',{detail:{x:e.touches[0].clientX,y:e.touches[0].clientY}})); }
    if(e.touches.length===2){ pinchStart = {dx: e.touches[0].clientX - e.touches[1].clientX, dy: e.touches[0].clientY - e.touches[1].clientY}; }
  });
  window.addEventListener('touchmove',(e)=>{
    if(e.touches.length===1){ window.dispatchEvent(new CustomEvent('gesture-drag',{detail:{x:e.touches[0].clientX,y:e.touches[0].clientY}})); }
    if(e.touches.length===2 && pinchStart){ const dx = e.touches[0].clientX - e.touches[1].clientX; const dy = e.touches[0].clientY - e.touches[1].clientY; const dist = Math.hypot(dx,dy); const startDist = Math.hypot(pinchStart.dx,pinchStart.dy); const scale = dist / (startDist||1); window.dispatchEvent(new CustomEvent('gesture-pinch',{detail:{scale}})); }
  });
  window.addEventListener('touchend', (e)=>{ pinchStart = null; window.dispatchEvent(new CustomEvent('gesture-end')); });
}
