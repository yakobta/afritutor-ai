// voice/lipsync.js
// Lightweight lip-sync: uses microphone amplitude when recording, and simulates amplitude for TTS playback

export const LipSync = (function(){
  let audioCtx = null; let analyser = null; let source = null; let running=false; let raf=null;

  function supportsAudio(){ return !!(window.AudioContext || window.webkitAudioContext); }

  async function startMicAnalysis(){
    if(!supportsAudio()) return;
    if(running) return;
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    try{
      const stream = await navigator.mediaDevices.getUserMedia({audio:true});
      source = audioCtx.createMediaStreamSource(stream);
      analyser = audioCtx.createAnalyser(); analyser.fftSize = 256;
      source.connect(analyser);
      running = true; loop();
    }catch(e){ console.warn('Mic access failed for lipsync',e); }
  }

  function stopMicAnalysis(){ if(!running) return; if(raf) cancelAnimationFrame(raf); if(source){ try{ source.disconnect(); }catch(e){} } if(analyser){ try{ analyser.disconnect(); }catch(e){} } running=false; }

  function loop(){ const buffer = new Uint8Array(analyser.frequencyBinCount); analyser.getByteFrequencyData(buffer); let sum=0; for(let i=0;i<buffer.length;i++){ sum+=buffer[i]; } const avg = sum / buffer.length / 255; window.dispatchEvent(new CustomEvent('voice-lip',{detail:{v:avg}})); raf = requestAnimationFrame(loop); }

  // When TTS is used we don't have an audio node we can analyze. Simulate a smooth amplitude envelope over duration.
  function simulateForDuration(ms){ const start = performance.now(); const step = ()=>{ const now = performance.now(); const t = (now-start)/ms; if(t>=1){ window.dispatchEvent(new CustomEvent('voice-lip',{detail:{v:0}})); return; } const v = Math.abs(Math.sin(t*Math.PI*4)) * (0.4 + Math.random()*0.6); window.dispatchEvent(new CustomEvent('voice-lip',{detail:{v}})); requestAnimationFrame(step); }; step(); }

  // Public API
  return { startMicAnalysis, stopMicAnalysis, simulateForDuration };
})();
