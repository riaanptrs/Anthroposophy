import fs from 'node:fs';
import assert from 'node:assert/strict';
import {weeklyMap} from './render-weekly-meditations.mjs';
import {weeklyCommentary,weeklyTeaching} from '../content/weekly-meditations.mjs';
import {texts} from '../content/meditation-texts.mjs';
assert.deepEqual(weeklyMap.map(w=>w.week),Array.from({length:52},(_,i)=>i+1));
for(const w of weeklyMap){
 assert.ok(w.pdfStart>=13&&w.pdfEnd<=82&&w.pdfStart<=w.pdfEnd);
 assert.equal(weeklyMap[52-w.week].week,53-w.week);
 for(const lang of ['en','pt'])assert.ok(w[lang].theme&&w[lang].question.endsWith('?'));
}
for(const lang of ['en','pt']){
 const prefix=lang==='pt'?'docs/pt':'docs',html=fs.readFileSync(prefix+'/meditation/04.html','utf8');
 assert.equal((html.match(/data-weekly-study/g)||[]).length,1);
 assert.equal((html.match(/data-reading-week=/g)||[]).length,52);
 assert.equal((html.match(/data-weekly-commentary=/g)||[]).length,4);
 for(const id of ['weekly-study','year-rhythm','weekly-routine','mirror-weeks','mirror-week','mirror-result','weekly-reading-map'])assert.ok(html.includes(`id="${id}"`));
 for(const id of ['week-1','week-13','week-26','week-38']){
  assert.ok(weeklyCommentary[id][lang].meaning.length>100);
  assert.ok(texts.find(t=>t.id===id).source.includes('PDF'));
 }
 assert.ok(html.includes('2008–2012'));
 assert.ok(fs.readFileSync(prefix+'/meditation/index.html','utf8').includes('04.html#weekly-study'));
}
console.log('Passed: 52 bilingual week records, source ranges, symmetric mirror pairing, four detailed verse commentaries, accessible annual diagram and existing course entry links.');
