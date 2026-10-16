import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {temperamentClarity} from './build-temperaments-clarity.mjs';
import {clarityRoute} from './build-remaining-clarity.mjs';
import {wholeElement,esc} from './learning-html.mjs';
const baseline='76d3bd0';
const stripLinks=s=>s.replace(/<a\b[^>]*>|<\/a>/g,'');
assert.equal(temperamentClarity.length,23);
for(const [course,count]of [['temperaments',11],['understanding-temperaments',12]])assert.deepEqual(temperamentClarity.filter(r=>r.course===course).map(r=>r.id),Array.from({length:count},(_,i)=>i));
for(const r of temperamentClarity){
 assert.equal(r.en.paragraphs.length,r.pt.paragraphs.length);assert.ok(r.en.paragraphs.length>=4);
 for(const lang of ['en','pt']){
  const file=clarityRoute(r,lang),html=fs.readFileSync(file,'utf8'),first=wholeElement(html,'<section class="batch-first-reading"');
  assert.equal(r[lang].checks.length,2);
  for(const text of [...r[lang].paragraphs,...r[lang].checks.flat()])assert.ok(stripLinks(first).includes(esc(text)),file+' full authored text');
  const old=execFileSync('git',['show',baseline+':'+file],{maxBuffer:4e6}).toString(),tag=old.match(/<main\b[^>]*>/)[0],main=wholeElement(old,tag),heading=main.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)[0],nav=wholeElement(main,'<nav class="lesson-navigation"');
  const depth=wholeElement(html,'<details class="batch-retained-depth"'),context=wholeElement(depth,'<aside class="temperament-source-context"');
  assert.equal(depth.slice(depth.indexOf('</summary>')+10,-10).replace(context,''),main.slice(tag.length,-7).replace(heading,'').replace(nav,''),file+' complete old teaching retained');
  assert.ok(html.includes(tag)&&html.includes(heading)&&html.includes(nav));
 }
}
for(const lang of ['en','pt']){
 const base='docs/'+(lang==='pt'?'pt/':'');
 for(const [course,count]of [['temperaments',11],['understanding-temperaments',12],['understand-temperament',13],['mystery-temperaments',15]]){
  for(let id=0;id<count;id++){
   const file=`${base}${course}/lessons/${String(id).padStart(2,'0')}.html`,html=fs.readFileSync(file,'utf8');
   assert.equal((html.match(/data-temperament-context/g)||[]).length,1,file+' context once');
   const note=stripLinks(wholeElement(html,'<aside class="temperament-source-context"'));
   for(const word of ['GA 295',lang==='pt'?'data':'birthday',lang==='pt'?'depressão':'depression',lang==='pt'?'TDAH':'ADHD'])assert.ok(note.includes(word),file+' missing correction '+word);
   if(['understand-temperament','mystery-temperaments'].includes(course)){
    const old=execFileSync('git',['show',baseline+':'+file],{maxBuffer:4e6}).toString();
    const removed=html.replace(wholeElement(html,'<aside class="temperament-source-context"'),'').replace(wholeElement(html,'<p class="temperament-guide-link"'),'');assert.equal(removed,old,file+' source companion unchanged apart from contextual additions');
   }
  }
 }
 const guide=fs.readFileSync(base+'understanding-temperaments/index.html','utf8');
 for(const marker of ['id="practical-guide"','19190821d01.html','GA015_c03.html','Gilbert Childs','The Mystery of Temperaments'])assert.ok(guide.includes(marker));
 assert.equal((wholeElement(guide,'<section id="practical-guide"').match(/<tr>/g)||[]).length,5,'Same situation comparison: header plus four portraits');
}
assert.equal(JSON.parse(fs.readFileSync('content/foundations-introduction-clear-lessons.json')).filter(r=>r.course==='foundations').length,36,'Earlier draft checkpoint retained');
console.log('Passed: 23 bilingual first readings, 46 retained complete original bodies, contextual corrections on all 102 family lesson pages, 56 book-companion pages otherwise unchanged, four-portrait comparison and source/birth distinctions.');
