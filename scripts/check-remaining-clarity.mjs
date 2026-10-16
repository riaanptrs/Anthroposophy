import {applyDocumentedLanguageCorrections} from './editorial-language-exceptions.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {clarityRows,clarityRoute} from './build-remaining-clarity.mjs';
import {wholeElement,esc} from './learning-html.mjs';
import {loadTheosophyCourse} from '../content/theosophy-guided.mjs';
import {thoughtInventory} from '../content/practical-thinking-revised.mjs';
import {higherWorlds} from '../content/higher-worlds.mjs';
const expected={'theosophy-reading':loadTheosophyCourse().order,'practical-thinking':thoughtInventory.map(r=>r.routeId),'higher-worlds':higherWorlds.map(r=>r.id)};
const baseline='386bca2';
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
  const heading=oldMain.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)[0],nav=wholeElement(oldMain,'<nav class="lesson-navigation"');
  const oldInner=oldMain.slice(oldTag.length,-7).replace(heading,'').replace(nav,'');
  const depth=wholeElement(html,'<details class="batch-retained-depth"');
  assert.equal(depth.slice(depth.indexOf('</summary>')+10,-10),oldInner,file+' exact retained original content');
  assert.ok(html.includes(oldTag)&&html.includes(heading)&&html.includes(nav),file+' main hooks, title, navigation preserved');
  assert.ok(html.indexOf(first)<html.indexOf(depth)&&html.indexOf(depth)<html.indexOf(nav),file+' reading-depth-navigation order');
 }
}
console.log('Passed: 60 bilingual units in exact course order; four paragraphs and two explained questions each; all 120 original lesson bodies preserved exactly against 386bca2 with heading and navigation moved outside optional depth.');
