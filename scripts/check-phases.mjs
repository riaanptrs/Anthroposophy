import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {modules,connections,chapters,bookSections,glossary} from '../content/phases/reference.mjs';
const plain=s=>s.replace(/<[^>]*>/g,'').replaceAll('&#39;',"'").replaceAll('&quot;','"').replaceAll('&gt;','>').replaceAll('&lt;','<').replaceAll('&amp;','&');
const lessons=JSON.parse(fs.readFileSync('content/phases/course.json')),ledger=JSON.parse(fs.readFileSync('content/phases/source-map.json'));
assert.equal(lessons.length,62);assert.equal(modules.length,9);assert.equal(chapters.length,7);assert.equal(glossary.length,62);assert.equal(ledger.completeBook,true);assert.equal(ledger.captures,157);assert.equal(ledger.transcriptionVerified,false);
assert.equal(ledger.sourceSha256,'6115d4b47c6f8179b90d96c109f3e12ef0c4da332b36b0b2d722a70b314889e6');
assert.deepEqual(ledger.pages.map(p=>p.capture),Array.from({length:157},(_,i)=>i+1));assert.deepEqual(lessons.map(l=>l.id),Array.from({length:62},(_,i)=>i+1));
for(const c of chapters){assert.deepEqual(c.lessonIds,lessons.filter(l=>l.chapter===c.id).map(l=>l.id));assert.ok(c.lessonIds.length>=3);assert.ok(bookSections.some(s=>s.chapter===c.id));for(const lang of ['en','pt'])assert.ok(c.check[lang].answer.length>100);}
for(const s of bookSections){const chapter=chapters.find(c=>c.id===s.chapter);assert.ok(s.start>=chapter.start&&s.end<=chapter.end);assert.ok(s.lessonIds.length);for(const id of s.lessonIds){const l=lessons.find(l=>l.id===id);assert.ok(l);assert.ok(l.start<=s.end&&l.end>=s.start,`Source mapping ${s.en}/${id}`);}}
for(const term of glossary)if(term[5])assert.ok(lessons.some(l=>l.id===term[5]));
let words={en:0,pt:0},links=0,pages=0;
for(const lang of ['en','pt']){
 const prefix=lang==='pt'?'pt/':'',base=`docs/${prefix}learn/phases`;
 for(const l of lessons){const v=l[lang];assert.equal(v.sections.length,4);for(const k of ['title','goal','example','question','answer','exercise','transfer','response'])assert.ok(v[k]?.length>10,`${l.id}/${lang}/${k}`);assert.ok(l.start>=9&&l.end<=156&&l.start<=l.end);assert.ok(modules.some(m=>m.id===l.module));assert.ok(l.concepts.length>=4);words[lang]+=v.sections.map(s=>s.text).concat(v.title,v.goal,v.example,v.question,v.answer,v.exercise,v.transfer,v.response).join(' ').split(/\s+/).length;const html=fs.readFileSync(`${base}/lessons/${String(l.id).padStart(2,'0')}.html`,'utf8');for(const s of v.sections){assert.ok(s.text.split(/\s+/).length>=25,`Shallow explanation ${l.id}/${lang}`);assert.ok(plain(html).includes(s.text),`teaching lost ${l.id}/${lang}`);}assert.ok(html.includes('id="cw-data"'));}
 const files=['index.html','coverage.html','glossary.html','sources.html','workbook.html','print.html',...lessons.map(l=>`lessons/${String(l.id).padStart(2,'0')}.html`)];
 for(const r of files){const file=base+'/'+r,html=fs.readFileSync(file,'utf8');pages++;assert.match(html,new RegExp(`<html lang="${lang==='pt'?'pt-BR':'en'}"`));assert.equal((html.match(/<h1\b/g)||[]).length,1,file);const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,file+' duplicate ids');for(const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){const u=m[1];if(/^(?:[a-z]+:|\/\/)/i.test(u))continue;const [url,fragment]=u.split('#');const target=path.resolve(path.dirname(file),url.split('?')[0]||path.basename(file));assert.ok(fs.existsSync(target),`${file}: missing ${u}`);if(fragment&&target.endsWith('.html')){const targetHtml=fs.readFileSync(target,'utf8');assert.ok(targetHtml.includes(`id="${fragment}"`)||targetHtml.includes(`name="${fragment}"`),`${file}: missing anchor ${u}`);}links++;}}
 assert.equal((fs.readFileSync(`${base}/sources.html`,'utf8').match(/id="capture-/g)||[]).length,157);
 assert.equal((fs.readFileSync(`${base}/coverage.html`,'utf8').match(/data-phases-chapter=/g)||[]).length,7);
 assert.ok(fs.readFileSync(`docs/${prefix}learn/index.html`,'utf8').includes('phases/index.html'));
 for(const c of connections)assert.ok(fs.readFileSync('docs/'+prefix+c.route,'utf8').includes('id="phases-connection"'));
}
console.log(JSON.stringify({lessons:62,chapters:7,bookSections:bookSections.length,languages:2,pages,sourceCaptures:157,glossaryTerms:62,explainedLessonQuestions:248,chapterReviewQuestions:14,existingLessonExpansions:8,links,courseWords:words}));
