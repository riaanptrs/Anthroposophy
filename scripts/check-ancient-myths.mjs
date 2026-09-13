import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {mythsLessons} from '../content/ancient-myths.mjs';
assert.deepEqual(mythsLessons.map(l=>l.lecture),[null,1,2,3,4,5,6,7]);
for(const base of ['docs','docs/pt']){
 const lang=base==='docs'?'en':'pt',other=base==='docs'?'docs/pt':'docs';
 const index=fs.readFileSync(base+'/ancient-myths/index.html','utf8');assert.equal((index.match(/data-myth-lesson=/g)||[]).length,8);
 for(const l of mythsLessons){
  const id=String(l.id).padStart(2,'0'),file=base+'/ancient-myths/lessons/'+id+'.html',h=fs.readFileSync(file,'utf8');
  assert.ok(h.includes(`data-study-id="ancient-myths/${id}"`));assert.ok(h.includes(l.url)&&h.includes(l.span));
  assert.ok(!h.includes('Compare your three practice entries')&&!h.includes('Compare suas três anotações'));
  const alt=h.match(/<link rel="alternate"[^>]*href="([^"]+)"/)[1];assert.equal(path.resolve(path.dirname(file),alt),path.resolve(other,'ancient-myths/lessons/'+id+'.html'));
  assert.equal((h.match(/data-note-field=/g)||[]).length,3);
  if(l.id<7)assert.ok(h.includes(`href="${String(l.id+1).padStart(2,'0')}.html"`));
  for(const k of ['example','explanation','key','activity','question'])assert.ok(l[lang][k].length>30);
 }
 for(const [target,id] of [['lessons/08.html','01'],['higher-worlds/lessons/04.html','03'],['philosophy-of-freedom/lessons/20.html','04'],['encountering-the-self/lessons/12.html','07']]){
  const h=fs.readFileSync(base+'/'+target,'utf8');assert.equal((h.match(/<!-- myths-connection:start -->/g)||[]).length,1);assert.ok(h.includes(`ancient-myths/lessons/${id}.html`));
 }
}
console.log('Passed: all seven lectures in eight bilingual lessons, preserved study tools, reading assignments, language partners and four paired course connections.');
