import {applyDocumentedLanguageCorrections} from './editorial-language-exceptions.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {clarityRows as previousRows,clarityRoute} from './build-remaining-clarity.mjs';
import {wholeElement,esc} from './learning-html.mjs';
import {loadTheosophyCourse} from '../content/theosophy-guided.mjs';
import {thoughtInventory} from '../content/practical-thinking-revised.mjs';
import {higherWorlds} from '../content/higher-worlds.mjs';
const expected={'foundations':Array.from({length:36},(_,i)=>i+1),'introduction-to-anthroposophy':Array.from({length:28},(_,i)=>i+1),'meditation':Array.from({length:9},(_,i)=>i)};
const baseline='d00ff60';
const clarityRows=JSON.parse(fs.readFileSync('content/foundations-introduction-clear-lessons.json','utf8'));

for(const [course,ids]of Object.entries(expected))assert.deepEqual(clarityRows.filter(r=>r.course===course).map(r=>r.id),ids,course+' exact authored order');
for(const row of clarityRows){
 assert.equal(row.en.paragraphs.length,row.pt.paragraphs.length);
 for(const lang of ['en','pt']){
  const file=clarityRoute(row,lang),html=fs.readFileSync(file,'utf8'),v=row[lang];
  const count=row.course==='introduction-to-anthroposophy'&&row.id===1?7:4;
  assert.equal(v.paragraphs.length,count,file);assert.equal(v.checks.length,2,file);
  const first=wholeElement(html,'<section class="batch-first-reading"');
  for(const s of [...v.paragraphs,...v.checks.flat()])assert.ok(typeof s==='string'&&s.trim()&&first.replace(/<a\b[^>]*>|<\/a>/g,'').includes(esc(s)),file+' complete new text');
  const original=applyDocumentedLanguageCorrections(execFileSync('git',['show',baseline+':'+file],{maxBuffer:4e6}).toString());
  const oldTag=original.match(/<main\b[^>]*>/)[0],oldMain=wholeElement(original,oldTag);
  const heading=oldMain.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)[0],nav=wholeElement(oldMain,oldMain.match(/<nav\b[^>]*class="[^"]*\blesson-navigation\b[^"]*"[^>]*>/)[0]);
  const oldInner=oldMain.slice(oldTag.length,-7).replace(heading,'').replace(nav,'');
  const depth=wholeElement(html,'<details class="batch-retained-depth"');
  if(row.course==='foundations'){
   assert.equal(v.paragraphHeadings.length,v.paragraphs.length,file+' explained steps');
   for(const title of v.paragraphHeadings)assert.ok(first.includes(`<h2>${esc(title)}</h2>`),file+' step heading');
   const context=wholeElement(html,'<section class="foundation-orientation"');
   assert.ok(context.replace(/<a\b[^>]*>|<\/a>/g,'').includes(esc(v.goal)),file+' visible learning question');
   if(row.id>1)assert.ok(context.includes(`href="${String(row.id-1).padStart(2,'0')}.html"`),file+' prerequisite');
   const next=wholeElement(html,'<section class="foundation-next"');
   assert.ok(next&&html.indexOf(next)<html.indexOf(depth),file+' continuation before optional sources');
   if(row.id<36)assert.ok(next.includes(`href="${String(row.id+1).padStart(2,'0')}.html"`),file+' visible next lesson');
   // Foundations now permits audited teaching repairs. Preserve source evidence,
   // stable navigation and study hooks against the deployed pre-revision version.
   const deployed=execFileSync('git',['show','0424fb1a79f3965eb059e230b6a0bb3f17087471:'+file],{maxBuffer:4e6}).toString();
   for(const tag of ['<section class="learning-source"','<details class="guided-deep-study"'])
    assert.equal(wholeElement(html,tag),wholeElement(deployed,tag),file+' preserved source evidence '+tag);
   const ids=[...deployed.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
   for(const id of ids)assert.ok(html.includes(`id="${id}"`),file+' retained anchor '+id);
   for(const href of [...deployed.matchAll(/\bhref="([^"]+)"/g)].map(m=>m[1]))assert.ok(html.includes(`href="${href}"`),file+' retained link '+href);
   for(const hook of ['data-learning-id','data-learning-save','data-learning-note','data-learning-complete','data-learning-export','data-learning-delete'])assert.ok(html.includes(hook),file+' study hook '+hook);
   if(v.relationshipTable){
    const table=wholeElement(first,'<table class="foundation-relationships"');assert.ok(table,file+' relationship aid');
    for(const s of [v.relationshipTable.caption,...v.relationshipTable.headers,...v.relationshipTable.rows.flat()])assert.ok(table.replace(/<a\b[^>]*>|<\/a>/g,'').includes(esc(s)),file+' complete table text');
    assert.equal((table.match(/scope="col"/g)||[]).length,2);assert.equal((table.match(/scope="row"/g)||[]).length,v.relationshipTable.rows.length);
    assert.deepEqual(v.relationshipTable.rows.map(r=>r.length),row[lang==='pt'?'en':'pt'].relationshipTable.rows.map(r=>r.length));
   }
  }else assert.equal(depth.slice(depth.indexOf('</summary>')+10,-10),oldInner,file+' exact retained original content');
  assert.ok(html.includes(oldTag)&&html.includes(heading)&&html.includes(nav),file+' main hooks, title, navigation preserved');
  assert.ok(html.indexOf(first)<html.indexOf(depth)&&html.indexOf(depth)<html.indexOf(nav),file+' reading-depth-navigation order');
 }
}
console.log('Passed: 73 bilingual units in exact course order; complete prose and two explained questions each; 72 Foundations pages preserve source evidence, links, anchors and study hooks against deployed 0424fb1, with accessible bilingual relationship aids. All 74 Introduction/Meditation bodies remain exact against d00ff60.');
