import assert from 'node:assert/strict';
import fs from 'node:fs';
import {lukeLessons,lukeSources} from '../content/according-to-luke.mjs';
import {lukeSourceGuides} from '../content/according-to-luke-source-guides.mjs';
import {lukeContents,lukeUploadReview as review} from '../content/according-to-luke-upload.mjs';

assert.equal(review.pdf.pages,21);
assert.equal(review.markdown.pageMarkers,21);
assert.equal(review.translator,'Catherine E. Creeger');
assert.equal(review.publicationYear,2001,'Edition year verified on the copyright page');
assert.equal(review.isbn,'0-88010-488-0');
assert.equal(review.editionEvidence.pdfPage,3);
assert.equal(review.editionEvidence.printedLectureDates,'15–24 September 1909','Preserve the printed discrepancy');
assert.match(review.lecture1Completion,/^unverified:/);
assert.deepEqual(review.coverage.flatMap(r=>Array.from({length:r.to-r.from+1},(_,i)=>r.from+i)),Array.from({length:review.pdf.pages},(_,i)=>i+1));
assert.deepEqual(review.coverage.map(r=>r.kind),['cover','title','copyright','contents','editorial-introduction','lecture-1-supplied-text']);
assert.deepEqual(lukeContents.map(c=>c.lecture),Array.from({length:10},(_,i)=>i+1));
assert.deepEqual(lukeSourceGuides.map(g=>g.id),[0,1,2]);
assert.equal(lukeSourceGuides.find(g=>g.id===2).scope,'retained-excerpt-and-earlier-source-summary');
assert.equal(lukeLessons.length,12);
assert.equal(lukeSources.length,10);

const registry=JSON.parse(fs.readFileSync('content/source-register.json','utf8'));
for(const source of [review.pdf,review.markdown]){
 const entry=registry.find(r=>r.sha256===source.sha256);
 assert.equal(entry?.filename,source.filename);
 assert.equal(entry.bytes,source.bytes);
 assert.equal(entry.contents_in_repository,false);
 assert.equal(entry.capture_pages,21);
 assert.equal(entry.translator,review.translator);
 assert.equal(entry.publication_year,review.publicationYear);
}
const ledger=fs.readFileSync(`content/${review.notes}`,'utf8');
assert.deepEqual([...ledger.matchAll(/^\| (\d+) \|/gm)].map(m=>Number(m[1])),Array.from({length:review.pdf.pages},(_,i)=>i+1));
const passages=JSON.parse(fs.readFileSync('content/passage-study.json','utf8')).filter(p=>p.course==='according-to-luke');
for(const [id,author,page] of [[0,'Robert A. McDermott',6],[1,'Rudolf Steiner',19]]){
 const passage=passages.find(p=>p.ids.includes(id));
 assert.equal(passage.author,author);
 assert.equal(passage.originalLanguage,'en');
 assert.equal(passage.pdfPage,page);
 assert.equal(passage.sourceSha256,review.pdf.sha256);
 assert.equal(passage.en.quote,passage.original);
 assert.match(passage.locator,/printed folio not visible/);
 assert.ok(passage.edition.includes('2001')&&passage.edition.includes('Catherine E. Creeger'));
 if(id===0)assert.deepEqual(passage.pdfColumns,[2,3],'Editorial passage spans the middle and right columns');
 else assert.equal(passage.pdfColumn,3);
}
for(let id=2;id<=11;id++)assert.equal(passages.find(p=>p.ids.includes(id)).originalLanguage,'de','Later passages retain their separate German source');

let checked=0;
for(const lang of ['en','pt']){
 const base=lang==='en'?'docs':'docs/pt';
 const index=fs.readFileSync(`${base}/according-to-luke/index.html`,'utf8');
 assert.equal((index.match(/id="upload-coverage"/g)||[]).length,1);
 assert.ok(index.includes('Catherine E. Creeger')&&index.includes('2001'),index+' missing supplied edition');
 assert.ok(!index.includes('remainder missing')&&!index.includes('restante ausente'),index+' unverified Lecture 1 truncation claim');
 for(const c of lukeContents)assert.ok(index.includes(c[lang]),`Missing supplied contents heading ${c.lecture}/${lang}`);
 for(const lesson of lukeLessons){
  const file=`${base}/according-to-luke/lessons/${String(lesson.id).padStart(2,'0')}.html`;
  const html=fs.readFileSync(file,'utf8');
  const guide=lukeSourceGuides.find(g=>g.id===lesson.id)?.[lang];
  assert.equal((html.match(/id="luke-source-guide"/g)||[]).length,guide?1:0,file);
  if(guide){
   assert.equal(guide.sections.length,lesson.id===1?6:4);
   const start=html.indexOf('id="luke-source-guide"');
   assert.ok(html.indexOf('id="book-passage"')<start&&start<html.indexOf('class="worked-example"'),file+' source guide must precede practice');
   for(const s of guide.sections){
    assert.ok(s.title&&s.reading&&s.paragraphs.length);
    assert.ok(html.includes(s.title),file+' missing source section');
    for(const p of s.paragraphs)assert.ok(p.trim()&&!p.includes('\uFFFD'));
   }
   assert.ok(guide.question&&guide.answer);
   if(lesson.id===1){
    assert.equal(guide.table.headers.length,3);
    assert.equal(guide.table.rows.length,3);
    assert.ok(guide.table.rows.every(row=>row.length===3));
    assert.ok(html.includes('<caption>')&&html.includes('scope="row"'),file+' missing accessible cognition comparison');
   }
  }
  if(lesson.lecture>=2){
   assert.ok(html.includes(lang==='en'?'This lecture is missing from the supplied PDF.':'Esta palestra está ausente no PDF fornecido.'),file+' missing source limit');
  }
  if(lesson.id===2){
   assert.ok(html.includes(lang==='en'?'earlier course explanation':'explicação anterior do curso'),file+' missing summary provenance');
   assert.ok(guide.sections.every(s=>!s.reading.includes('PDF')),file+' falsely attributes Lecture 2 guide to uploaded PDF');
  }
  assert.ok(!/C:\\Users\\|Starting in 5 seconds/.test(html),file+' capture interface leaked');
  checked++;
 }
}
console.log(`Passed: GA114 2001 Creeger edition evidence, ${review.pdf.pages} page notes, separate editorial/lecture passages, six bilingual source guides with explicit Lecture 2 scope, cognition comparisons and ${checked} bilingual lessons.`);
