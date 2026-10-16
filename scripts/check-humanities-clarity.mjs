import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {clarityRows as previousRows,clarityRoute} from './build-remaining-clarity.mjs';
import {wholeElement,esc} from './learning-html.mjs';
import {loadTheosophyCourse} from '../content/theosophy-guided.mjs';
import {thoughtInventory} from '../content/practical-thinking-revised.mjs';
import {higherWorlds} from '../content/higher-worlds.mjs';
const expected={'according-to-luke':Array.from({length:12},(_,i)=>i),'ancient-myths':Array.from({length:8},(_,i)=>i),'encountering-the-self':Array.from({length:17},(_,i)=>i),'learn/esoteric-christianity':Array.from({length:24},(_,i)=>'ec1-'+String(i+1).padStart(2,'0')),'colour':Array.from({length:14},(_,i)=>i),'toward-threefold-society':Array.from({length:7},(_,i)=>i)};
const baseline='7da2cf5';
const clarityRows=JSON.parse(fs.readFileSync('content/humanities-clear-lessons.json','utf8'));

for(const [course,ids]of Object.entries(expected))assert.deepEqual(clarityRows.filter(r=>r.course===course).map(r=>r.id),ids,course+' exact authored order');
for(const row of clarityRows){
 assert.equal(row.en.paragraphs.length,row.pt.paragraphs.length);
 for(const lang of ['en','pt']){
  const file=clarityRoute(row,lang),html=fs.readFileSync(file,'utf8'),v=row[lang];
  assert.equal(v.paragraphs.length,4,file);assert.equal(v.checks.length,2,file);
  const first=wholeElement(html,'<section class="batch-first-reading"');
  for(const s of [...v.paragraphs,...v.checks.flat()])assert.ok(typeof s==='string'&&s.trim()&&first.replace(/<a\b[^>]*>|<\/a>/g,'').includes(esc(s)),file+' complete new text');
  const original=execFileSync('git',['show',baseline+':'+file],{maxBuffer:4e6}).toString();
  const oldTag=original.match(/<main\b[^>]*>/)[0],oldMain=wholeElement(original,oldTag);
  const heading=oldMain.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)[0],nav=wholeElement(oldMain,oldMain.match(/<nav\b[^>]*class="[^"]*\b(?:lesson-navigation|ec-prev-next)\b[^"]*"[^>]*>/)[0]);
  const oldInner=oldMain.slice(oldTag.length,-7).replace(heading,'').replace(nav,'');
  const depth=wholeElement(html,'<details class="batch-retained-depth"');
  assert.equal(depth.slice(depth.indexOf('</summary>')+10,-10),oldInner,file+' exact retained original content');
  assert.ok(html.includes(oldTag)&&html.includes(heading)&&html.includes(nav),file+' main hooks, title, navigation preserved');
  assert.ok(html.indexOf(first)<html.indexOf(depth)&&html.indexOf(depth)<html.indexOf(nav),file+' reading-depth-navigation order');
 }
}
console.log('Passed: 82 bilingual humanities units, complete first readings and explained answers; 164 original bodies preserved against 7da2cf5.');
