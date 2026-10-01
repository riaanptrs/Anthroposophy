import fs from 'node:fs';
import assert from 'node:assert/strict';
import {freedomLectureSources as sources,freedomLectureGuides as guides} from '../content/philosophy-of-freedom-lecture-guides.mjs';

const expected=Array.from({length:21},(_,id)=>id);
assert.deepEqual(guides.map(g=>g.id),expected,'Only lessons supported by this transcript batch receive new lecture guides');
assert.equal(sources.length,17);
assert.equal(new Set(sources.map(s=>s.key)).size,17);
assert.equal(sources.reduce((sum,s)=>sum+s.lines,0),11351);
assert.equal(sources.reduce((sum,s)=>sum+s.words,0),139362);
assert.ok(sources.some(s=>s.key==='chapter-08'&&s.sha256==='a19bf1f584e02705bbbf991383fe0e579bbfa5e31a94f57dc51719be873dc49f'&&s.lines===394),'Identify the recovered Chapter 8 source');
const registry=JSON.parse(fs.readFileSync('content/source-register.json','utf8'));
for(const s of sources){
 assert.match(s.sha256,/^[a-f0-9]{64}$/);
 assert.equal(s.contentsInRepository,false);
 assert.ok(registry.some(r=>r.sha256===s.sha256&&r.contents_in_repository===false&&r.lecturer==='Brian Gray'),'Missing source fingerprint or attribution');
 assert.match(s.timestampStart,/^\d\d:\d\d:\d\d$/);
 assert.match(s.timestampEnd,/^\d\d:\d\d:\d\d$/);
}
const keys=new Set(sources.map(s=>s.key));
assert.deepEqual([...new Set(guides.flatMap(g=>g.sourceKeys))].sort(),[...keys].sort(),'Every supplied transcript contributes to its relevant study guide');
const visible=s=>s.replace(/<[^>]*>/g,'').replace(/&(amp|lt|gt|quot|#39);/g,(_,e)=>({'amp':'&','lt':'<','gt':'>','quot':'"','#39':"'"}[e])).replace(/\s+/g,' ').trim();
let pages=0;
for(const guide of guides){
 assert.ok(guide.sourceKeys.length&&guide.sourceKeys.every(key=>keys.has(key)));
 for(const lang of ['en','pt']){
  const v=guide[lang];
  assert.equal(v.paragraphs.length,3);
  const file=`${lang==='en'?'docs':'docs/pt'}/philosophy-of-freedom/lessons/${String(guide.id).padStart(2,'0')}.html`;
  const html=fs.readFileSync(file,'utf8');
  assert.equal((html.match(/id="lecture-guide"/g)||[]).length,1,file+' duplicate or missing guide');
  const block=html.match(/<section class="source-note lecture-guide"[\s\S]*?<\/section>/)?.[0];
  assert.ok(block&&block.includes('Brian Gray'),file+' missing source voice');
  for(const text of [v.title,...v.paragraphs,v.example,v.question,v.answer])assert.ok(visible(block).includes(visible(text)),file+' lost lecture explanation, example or answer');
  assert.ok(block.includes('class="guided-answer"')&&block.includes('../index.html#lecture-sources'));
  for(const key of guide.sourceKeys){
   const s=sources.find(s=>s.key===key);
   assert.ok(visible(block).includes(s[lang])&&block.includes(s.timestampStart)&&block.includes(s.timestampEnd),file+' missing transcript locator');
  }
  assert.ok(html.indexOf('id="book-passage"')<html.indexOf('id="lecture-guide"'),'Read Steiner before the lecturer’s interpretation');
  assert.ok(!/system-audio_|Recording started|Started: 2026|Transcription is pending/.test(block),'Do not publish capture controls as teaching');
  pages++;
 }
}
for(const base of ['docs','docs/pt']){
 const index=fs.readFileSync(`${base}/philosophy-of-freedom/index.html`,'utf8');
 assert.equal((index.match(/id="lecture-sources"/g)||[]).length,1);
 assert.ok(index.includes('Brian Gray')&&index.includes('2012')&&index.includes('166'));
 for(const id of [21])assert.ok(!fs.readFileSync(`${base}/philosophy-of-freedom/lessons/${id}.html`,'utf8').includes('id="lecture-guide"'),'Unsupported chapter must retain its book-based lesson');
}
for(const name of ['source-review','notes-front-chapters1-2','notes-chapters3-4','notes-chapters5-7','notes-chapter8','notes-chapter9','notes-chapters10-14'])assert.ok(fs.existsSync(`content/philosophy-of-freedom-lecture-${name}.md`),'Missing source comparison notes');
console.log(`Passed: seventeen fingerprinted lecture sources, 11,351 recorded transcript lines, twenty-one bilingual guides, ${pages} lesson outputs, explained questions and preserved book precedence.`);
