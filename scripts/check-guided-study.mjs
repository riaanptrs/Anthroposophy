import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {guidedCounts} from '../content/guided-prompts.mjs';
import {mysteryLessons} from '../content/mystery-temperaments.mjs';
const files=fs.readdirSync('docs',{recursive:true}).filter(f=>/lessons[\\/]\d{2}\.html$/.test(f));
assert.equal(files.length,292);
assert.equal(Object.values(guidedCounts).reduce((a,b)=>a+b,0),131);
assert.deepEqual(mysteryLessons.map(l=>l.id),Array.from({length:15},(_,i)=>i));
const counts={};
for(const f of files){
 const h=fs.readFileSync(path.join('docs',f),'utf8'),id=h.match(/data-study-id="([^"]+)"/)?.[1];
 assert.ok(id,'Missing study identity: '+f);counts[id]=(counts[id]||0)+1;
 for(const field of ['first','source','after'])assert.equal((h.match(new RegExp(`data-note-field="${field}"`,'g'))||[]).length,1,f+' '+field);
 for(const control of ['save-notes','reading-view','note-status','complete','export','delete','first-preview'])assert.ok(h.includes('data-'+control),f+' '+control);
 assert.equal((h.match(/class="guided-reveal"/g)||[]).length,1,f);
 assert.ok(h.indexOf('data-note-field="first"')<h.indexOf('id="study-explanation"'),f+' explanation precedes attempt');
 assert.ok(h.includes('<noscript>'),f+' missing fallback');
 assert.ok(h.includes('guided-study.v1.css')&&h.includes('guided-study.v1.js'),f+' missing assets');
 assert.ok(!/C:\\Users\\|Starting in|capture-software/.test(h),f+' private capture noise');
 const ids=[...h.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,f+' duplicate id');
}
assert.equal(Object.keys(counts).length,146);assert.ok(Object.values(counts).every(c=>c===2));
for(const p of ['docs/index.html','docs/pt/index.html'])assert.equal((fs.readFileSync(p,'utf8').match(/class="course-card"/g)||[]).length,9,p);
for(const [file,lab] of [['philosophy-of-freedom/lessons/04.html','arithmetic'],['colour/lessons/02.html','colour'],['encountering-the-self/lessons/03.html','dialogue'],['encountering-the-self/lessons/15.html','reflection'],['lessons/06.html','map'],['according-to-luke/lessons/07.html','map']])for(const p of ['docs/','docs/pt/'])assert.ok(fs.readFileSync(p+file,'utf8').includes(`data-lab="${lab}"`),p+file);
console.log('Passed: 146 bilingual lesson pairs, nine course cards, guided sequence, note controls, lab coverage and static fallback.');
