// lms/app.js — core LMS dashboard wiring
// Modularized and documented; imports feature modules from /lms/modules

import {loadSubjects, saveSubjects, reorderSubjects} from './modules/subjects.js';
import {initAnalytics} from './modules/analytics.js';

/** Boot the dashboard: render subjects and wire interactions */
async function boot(){
  const subjectsEl = document.getElementById('subjects');
  const tpl = document.getElementById('subject-card-template');
  const subjects = loadSubjects();

  function render(){
    subjectsEl.innerHTML='';
    subjects.forEach((s,i)=>{
      const node = tpl.content.cloneNode(true);
      const article = node.querySelector('article');
      article.dataset.id = s.id; article.setAttribute('aria-grabbed','false');
      const title = node.querySelector('.subject-title'); title.textContent = s.title;
      const level = node.querySelector('.level'); level.textContent = `Mastery ${Math.round(s.mastery*100)}%`;
      const streak = node.querySelector('.streak'); streak.textContent = `Streak ${s.streak||0}`;
      const ring = node.querySelector('.fg');
      const circumference = 2*Math.PI*16;
      const offset = circumference * (1 - s.mastery);
      ring.style.strokeDasharray = `${circumference}`;
      ring.style.strokeDashoffset = `${offset}`;

      // drag interactions
      article.addEventListener('dragstart',e=>{
        e.dataTransfer.setData('text/plain',s.id);
        article.setAttribute('aria-grabbed','true');
        setTimeout(()=>article.classList.add('placeholder'),10);
      });
      article.addEventListener('dragend',()=>{ article.setAttribute('aria-grabbed','false'); article.classList.remove('placeholder'); });

      article.addEventListener('dragover',e=>{ e.preventDefault(); });
      article.addEventListener('drop',e=>{
        e.preventDefault(); const draggedId = e.dataTransfer.getData('text/plain');
        const targetId = s.id; reorderSubjects(subjects,draggedId,targetId); saveSubjects(subjects); render();
      });

      // start lesson
      const startBtn = node.querySelector('.start-lesson');
      startBtn.addEventListener('click',()=>{
        // open lesson UI (delegated to lessons module later)
        alert(`Start lesson: ${s.title}`);
      });

      subjectsEl.appendChild(node);
    });
  }

  render();
  // init analytics with subject data
  initAnalytics(subjects);

  // Accessibility: keyboard reordering
  subjectsEl.addEventListener('keydown',e=>{
    const focused = document.activeElement.closest('.subject-card'); if(!focused) return;
    if(e.key==='ArrowLeft' || e.key==='ArrowUp'){
      const id = focused.dataset.id; reorderSubjects(subjects,id,null,'up'); saveSubjects(subjects); render();
    }
    if(e.key==='ArrowRight' || e.key==='ArrowDown'){
      const id = focused.dataset.id; reorderSubjects(subjects,id,null,'down'); saveSubjects(subjects); render();
    }
  });

  // register service worker for PWA (if available)
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/lms/sw.js').catch(err=>console.warn('SW registration failed',err));
  }
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
