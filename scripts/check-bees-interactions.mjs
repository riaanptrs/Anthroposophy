// Exercise the shipped script with a small DOM harness. This is not visual browser QA.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {lessons} from '../content/bees/course.mjs';
class Node{
 constructor(){this.events={};this.value='';this.checked=false;this.textContent='';this.attributes={};this.dataset={};}
 addEventListener(name,fn){this.events[name]=fn;}
 fire(name){this.events[name]?.();}
 setAttribute(name,v){this.attributes[name]=v;}
 focus(){this.focused=true;}
}
function load({lang='en',storage={},blocked=false,id=6}={}){
 const q=lessons[id-1][lang].check,radio=q.options.map((_,i)=>Object.assign(new Node(),{value:String(i)}));
 const check=new Node(),retry=new Node(),feedback=new Node(),data=Object.assign(new Node(),{textContent:JSON.stringify(q)});
 const box={querySelector:s=>s==='input:checked'?radio.find(x=>x.checked):s==='input'?radio[0]:s==='[data-bees-answer]'?data:s==='[data-bees-feedback]'?feedback:retry,querySelectorAll:()=>radio};check.closest=()=>box;
 const note=new Node(),save=new Node(),mark=new Node(),status=new Node(),exp=new Node(),article={dataset:{beesLesson:String(id)}};
 const selectors={'[data-bees-lesson]':article,'[data-bees-save]':save,'[data-bees-note]':note,'[data-bees-mark]':mark,'[data-bees-status]':status,'[data-bees-export]':exp};
 const root={dataset:{beesLang:lang},querySelector:s=>selectors[s],querySelectorAll:()=>[check]};
 const store=new Proxy(storage,{get(target,k){if(k==='getItem')return key=>target[key]??null;if(k==='setItem')return(key,value)=>target[key]=value;if(k==='removeItem')return key=>delete target[key];return target[k];}});
 let download;
 const context={document:{querySelector:()=>root,createElement:()=>({click(){download=true;}})},URL:{createObjectURL:()=>'',revokeObjectURL(){}},Blob,setTimeout:fn=>fn()};Object.defineProperty(context,'localStorage',{get(){if(blocked)throw Error('Blocked');return store;}});
 vm.runInNewContext(fs.readFileSync('scripts/assets/bees.js','utf8'),context);
 return {q,radio,check,retry,feedback,note,save,mark,status,exp,storage,get download(){return download;}};
}
const a=load({storage:{'another-course:note':'keep'}});
a.check.fire('click');assert.match(a.feedback.textContent,/Choose/);
for(let i=0;i<3;i++){a.radio.forEach(r=>r.checked=false);a.radio[i].checked=true;a.check.fire('click');assert.equal(a.feedback.textContent,a.q.feedback[i]);}
a.retry.fire('click');assert.ok(a.radio.every(r=>!r.checked));assert.equal(a.feedback.textContent,'');
a.note.value='An unsaved observation';a.note.fire('input');assert.equal(Object.keys(a.storage).length,1,'No writing without opt-in');
a.save.checked=true;a.save.fire('change');assert.equal(a.storage['anthro-bees-v1:note:en:6'],a.note.value);
a.mark.fire('click');assert.equal(a.mark.attributes['aria-pressed'],'true');
const b=load({lang:'pt',storage:a.storage});assert.equal(b.mark.attributes['aria-pressed'],'true','Study marks cross language');assert.equal(b.note.value,'','Notes keep their language');
b.note.value='Uma observação';b.note.fire('input');assert.equal(a.storage['anthro-bees-v1:note:en:6'],'An unsaved observation');
a.exp.fire('click');assert.ok(a.download,'Export offered');
a.save.checked=false;a.save.fire('change');assert.deepEqual(a.storage,{'another-course:note':'keep'},'Only Bees data removed');
const c=load({blocked:true,lang:'pt'});c.save.checked=true;c.save.fire('change');assert.match(c.status.textContent,/indisponível/);c.radio[c.q.answer].checked=true;c.check.fire('click');assert.equal(c.feedback.textContent,c.q.feedback[c.q.answer]);c.note.value='Ainda disponível';c.exp.fire('click');assert.ok(c.download,'Export remains usable without storage');
console.log('Bees interaction harness passed: option-specific feedback, retry, opt-in persistence, bilingual mark continuity, separate notes, export, scoped deletion and blocked storage. Visual browser behavior remains unverified.');
