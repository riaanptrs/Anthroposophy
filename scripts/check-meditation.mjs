import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {meditationLessons as lessons} from '../content/meditation-course.mjs';
import {texts,foundationSource} from '../content/meditation-texts.mjs';
assert.deepEqual(lessons.map(l=>l.id),[0,1,2,3,4,5,6,7,8]);
assert.deepEqual(texts.map(x=>x.id),['daily','week-1','week-13','week-26','week-38','foundation']);
for(const t of texts)for(const lang of ['en','pt']){assert.ok(t[lang].length>100);assert.ok(!/\+Cuja|WOOK LD|shail truly jeer|wil truly tive/.test(t[lang]));}
assert.equal((texts.at(-1).en.match(/Human soul!/g)||[]).length,3);
assert.ok(texts.at(-1).en.endsWith('In willing.'));
assert.ok(texts.at(-1).pt.endsWith('No querer.'));
for(const lang of ['en','pt']){
 const base=lang==='en'?'docs':'docs/pt',other=lang==='en'?'docs/pt':'docs';
 const index=fs.readFileSync(base+'/meditation/index.html','utf8');
 assert.ok(index.includes(foundationSource));assert.ok(index.includes('52'));
 for(const l of lessons){const id=String(l.id).padStart(2,'0'),file=base+'/meditation/'+id+'.html',h=fs.readFileSync(file,'utf8');
  assert.ok(h.includes(`data-meditation-session="${l.id}"`));assert.ok(h.includes(l[lang].title));
  assert.equal((h.match(/class="verse"/g)||[]).length,l.texts.length);
  for(const v of l.texts)assert.ok(h.includes(`id="${v}"`));
  const alternate=h.match(/<link rel="alternate"[^>]*href="([^"]+)"/)[1];assert.equal(path.resolve(path.dirname(file),alternate),path.resolve(other+'/meditation/'+id+'.html'));
  assert.ok(h.includes('data-download=')&&h.includes('id="reflection"'));
  assert.ok(!h.includes('data-note-field=')&&!h.includes('localStorage'));
  assert.ok(l[lang].steps.length>=3&&l[lang].explain.length>=2);
 }
 const home=fs.readFileSync(base+'/index.html','utf8');assert.equal((home.match(/<!-- meditation-card:start -->/g)||[]).length,1);
}
console.log('Passed: 18 meditation sessions, two indexes, six complete selected texts per language, Foundation Stone ending, source attribution, navigation and reflection controls.');
