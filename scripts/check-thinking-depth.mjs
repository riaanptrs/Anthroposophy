import fs from 'node:fs';
import assert from 'node:assert/strict';
import {thinkingDepth,thinkingRoute} from '../content/thinking-depth.mjs';
const source='https://rsarchive.org/Lectures/GA108/English/Singles/19090118p02.html';
let steps=0;
for(const lang of ['en','pt']){
 const base=lang==='pt'?'docs/pt':'docs';
 const index=fs.readFileSync(`${base}/practical-thinking/index.html`,'utf8');
 assert.equal((index.match(/id="exercise-map"/g)||[]).length,1);
 for(const [, ,id] of thinkingRoute[lang])assert.ok(index.includes(`href="lessons/${String(id).padStart(2,'0')}.html"`));
 for(const entry of thinkingDepth){
  const file=`${base}/practical-thinking/lessons/${String(entry.id).padStart(2,'0')}.html`,h=fs.readFileSync(file,'utf8');
  const core=h.indexOf('id="study-explanation"'),depth=h.indexOf('id="thinking-depth"'),practice=h.indexOf('class="practice"');
  assert.ok(core>=0&&core<depth&&depth<practice,file+' must teach before independent practice');
  assert.match(h,/<details class="guided-reveal" open/);
  assert.equal((h.match(/class="guided-depth-answer"/g)||[]).length,entry[lang].length);
  assert.ok(h.includes(source)&&h.includes('thinking-depth.css'));
  for(const step of entry[lang])assert.ok(step.length===6&&step.every(t=>typeof t==='string'&&t.trim()));
  for(const field of ['first','session1','session2','session3'])assert.ok(h.includes(`data-note-field="${field}"`),file+' missing preserved note field');
  steps+=entry[lang].length;
 }
 const last=fs.readFileSync(`${base}/practical-thinking/lessons/09.html`,'utf8');
 assert.ok(last.includes('38–48')&&last.includes('§ 48'),'Conclusion assignment must include the quoted passage');
}
console.log(`Passed: 20 bilingual lessons, ${steps} guided explanation/answer blocks, teaching before practice, source coverage and preserved notes.`);
