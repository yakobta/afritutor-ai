// voice/commands.js
// Advanced voice command parser for intent routing

export function parseVoiceCommand(text){
  if(!text) return null;
  const t = text.toLowerCase();
  // wake
  if(t.includes('hey soma') || t.includes('hi soma')) return {intent:'wake',raw:text};
  // open subject (supports multi-word subjects)
  let m = t.match(/open\s+([a-z ]+)/i); if(m){ const subject = m[1].trim(); return {intent:'open',subject,raw:text}; }
  // show X
  m = t.match(/show me(?: the)?\s+([a-z ]+)/i); if(m) return {intent:'show',q:m[1].trim(),raw:text};
  // start lesson
  m = t.match(/start(?: a| the)? lesson(?: on)?\s+([a-z ]+)/i); if(m) return {intent:'start_lesson',subject:m[1].trim(),raw:text};
  // quiz
  m = t.match(/(take|start) (?:a )?quiz(?: on)?\s*([a-z ]+)/i); if(m) return {intent:'start_quiz',subject:m[2]?m[2].trim():null,raw:text};
  // search
  m = t.match(/search for\s+([a-z0-9 ]+)/i); if(m) return {intent:'search',q:m[1].trim(),raw:text};
  // fallback: treat as transcript
  return {intent:'transcript',raw:text};
}

export function routeVoiceCommand(parsed, handlers){
  if(!parsed) return;
  const h = handlers || {};
  switch(parsed.intent){
    case 'wake': if(h.onWake) h.onWake(parsed); break;
    case 'open': if(h.onOpen) h.onOpen(parsed.subject, parsed); break;
    case 'show': if(h.onShow) h.onShow(parsed.q, parsed); break;
    case 'start_lesson': if(h.onStartLesson) h.onStartLesson(parsed.subject, parsed); break;
    case 'start_quiz': if(h.onStartQuiz) h.onStartQuiz(parsed.subject, parsed); break;
    case 'search': if(h.onSearch) h.onSearch(parsed.q, parsed); break;
    default: if(h.onTranscript) h.onTranscript(parsed.raw); break;
  }
}
