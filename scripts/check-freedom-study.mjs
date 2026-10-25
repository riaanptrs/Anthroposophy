import fs from 'node:fs';
import assert from 'node:assert/strict';
import {esc,wholeElement,n} from './learning-html.mjs';
import {chapters,editions,supportingSections,glossary} from '../content/freedom-revision/reference.mjs';
const units=JSON.parse(fs.readFileSync('content/freedom-revision/units.json'));
assert.equal(units.length,36);
assert.deepEqual(units.map(l=>l.id),Array.from({length:36},(_,i)=>i+1));
assert.deepEqual([...new Set(units.map(l=>l.chapter))],Array.from({length:17},(_,i)=>i));
assert.equal(new Set(chapters.map(c=>c.parent)).size,16);
assert.equal(editions.wilson.captures,173);assert.equal(editions.amrine.captures,84);
const positions=s=>[...s.matchAll(/(\d+)(?:–(\d+))?/g)].flatMap(m=>Array.from({length:Number(m[2]||m[1])-Number(m[1])+1},(_,i)=>Number(m[1])+i));
for(const [name,column] of [['wilson',0],['amrine',1]]){
 const covered=new Set([...chapters.flatMap(c=>positions(c[name])),...supportingSections.flatMap(s=>positions(s[column]))]);
 assert.deepEqual([...covered].sort((a,b)=>a-b),Array.from({length:editions[name].captures},(_,i)=>i+1),name+' has unmapped capture positions');
}
assert.equal(chapters.find(c=>c.id===16).amrine,'—','Do not claim the abridgment includes the full 1918 appendix');
assert.equal(glossary.length,22);
let words=0;
for(const lang of ['en','pt']){
 const base=`docs/${lang==='pt'?'pt/':''}philosophy-of-freedom`;
 const index=fs.readFileSync(base+'/index.html','utf8');
 assert.ok(index.includes('36')&&index.includes('173')&&index.includes('84')&&index.includes('166'));
 const parentFiles=new Map([...new Set(chapters.map(c=>c.parent))].map(id=>[id,fs.readFileSync(`${base}/lessons/${n(id)}.html`,'utf8')]));
 for(const l of units){
  const c=chapters.find(c=>c.id===l.chapter),v=l[lang];
  assert.equal(v.steps.length,3);
  assert.ok(new Set(v.steps).size===3);
  const all=[...v.steps,v.example,v.question,v.answer,v.exercise];
  assert.ok(all.every(s=>typeof s==='string'&&s.trim()));words+=all.join(' ').split(/\s+/).length;
  const standalone=fs.readFileSync(`${base}/studies/${n(l.id)}.html`,'utf8');
  const parent=parentFiles.get(c.parent);
  const block=wholeElement(parent,`<section id="freedom-detailed-teaching"`);
  assert.ok(block,`Missing inline teaching ${lang}/${c.parent}`);
  for(const p of [...v.steps,v.example,v.question,v.answer,v.exercise])for(const html of [standalone,block])assert.ok(html.includes(esc(p)),`Missing full text ${lang}/${l.id}`);
  assert.ok(block.includes(c.wilson)&&block.includes(c.amrine),'Edition-specific source span lost');
  assert.ok(parent.indexOf('id="freedom-detailed-teaching"')<parent.indexOf('<div class="reading lesson-reading">'),'Detailed teaching should precede earlier reader');
  assert.equal((parent.match(new RegExp(`data-freedom-study="${l.id}"`,'g'))||[]).length,1);
  assert.ok(standalone.includes(`lessons/${n(c.parent)}.html#freedom-detailed-teaching`));
  const prev=l.id>1?`href="${n(l.id-1)}.html"`:null,next=l.id<36?`href="${n(l.id+1)}.html"`:null;
  if(prev)assert.ok(standalone.includes(prev));if(next)assert.ok(standalone.includes(next));
 }
 const printed=fs.readFileSync(base+'/print.html','utf8');assert.equal((printed.match(/class="freedom-model-answer"/g)||[]).length,36);
 const workbook=fs.readFileSync(base+'/workbook.html','utf8');assert.ok(workbook.includes('id="final-project"'));
 for(const p of parentFiles.values())assert.ok(p.includes('166')&&p.includes('173')&&p.includes('84'),'Retained reader must have clear witness distinction');
 for(let i=0;i<22;i++)assert.ok(fs.readFileSync(`${base}/lessons/${n(i)}.html`,'utf8').includes(`data-study-id="philosophy-of-freedom/${n(i)}"`),'Preserve notebook key');
}
assert.ok(words>17000,'Substantial complete bilingual teaching expected');
console.log(`Passed: 36 full bilingual studies, all book and editorial sections mapped across 173/84 captures, 16 expanded chapter stages, print answers and 22 preserved notebook identities; ${words} new teaching words.`);
