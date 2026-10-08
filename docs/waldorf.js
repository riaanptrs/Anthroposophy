/* Course-topic filtering and optional reading marks follow the site's local-only
   study pattern. The separate namespace preserves every other course's records. */
(() => {
 'use strict';
 const pt=document.documentElement.lang.startsWith('pt');
 const say=(en,br)=>pt?br:en;
 const cards=[...document.querySelectorAll('[data-wf-item]')],search=document.querySelector('[data-wf-search]'),filter=document.querySelector('[data-wf-filter]');
 const controls=document.querySelector('[data-wf-filters]'),results=document.querySelector('[data-wf-results]');
 if(controls&&search&&filter) {
  controls.hidden=false;
  const update=()=>{
   const q=search.value.trim().toLowerCase();let count=0;
   for(const card of cards) {card.hidden=Boolean((filter.value&&card.dataset.wfGroup!==filter.value)||(q&&!card.textContent.toLowerCase().includes(q)));if(!card.hidden)count++;}
   results.textContent=count?say(`${count} of ${cards.length} topics shown.`,`${count} de ${cards.length} temas exibidos.`):say('No matching topics. Try another search or section.','Nenhum tema encontrado. Tente outra busca ou seção.');
  };
  search.addEventListener('input',update);filter.addEventListener('change',update);update();
 }
 // Stacked tables preserve column labels, also when JavaScript is unavailable:
 // labels are rendered into the HTML by the builder. No layout code needed here.
 const prefix='anthro-waldorf-v1:',preference=prefix+'enabled';
 const get=key=>{try{return localStorage.getItem(key);}catch{return null;}};
 const put=(key,value)=>{try{localStorage.setItem(key,value);return true;}catch{return false;}};
 const remove=key=>{try{localStorage.removeItem(key);return true;}catch{return false;}};
 const refresh=()=>{for(const span of document.querySelectorAll('[data-wf-progress]'))span.textContent=get(preference)==='yes'&&get(prefix+span.dataset.wfProgress)==='read'?say('Lesson read on this device','Lição lida neste dispositivo'):'';};
 refresh();
 const study=document.querySelector('[data-wf-study]');if(!study)return;
 const save=study.querySelector('[data-wf-save]'),mark=study.querySelector('[data-wf-mark]'),del=study.querySelector('[data-wf-delete]'),status=study.querySelector('[data-wf-study-status]');
 const key=prefix+study.dataset.wfStudy;let read=get(preference)==='yes'&&get(key)==='read';
 save.checked=get(preference)==='yes';for(const control of [save,mark,del])control.disabled=false;
 const paint=()=>{mark.setAttribute('aria-pressed',String(read));mark.textContent=read?say('Lesson read — mark unread','Lição lida — marcar como não lida'):say('Mark lesson as read','Marcar lição como lida');refresh();};
 save.addEventListener('change',()=>{
  const ok=put(preference,save.checked?'yes':'no');
  if(ok&&save.checked) {if(read)put(key,'read');else remove(key);}
  status.textContent=ok?(save.checked?say('Reading marks will be saved on this device.','As marcações serão salvas neste dispositivo.'):say('Saving paused. Use “Delete this reading mark” to remove an existing mark.','Salvamento pausado. Use “Apagar esta marcação” para remover uma marcação existente.')):say('Browser storage is unavailable. Marks last for this visit only.','O armazenamento está indisponível. As marcações valem apenas nesta visita.');paint();
 });
 mark.addEventListener('click',()=>{
  read=!read;const ok=!save.checked||(read?put(key,'read'):remove(key));paint();
  status.textContent=ok?(save.checked?say('Reading mark saved on this device.','Marcação salva neste dispositivo.'):say('Reading mark set for this visit only; saving is off.','Marcação definida apenas nesta visita; o salvamento está desativado.')):say('Browser storage is unavailable. Mark set for this visit only.','Armazenamento indisponível. Marcação definida apenas nesta visita.');
 });
 del.addEventListener('click',()=>{const ok=remove(key);read=false;paint();status.textContent=ok?say('This saved reading mark was deleted.','A marcação salva foi apagada.'):say('Browser storage is unavailable.','O armazenamento do navegador está indisponível.');});
 window.addEventListener('storage',()=>{save.checked=get(preference)==='yes';read=save.checked&&get(key)==='read';paint();});paint();
})();
