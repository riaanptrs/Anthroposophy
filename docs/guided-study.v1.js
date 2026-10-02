/* Authored study tools; no server requests, analytics or automatic free-text grading. */
(()=>{
'use strict';
document.documentElement.classList.add('study-js');
const pt=document.documentElement.lang==='pt-BR',say=(en,br)=>pt?br:en;
const pref='anthro-study-v1:enabled',root=document.querySelector('[data-study-id]');
const get=k=>{try{return localStorage.getItem(k)}catch{return null}};
const read=k=>{try{return JSON.parse(get(k)||'null')}catch{return null}};
const put=(k,v)=>{try{localStorage.setItem(k,v);return true}catch{return false}};
const remove=k=>{try{localStorage.removeItem(k);return true}catch{return false}};
const enabled=()=>get(pref)==='yes';
function download(name,text){const u=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000);}
function safeLesson(url){try{const u=new URL(url,location.href);const scope=location.pathname.includes('/Anthroposophy/')?'/Anthroposophy/':'/';return u.origin===location.origin&&u.pathname.startsWith(scope)&&/\/lessons\/\d{2}\.html$/.test(u.pathname)?u:null}catch{return null}}
const resume=document.querySelector('[data-study-resume]');
if(resume&&enabled()){
 const last=read('anthro-study-v1:last'),u=last&&safeLesson(last.url);
 if(u){const a=document.createElement('a');a.href=u.href;a.textContent=say('Resume: ','Continuar: ')+last.title;resume.replaceChildren(a);resume.hidden=false;}
}
const journal=document.querySelector('[data-course-journal]');
if(journal){
 const course=journal.dataset.courseJournal,lang=pt?'pt':'en',entries=journal.querySelector('[data-journal-entries]');
 const labels={first:say('First attempt','Primeira tentativa'),source:say('Reading connection','Ligação com a leitura'),after:say('Revised answer','Resposta revisada'),session1:say('Practice session 1','Sessão prática 1'),session2:say('Practice session 2','Sessão prática 2'),session3:say('Practice session 3','Sessão prática 3')};
 function collect(){return enabled()?[...document.querySelectorAll('[data-practice-lesson]')].flatMap(row=>{
  const lesson=String(row.dataset.practiceLesson).padStart(2,'0'),saved=read('anthro-study-v1:'+course+'/'+lesson),notes=saved?.[lang];
  if(!notes||!Object.values(notes).some(v=>typeof v==='string'&&v.trim()))return [];
  return [{title:row.querySelector('h3').textContent,url:row.querySelector('h3 a').href,notes}];
 }):[];}
 function render(){entries.replaceChildren();const saved=collect();journal.querySelector('[data-journal-export]').disabled=saved.length===0;
  if(!saved.length){const p=document.createElement('p');p.textContent=say('No saved entries are available here yet. Enable saving in a lesson to keep your practice notes.','Ainda não há anotações salvas disponíveis aqui. Ative o salvamento numa lição para conservar as notas práticas.');entries.append(p);}
  for(const e of saved){const d=document.createElement('details'),s=document.createElement('summary');s.textContent=e.title;d.append(s);const a=document.createElement('a');a.href=e.url;a.textContent=say('Open lesson','Abrir lição');d.append(a);
   for(const [key,label] of Object.entries(labels)){if(!e.notes[key])continue;const h=document.createElement('h3'),p=document.createElement('p');h.textContent=label;p.textContent=e.notes[key];p.style.whiteSpace='pre-wrap';d.append(h,p);}entries.append(d);}
 }
 render();window.addEventListener('pageshow',render);
 journal.querySelector('[data-journal-export]').addEventListener('click',()=>{const saved=collect();if(!saved.length){render();return;}download(course+'-'+lang+'-journal.txt',saved.map(e=>e.title+'\n'+e.url+'\n\n'+Object.entries(labels).filter(([k])=>e.notes[k]).map(([k,label])=>label+'\n'+e.notes[k]).join('\n\n')).join('\n\n---\n\n'));});
}
if(!root)return;
const id=root.dataset.studyId,lang=pt?'pt':'en',key='anthro-study-v1:'+id;
const status=root.querySelector('[data-note-status]'),saveBox=root.querySelector('[data-save-notes]');
const fields=[...root.querySelectorAll('[data-note-field]')];
let complete=false,timer,stateDirty=false,deletedElsewhere=false;
const editedFields=new Set();
const object=value=>value&&typeof value==='object'&&!Array.isArray(value);
const announce=t=>{status.textContent=t};
const completeButton=root.querySelector('[data-complete]');
function paintComplete(){completeButton.textContent=complete?say('Studied ✓ — mark unfinished','Estudada ✓ — marcar como não concluída'):say('Mark lesson studied','Marcar lição como estudada');completeButton.setAttribute('aria-pressed',String(complete));}
function remember(){if(enabled())put('anthro-study-v1:last',JSON.stringify({url:location.href.split('#')[0],title:document.querySelector('h1').textContent,course:id.split('/')[0]}));}
// Missing records may be created; unreadable records must survive until an explicit delete.
function notebook(){
 try{
  const raw=localStorage.getItem(key);
  if(raw===null)return {value:{},exists:false};
  let value;try{value=JSON.parse(raw)}catch{return {malformed:true}};
  if(!object(value)||['en','pt'].some(language=>Object.hasOwn(value,language)&&!object(value[language])))return {malformed:true};
  return {value,exists:true};
 }catch{return {unavailable:true}}
}
function compare(){const first=fields.find(f=>f.dataset.noteField==='first');root.querySelector('[data-first-preview]').textContent=first.value||say('No first attempt recorded yet.','Nenhuma primeira tentativa registrada ainda.');}
function storageProblem(stored){
 announce(stored.malformed
  ?say('The existing saved record could not be read and was kept unchanged. Export your text before leaving, or explicitly delete this lesson’s saved notes.','Não foi possível ler o registro salvo existente; ele foi mantido. Exporte seu texto antes de sair ou exclua explicitamente as anotações salvas desta lição.')
  :say('Saving is unavailable. Your text remains here; export a copy before leaving.','Não foi possível salvar. Seu texto continua aqui; exporte uma cópia antes de sair.'));
}
function restore(stored){
 if(!stored.value){storageProblem(stored);return false;}
 const notes=stored.value[lang]||{};
 for(const f of fields)if(!editedFields.has(f))f.value=typeof notes[f.dataset.noteField]==='string'?notes[f.dataset.noteField]:'';
 if(!stateDirty)complete=stored.value.complete===true;
 paintComplete();compare();return true;
}
function save(finishingSession=false){
 if(deletedElsewhere||(!saveBox.checked&&!finishingSession)||(!editedFields.size&&!stateDirty))return;
 clearTimeout(timer);
 let consent;try{consent=localStorage.getItem(pref)}catch{storageProblem({unavailable:true});return false;}
 if(consent!=='yes')return;
 const stored=notebook();
 if(!stored.value){storageProblem(stored);return false;}
 const updated={...stored.value,updated:new Date().toISOString()};
 if(editedFields.size){
  const notes={...stored.value[lang]};
  for(const f of editedFields)notes[f.dataset.noteField]=f.value;
  updated[lang]=notes;
 }
 if(stateDirty)updated.complete=complete;
 if(put(key,JSON.stringify(updated))){
  editedFields.clear();stateDirty=false;restore({value:updated});remember();announce(say('Saved on this device.','Salvo neste dispositivo.'));return true;
 }else {storageProblem({unavailable:true});return false;}
}
saveBox.checked=enabled();
if(saveBox.checked){
 const stored=notebook();
 if(restore(stored))announce(stored.exists?say('Your notes were restored from this device.','Suas anotações foram recuperadas deste dispositivo.'):say('Saving is enabled on this device. Begin writing to save a note.','O salvamento está ativado neste dispositivo. Comece a escrever para salvar uma anotação.'));
}
paintComplete();remember();compare();
saveBox.addEventListener('change',()=>{
 clearTimeout(timer);
 if(saveBox.checked){
  if(!put(pref,'yes')){saveBox.checked=false;announce(say('Storage is unavailable; use Export notes.','O armazenamento não está disponível; use Exportar anotações.'));return;}
  const stored=notebook();
  if(restore(stored)){
   deletedElsewhere=false;
   announce(say('Saving is enabled on this device.','O salvamento está ativado neste dispositivo.'));
   save();remember();
  }
 }else{
  // Finish edits made while saving was on before changing the shared preference.
  const flushed=save(true);
  if(!remove(pref)){saveBox.checked=enabled();announce(say('The browser could not change the saving preference. Your text remains here.','O navegador não conseguiu mudar a preferência de salvamento. Seu texto continua aqui.'));return;}
  announce(flushed===false
   ?say('Automatic saving is off. Your latest edits could not be saved; export a copy before leaving.','O salvamento automático está desativado. Não foi possível salvar suas últimas alterações; exporte uma cópia antes de sair.')
   :say('Automatic saving is off. Existing notes remain until you delete them.','O salvamento automático está desativado. As anotações existentes permanecem até você excluí-las.'));
 }
});
for(const f of fields)f.addEventListener('input',()=>{deletedElsewhere=false;editedFields.add(f);compare();clearTimeout(timer);timer=setTimeout(save,450)});
window.addEventListener('pagehide',()=>save());
window.addEventListener('storage',event=>{
 if(event.key!==null&&event.key!==pref&&event.key!==key)return;
 saveBox.checked=enabled();
 if(event.key===key&&event.newValue===null){
  // A stale editor must not undo an explicit deletion in another tab.
  clearTimeout(timer);deletedElsewhere=true;stateDirty=false;restore({value:{}});
  announce(say('Saved notes were deleted in another tab. Any unsaved text remains here; export it before leaving. A new edit starts a new saved note.','As anotações salvas foram excluídas em outra aba. O texto não salvo continua aqui; exporte-o antes de sair. Uma nova alteração inicia uma nova anotação salva.'));
  return;
 }
 if(saveBox.checked)restore(notebook());
 else {clearTimeout(timer);announce(say('Automatic saving is off. Existing notes remain until you delete them.','O salvamento automático está desativado. As anotações existentes permanecem até você excluí-las.'));}
});
completeButton.addEventListener('click',()=>{deletedElsewhere=false;complete=!complete;stateDirty=true;paintComplete();save();if(!saveBox.checked||!enabled())announce(say('Study mark changed for this visit. Enable saving to keep it.','Marcação alterada nesta visita. Ative o salvamento para conservá-la.'));});
root.querySelector('[data-export]').addEventListener('click',()=>{
 const labels={first:say('First attempt','Primeira tentativa'),source:say('Reading connection','Ligação com a leitura'),after:say('Revised answer','Resposta revisada'),session1:say('Practice session 1','Sessão prática 1'),session2:say('Practice session 2','Sessão prática 2'),session3:say('Practice session 3','Sessão prática 3')};
 const text=document.querySelector('h1').textContent+'\n'+location.href.split('#')[0]+'\n\n'+fields.map(f=>labels[f.dataset.noteField]+'\n'+f.value).join('\n\n');download(id.replaceAll('/','-')+'-'+lang+'-notes.txt',text);announce(say('Notes exported.','Anotações exportadas.'));
});
root.querySelector('[data-delete]').addEventListener('click',()=>{
 clearTimeout(timer);
 if(!remove(key)){announce(say('Could not delete saved notes. Try your browser’s site-data settings.','Não foi possível excluir as anotações salvas. Use as configurações de dados do site no navegador.'));return;}
 const last=read('anthro-study-v1:last'),lastUrl=last&&safeLesson(last.url);
 if(last?.course===id.split('/')[0]&&lastUrl&&Number(lastUrl.pathname.match(/\/lessons\/(\d{2})\.html$/)?.[1])===Number(id.split('/')[1]))remove('anthro-study-v1:last');
 for(const f of fields)f.value='';complete=false;editedFields.clear();stateDirty=false;deletedElsewhere=false;paintComplete();compare();announce(say('Notes for this lesson were deleted in both languages.','As anotações desta lição foram excluídas nos dois idiomas.'));
});
root.querySelector('[data-reading-view]').textContent=say('Open all study notes','Abrir todas as notas de estudo');
root.querySelector('[data-reading-view]').addEventListener('click',e=>{
 const full=!document.body.classList.contains('study-full');document.body.classList.toggle('study-full',full);
 for(const d of root.querySelectorAll('details.guided-reveal'))d.open=true;
 for(const d of root.querySelectorAll('details[data-deep-study]'))d.open=full;
 e.currentTarget.textContent=full?say('Return to reading view','Voltar ao modo de leitura'):say('Open all study notes','Abrir todas as notas de estudo');e.currentTarget.setAttribute('aria-pressed',String(full));
});
for(const lab of root.querySelectorAll('[data-lab]')){
 const type=lab.dataset.lab,out=lab.querySelector('[data-lab-output]');
 if(type==='arithmetic')lab.querySelector('button').addEventListener('click',()=>{
  const value=lab.querySelector('input').value;
  out.textContent=value.trim()===''?say('Try a number first, or open the worked explanation below.','Tente um número ou abra a explicação abaixo.'):
  Number(value)===5?say('5 is the result. Now explain the connections: 3 × 3 = 9; 9 + 1 = 10; 10 ÷ 2 = 5. Recalling 5 is different from reconstructing these steps.','5 é o resultado. Explique as ligações: 3 × 3 = 9; 9 + 1 = 10; 10 ÷ 2 = 5. Lembrar 5 difere de reconstruir os passos.'):
  Number(value)===9.5?say('9.5 fits the expression without the outer grouping. Here you divide the whole sum by two. Try again.','9,5 corresponde à expressão sem o agrupamento externo. Aqui, divida a soma inteira por dois. Tente de novo.'):
  say('Check one operation at a time. Multiply, add one to that result, then divide the whole result by two.','Confira uma operação por vez: multiplique, acrescente um ao resultado e divida o resultado inteiro por dois.');
 });
 if(type==='colour'){
  const patches=[...lab.querySelectorAll('.lab-patch')];
  lab.querySelector('[data-swap]').addEventListener('click',()=>{for(const p of patches)p.classList.toggle('edge');describe();});
  lab.querySelector('select').addEventListener('change',e=>{for(const p of patches)p.classList.toggle('blue',e.target.value==='blue');describe();});
  function describe(){patches.forEach((p,i)=>{const denseCentre=!p.classList.contains('edge');lab.querySelectorAll('figcaption')[i].textContent=(i?'B: ':'A: ')+(denseCentre?say('dense centre, pale edge','centro intenso, borda clara'):say('pale centre, dense edge','centro claro, borda intensa'));});out.textContent=say('The study changed. Describe your response; “no clear difference” is a valid observation.','O estudo mudou. Descreva sua resposta; “nenhuma diferença clara” é uma observação válida.');}
 }
 if(type==='dialogue')for(const b of lab.querySelectorAll('[data-reply]'))b.addEventListener('click',()=>{out.textContent=b.dataset.reply;});
 if(type==='reflection')lab.querySelector('button').addEventListener('click',e=>{const show=lab.querySelector('svg').classList.toggle('show-reflection');e.currentTarget.setAttribute('aria-pressed',String(show));out.textContent=show?say('Corresponding points lie equally far from the vertical axis on opposite sides. Explain one difference from your prediction.','Pontos correspondentes ficam a igual distância do eixo vertical, em lados opostos. Explique uma diferença em relação à previsão.'):say('The reflected curve is hidden. Predict three points before showing it again.','A curva refletida está oculta. Preveja três pontos antes de mostrá-la novamente.');});
}
})();
