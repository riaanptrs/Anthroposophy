import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {thinkingLessons} from '../content/practical-thinking.mjs';
import {temperamentCourse} from '../content/temperament-course.mjs';
const routes=[['practical-thinking',thinkingLessons,10],['understanding-temperaments',temperamentCourse,12]];
for(const prefix of ['docs','docs/pt']){
 const lang=prefix.endsWith('/pt')?'pt':'en',other=lang==='en'?'docs/pt':'docs';
 const home=fs.readFileSync(prefix+'/index.html','utf8');
 const cards=[...home.matchAll(/<a class="course-card" href="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(cards.length,10);assert.equal(new Set(cards).size,10);
 for(const old of ['temperaments','understand-temperament','mystery-temperaments']){
  assert.ok(!cards.includes(old+'/index.html'),'Duplicate primary temperament route');
  assert.ok(home.includes(`href="${old}/index.html"`),'Missing source-library access');
  assert.ok(fs.readFileSync(prefix+'/'+old+'/index.html','utf8').includes('../understanding-temperaments/index.html'));
 }
 for(const [slug,lessons,total] of routes){
  assert.equal(lessons.length,total);assert.deepEqual(lessons.map(l=>l.id),Array.from({length:total},(_,i)=>i));
  assert.ok(cards.includes(slug+'/index.html'));const index=fs.readFileSync(prefix+'/'+slug+'/index.html','utf8');
  assert.equal((index.match(/data-practice-lesson=/g)||[]).length,total);assert.ok(index.includes(`data-course-journal="${slug}"`));
  for(const l of lessons){
   const filename=String(l.id).padStart(2,'0')+'.html',file=prefix+'/'+slug+'/lessons/'+filename,h=fs.readFileSync(file,'utf8'),v=l[lang];
   const alternate=h.match(/<link rel="alternate"[^>]*href="([^"]+)"/)[1];
   assert.equal(path.resolve(path.dirname(file),alternate),path.resolve(other,slug,'lessons',filename));
   for(const key of ['title','goal','example','explanation','activity','question','takeaway'])assert.ok(v[key]?.trim(),file+' missing '+key);
   assert.equal((h.match(/data-note-field=/g)||[]).length,6,file+' needs first/source/after plus three dated entries');
   assert.ok(h.indexOf('id="book-passage"')<h.indexOf('id="study-explanation"'));
   assert.ok(h.indexOf('id="study-explanation"')<h.indexOf('data-note-field="first"'));
   assert.ok(h.indexOf('data-note-field="session3"')<h.indexOf('data-note-field="after"'));
   if(l.id<total-1)assert.ok(h.includes(`href="${String(l.id+1).padStart(2,'0')}.html"`));
   else assert.ok(h.includes('href="../index.html#journal"'));
   assert.ok(v.sources.every(s=>h.includes(s.url)),file+' source links');
  }
 }
 const map=fs.readFileSync(prefix+'/understanding-temperaments/lessons/01.html','utf8');
 assert.equal((map.match(/<th scope="row">/g)||[]).length,4);
 for(const id of ['04','05','16','20'])assert.match(fs.readFileSync(prefix+'/philosophy-of-freedom/lessons/'+id+'.html','utf8'),/href="\.\.\/\.\.\/(practical-thinking|understanding-temperaments)\/lessons\//);
}
console.log('Passed: 22 bilingual practice lessons, distinct source library, six notebook fields, sequential routes, source links, table and Philosophy of Freedom bridges.');
