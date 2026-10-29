(()=>{'use strict';
// Both languages use the existing lesson IDs and storage record. Changing the
// interface language never migrates, clears or replaces a learner's notebook.
const key='anthroposophy-esoteric-social-v1';
const pt=(document.documentElement?.lang||'en').toLowerCase().startsWith('pt');
const text=pt?{
 progress:count=>`${count} de 16 lições marcadas como concluídas neste navegador.`,
 unavailable:'O armazenamento do navegador não está disponível. Copie suas notas antes de sair desta página.',
 saved:'Salvo neste navegador.',saveFailed:'Não foi possível salvar. Copie suas notas antes de sair.',
 progressSaved:'Progresso salvo neste navegador.',progressFailed:'Não foi possível salvar o progresso.',
 lesson:id=>`Lição ${id}`,complete:' · marcada como concluída',empty:'Nenhuma reflexão salva ainda.',
 exportTitle:'# O aspecto esotérico da questão social — Meu caderno',exportComplete:' (marcada como concluída)',
 exportEmpty:'Nenhuma reflexão salva.',exportReady:'O download do caderno está pronto.',filename:'esoteric-social-meu-caderno.md'
}:{
 progress:count=>`${count} of 16 lessons marked complete on this browser.`,
 unavailable:'Browser storage is unavailable. Copy your notes before leaving this page.',
 saved:'Saved in this browser.',saveFailed:'Could not save. Copy your notes before leaving.',
 progressSaved:'Progress saved in this browser.',progressFailed:'Could not save progress.',
 lesson:id=>`Lesson ${id}`,complete:' · marked complete',empty:'No reflection saved yet.',
 exportTitle:'# The Esoteric Aspect of the Social Question — My workbook',exportComplete:' (marked complete)',
 exportEmpty:'No reflection saved.',exportReady:'Workbook download prepared.',filename:'esoteric-social-my-workbook.md'
};
let data={notes:{},complete:{}},available=true;
try{const value=JSON.parse(localStorage.getItem(key)||'null');if(value&&typeof value==='object')data={notes:value.notes||{},complete:value.complete||{}};}catch{available=false;}
const save=()=>{try{localStorage.setItem(key,JSON.stringify(data));return true;}catch{return false;}};
const progress=document.querySelector('[data-es-progress]');
if(progress){progress.hidden=false;progress.textContent=text.progress(Object.values(data.complete).filter(Boolean).length);}
for(const area of document.querySelectorAll('[data-es-notebook]')){
 area.hidden=false;
 const input=area.querySelector('[data-es-note]'),done=area.querySelector('[data-es-complete]'),status=area.querySelector('[data-es-save-status]');
 input.value=typeof data.notes[input.dataset.esNote]==='string'?data.notes[input.dataset.esNote]:'';
 done.checked=!!data.complete[done.dataset.esComplete];
 if(!available)status.textContent=text.unavailable;
 input.addEventListener('input',()=>{data.notes[input.dataset.esNote]=input.value;status.textContent=save()?text.saved:text.saveFailed;});
 done.addEventListener('change',()=>{data.complete[done.dataset.esComplete]=done.checked;status.textContent=save()?text.progressSaved:text.progressFailed;});
}
const workbook=document.querySelector('[data-es-workbook]');
if(workbook){
 workbook.hidden=false;
 const list=workbook.querySelector('[data-es-saved]');
 for(let id=1;id<=16;id++){
  const section=document.createElement('section'),heading=document.createElement('h3'),paragraph=document.createElement('p');
  heading.textContent=text.lesson(id)+(data.complete[id]?text.complete:'');
  paragraph.textContent=data.notes[id]||text.empty;
  section.append(heading,paragraph);list.append(section);
 }
 workbook.querySelector('[data-es-export]').addEventListener('click',()=>{
  const contents=[text.exportTitle,...Array.from({length:16},(_,i)=>`\n## ${text.lesson(i+1)}${data.complete[i+1]?text.exportComplete:''}\n\n${data.notes[i+1]||text.exportEmpty}`)].join('\n');
  const url=URL.createObjectURL(new Blob([contents],{type:'text/markdown;charset=utf-8'}));
  const anchor=document.createElement('a');anchor.href=url;anchor.download=text.filename;
  document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  workbook.querySelector('[data-es-export-status]').textContent=text.exportReady;
 });
}
})();