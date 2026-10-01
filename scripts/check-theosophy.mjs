import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {introduction} from '../content/introduction.mjs';
import {lessons as chapter1} from '../content/lessons.mjs';
import {lessons as chapter2} from '../content/lessons-chapter-2.mjs';
import {lessons as chapter3} from '../content/lessons-chapter-3.mjs';
import {lessons as chapter4} from '../content/lessons-chapter-4.mjs';
import {applyFreedomConnections} from '../content/philosophy-of-freedom-connections.mjs';

const lessons=[introduction,...chapter1,...chapter2,...chapter3,...chapter4];
assert.deepEqual(lessons.map(l=>l.id),Array.from({length:23},(_,id)=>id),'The complete book route must retain all 23 lesson IDs');
for(const [entries,chapter,first,last] of [[chapter1,1,1,6],[chapter2,2,7,9],[chapter3,3,10,17],[chapter4.slice(0,4),4,18,21]]){
  assert.equal(entries.length,last-first+1);
  assert.ok(entries.every(l=>l.chapter===chapter),'Chapter sequence changed');
}
for(const lang of ['en','pt']){
  for(const lesson of lessons){
    assert.equal(lesson[lang].length,6,`Lesson ${lesson.id}/${lang} is incomplete`);
    assert.ok(lesson[lang][2].every(p=>typeof p==='string'&&p.trim()));
  }
  for(const id of [18,21]){
    const original=lessons.find(l=>l.id===id);
    const supplemented=applyFreedomConnections([original],'theosophy')[0];
    assert.equal(supplemented[lang][3],original[lang][3],`A supplement replaced the main book exercise in ${id}/${lang}`);
  }
}

const assignedAddenda=new Set();
for(const lesson of lessons)for(const token of (lesson.notes||'').split(/[,;]/)){
  const match=token.trim().match(/^(\d+)(?:[–-](\d+))?$/);
  if(match)for(let n=Number(match[1]);n<=Number(match[2]||match[1]);n++)assignedAddenda.add(n);
}
assert.deepEqual([...assignedAddenda].sort((a,b)=>a-b),Array.from({length:13},(_,n)=>n+1),'All thirteen addenda must remain assigned');
assert.ok(lessons.find(l=>l.id===18).notes.split(/[,;–-]/).includes('8'),'Addendum 8 belongs with the path of knowledge');

const ledgers=[
  ['front-and-addenda',[...Array.from({length:28},(_,i)=>i+1),...Array.from({length:22},(_,i)=>i+207)]],
  ['chapter-1',Array.from({length:39},(_,i)=>i+29)],
  ['chapter-2',Array.from({length:30},(_,i)=>i+68)],
  ['chapter-3',Array.from({length:84},(_,i)=>i+98)],
  ['chapter-4',Array.from({length:25},(_,i)=>i+182)]
];
const reviewed=[];
for(const [suffix,expected] of ledgers){
  const text=fs.readFileSync(`content/theosophy-page-notes-${suffix}.md`,'utf8');
  let pageTable=false;const pages=[];
  for(const line of text.split('\n')){
    if(/^\| PDF page \|/.test(line)){pageTable=true;continue;}
    if(!line.startsWith('|')){pageTable=false;continue;}
    if(pageTable){
      const row=line.match(/^\|\s*(\d+)\s*\|/);
      if(row)pages.push(Number(row[1]));
    }
  }
  assert.deepEqual(pages,expected,`Incomplete or duplicated page notes in ${suffix}`);
  reviewed.push(...pages);
}
assert.deepEqual(reviewed.sort((a,b)=>a-b),Array.from({length:228},(_,i)=>i+1),'Every PDF page must have a reading record');

const passages=JSON.parse(fs.readFileSync('content/passage-study.json','utf8')).filter(p=>p.course==='theosophy');
assert.equal(passages.length,23,'Each Theosophy lesson needs its own contextualized passage');
assert.deepEqual(passages.flatMap(p=>p.ids).sort((a,b)=>a-b),Array.from({length:23},(_,id)=>id));
const escaped=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain=s=>s.replace(/<[^>]*>/g,'').replace(/&(amp|lt|gt|quot|#39);/g,(_,e)=>({'amp':'&','lt':'<','gt':'>','quot':'"','#39':"'"}[e])).replace(/\s+/g,' ').trim();
let pagesChecked=0;
for(const p of passages){
  assert.equal(p.originalLanguage,'en');
  assert.equal(p.original,p.en.quote,'The source wording must be distinct from its Portuguese translation');
  assert.ok(p.edition.includes('1971')&&p.edition.includes('Monges')&&p.edition.includes('Church'),'Missing verified edition credit');
  assert.ok(Number.isInteger(p.pdfPage)&&p.pdfPage>=1&&p.pdfPage<=228,'Missing PDF locator');
  if(/^\d+$/.test(p.printedPage))assert.equal(p.pdfPage,Number(p.printedPage)+28,'Printed/PDF locator mismatch');
  assert.equal(p.sourceFile,'Theosophy -- Rudolf Steiner -- 1971 -- Anthroposophic Press -- 35a0e3779e08323bf09813009f1f2dca -- Anna’s Archive.pdf');
  for(const lang of ['en','pt']){
    const file=path.join(lang==='en'?'docs':'docs/pt','lessons',String(p.ids[0]).padStart(2,'0')+'.html');
    const html=fs.readFileSync(file,'utf8'),visible=plain(html);
    assert.equal((html.match(/<link\b[^>]*href="[^">]*passage-study\.css"[^>]*>/g)||[]).length,1,`${file} duplicates the passage stylesheet`);
    const excerpt=html.match(/<blockquote class="source-excerpt">([\s\S]*?)<\/blockquote>/);
    assert.ok(excerpt,`${file} missing book excerpt`);
    assert.equal(plain(excerpt[1]),p[lang].quote.replace(/\s+/g,' ').trim(),`${file} excerpt differs from reviewed source`);
    assert.ok(html.includes(escaped(p.locator)),`${file} missing exact source reference`);
    assert.ok(visible.includes(lessons.find(l=>l.id===p.ids[0])[lang][3]),`${file} lost the book-based exercise`);
    assert.ok(!visible.includes('friend asking for help in the introduction')&&!visible.includes('opening example of a request for help'),`${file} refers to the previous orientation`);
    pagesChecked++;
  }
}
for(const file of ['docs/theosophy/index.html','docs/pt/theosophy/index.html']){
  const html=fs.readFileSync(file,'utf8');
  assert.equal((html.match(/<link\b[^>]*href="[^">]*passage-study\.css"[^>]*>/g)||[]).length,1,`${file} accumulates passage stylesheets on rebuild`);
  assert.ok(plain(html).includes(chapter1.find(l=>l.id===6)[file.includes('/pt/')?'pt':'en'][1]),`${file} shows a stale classification objective`);
}
const registry=JSON.parse(fs.readFileSync('content/source-register.json','utf8'));
assert.ok(registry.some(s=>s.sha256==='ca555e2d7a13477b94b3012a53e929350756f9d9e3570381e639225f8e7876bc'&&s.contents_in_repository===false),'Supplied PDF provenance missing');
console.log(`Passed: 228 page records, four-chapter route, all thirteen addenda, 23 source passages, ${pagesChecked} bilingual lessons, and preserved main-book exercises.`);
