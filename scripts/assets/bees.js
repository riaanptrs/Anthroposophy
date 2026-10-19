(() => {
 'use strict';
 const root=document.querySelector('[data-bees-course]');if(!root)return;
 const pt=root.dataset.beesLang==='pt',t=(a,b)=>pt?b:a;
 root.querySelectorAll('[data-bees-check]').forEach(button=>{
  const box=button.closest('fieldset'),q=JSON.parse(box.querySelector('[data-bees-answer]').textContent),status=box.querySelector('[data-bees-feedback]');
  button.addEventListener('click',()=>{const choice=box.querySelector('input:checked');status.textContent=choice?q.feedback[Number(choice.value)]:t('Choose an option first.','Escolha uma opção primeiro.');});
  box.querySelector('[data-bees-retry]').addEventListener('click',()=>{box.querySelectorAll('input').forEach(x=>x.checked=false);status.textContent='';box.querySelector('input')?.focus();});
 });
 const article=root.querySelector('[data-bees-lesson]'),save=root.querySelector('[data-bees-save]');if(!article||!save)return;
 const id=article.dataset.beesLesson,lang=pt?'pt':'en',prefix='anthro-bees-v1:',note=root.querySelector('[data-bees-note]'),mark=root.querySelector('[data-bees-mark]'),status=root.querySelector('[data-bees-status]');
 let enabled=false,studied=false,available=true;
 const announce=text=>{status.textContent=text;};
 const unavailable=()=>{available=false;enabled=false;save.checked=false;announce(t('Device saving is unavailable. You can still write and export notes.','O salvamento está indisponível. Você ainda pode escrever e exportar notas.'));};
 function read(key){try{return localStorage.getItem(prefix+key);}catch{unavailable();return null;}}
 function set(key,value){try{localStorage.setItem(prefix+key,value);return true;}catch{unavailable();return false;}}
 function paint(){mark.setAttribute('aria-pressed',String(studied));mark.textContent=studied?t('Lesson studied','Lição estudada'):t('Mark lesson studied','Marcar lição estudada');}
 enabled=read('enabled')==='yes';save.checked=enabled;
 if(enabled){note.value=read(`note:${lang}:${id}`)||'';studied=read(`mark:${id}`)==='yes';}
 paint();
 save.addEventListener('change',()=>{
  if(save.checked){if(set('enabled','yes')){enabled=true;available=true;if(set(`note:${lang}:${id}`,note.value)&&set(`mark:${id}`,studied?'yes':'no'))announce(t('Saving enabled for this course on this device.','Salvamento ativado para este curso neste dispositivo.'));}}
  else {enabled=false;try{Object.keys(localStorage).filter(k=>k.startsWith(prefix)).forEach(k=>localStorage.removeItem(k));announce(t('Saved Bees notes and marks removed. The current note remains here until you leave.','Notas e marcações de Abelhas removidas. A nota atual permanece aqui até você sair.'));}catch{unavailable();}}
 });
 note.addEventListener('input',()=>{if(enabled&&set(`note:${lang}:${id}`,note.value))announce(t('Note saved on this device.','Nota salva neste dispositivo.'));});
 mark.addEventListener('click',()=>{studied=!studied;paint();if(enabled){if(set(`mark:${id}`,studied?'yes':'no'))announce(t('Study mark saved.','Marcação salva.'));}else announce(available?t('Study mark changed for this visit. Enable saving to retain it.','Marcação alterada nesta visita. Ative o salvamento para mantê-la.'):t('Device saving is unavailable; this mark lasts for this visit.','Salvamento indisponível; a marcação dura nesta visita.'));});
 root.querySelector('[data-bees-export]').addEventListener('click',()=>{
  const entries=[];if(enabled)for(let i=1;i<=23;i++){const text=read(`note:${lang}:${i}`);if(text)entries.push({id:i,text});}
  const current=entries.find(x=>x.id===Number(id));if(current)current.text=note.value;else if(note.value)entries.push({id:Number(id),text:note.value});
  entries.sort((a,b)=>a.id-b.id);const text=[t('# Bees course notes','# Anotações do curso de abelhas'),...entries.map(x=>`## ${t('Lesson','Lição')} ${x.id}\n\n${x.text}`)].join('\n\n');
  const url=URL.createObjectURL(new Blob([text],{type:'text/markdown;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=`bees-notes-${lang}.md`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);announce(t('Notes exported. Keep the downloaded copy.','Notas exportadas. Guarde a cópia baixada.'));
 });
})();
