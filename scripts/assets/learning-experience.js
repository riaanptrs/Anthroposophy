/* Reading preferences are optional, tab-local and independent of saved study notes. */
(() => {
 'use strict';
 function enhance(){
  const body=document.body,main=document.querySelector('main'),h1=main?.querySelector('h1');
  if(!h1||!body.hasAttribute('data-visual-identity')||document.querySelector('.reader-tools'))return;
  let workspaceLesson=false;try{workspaceLesson=JSON.parse(document.getElementById('cw-data')?.textContent||'{}').role==='lesson';}catch{}
  const isLesson=workspaceLesson||body.classList.contains('tw-lesson')||!!document.querySelector('[data-study-id],[data-intro-study-id],[data-phases-lesson],[data-freedom-study],.cp-building,.cp-lesson,.cp-synthesis,.thought-practice,.ec-lesson,.wf-lesson');
  if(!isLesson||location.pathname.endsWith('/print.html')||body.classList.contains('cw-overview'))return;
  const pt=document.documentElement.lang==='pt-BR',say=(a,b)=>pt?b:a;
  const make=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;};
  const bar=make('div','reader-tools');bar.setAttribute('role','group');bar.setAttribute('aria-label',say('Reading preferences','Preferências de leitura'));
  const options=make('details'),summary=make('summary','',say('Aa · Reading options','Aa · Opções de leitura'));options.append(summary);
  const buttons=make('div','reader-size-buttons'),normal=make('button','',say('Standard text','Texto padrão')),large=make('button','',say('Larger text','Texto maior'));
  const status=make('p','reader-status',say('Applies to reading text. Your notes are unchanged.','Aplica-se ao texto de leitura. Suas notas permanecem iguais.'));status.setAttribute('role','status');
  for(const b of [normal,large]){b.type='button';buttons.append(b);}options.append(buttons,status);
  const focus=make('button','reader-focus-toggle',say('Focus reading','Focar na leitura'));focus.type='button';focus.setAttribute('aria-pressed','false');
  function size(value,save=false){body.dataset.readerSize=value;normal.setAttribute('aria-pressed',String(value==='standard'));large.setAttribute('aria-pressed',String(value==='large'));if(save)try{sessionStorage.setItem('anthroposophy:reading-size',value);}catch{} }
  normal.addEventListener('click',()=>size('standard',true));large.addEventListener('click',()=>size('large',true));
  let saved;try{saved=sessionStorage.getItem('anthroposophy:reading-size');}catch{}size(saved==='large'?'large':'standard');
  function setFocus(on){body.classList.toggle('reader-focus',on);focus.setAttribute('aria-pressed',String(on));focus.textContent=on?say('Exit focus · Esc','Sair do foco · Esc'):say('Focus reading','Focar na leitura');}
  focus.addEventListener('click',()=>{const on=!body.classList.contains('reader-focus');setFocus(on);if(on){document.querySelector('dialog[open]')?.close();h1.scrollIntoView({block:'start'});}focus.focus({preventScroll:true});});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&body.classList.contains('reader-focus')){setFocus(false);focus.focus({preventScroll:true});}});
  window.addEventListener('beforeprint',()=>{if(body.classList.contains('reader-focus')){body.dataset.restoreReaderFocus='true';setFocus(false);}});
  window.addEventListener('afterprint',()=>{if(body.dataset.restoreReaderFocus){delete body.dataset.restoreReaderFocus;setFocus(true);}});
  bar.append(options,focus);
  const existing=document.querySelector('.cw-section-links');(existing||h1).after(bar);
  // The toolbar already supplies the course position; preserve but suppress conflicting legacy counters.
  if(body.classList.contains('cw-lesson'))for(const e of main.querySelectorAll('.learning-context'))e.hidden=true;
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance,{once:true});else enhance();
})();
