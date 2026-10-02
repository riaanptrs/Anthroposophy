import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import test from 'node:test';

// Exercise the published controller's input, consent, lifecycle and delete handlers.
// The small DOM/storage adapters keep this regression check dependency-free.
const scriptFile=process.argv[2]||fileURLToPath(new URL('../docs/guided-study.v1.js',import.meta.url));
const script=fs.readFileSync(scriptFile,'utf8');
const preference='anthro-study-v1:enabled',key='anthro-study-v1:understanding-temperaments/01';
const names=['first','source','after','session1','session2','session3'];
const original={
 en:{first:'English first attempt',source:'English source connection',after:'English revision',session1:'Earlier practice',unknown:{kept:true}},
 pt:{first:'Primeira tentativa',source:'Ligação com a fonte',after:'Resposta revisada',session1:'Prática anterior',unknown:{kept:true}},
 complete:true,updated:'2026-01-01T00:00:00.000Z',unknown:{kept:'record metadata'}
};
class Storage{
 constructor(raw=JSON.stringify(original),saving=true){this.values=new Map([[key,raw]]);if(saving)this.values.set(preference,'yes');}
 getItem(name){if(this.failReads)throw Error('Storage unavailable');return this.values.get(name)??null;}
 setItem(name,value){if(this.failWrites)throw Error('Storage full');this.values.set(name,String(value));}
 removeItem(name){if(this.failRemovals)throw Error('Storage unavailable');this.values.delete(name);}
 record(){return JSON.parse(this.values.get(key));}
}
class Element{
 constructor(dataset={}){this.dataset=dataset;this.value='';this.checked=false;this.textContent='';this.attributes=new Map();this.listeners=new Map();}
 addEventListener(name,callback){const callbacks=this.listeners.get(name)||[];callbacks.push(callback);this.listeners.set(name,callbacks);}
 dispatch(name,event={}){for(const callback of this.listeners.get(name)||[])callback({currentTarget:this,target:this,...event});}
 setAttribute(name,value){this.attributes.set(name,String(value));}
 remove(){}
 click(){this.dispatch('click');}
}
function page(language,storage=new Storage()){
 const fields=Object.fromEntries(names.map(name=>[name,new Element({noteField:name})]));
 const controls=Object.fromEntries(['note-status','save-notes','complete','first-preview','export','delete','reading-view'].map(name=>[name,new Element()]));
 const root=new Element({studyId:'understanding-temperaments/01'});
 root.querySelector=selector=>controls[selector.match(/^\[data-(.+)\]$/)?.[1]]||null;
 root.querySelectorAll=selector=>selector==='[data-note-field]'?Object.values(fields):[];
 const timers=new Map(),downloads=[],events=new Element();let nextTimer=0;
 const classList={add(){},contains(){return false;},toggle(){return false;}};
 const document={
  documentElement:{lang:language==='pt'?'pt-BR':'en',classList},
  querySelector:selector=>selector==='[data-study-id]'?root:selector==='h1'?{textContent:'Practice lesson'}:null,
  createElement:()=>new Element(),body:{append(){},classList}
 };
 class BrowserURL extends URL{
  static createObjectURL(blob){downloads.push(blob);return 'blob:notebook-test';}
  static revokeObjectURL(){}
 }
 const location={href:`https://example.test/${language==='pt'?'pt/':''}understanding-temperaments/lessons/01.html`,pathname:`/${language==='pt'?'pt/':''}understanding-temperaments/lessons/01.html`};
 vm.runInNewContext(script,{document,window:events,localStorage:storage,location,URL:BrowserURL,Blob,
  setTimeout:callback=>{const id=++nextTimer;timers.set(id,callback);return id;},clearTimeout:id=>timers.delete(id)}, {filename:path.basename(scriptFile)});
 return {fields,controls,storage,timers,downloads,
  consent(checked){controls['save-notes'].checked=checked;controls['save-notes'].dispatch('change');},
  input(name,value){fields[name].value=value;fields[name].dispatch('input');},
  flush(){for(const [id,callback] of [...timers]){timers.delete(id);callback();}},
  lifecycle(name,event){events.dispatch(name,event);},
  complete(){controls.complete.click();},delete(){controls.delete.click();},
  marked(){return controls.complete.attributes.get('aria-pressed')==='true';}
 };
}
for(const language of ['en','pt']){
 test(`${language}: disabling, reopening and re-enabling restores notes without rewriting them`,()=>{
  const storage=new Storage(),first=page(language,storage);
  first.consent(false);
  const reopened=page(language,storage),raw=storage.values.get(key);
  assert.equal(reopened.fields.first.value,'');
  reopened.consent(true);
  assert.equal(storage.values.get(key),raw);
  for(const name of ['first','source','after','session1'])assert.equal(reopened.fields[name].value,original[language][name]);
  assert.equal(reopened.marked(),true);
 });
 test(`${language}: edits made while saving is off merge with untouched and unknown saved fields`,()=>{
  const storage=new Storage(JSON.stringify(original),false),lesson=page(language,storage);
  lesson.input('first','New attempt');lesson.input('session3','New practice');lesson.flush();
  assert.deepEqual(storage.record(),original);
  lesson.consent(true);
  const expected=structuredClone(original);expected[language].first='New attempt';expected[language].session3='New practice';
  const result=storage.record();delete result.updated;delete expected.updated;
  assert.deepEqual(result,expected);assert.equal(lesson.marked(),true);
  assert.equal(lesson.fields.source.value,original[language].source);
 });
 test(`${language}: intentionally clearing one note preserves the other notes and completion`,()=>{
  const lesson=page(language);lesson.input('first','');lesson.flush();
  assert.equal(lesson.storage.record()[language].first,'');
  assert.equal(lesson.storage.record()[language].source,original[language].source);
  assert.equal(lesson.storage.record().complete,true);
  assert.deepEqual(lesson.storage.record()[language].unknown,original[language].unknown);
 });
 test(`${language}: a pending edit flushes before opt-out and later off-session edits remain unsaved`,()=>{
  const lesson=page(language);lesson.input('source','Pending edit');lesson.consent(false);
  assert.equal(lesson.storage.record()[language].source,'Pending edit');assert.equal(lesson.timers.size,0);
  const raw=lesson.storage.values.get(key);lesson.input('after','Off-session edit');lesson.flush();lesson.lifecycle('pagehide');
  assert.equal(lesson.storage.values.get(key),raw);
  lesson.consent(true);assert.equal(lesson.storage.record()[language].after,'Off-session edit');
  assert.equal(lesson.storage.record()[language].source,'Pending edit');
 });
 test(`${language}: completion changes only after an explicit toggle`,()=>{
  const saved=structuredClone(original);saved.complete=false;
  const lesson=page(language,new Storage(JSON.stringify(saved),false));
  lesson.complete();lesson.input('first','New attempt');lesson.consent(true);
  assert.equal(lesson.storage.record().complete,true);
  lesson.complete();assert.equal(lesson.storage.record().complete,false);
  lesson.input('source','New connection');lesson.flush();assert.equal(lesson.storage.record().complete,false);
 });
 test(`${language}: note saving merges the latest untouched fields and completion`,()=>{
  const lesson=page(language);lesson.input('first','Local edit');
  const concurrent=structuredClone(original);concurrent[language].source='Changed in another tab';concurrent.complete=false;
  lesson.storage.setItem(key,JSON.stringify(concurrent));lesson.flush();
  assert.equal(lesson.storage.record()[language].first,'Local edit');
  assert.equal(lesson.storage.record()[language].source,'Changed in another tab');
  assert.equal(lesson.storage.record().complete,false);assert.equal(lesson.marked(),false);
 });
 test(`${language}: corrupt records survive consent, input and page exit until explicit deletion`,()=>{
  for(const raw of ['{broken','null','[]',JSON.stringify({en:'not a notebook'}),JSON.stringify({pt:null})]){
   const lesson=page(language,new Storage(raw,false));lesson.input('first','Recoverable new text');lesson.consent(true);lesson.flush();lesson.lifecycle('pagehide');
   assert.equal(lesson.storage.values.get(key),raw);assert.equal(lesson.fields.first.value,'Recoverable new text');
   assert.match(lesson.controls['note-status'].textContent,/kept unchanged|ele foi mantido/);
   lesson.delete();assert.equal(lesson.storage.values.has(key),false);
   lesson.input('first','A fresh note after explicit deletion');lesson.flush();
   assert.equal(lesson.storage.record()[language].first,'A fresh note after explicit deletion');
  }
 });
 test(`${language}: blocked storage keeps text exportable and retries without losing old notes`,async()=>{
  const storage=new Storage(JSON.stringify(original),false),lesson=page(language,storage);
  lesson.input('first','Unsaved text');storage.failWrites=true;lesson.consent(true);
  assert.equal(lesson.controls['save-notes'].checked,false);assert.equal(lesson.fields.first.value,'Unsaved text');
  assert.deepEqual(storage.record(),original);
  lesson.controls.export.click();assert.match(await lesson.downloads[0].text(),/Unsaved text/);
  storage.failWrites=false;storage.failReads=true;lesson.consent(true);lesson.flush();
  assert.equal(storage.values.get(key),JSON.stringify(original));
  storage.failReads=false;lesson.consent(true);assert.equal(storage.record()[language].first,'Unsaved text');
  assert.equal(storage.record()[language].source,original[language].source);
 });
 test(`${language}: deleting cancels pending saves and removes both languages without resurrection`,()=>{
  const lesson=page(language);lesson.input('first','Pending edit');lesson.delete();lesson.flush();lesson.lifecycle('pagehide');
  assert.equal(lesson.storage.values.has(key),false);assert.equal(lesson.marked(),false);
  assert.ok(Object.values(lesson.fields).every(field=>field.value===''));
 });
 test(`${language}: failed automatic writes retain edits for retry and report an unsaved opt-out`,()=>{
  const lesson=page(language),raw=lesson.storage.values.get(key);
  lesson.input('first','Edit while storage is full');lesson.storage.failWrites=true;lesson.flush();
  assert.equal(lesson.storage.values.get(key),raw);assert.equal(lesson.fields.first.value,'Edit while storage is full');
  assert.match(lesson.controls['note-status'].textContent,/export a copy|exporte uma cópia/);
  lesson.consent(false);assert.equal(lesson.controls['save-notes'].checked,false);
  assert.match(lesson.controls['note-status'].textContent,/latest edits could not be saved|últimas alterações/);
  lesson.storage.failWrites=false;lesson.consent(true);
  assert.equal(lesson.storage.record()[language].first,'Edit while storage is full');
 });
 test(`${language}: storage read denial during an active session retains edits and announces export`,()=>{
  const lesson=page(language),raw=lesson.storage.values.get(key);
  lesson.input('first','Edit before read access was blocked');lesson.storage.failReads=true;lesson.flush();
  assert.equal(lesson.storage.values.get(key),raw);assert.equal(lesson.fields.first.value,'Edit before read access was blocked');
  assert.match(lesson.controls['note-status'].textContent,/export a copy|exporte uma cópia/);
  lesson.storage.failReads=false;lesson.lifecycle('pagehide');
  assert.equal(lesson.storage.record()[language].first,'Edit before read access was blocked');
 });
 test(`${language}: failed deletion keeps the notebook and visible edits intact`,()=>{
  const lesson=page(language),raw=lesson.storage.values.get(key);lesson.input('first','Visible unsaved edit');
  lesson.storage.failRemovals=true;lesson.delete();
  assert.equal(lesson.storage.values.get(key),raw);assert.equal(lesson.fields.first.value,'Visible unsaved edit');
  assert.match(lesson.controls['note-status'].textContent,/Could not delete|Não foi possível excluir/);
 });
 test(`${language}: opt-out in another tab stops automatic saving but keeps local edits for later consent`,()=>{
  const lesson=page(language),raw=lesson.storage.values.get(key);
  lesson.storage.removeItem(preference);lesson.lifecycle('storage',{key:preference});
  assert.equal(lesson.controls['save-notes'].checked,false);
  lesson.input('first','Local work after remote opt-out');lesson.flush();assert.equal(lesson.storage.values.get(key),raw);
  lesson.consent(true);assert.equal(lesson.storage.record()[language].first,'Local work after remote opt-out');
 });
 test(`${language}: another tab's delete cannot be undone by a pending timer or page exit`,async()=>{
  const storage=new Storage(),first=page(language,storage),second=page(language,storage);
  second.input('first','An unsaved draft in a second tab');first.delete();
  second.lifecycle('storage',{key,newValue:null});second.flush();second.lifecycle('pagehide');
  assert.equal(storage.values.has(key),false);assert.equal(second.marked(),false);
  assert.equal(second.fields.first.value,'An unsaved draft in a second tab');assert.equal(second.fields.source.value,'');
  second.controls.export.click();assert.match(await second.downloads[0].text(),/An unsaved draft in a second tab/);
  second.input('source','A deliberate fresh edit after deletion');second.flush();
  assert.equal(storage.record()[language].first,'An unsaved draft in a second tab');
  assert.equal(storage.record()[language].source,'A deliberate fresh edit after deletion');
  assert.equal(Object.hasOwn(storage.record(),language==='en'?'pt':'en'),false);
  assert.equal(Object.hasOwn(storage.record(),'complete'),false);
 });
}
