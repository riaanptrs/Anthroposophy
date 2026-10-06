/* Progress only. Reuses the site's opt-in anthro-study-v1 schema across languages.
   Shared learning-system.js owns quizzes. No notebooks or network requests. */
(()=>{
 'use strict';
 const pt=document.documentElement.lang==='pt-BR',t=(en,br)=>pt?br:en;
 const prefix='anthro-study-v1:',course='esoteric-christianity-1',pref=prefix+'enabled';
 const valid=id=>/^ec1-(0[1-9]|1\d|2[0-4])$/.test(id);
 const root=document.querySelector('[data-ec-lesson]'),save=root?.querySelector('[data-ec-save]');
 const status=root?.querySelector('[data-ec-status]'),button=root?.querySelector('[data-ec-complete]');
 const get=k=>{try{return localStorage.getItem(k)}catch{return null}};
 const read=k=>{try{const raw=get(k);return raw===null?{}:JSON.parse(raw)}catch{return null}};
 const key=id=>prefix+course+'/'+id,lastKey=prefix+course+':last';
 const enabled=()=>get(pref)==='yes',object=v=>v&&typeof v==='object'&&!Array.isArray(v);
 let complete=false;
 function paint(){if(button){button.setAttribute('aria-pressed',String(complete));button.textContent=complete?t('Studied ✓ — mark unfinished','Estudada ✓ — marcar como não concluída'):t('Mark lesson studied','Marcar lição como estudada');}}
 function remember(){if(!root||!valid(root.dataset.ecLesson)||!enabled())return;try{localStorage.setItem(lastKey,JSON.stringify({id:root.dataset.ecLesson}));}catch{}}
 function render(){
  const saved=enabled(),completed=Array.from({length:24},(_,i)=>'ec1-'+String(i+1).padStart(2,'0')).filter(id=>saved&&read(key(id))?.complete===true);
  for(const row of document.querySelectorAll('[data-ec-row]')){const mark=row.querySelector('[data-ec-mark]');mark.hidden=!completed.includes(row.dataset.ecRow);mark.textContent=t('Studied ✓','Estudada ✓');}
  const summary=document.querySelector('[data-ec-progress]');if(summary)summary.textContent=saved?t(`${completed.length} of 24 marked studied on this device.`,`${completed.length} de 24 marcadas como estudadas neste dispositivo.`):t('Saving study marks is optional; enable it in a lesson.','Salvar marcações é opcional; ative numa lição.');
  const resume=document.querySelector('[data-ec-resume]'),last=saved?read(lastKey):null;
  if(resume){const id=valid(last?.id)?last.id:'ec1-01';resume.setAttribute('href','lessons/'+id+'.html');}
 }
 if(root&&valid(root.dataset.ecLesson)){
  const id=root.dataset.ecLesson;
  if(enabled())complete=read(key(id))?.complete===true;
  save.checked=enabled();paint();remember();
  status.textContent=t('Marks are optional. Saving uses this browser and is shared between course languages.','Marcações são opcionais. O salvamento usa este navegador e é compartilhado entre os idiomas.');
  function persist(){
   if(!enabled())return;
   const previous=read(key(id));
   if(!object(previous)){status.textContent=t('The saved record could not be read and was left intact. This visit’s mark remains available.','O registro salvo não pôde ser lido e foi preservado. A marcação desta visita continua disponível.');return;}
   try{localStorage.setItem(key(id),JSON.stringify({...previous,complete}));remember();status.textContent=t('Study mark saved on this device.','Marcação salva neste dispositivo.');}catch{status.textContent=t('Saving is unavailable. The mark is kept for this visit.','Salvamento indisponível. A marcação permanece nesta visita.');}
  }
  save.addEventListener('change',()=>{try{if(save.checked)localStorage.setItem(pref,'yes');else localStorage.removeItem(pref);}catch{save.checked=enabled();status.textContent=t('Could not change saving.','Não foi possível alterar o salvamento.');return;}
   if(save.checked){persist();}else status.textContent=t('Saving is off. Existing study marks remain stored.','Salvamento desativado. As marcações anteriores permanecem armazenadas.');render();});
  button.addEventListener('click',()=>{complete=!complete;paint();persist();if(!enabled())status.textContent=t('Changed for this visit. Enable saving to keep the mark.','Alterada nesta visita. Ative o salvamento para conservar.');render();});
 }
 render();window.addEventListener('pageshow',()=>{remember();render();});
 window.addEventListener('storage',event=>{if(!event.key||event.key.startsWith(prefix)){if(root){save.checked=enabled();if(enabled()){complete=read(key(root.dataset.ecLesson))?.complete===true;paint();}}render();}});
})();
