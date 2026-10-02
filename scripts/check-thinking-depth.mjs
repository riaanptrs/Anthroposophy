import fs from 'node:fs';
import assert from 'node:assert/strict';
import {thinkingDepth,thinkingRoute} from '../content/thinking-depth.mjs';
import {cloudGuide} from '../content/thinking-cloud-guide.mjs';
import {esc} from './learning-html.mjs';
import {validatePracticalThinking} from './check-practical-thinking.mjs';
// The original depth bank remains available. Concise source-first lessons now
// have their own fidelity contract; useful introductions and cloud study are
// rendered as optional study instead of ten mandatory repeated walkthroughs.
validatePracticalThinking();
assert.deepEqual(thinkingDepth.map(l=>l.id),Array.from({length:10},(_,i)=>i));
let steps=0;
for(const lang of ['en','pt']){
 const base=lang==='pt'?'docs/pt':'docs';
 const tools=fs.readFileSync(`${base}/practical-thinking/tools.html`,'utf8');
 assert.equal((tools.match(/id="exercise-map"/g)||[]).length,1);
 for(const [difficulty,instruction,id] of thinkingRoute[lang]){
  assert.ok(difficulty.trim()&&instruction.trim()&&Number.isInteger(id)&&id>=0&&id<10,'Preserve original exercise-selection source data');
  assert.ok(fs.existsSync(`${base}/practical-thinking/lessons/${String(id).padStart(2,'0')}.html`),'Original exercise destination remains accessible');
 }
 for(const entry of thinkingDepth){
  for(const step of entry[lang])assert.ok(step.length===6&&step.every(t=>typeof t==='string'&&t.trim()),'Retained depth data '+entry.id);
  if(entry.id<2)for(const [heading,meaning,example] of entry[lang])for(const text of [heading,meaning,example])assert.ok(tools.includes(esc(text)),'Retained optional introduction '+entry.id);
  steps+=entry[lang].length;
 }
 const cloud=cloudGuide[lang];
 assert.ok(tools.includes('id="cloud-guide"')&&tools.includes(esc(cloud.title)));
 for(const [heading,meaning] of cloud.steps)for(const text of [heading,meaning])assert.ok(tools.includes(esc(text)),'Retained cloud-study explanation');
}
console.log(`Passed: 12 revised bilingual core lessons plus forecasting, ${steps} retained bilingual depth-data blocks, optional introductory examples and cloud study, source-first teaching and stable exercise destinations.`);
