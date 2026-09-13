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
if(!root)return;
const id=root.dataset.studyId,lang=pt?'pt':'en',key='anthro-study-v1:'+id;
const status=root.querySelector('[data-note-status]'),saveBox=root.querySelector('[data-save-notes]');
const fields=[...root.querySelectorAll('[data-note-field]')];
let complete=false,timer,dirty=false;
const announce=t=>{status.textContent=t};
const completeButton=root.querySelector('[data-complete]');
function paintComplete(){completeButton.textContent=complete?say('Studied ✓ — mark unfinished','Estudada ✓ — marcar como não concluída'):say('Mark lesson studied','Marcar lição como estudada');completeButton.setAttribute('aria-pressed',String(complete));}
function remember(){if(enabled())put('anthro-study-v1:last',JSON.stringify({url:location.href.split('#')[0],title:document.querySelector('h1').textContent,course:id.split('/')[0]}));}
function save(){
 if(!saveBox.checked||!dirty)return;
 const previous=read(key)||{},notes=Object.fromEntries(fields.map(f=>[f.dataset.noteField,f.value]));
 const ok=put(key,JSON.stringify({...previous,[lang]:notes,complete,updated:new Date().toISOString()}));
 if(ok){dirty=false;remember();announce(say('Saved on this device.','Salvo neste dispositivo.'));}
 else {announce(say('Saving is unavailable. Your text remains here; export a copy before leaving.','Não foi possível salvar. Seu texto continua aqui; exporte uma cópia antes de sair.'));}
}
saveBox.checked=enabled();
const stored=enabled()?read(key):null;
if(enabled()&&!stored)announce(say('Saving is enabled on this device. Begin writing to save a note.','O salvamento está ativado neste dispositivo. Comece a escrever para salvar uma anotação.'));
if(stored&&typeof stored==='object'){for(const f of fields)if(typeof stored[lang]?.[f.dataset.noteField]==='string')f.value=stored[lang][f.dataset.noteField];complete=!!stored.complete;announce(say('Your notes were restored from this device.','Suas anotações foram recuperadas deste dispositivo.'));}
function compare(){const first=fields.find(f=>f.dataset.noteField==='first');root.querySelector('[data-first-preview]').textContent=first.value||say('No first attempt recorded yet.','Nenhuma primeira tentativa registrada ainda.');}
paintComplete();remember();compare();
saveBox.addEventListener('change',()=>{
 if(saveBox.checked){if(!put(pref,'yes')){saveBox.checked=false;announce(say('Storage is unavailable; use Export notes.','O armazenamento não está disponível; use Exportar anotações.'));return;}dirty=true;save();}
 else {remove(pref);announce(say('Automatic saving is off. Existing notes remain until you delete them.','O salvamento automático está desativado. As anotações existentes permanecem até você excluí-las.'));}
});
for(const f of fields)f.addEventListener('input',()=>{dirty=true;compare();clearTimeout(timer);timer=setTimeout(save,450)});
window.addEventListener('pagehide',save);
completeButton.addEventListener('click',()=>{complete=!complete;dirty=true;paintComplete();save();if(!saveBox.checked)announce(say('Study mark changed for this visit. Enable saving to keep it.','Marcação alterada nesta visita. Ative o salvamento para conservá-la.'));});
root.querySelector('[data-export]').addEventListener('click',()=>{
 const labels={first:say('First attempt','Primeira tentativa'),source:say('Reading connection','Ligação com a leitura'),after:say('Revised answer','Resposta revisada')};
 const text=document.querySelector('h1').textContent+'\n'+location.href.split('#')[0]+'\n\n'+fields.map(f=>labels[f.dataset.noteField]+'\n'+f.value).join('\n\n');download(id.replaceAll('/','-')+'-'+lang+'-notes.txt',text);announce(say('Notes exported.','Anotações exportadas.'));
});
root.querySelector('[data-delete]').addEventListener('click',()=>{
 if(!remove(key)){announce(say('Could not delete saved notes. Try your browser’s site-data settings.','Não foi possível excluir as anotações salvas. Use as configurações de dados do site no navegador.'));return;}
 clearTimeout(timer);for(const f of fields)f.value='';complete=false;dirty=false;paintComplete();compare();announce(say('Notes for this lesson were deleted in both languages.','As anotações desta lição foram excluídas nos dois idiomas.'));
});
root.querySelector('[data-reading-view]').addEventListener('click',e=>{
 const full=!document.body.classList.contains('study-full');document.body.classList.toggle('study-full',full);
 for(const d of root.querySelectorAll('details.guided-reveal'))d.open=full;
 e.currentTarget.textContent=full?say('Return to guided view','Voltar ao modo guiado'):say('Open complete explanation','Abrir explicação completa');e.currentTarget.setAttribute('aria-pressed',String(full));
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
