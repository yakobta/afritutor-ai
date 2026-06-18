// voice/voice.js
// Web Speech API wrapper: TTS & STT + simple command parsing and lip-sync simulation

export const Voice = (function(){
  let recognition = null;
  let listening = false;

  function supportsRecognition(){
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  function startRecognition(lang='en-US'){
    if(!supportsRecognition()) return Promise.reject(new Error('SpeechRecognition not supported'));
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SR();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (ev)=>{
      const text = ev.results[0][0].transcript;
      window.dispatchEvent(new CustomEvent('voice-transcript', {detail:{text}}));
      parseCommand(text);
    };
    recognition.onerror = (e)=>{ console.warn('STT error',e); window.dispatchEvent(new CustomEvent('voice-error',{detail:e})); };
    recognition.onend = ()=>{ listening = false; window.dispatchEvent(new CustomEvent('voice-ended')); };
    recognition.start(); listening = true; window.dispatchEvent(new CustomEvent('voice-started')); return Promise.resolve();
  }

  function stopRecognition(){ if(recognition && listening){ recognition.stop(); listening=false; }}

  // TTS: speak text using SpeechSynthesis and simulate lip-sync via events
  function speak(text, lang='en-US', opts={}){
    return new Promise((resolve,reject)=>{
      if(!('speechSynthesis' in window)){
        console.warn('TTS not supported'); window.dispatchEvent(new CustomEvent('tts-failed')); return reject(new Error('TTS not supported')); }
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang; u.rate = opts.rate || 1; u.pitch = opts.pitch || 1; u.volume = opts.volume || 1;
      u.onstart = ()=>{ window.dispatchEvent(new CustomEvent('tts-start',{detail:{text}})); simulateLipSyncStart(); };
      u.onend = ()=>{ window.dispatchEvent(new CustomEvent('tts-end')); simulateLipSyncStop(); resolve(); };
      u.onerror = (e)=>{ window.dispatchEvent(new CustomEvent('tts-error',{detail:e})); simulateLipSyncStop(); reject(e); };
      speechSynthesis.speak(u);
    });
  }

  // Simple command parser: wake word 'hey soma' or direct 'open X' patterns
  function parseCommand(text){
    const t = (text||'').toLowerCase();
    if(t.includes('hey soma') || t.includes('hi soma')){
      // just acknowledge
      window.dispatchEvent(new CustomEvent('voice-command',{detail:{cmd:'wake',raw:text}}));
      return;
    }
    const openMatch = t.match(/open\s+(\w+)/i);
    if(openMatch){
      const subject = openMatch[1];
      window.dispatchEvent(new CustomEvent('voice-command',{detail:{cmd:'open',subject,raw:text}}));
      return;
    }
    // other commands: 'show me photosynthesis' => search intent
    const showMatch = t.match(/show me\s+([\w\s]+)/i);
    if(showMatch){ window.dispatchEvent(new CustomEvent('voice-command',{detail:{cmd:'show',q:showMatch[1],raw:text}})); return; }
    // fallback: emit transcript only
    window.dispatchEvent(new CustomEvent('voice-transcript',{detail:{text}}));
  }

  // Lip-sync simulation: simple amplitude timer that emits 'lip' events with value 0..1
  let lipTimer = null;
  function simulateLipSyncStart(){
    if(lipTimer) clearInterval(lipTimer);
    lipTimer = setInterval(()=>{
      // generate pseudo-amplitude using noise
      const v = Math.random()*0.9; window.dispatchEvent(new CustomEvent('voice-lip',{detail:{v}}));
    }, 80);
  }
  function simulateLipSyncStop(){ if(lipTimer){ clearInterval(lipTimer); lipTimer = null; window.dispatchEvent(new CustomEvent('voice-lip',{detail:{v:0}})); }}

  // Public API
  return { startRecognition, stopRecognition, speak, parseCommand, supportsRecognition };
})();
