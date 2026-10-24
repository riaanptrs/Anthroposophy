import {applyDocumentedLanguageCorrections} from './editorial-language-exceptions.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {clarityRows as previousRows,clarityRoute} from './build-remaining-clarity.mjs';
import {wholeElement,esc} from './learning-html.mjs';
import {loadTheosophyCourse} from '../content/theosophy-guided.mjs';
import {thoughtInventory} from '../content/practical-thinking-revised.mjs';
import {higherWorlds} from '../content/higher-worlds.mjs';
const expected={'agriculture':Array.from({length:18},(_,i)=>i),'biodynamics':Array.from({length:24},(_,i)=>i+1),'what-is-biodynamics':Array.from({length:14},(_,i)=>i)};
const baseline='4f931f4';
const clarityRows=JSON.parse(fs.readFileSync('content/agriculture-clear-lessons.json','utf8'));
const depthCorrections=JSON.parse(fs.readFileSync('reviews/pedagogy/biodynamics-depth-corrections.json','utf8'));

for(const [course,ids]of Object.entries(expected))assert.deepEqual(clarityRows.filter(r=>r.course===course).map(r=>r.id),ids,course+' exact authored order');
for(const row of clarityRows){
 assert.equal(row.en.paragraphs.length,row.pt.paragraphs.length);
 for(const lang of ['en','pt']){
  const file=clarityRoute(row,lang),html=fs.readFileSync(file,'utf8'),v=row[lang];
  assert.equal(v.paragraphs.length,4,file);assert.equal(v.checks.length,2,file);
  const first=wholeElement(html,'<section class="batch-first-reading"');
  for(const s of [...v.paragraphs,...v.checks.flat()])assert.ok(typeof s==='string'&&s.trim()&&first.replace(/<a\b[^>]*>|<\/a>/g,'').includes(esc(s)),file+' complete new text');
  const original=applyDocumentedLanguageCorrections(execFileSync('git',['show',baseline+':'+file],{maxBuffer:4e6}).toString());
  const oldTag=original.match(/<main\b[^>]*>/)[0],oldMain=wholeElement(original,oldTag);
  const heading=oldMain.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)[0],nav=wholeElement(oldMain,oldMain.match(/<nav\b[^>]*class="[^"]*\blesson-navigation\b[^"]*"[^>]*>/)[0]);
  let oldInner=oldMain.slice(oldTag.length,-7).replace(heading,'').replace(nav,'');
  // Permit only the four recorded explanations added during the novice review;
  // everything else in the original detailed reading must still match exactly.
  for(const correction of depthCorrections.filter(c=>row.course==='biodynamics'&&c.lesson===row.id&&c.language===lang)){
   const old=esc(correction.old),replacement=esc(correction.new);
   assert.equal(oldInner.split(old).length,2,file+' unique documented depth correction');
   oldInner=oldInner.replace(old,replacement);
  }
  const depth=wholeElement(html,'<details class="batch-retained-depth"');
  assert.equal(depth.slice(depth.indexOf('</summary>')+10,-10),oldInner,file+' exact retained original content');
  assert.ok(html.includes(oldTag)&&html.includes(heading)&&html.includes(nav),file+' main hooks, title, navigation preserved');
  assert.ok(html.indexOf(first)<html.indexOf(depth)&&html.indexOf(depth)<html.indexOf(nav),file+' reading-depth-navigation order');
  if(v.relationshipTable){
   const table=wholeElement(first,'<table class="foundation-relationships"');
   for(const s of [v.relationshipTable.caption,...v.relationshipTable.headers,...v.relationshipTable.rows.flat()])assert.ok(table.replace(/<a\b[^>]*>|<\/a>/g,'').includes(esc(s)),file+' complete relationship table');
   assert.equal((table.match(/scope="col"/g)||[]).length,v.relationshipTable.headers.length);
   assert.equal((table.match(/scope="row"/g)||[]).length,v.relationshipTable.rows.length);
   assert.deepEqual(v.relationshipTable.rows.map(r=>r.length),row[lang==='pt'?'en':'pt'].relationshipTable.rows.map(r=>r.length));
  }
 }
}
console.log('Passed: 56 bilingual agriculture units, complete prose/answers and accessible relationship tables; 112 original detailed bodies preserved against 4f931f4 with documented teaching, language and provenance corrections.');
