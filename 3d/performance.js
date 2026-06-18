// 3d/performance.js
// Automatic device profiling to set quality levels

export function detectQuality(){
  const ua = navigator.userAgent || '';
  const isMobile = /Mobi|Android/i.test(ua);
  const cores = navigator.hardwareConcurrency || 2;
  const memory = navigator.deviceMemory || 2;
  // simple scoring
  let score = 0; if(!isMobile) score+=2; score += Math.min(4, Math.floor(cores/2)); score += Math.min(4, Math.floor(memory/2));
  if(score<=3) return 'low'; if(score<=6) return 'medium'; return 'high';
}
