/**
 * script.js — Modular chat interface logic
 * - Language detection (English, Amharic, Kiswahili)
 * - Accessible keyboard navigation and focus management
 * - Quiz integration with inline cards
 * - Session persistence (localStorage)
 * - Simple simulation of assistant replies for demo/testing
 */

const STORAGE_KEY = 'afritutor.chat.v1';

/**
 * Message shape:
 * {
 *   id: string,
 *   who: 'user'|'assistant',
 *   text: string,
 *   lang: 'en'|'am'|'sw'|'mix',
 *   ts: ISOString,
 *   status: 'sent'|'delivered'|'read',
 *   quiz?: {question,options:[],answerIndex}
 * }
 */

/**
 * Save messages to localStorage
 * @param {Array<Object>} messages
 */
function saveSession(messages){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

/**
 * Load messages from localStorage
 * @returns {Array<Object>}
 */
function loadSession(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw? JSON.parse(raw): [];
  }catch(e){
    console.error('Failed to load session',e);
    return [];
  }
}

/**
 * Simple language detector covering English, Amharic (Ethiopic), Kiswahili
 * @param {string} text
 * @returns {'en'|'am'|'sw'|'mix'}
 */
function detectLanguage(text){
  if(!text) return 'en';
  const hasEthiopic = /[\u1200-\u137F]/.test(text);
  const swKeywords = /\b(habari|karibu|asante|jambo|sawa|nzuri)\b/i;
  const enKeywords = /\b(the|and|is|you|hello|thanks)\b/i;
  const hasSw = swKeywords.test(text);
  const hasEn = enKeywords.test(text);
  if(hasEthiopic && (hasEn || hasSw)) return 'mix';
  if(hasEthiopic) return 'am';
  if(hasSw && !hasEn) return 'sw';
  if(hasEn) return 'en';
  return 'en';
}

/**
 * Format relative time (simple)
 * @param {string} iso
 * @returns {string}
 */
function relTime(iso){
  const then = new Date(iso); const now = new Date();
  const diff = Math.round((now - then)/1000);
  if(diff<10) return 'now';
  if(diff<60) return `${diff}s`;
  if(diff<3600) return `${Math.floor(diff/60)}m`;
  if(diff<86400) return `${Math.floor(diff/3600)}h`;
  return `${Math.floor(diff/86400)}d`;
}

/**
 * Render a single message into the conversation
 * @param {Object} msg
 */
function renderMessage(msg){
  const tpl = document.getElementById('msg-template');
  const node = tpl.content.cloneNode(true);
  const article = node.querySelector('article');
  article.classList.add(msg.who);
  article.dataset.id = msg.id;

  const avatar = node.querySelector('.avatar');
  avatar.classList.add('pulse');
  avatar.setAttribute('aria-hidden','true');

  const name = node.querySelector('.name');
  name.textContent = msg.who === 'user' ? 'You' : 'AfriTutor';

  const badge = node.querySelector('.lang-badge');
  const langMap = {en:'EN',am:'AM',sw:'SW',mix:'MX'};
  badge.textContent = langMap[msg.lang]||'EN';

  const timeEl = node.querySelector('time');
  timeEl.textContent = relTime(msg.ts);
  timeEl.setAttribute('datetime',msg.ts);

  const status = node.querySelector('.status');
  status.innerHTML = msg.who==='user'? (msg.status==='read'? '✓✓':'✓') : '';

  const content = node.querySelector('.content');
  // Language highlighting: wrap in a span with class
  const span = document.createElement('span');
  span.className = `lang-${msg.lang}`;
  span.textContent = msg.text;
  content.appendChild(span);

  // actions (quiz button for assistant)
  const actions = node.querySelector('.actions');
  if(msg.who==='assistant' && msg.quiz){
    const btn = document.createElement('button');
    btn.className = 'test-button';
    btn.textContent = 'Test Me';
    btn.setAttribute('aria-expanded','false');
    btn.addEventListener('click',()=>toggleQuiz(article,msg));
    actions.appendChild(btn);
  }

  // animation staggering using CSS custom property
  const conv = document.getElementById('conversation');
  const count = conv.children.length;
  article.style.animationDelay = `${Math.min(0.08*count,0.7)}s`;

  conv.appendChild(node);
  // scroll into view
  conv.scrollTop = conv.scrollHeight;
}

/**
 * Toggle quiz card for a given article node
 * @param {HTMLElement} article
 * @param {Object} msg
 */
function toggleQuiz(article,msg){
  // find existing
  let card = article.querySelector('.quiz-card');
  const btn = article.querySelector('.test-button');
  if(card){
    card.remove(); btn.setAttribute('aria-expanded','false'); return;
  }
  btn.setAttribute('aria-expanded','true');
  card = document.createElement('div');
  card.className = 'quiz-card';
  card.setAttribute('role','region');
  card.setAttribute('aria-label','quiz card');

  const q = document.createElement('div'); q.textContent = msg.quiz.question; card.appendChild(q);
  const opts = document.createElement('div'); opts.className='quiz-options';
  msg.quiz.options.forEach((opt,i)=>{
    const o = document.createElement('button'); o.className='quiz-option'; o.textContent = opt; o.setAttribute('data-index',i);
    o.addEventListener('click',()=>onAnswer(o,msg));
    opts.appendChild(o);
  });
  card.appendChild(opts);
  article.querySelector('.bubble').appendChild(card);
  // focus first option for keyboard users
  const first = card.querySelector('.quiz-option'); if(first) first.focus();
}

/**
 * Handle quiz answer click
 * @param {HTMLElement} btn
 * @param {Object} msg
 */
function onAnswer(btn,msg){
  const idx = Number(btn.dataset.index);
  const parent = btn.closest('.quiz-card');
  const options = parent.querySelectorAll('.quiz-option');
  options.forEach((o,i)=>{
    o.classList.remove('correct','incorrect');
    if(i===msg.quiz.answerIndex){ o.classList.add('correct'); }
    if(i===idx && i!==msg.quiz.answerIndex){ o.classList.add('incorrect'); }
    o.disabled = true;
  });
  // cultural praise animation/text
  const praise = document.createElement('div'); praise.style.marginTop='8px';
  praise.style.fontWeight='600';
  praise.textContent = idx===msg.quiz.answerIndex ? 'Hongera! 👏 Great job!' : 'Good try — keep learning! ✨';
  parent.appendChild(praise);
}

/**
 * Add message and persist
 * @param {Object} msg
 */
function pushMessage(msg){
  const messages = loadSession();
  messages.push(msg);
  saveSession(messages);
  renderMessage(msg);
}

/**
 * Simulate assistant reply (placeholder for real integration)
 * @param {string} text
 */
function assistantReplyFor(text){
  // simple echo with language detection and a sample quiz injected sometimes
  const lang = detectLanguage(text);
  const replyText = {
    en: `I heard: "${text}" — here's a short tip.`,
    am: `እኔ ሰማሁ፡ "${text}" — እነዚህ ጥቆማዎች ናቸው።`,
    sw: `Nimesikia: "${text}" — hapa kuna ushauri mfupi.`,
    mix: `Mixed language detected. Thanks — ${text}`
  }[lang] || text;

  /** inject a quiz for demonstration when message length short */
  const quiz = (text.length<40) ? {question:'Which greeting is Kiswahili for "Hello"?', options:['Habari','Tena','Selam','Shikamoo'], answerIndex:0} : null;

  return {text:replyText,lang:lang,quiz};
}

/**
 * Wire up UI
 */
function init(){
  const input = document.getElementById('input');
  const send = document.getElementById('send');
  const conv = document.getElementById('conversation');
  const clear = document.getElementById('clear-session');

  // restore session
  const messages = loadSession();
  messages.forEach(renderMessage);

  // sample assistant welcome if empty
  if(messages.length===0){
    const welcome = {id:crypto.randomUUID(),who:'assistant',text:'Welcome to AfriTutor — type in English, Amharic (አማርኛ), or Kiswahili (Kiswahili).',lang:'en',ts:new Date().toISOString(),status:'delivered',quiz:{question:'Ready to try a quiz?',options:['Yes','No'],answerIndex:0}};
    pushMessage(welcome);
  }

  send.addEventListener('click',onSend);
  input.addEventListener('keydown',e=>{
    if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); onSend(); }
    if(e.key==='ArrowUp' && input.value===''){ // quick edit last
      const last = loadSession().slice(-1)[0]; if(last && last.who==='user') input.value = last.text; }
  });

  clear.addEventListener('click',()=>{ localStorage.removeItem(STORAGE_KEY); conv.innerHTML=''; init(); });

  // accessibility: focus management when new messages appear
  const obs = new MutationObserver((mut)=>{
    mut.forEach(m=>{
      m.addedNodes.forEach(n=>{
        if(n.querySelector){
          const c = n.querySelector('.content'); if(c) c.setAttribute('tabindex',0);
        }
      });
    });
  });
  obs.observe(conv,{childList:true,subtree:true});

  function onSend(){
    const text = input.value.trim(); if(!text) return; input.value='';
    const lang = detectLanguage(text);
    const userMsg = {id:crypto.randomUUID(),who:'user',text,lang,ts:new Date().toISOString(),status:'sent'};
    pushMessage(userMsg);

    // simulate delivery/read after short delays
    setTimeout(()=>{ // delivered
      const m = loadSession(); m.find(x=>x.id===userMsg.id).status='delivered'; saveSession(m);
      // update UI status
      const node = document.querySelector(`article[data-id="${userMsg.id}"] .status`); if(node) node.textContent='✓';
    },400);
    setTimeout(()=>{ const m = loadSession(); m.find(x=>x.id===userMsg.id).status='read'; saveSession(m); const node = document.querySelector(`article[data-id="${userMsg.id}"] .status`); if(node) node.textContent='✓✓'; },1200);

    // assistant reply
    setTimeout(()=>{
      const r = assistantReplyFor(text);
      const assistantMsg = {id:crypto.randomUUID(),who:'assistant',text:r.text,lang:r.lang,ts:new Date().toISOString(),status:'delivered',quiz:r.quiz};
      pushMessage(assistantMsg);
    },800 + Math.random()*700);
  }
}

// Initialize when DOM is ready
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
