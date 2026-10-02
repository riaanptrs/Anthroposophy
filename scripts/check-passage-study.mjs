import fs from 'node:fs';
import assert from 'node:assert/strict';
import {isPracticalThinkingOwned} from './practical-thinking-owned.mjs';

const expected={'theosophy':23,'higher-worlds':19,'philosophy-of-freedom':22,'practical-thinking':10,'understanding-temperaments':12,'according-to-luke':12,'colour':14,'temperaments':11,'understand-temperament':13,'encountering-the-self':17,'ancient-myths':8,'meditation':9,'mystery-temperaments':15};
const passages=JSON.parse(fs.readFileSync('content/passage-study.json','utf8'));
const assigned=new Set();
for(const p of passages){
 assert.ok(Object.hasOwn(expected,p.course),'Unknown course '+p.course);
 for(const key of ['author','title','locator','edition','original','originalLanguage'])assert.ok(p[key]?.trim(),p.course+' missing '+key);
 assert.ok(['de','en'].includes(p.originalLanguage));
 if(p.url)assert.equal(new URL(p.url).protocol,'https:');
 for(const lang of ['en','pt'])for(const key of ['quote','note']){
  assert.ok(p[lang][key]?.trim(),p.course+' missing '+lang+' '+key);
  assert.ok(!p[lang][key].includes('\uFFFD'),'Damaged source text');
 }
 for(const id of p.ids){
  assert.ok(Number.isInteger(id)&&id>=0&&id<expected[p.course]);
  const identity=p.course+'/'+id;
  assert.ok(!assigned.has(identity),'Repeated lesson '+identity);assigned.add(identity);
 }
}
let checked=0;
for(const [course,total] of Object.entries(expected))for(let id=0;id<total;id++){
 assert.ok(assigned.has(course+'/'+id),'Missing passage for '+course+'/'+id);
 for(const lang of ['en','pt']){
  const base=lang==='en'?'docs':'docs/pt',number=String(id).padStart(2,'0');
  const file=course==='theosophy'?`${base}/lessons/${number}.html`:course==='meditation'?`${base}/meditation/${number}.html`:`${base}/${course}/lessons/${number}.html`;
  const h=fs.readFileSync(file,'utf8');
  // The historical bank remains authoritative for its beginner-course consumers.
  // Revised Theosophy uses a separately verified primary-edition passage bank.
  if(course==='theosophy'){
   assert.ok(h.includes('data-theosophy-owned="true"'),file+' missing guided Theosophy reading');
   checked++;
   continue;
  }
  // All ten historical assignments remain registered. The revised course has
  // its own verified Adams excerpts; do not reapply the older German translations.
  if(course==='practical-thinking'){
   assert.ok(isPracticalThinkingOwned(file.slice(5),h),file+' missing scoped Practical source reading');
   assert.ok(h.includes('data-thought-source')&&h.includes('19090118p02.html'),file+' missing revised source assignment');
   checked++;
   continue;
  }
  assert.equal((h.match(/id="book-passage"/g)||[]).length,1,file);
  const passage=h.indexOf('id="book-passage"'),meaning=h.indexOf('class="passage-explanation"');
  assert.ok(passage<meaning&&meaning>0,file+' missing close reading');
  assert.ok(h.includes('class="source-excerpt"')&&h.includes('class="passage-credit"'),file+' missing source or attribution');
  if(course!=='meditation'){
   const core=h.indexOf('id="study-explanation"'),example=h.indexOf('class="worked-example"'),attempt=h.indexOf('data-note-field="first"');
   assert.ok(meaning<core&&core<example&&example<attempt,file+' must teach before asking for an answer');
   assert.match(h,/<details class="guided-reveal" open\b/,file+' hidden teaching');
  }
  checked++;
 }
}
assert.equal(checked,370);
console.log(`Passed: all thirteen historical source collections, ${assigned.size} retained assignments and ${checked} bilingual routes; legacy source credits and reading-before-practice order. Revised Theosophy and Practical Thinking have separate primary-source checks.`);
