import fs from 'node:fs';
import assert from 'node:assert/strict';
import {freedomCore,freedomPractice,freedomConsolidated as lessons} from '../content/philosophy-of-freedom-consolidated.mjs';
assert.equal(freedomCore.length,16);
assert.deepEqual(freedomCore.map(id=>lessons.find(l=>l.id===id).chapter),Array.from({length:16},(_,i)=>i));
assert.equal(Object.keys(freedomPractice).length,6);
for(const prefix of ['docs','docs/pt']){
 const index=fs.readFileSync(prefix+'/philosophy-of-freedom/index.html','utf8');
 assert.deepEqual([...index.matchAll(/data-core-lesson="(\d+)"/g)].map(m=>Number(m[1])),freedomCore);
 assert.ok(index.includes('Amrine')&&index.includes('Wilson')&&index.includes('Brian'));
 assert.ok(!/in preparation|em preparação/.test(index));
 for(const [i,id] of freedomCore.entries()){
  const h=fs.readFileSync(`${prefix}/philosophy-of-freedom/lessons/${String(id).padStart(2,'0')}.html`,'utf8');
  const next=h.match(/data-core-next href="(\d+)\.html"/);
  if(i<15)assert.equal(Number(next?.[1]),freedomCore[i+1]);else assert.ok(!next);
  assert.ok(h.includes(`${i+1} / 16`));
  assert.ok(h.includes('Basis')&&h.includes('data-study-id='));
 }
 const ending=fs.readFileSync(prefix+'/philosophy-of-freedom/lessons/21.html','utf8');
 assert.ok(ending.includes('GA004_conmon.html')&&ending.includes('129–135'));
 for(const [id,parent] of Object.entries(freedomPractice)){
  const h=fs.readFileSync(`${prefix}/philosophy-of-freedom/lessons/${String(id).padStart(2,'0')}.html`,'utf8');
  assert.ok(h.includes(`data-core-next href="${String(parent).padStart(2,'0')}.html"`));
 }
}
console.log('Passed: 16 core steps cover the prefaces, all 14 chapters and conclusion; six optional practices return to their parent; both language paths are complete.');
